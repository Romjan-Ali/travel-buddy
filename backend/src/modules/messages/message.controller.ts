import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { messageService } from './message.service'
import { sendResponse } from '../../utils/helpers'

export const messageController = {
  async sendMessage(req: AuthRequest, res: Response) {
    const { receiverId, content, matchId } = req.body

    if (!receiverId || !content) {
      return sendResponse(res, 400, 'Receiver ID and content are required')
    }

    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    const message = await messageService.sendMessage(
      userId,
      receiverId,
      content,
      matchId
    )

    sendResponse(res, 201, 'Message sent successfully', { message })
  },

  async getConversation(req: AuthRequest, res: Response) {
    const { userId } = req.params
    const { page = 1, limit = 50 } = req.query

    const authUserId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    const conversation = await messageService.getConversation(
      authUserId!,
      userId,
      parseInt(page as string),
      parseInt(limit as string)
    )

    sendResponse(res, 200, 'Conversation retrieved successfully', conversation)
  },

  async getConversations(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const conversations = await messageService.getConversations(userId)
    sendResponse(res, 200, 'Conversations retrieved successfully', {
      conversations,
    })
  },

  async markAsRead(req: AuthRequest, res: Response) {
    const { messageIds } = req.body

    if (!messageIds || !Array.isArray(messageIds)) {
      return sendResponse(res, 400, 'Message IDs are required')
    }

    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    await messageService.markAsRead(messageIds, userId)
    sendResponse(res, 200, 'Messages marked as read')
  },

  async deleteMessage(req: AuthRequest, res: Response) {
    const { id } = req.params
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    await messageService.deleteMessage(id, userId)
    sendResponse(res, 200, 'Message deleted successfully')
  },
}
