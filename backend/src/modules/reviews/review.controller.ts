// backend/src/modules/reviews/review.controller.ts
import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { reviewService } from './review.service'
import { sendResponse } from '../../utils/helpers'

export const reviewController = {
  async checkCanReview(req: AuthRequest, res: Response) {
    const { userId } = req.params
    const currentUserId = req.user?.id

    if (!currentUserId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    const result = await reviewService.checkCanReview(currentUserId, userId)
    sendResponse(res, 200, 'Review check completed', result)
  },
  
  async createReview(req: AuthRequest, res: Response) {
    const reviewData = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const review = await reviewService.createReview(userId, reviewData)
    sendResponse(res, 201, 'Review created successfully', { review })
  },

  async getUserReviews(req: AuthRequest, res: Response) {
    const { type = 'received', page = 1, limit = 10 } = req.query
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await reviewService.getUserReviews(
      userId,
      type as 'given' | 'received',
      parseInt(page as string),
      parseInt(limit as string)
    )
    sendResponse(res, 200, 'Reviews retrieved successfully', result)
  },

  async updateReview(req: AuthRequest, res: Response) {
    const { id } = req.params
    const updateData = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const review = await reviewService.updateReview(id, userId, updateData)
    sendResponse(res, 200, 'Review updated successfully', { review })
  },

  async deleteReview(req: AuthRequest, res: Response) {
    const { id } = req.params
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await reviewService.deleteReview(id, userId)
    sendResponse(res, 200, result.message)
  },

  async getTravelPlanReviews(req: AuthRequest, res: Response) {
    const { travelPlanId } = req.params
    const reviews = await reviewService.getTravelPlanReviews(travelPlanId)
    sendResponse(res, 200, 'Travel plan reviews retrieved successfully', {
      reviews,
    })
  },
}
