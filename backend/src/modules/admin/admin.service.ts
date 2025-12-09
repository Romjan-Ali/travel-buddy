// backend/src/modules/admin/admin.service.ts
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/errorHandler'

export const adminService = {
  async getDashboardStats() {
    const [
      totalUsers,
      activeUsers,
      totalTravelPlans,
      activeTravelPlans,
      totalReviews,
      totalMatches,
      activeSubscriptions,
      recentSignups,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.travelPlan.count(),
      prisma.travelPlan.count({ where: { startDate: { gte: new Date() } } }),
      prisma.review.count(),
      prisma.match.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.user.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return {
      totals: {
        users: totalUsers,
        activeUsers,
        travelPlans: totalTravelPlans,
        activeTravelPlans,
        reviews: totalReviews,
        matches: totalMatches,
        subscriptions: activeSubscriptions,
      },
      recentSignups,
    }
  },

  async getAllUsers(
    page: number = 1,
    limit: number = 20,
    filters: {
      search?: string
      role?: 'ADMIN' | 'USER'
      isActive?: boolean
      isVerified?: boolean
    }
  ) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        {
          profile: {
            fullName: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ]
    }

    if (filters?.role) {
      where.role = filters.role
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive === true
    }

    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified === true
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          isVerified: true,
          profile: {
            select: {
              fullName: true,
              profileImage: true,
              currentLocation: true,
            },
          },
          _count: {
            select: {
              travelPlans: true,
              reviewsReceived: true,
              subscriptions: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async getUserDetails(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        profile: true,
        travelPlans: {
          include: {
            matches: true,
          },
          orderBy: { createdAt: 'desc' },
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
          orderBy: { createdAt: 'desc' },
        },
        reviewsGiven: {
          include: {
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
          orderBy: { createdAt: 'desc' },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
        matchesInitiated: {
          include: {
            receiver: {
              select: {
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        matchesReceived: {
          include: {
            initiator: {
              select: {
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  },

  async updateUserStatus(
    userId: string,
    updates: { isActive?: boolean; isVerified?: boolean; role?: string }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    // if(updates.isActive !== undefined)

    const updateData: any = {}

    if (updates.isActive !== undefined) {
      updateData.isActive = updates.isActive
    }

    if (updates.isVerified !== undefined) {
      updateData.isVerified = updates.isVerified
    }

    if (updates.role !== undefined) {
      updateData.role = updates.role
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
        profile: {
          select: {
            fullName: true,
          },
        },
        updatedAt: true,
      },
    })

    return updatedUser
  },

  async getAllTravelPlans(page: number = 1, limit: number = 20, filters?: any) {
    const skip = (page - 1) * limit
    const where: any = {}

    if (filters?.search) {
      where.OR = [
        { destination: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.travelType) {
      where.travelType = filters.travelType
    }

    if (filters?.isPublic !== undefined) {
      where.isPublic = filters.isPublic === 'true'
    }

    const [travelPlans, total] = await Promise.all([
      prisma.travelPlan.findMany({
        where,
        include: {
          user: {
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
          matches: true,
          _count: {
            select: {
              matches: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.travelPlan.count({ where }),
    ])

    return {
      travelPlans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async deleteTravelPlan(planId: string) {
    const travelPlan = await prisma.travelPlan.findUnique({
      where: { id: planId },
    })

    if (!travelPlan) {
      throw new AppError(404, 'Travel plan not found')
    }

    await prisma.travelPlan.delete({
      where: { id: planId },
    })

    return { message: 'Travel plan deleted successfully' }
  },

  async getSystemAnalytics() {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    // Monthly Signups
    const monthlySignupsRaw = await prisma.$queryRaw<
      { month: Date; count: bigint }[]
    >`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count
    FROM "users"
    WHERE "createdAt" >= ${twelveMonthsAgo}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month
  `

    const monthlySignups = monthlySignupsRaw.map((row) => ({
      month: row.month,
      count: Number(row.count),
    }))

    // Popular Destinations
    const popularDestinationsRaw = await prisma.$queryRaw<
      { destination: string; plan_count: bigint }[]
    >`
    SELECT 
      "destination",
      COUNT(*) as plan_count
    FROM "travel_plans"
    WHERE "startDate" >= NOW()
    GROUP BY "destination"
    ORDER BY plan_count DESC
    LIMIT 10
  `

    const popularDestinations = popularDestinationsRaw.map((row) => ({
      destination: row.destination,
      plan_count: Number(row.plan_count),
    }))

    // Engagement Stats
    const engagementStats = {
      activeUsers: Number(
        await prisma.user.count({
          where: {
            OR: [
              { travelPlans: { some: {} } },
              { reviewsGiven: { some: {} } },
              { matchesInitiated: { some: {} } },
            ],
            isActive: true,
          },
        })
      ),
      plansCreated: Number(
        await prisma.travelPlan.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        })
      ),
      matchesMade: Number(
        await prisma.match.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        })
      ),
      reviewsGiven: Number(
        await prisma.review.count({
          where: {
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        })
      ),
    }

    return {
      monthlySignups,
      popularDestinations,
      engagementStats,
    }
  },
}
