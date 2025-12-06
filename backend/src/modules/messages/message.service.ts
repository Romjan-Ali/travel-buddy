import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/errorHandler'

export const messageService = {
  async sendMessage(senderId: string, receiverId: string, content: string, matchId?: string) {
    // Check if users exist
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ])

    if (!sender || !receiver) {
      throw new AppError(404, 'User not found')
    }

    // Check if there's an existing match between users
    let existingMatch = matchId 
      ? await prisma.match.findUnique({ where: { id: matchId } })
      : await prisma.match.findFirst({
          where: {
            OR: [
              { initiatorId: senderId, receiverId },
              { initiatorId: receiverId, receiverId: senderId },
            ],
            status: 'ACCEPTED',
          },
        })

    if (!existingMatch) {
      throw new AppError(400, 'No accepted match found between users')
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        matchId: existingMatch.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })

    return message
  },

  async getConversation(user1Id: string, user2Id: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    })

    const total = await prisma.message.count({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
    })

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  },

  async getConversations(userId: string) {
    // Get all unique conversations for a user
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    })

    const conversationUserIds = [
      ...new Set([
        ...sentMessages.map(m => m.receiverId),
        ...receivedMessages.map(m => m.senderId),
      ]),
    ]

    const conversations = await Promise.all(
      conversationUserIds.map(async (otherUserId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          include: {
            sender: {
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

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                profileImage: true,
              },
            },
          },
        })

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            read: false,
          },
        })

        return {
          user: otherUser,
          lastMessage,
          unreadCount,
        }
      })
    )

    // Sort by last message date
    conversations.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt || new Date(0)
      const dateB = b.lastMessage?.createdAt || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })

    return conversations
  },

  async markAsRead(messageIds: string[], userId: string) {
    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
      },
      data: { read: true },
    })
  },

  async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new AppError(404, 'Message not found')
    }

    if (message.senderId !== userId) {
      throw new AppError(403, 'You can only delete your own messages')
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { deleted: true },
    })
  },
}