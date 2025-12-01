import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { userService } from './user.service'
import { sendResponse } from '../../utils/helpers'

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const user = await userService.getUserProfile(userId)
    sendResponse(res, 200, 'Profile retrieved successfully', { user })
  },

  async updateProfile(req: AuthRequest, res: Response) {
    const profileData = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const updatedUser = await userService.updateUserProfile(userId, profileData)
    sendResponse(res, 200, 'Profile updated successfully', {
      user: updatedUser,
    })
  },

  async getPublicProfile(req: AuthRequest, res: Response) {
    const { id } = req.params
    const user = await userService.getPublicProfile(id)
    sendResponse(res, 200, 'Public profile retrieved successfully', { user })
  },

  async searchUsers(req: AuthRequest, res: Response) {
    const { q, page = 1, limit = 10 } = req.query

    if (!q || typeof q !== 'string') {
      return sendResponse(res, 400, 'Search query is required')
    }

    const result = await userService.searchUsers(
      q,
      parseInt(page as string),
      parseInt(limit as string)
    )

    sendResponse(res, 200, 'Users retrieved successfully', result)
  },
}
