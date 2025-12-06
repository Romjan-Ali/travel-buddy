// backend/src/modules/reviews/review.service.ts
import { prisma } from '../../lib/prisma'
import type { ReviewInput } from '../../utils/types'
import { AppError } from '../../middleware/errorHandler'

export const reviewService = {
  async checkCanReview(userId: string, subjectId: string) {
    // Prevent self-review
    if (userId === subjectId) {
      return {
        canReview: false,
        reason: 'Cannot review yourself',
      }
    }

    // Find completed trips where both users participated
    const completedTrips = await prisma.travelPlan.findMany({
      where: {
        endDate: {
          lt: new Date(), // Trip is completed
        },
        matches: {
          some: {
            OR: [
              { initiatorId: userId, receiverId: subjectId },
              { initiatorId: subjectId, receiverId: userId },
            ],
            status: 'ACCEPTED',
          },
        },
      },
      select: {
        id: true,
        destination: true,
        startDate: true,
        endDate: true,
      },
    })

    // Check if user already reviewed for any of these trips
    const existingReviews = await prisma.review.findMany({
      where: {
        authorId: userId,
        subjectId: subjectId,
        travelPlanId: {
          in: completedTrips.map((trip) => trip.id),
        },
      },
    })

    // Filter out trips that already have reviews
    const reviewableTrips = completedTrips.filter(
      (trip) =>
        !existingReviews.some((review) => review.travelPlanId === trip.id)
    )

    return {
      canReview: reviewableTrips.length > 0,
      reason:
        reviewableTrips.length > 0
          ? 'You can review completed trips together'
          : 'No completed trips found',
      trips: reviewableTrips,
    }
  },

  async createReview(userId: string, reviewData: ReviewInput) {
    const { subjectId, travelPlanId, rating, comment } = reviewData

    // Check if subject exists
    const subject = await prisma.user.findUnique({
      where: { id: subjectId, isActive: true },
    })

    if (!subject) {
      throw new AppError(404, 'User not found')
    }

    // Prevent self-review
    if (userId === subjectId) {
      throw new AppError(400, 'Cannot review yourself')
    }

    // Check if review already exists for this combination
    const existingReview = await prisma.review.findUnique({
      where: {
        authorId_subjectId_travelPlanId: {
          authorId: userId,
          subjectId,
          travelPlanId: travelPlanId || '',
        },
      },
    })

    if (existingReview) {
      throw new AppError(400, 'Review already exists')
    }

    // If travelPlanId is provided, verify it exists and user participated
    if (travelPlanId) {
      const travelPlan = await prisma.travelPlan.findUnique({
        where: { id: travelPlanId },
        include: {
          matches: {
            where: {
              OR: [
                { initiatorId: userId, receiverId: subjectId },
                { initiatorId: subjectId, receiverId: userId },
              ],
              status: 'ACCEPTED',
            },
          },
        },
      })

      if (!travelPlan) {
        throw new AppError(404, 'Travel plan not found')
      }

      if (travelPlan.matches.length === 0) {
        throw new AppError(400, 'Cannot review unless you traveled together')
      }
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        authorId: userId,
        subjectId,
        travelPlanId,
      },
      include: {
        author: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
        subject: {
          select: {
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })

    return review
  },

  async getUserReviews(
    userId: string,
    type: 'given' | 'received' = 'received',
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'newest'
  ) {
    const skip = (page - 1) * limit
    const where =
      type === 'given' ? { authorId: userId } : { subjectId: userId }

    let orderBy: any = {}

    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break;

      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break;

      case 'highest':
        orderBy = { rating: 'desc' }
        break;

      case 'lowest':
        orderBy = { rating: 'asc' }
        break;

      default:
        orderBy = { createdAt: 'desc' }
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  fullName: true,
                  profileImage: true,
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          travelPlan: {
            select: {
              id: true,
              destination: true,
              startDate: true,
              endDate: true,
              travelType: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    // Calculate average rating for received reviews
    let averageRating = 0
    let totalReviews = 0

    if (type === 'received') {
      const ratings = await prisma.review.aggregate({
        where: { subjectId: userId },
        _avg: { rating: true },
        _count: { rating: true },
      })
      averageRating = ratings._avg.rating || 0
      totalReviews = ratings._count.rating || 0
    }

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async updateReview(
    reviewId: string,
    userId: string,
    updateData: { rating?: number; comment?: string }
  ) {
    // Check if review exists and user owns it
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        authorId: userId,
      },
    })

    if (!review) {
      throw new AppError(404, 'Review not found or access denied')
    }

    // Check if review was created within last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (review.createdAt < thirtyDaysAgo) {
      throw new AppError(
        400,
        'Reviews can only be edited within 30 days of creation'
      )
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        author: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
      },
    })

    return updatedReview
  },

  async deleteReview(reviewId: string, userId: string) {
    // Check if review exists and user owns it
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        authorId: userId,
      },
    })

    if (!review) {
      throw new AppError(404, 'Review not found or access denied')
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return { message: 'Review deleted successfully' }
  },

  async getTravelPlanReviews(travelPlanId: string) {
    const reviews = await prisma.review.findMany({
      where: { travelPlanId },
      include: {
        author: {
          select: {
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return reviews
  },
}
