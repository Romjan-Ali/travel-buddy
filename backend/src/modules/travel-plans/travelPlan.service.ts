import { prisma } from '../../lib/prisma'
import type { TravelPlanInput } from '../../utils/types'
import { AppError } from '../../middleware/errorHandler'

export const travelPlanService = {
  async createTravelPlan(userId: string, planData: TravelPlanInput) {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelType,
      description,
      isPublic,
    } = planData

    const travelPlan = await prisma.travelPlan.create({
      data: {
        destination,
        budget,
        travelType,
        description,
        isPublic,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profileImage: true,
                currentLocation: true,
              },
            },
          },
        },
      },
    })

    return travelPlan
  },

  async getUserTravelPlans(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit

    const [plans, total] = await Promise.all([
      prisma.travelPlan.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              profile: {
                select: {
                  fullName: true,
                  profileImage: true,
                },
              },
            },
          },
          _count: {
            select: {
              matches: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.travelPlan.count({
        where: { userId },
      }),
    ])

    return {
      plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async getTravelPlanById(planId: string) {
    const travelPlan = await prisma.travelPlan.findUnique({
      where: { id: planId },
      include: {
        user: {
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
            reviewsReceived: {
              include: {
                author: {
                  select: {
                    profile: {
                      select: {
                        fullName: true,
                      },
                    },
                  },
                },
              },
              take: 5,
            },
            _count: {
              select: {
                reviewsReceived: true,
                travelPlans: true,
              },
            },
          },
        },
        matches: {
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
          },
          where: {
            status: 'ACCEPTED',
          },
          take: 5,
        },
      },
    })

    if (!travelPlan) {
      throw new AppError(404, 'Travel plan not found')
    }

    return travelPlan
  },

  async updateTravelPlan(
    planId: string,
    userId: string,
    updateData: Partial<TravelPlanInput>
  ) {
    const startDate = updateData.startDate
    const endDate = updateData.endDate

    // Check if plan exists and user owns it
    const existingPlan = await prisma.travelPlan.findFirst({
      where: {
        id: planId,
        userId,
      },
    })

    if (!existingPlan) {
      throw new AppError(404, 'Travel plan not found or access denied')
    }

    const updatedData: any = { ...updateData }

    // Convert date strings to Date objects if provided
    if (startDate) {
      updatedData.startDate = new Date(startDate)
    }
    if (endDate) {
      updatedData.endDate = new Date(endDate)
    }

    const travelPlan = await prisma.travelPlan.update({
      where: { id: planId },
      data: updatedData,
      include: {
        user: {
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

    return travelPlan
  },

  async deleteTravelPlan(planId: string, userId: string) {
    // Check if plan exists and user owns it
    const existingPlan = await prisma.travelPlan.findFirst({
      where: {
        id: planId,
        userId,
      },
    })

    if (!existingPlan) {
      throw new AppError(404, 'Travel plan not found or access denied')
    }

    await prisma.travelPlan.delete({
      where: { id: planId },
    })

    return { message: 'Travel plan deleted successfully' }
  },

  async searchTravelPlans(
    filters: {
      destination?: string
      startDate?: string
      endDate?: string
      travelType?: string
      interests?: string[]
    },
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit

    const where: any = {
      isPublic: true,
      startDate: { gte: new Date() }, // Only future plans
    }

    if (filters.destination) {
      where.destination = {
        contains: filters.destination,
        mode: 'insensitive',
      }
    }

    if (filters.travelType) {
      where.travelType = filters.travelType
    }

    if (filters.startDate && filters.endDate) {
      where.OR = [
        {
          startDate: { lte: new Date(filters.endDate) },
          endDate: { gte: new Date(filters.startDate) },
        },
      ]
    }

    const [plans, total] = await Promise.all([
      prisma.travelPlan.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                  profileImage: true,
                  currentLocation: true,
                  travelInterests: true,
                },
              },
              reviewsReceived: {
                select: {
                  rating: true,
                },
              },
            },
          },
          _count: {
            select: {
              matches: true,
            },
          },
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.travelPlan.count({ where }),
    ])

    // Calculate average ratings
    const plansWithRatings = plans.map((plan) => {
      const ratings = plan.user.reviewsReceived.map((r) => r.rating)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0

      const { reviewsReceived, ...userWithoutReviews } = plan.user

      return {
        ...plan,
        user: {
          ...userWithoutReviews,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: ratings.length,
        },
      }
    })

    return {
      plans: plansWithRatings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },
}
