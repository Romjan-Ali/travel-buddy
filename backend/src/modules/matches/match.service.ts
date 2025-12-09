// backend/src/modules/matches/match.service.ts
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/errorHandler'

export const matchService = {
  async createMatch(userId: string, receiverId: string, travelPlanId?: string) {
    // Check if receiver exists and is active
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId, isActive: true },
    })

    if (!receiver) {
      throw new AppError(404, 'User not found')
    }

    // Prevent self-match
    if (userId === receiverId) {
      throw new AppError(400, 'Cannot match with yourself')
    }

    // Check if travel plan exists and is public
    if (travelPlanId) {
      const travelPlan = await prisma.travelPlan.findFirst({
        where: {
          id: travelPlanId,
          OR: [{ userId: receiverId }, { isPublic: true }],
        },
      })

      if (!travelPlan) {
        throw new AppError(404, 'Travel plan not found or not accessible')
      }
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        initiatorId: userId,
        receiverId,
        travelPlanId: travelPlanId || null,
      },
    })

    if (existingMatch) {
      throw new AppError(400, 'Match request already sent')
    }

    const match = await prisma.match.create({
      data: {
        initiatorId: userId,
        receiverId,
        travelPlanId,
      },
      include: {
        initiator: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
                currentLocation: true,
              },
            },
          },
        },
        receiver: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
        travelPlan: {
          select: {
            destination: true,
            startDate: true,
            endDate: true,
            travelType: true,
          },
        },
      },
    })

    return match
  },

  async getUserMatches(
    userId: string,
    type: 'sent' | 'received' = 'received',
    status?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (type === 'sent') where.initiatorId = userId
    else where.receiverId = userId

    if (status) where.status = status

    const [matches, total] = await Promise.all([
      prisma.match
        .findMany({
          where,
          include: {
            initiator: {
              select: {
                id: true,
                profile: {
                  select: {
                    fullName: true,
                    profileImage: true,
                    currentLocation: true,
                  },
                },
                _count: { select: { reviewsReceived: true } },
                reviewsReceived: { select: { rating: true, comment: true } },
              },
            },
            receiver: {
              select: {
                id: true,
                profile: {
                  select: { fullName: true, profileImage: true },
                },
                _count: { select: { reviewsReceived: true } },
                reviewsReceived: { select: { rating: true, comment: true } },
              },
            },
            travelPlan: {
              select: {
                destination: true,
                startDate: true,
                endDate: true,
                travelType: true,
              },
            },
            messages: {
              select: {
                id: true,
                content: true, // ✅ corrected
                createdAt: true,
                senderId: true,
                receiverId: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        })
        .then((matches) =>
          matches.map((match) => ({
            ...match,
            initiator: {
              ...match.initiator,
              reviewCount: match.initiator._count.reviewsReceived,
              averageRating:
                match.initiator.reviewsReceived.length > 0
                  ? match.initiator.reviewsReceived.reduce(
                      (sum, r) => sum + r.rating,
                      0
                    ) / match.initiator.reviewsReceived.length
                  : 0,
            },
            receiver: {
              ...match.receiver,
              reviewCount: match.receiver._count.reviewsReceived,
              averageRating:
                match.receiver.reviewsReceived.length > 0
                  ? match.receiver.reviewsReceived.reduce(
                      (sum, r) => sum + r.rating,
                      0
                    ) / match.receiver.reviewsReceived.length
                  : 0,
            },
            lastMessage: match.messages?.[0] || null,
          }))
        ),

      prisma.match.count({ where }),
    ])

    return {
      matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },
  async updateMatchStatus(
    matchId: string,
    userId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) {
    // Check if match exists and user is the receiver
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        receiverId: userId,
        status: 'PENDING',
      },
    })

    if (!match) {
      throw new AppError(404, 'Match request not found or already processed')
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status },
      include: {
        initiator: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
        travelPlan: {
          select: {
            destination: true,
            startDate: true,
          },
        },
      },
    })

    return updatedMatch
  },

  async getMatchSuggestions(
    userId: string,
    travelPlanId?: string,
    limit: number = 10
  ) {
    // Get user's profile and preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        travelPlans: {
          where: travelPlanId
            ? { id: travelPlanId }
            : { startDate: { gte: new Date() } },
          orderBy: { startDate: 'asc' },
          take: 1,
        },
      },
    })

    if (!user || !user.profile) {
      throw new AppError(404, 'User profile not found')
    }

    const currentPlan = user.travelPlans[0]

    // Build match criteria
    const where: any = {
      id: { not: userId },
      isActive: true,
      isVerified: true,
      profile: { isNot: null },
    }

    // If we have a specific travel plan, find users with overlapping plans
    if (currentPlan) {
      // Find users with overlapping travel plans to the same destination
      const overlappingUsers = await prisma.travelPlan.findMany({
        where: {
          userId: { not: userId },
          destination: {
            contains: currentPlan.destination.split(',')[0], // Match city/country
            mode: 'insensitive',
          },
          startDate: { lte: currentPlan.endDate },
          endDate: { gte: currentPlan.startDate },
          travelType: currentPlan.travelType,
        },
        select: { userId: true },
        distinct: ['userId'],
      })

      const userIds = overlappingUsers.map((u) => u.userId)
      if (userIds.length > 0) {
        where.id = { in: userIds }
      }
    }

    // Match by interests if available
    if (
      user.profile.travelInterests &&
      user.profile.travelInterests.length > 0
    ) {
      where.profile.travelInterests = {
        hasSome: user.profile.travelInterests,
      }
    }

    // Exclude already matched users
    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [{ initiatorId: userId }, { receiverId: userId }],
      },
      select: {
        initiatorId: true,
        receiverId: true,
      },
    })

    const excludedUserIds = new Set(
      existingMatches.flatMap((m) => [m.initiatorId, m.receiverId])
    )
    excludedUserIds.delete(userId)

    if (excludedUserIds.size > 0) {
      where.id = { ...where.id, notIn: Array.from(excludedUserIds) }
    }

    const suggestions = await prisma.user.findMany({
      where,
      select: {
        id: true,
        profile: {
          select: {
            fullName: true,
            profileImage: true,
            bio: true,
            currentLocation: true,
            travelInterests: true,
            visitedCountries: true,
          },
        },
        travelPlans: {
          where: {
            startDate: { gte: new Date() },
            isPublic: true,
          },
          take: 3,
          orderBy: { startDate: 'asc' },
        },
        reviewsReceived: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            travelPlans: true,
            reviewsReceived: true,
          },
        },
      },
      take: limit,
      orderBy: {
        reviewsReceived: {
          _count: 'desc',
        },
      },
    })

    // Calculate compatibility scores and add average ratings
    const suggestionsWithScores = suggestions.map((suggestion) => {
      const ratings = suggestion.reviewsReceived.map((r) => r.rating)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0

      // Calculate compatibility based on shared interests
      const userInterests = user.profile?.travelInterests || []
      const suggestionInterests = suggestion.profile?.travelInterests || []
      const sharedInterests = userInterests.filter((interest) =>
        suggestionInterests.includes(interest)
      )
      const compatibilityScore = Math.round(
        (sharedInterests.length / Math.max(userInterests.length, 1)) * 100
      )

      const { reviewsReceived, ...userWithoutReviews } = suggestion

      return {
        ...userWithoutReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: ratings.length,
        compatibilityScore,
        sharedInterests,
      }
    })

    // Sort by compatibility score
    suggestionsWithScores.sort(
      (a, b) => b.compatibilityScore - a.compatibilityScore
    )

    return suggestionsWithScores
  },

  async deleteMatch(matchId: string, userId: string) {
    // Check if match exists and user is involved
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [{ initiatorId: userId }, { receiverId: userId }],
      },
    })

    if (!match) {
      throw new AppError(404, 'Match not found or access denied')
    }

    await prisma.match.delete({
      where: { id: matchId },
    })

    return { message: 'Match deleted successfully' }
  },
}
