// backend/src/modules/users/user.service.ts
import { prisma } from '../../lib/prisma'
import type { ProfileInput } from '../../utils/types'
import { AppError } from '../../middleware/errorHandler'

export const userService = {
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        profile: true,
        travelPlans: {
          where: { isPublic: true },
          orderBy: { startDate: 'asc' },
          take: 5,
        },
        reviewsReceived: {
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
          take: 10,
        },
        _count: {
          select: {
            travelPlans: true,
            reviewsReceived: true,
          },
        },
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  },

  async updateUserProfile(userId: string, profileData: ProfileInput) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    // Update or create profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: profileData,
            update: profileData,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
        updatedAt: true,
      },
    })

    return updatedUser
  },

  async getPublicProfile(authUserId: string, userId: string) {
    // Check Subscription Status
    const userSubscription = await prisma.subscription.findFirst({
      where: { userId: authUserId, currentPeriodEnd: { gt: new Date() } },
    })

    if (!userSubscription) {
      throw new AppError(
        403,
        'Active subscription required to get public profiles'
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        isActive: true,
      },
      select: {
        id: true,
        profile: true,
        travelPlans: {
          where: {
            isPublic: true,
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
          take: 3,
        },
        reviewsReceived: {
          where: {
            rating: { gte: 4 },
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
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            travelPlans: true,
            reviewsReceived: true,
          },
        },
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  },

  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          {
            profile: {
              fullName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            profile: {
              currentLocation: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            profile: {
              travelInterests: {
                hasSome: [query],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        profile: {
          select: {
            fullName: true,
            profileImage: true,
            bio: true,
            currentLocation: true,
            travelInterests: true,
          },
        },
        _count: {
          select: {
            travelPlans: true,
            reviewsReceived: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        profile: {
          fullName: 'asc',
        },
      },
    })

    const total = await prisma.user.count({
      where: {
        isActive: true,
        OR: [
          {
            profile: {
              fullName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            profile: {
              currentLocation: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
    })

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
}
