import { type Response } from 'express';
import type { AuthRequest } from '../../utils/types';
import { reviewService } from './review.service';
import { sendResponse } from '../../utils/helpers';

export const reviewController = {
  async createReview(req: AuthRequest, res: Response) {
    const reviewData = req.body;
    const review = await reviewService.createReview(req.user.id, reviewData);
    sendResponse(res, 201, 'Review created successfully', { review });
  },

  async getUserReviews(req: AuthRequest, res: Response) {
    const { type = 'received', page = 1, limit = 10 } = req.query;
    const result = await reviewService.getUserReviews(
      req.user.id,
      type as 'given' | 'received',
      parseInt(page as string),
      parseInt(limit as string)
    );
    sendResponse(res, 200, 'Reviews retrieved successfully', result);
  },

  async updateReview(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    const review = await reviewService.updateReview(id, req.user.id, updateData);
    sendResponse(res, 200, 'Review updated successfully', { review });
  },

  async deleteReview(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await reviewService.deleteReview(id, req.user.id);
    sendResponse(res, 200, result.message);
  },

  async getTravelPlanReviews(req: AuthRequest, res: Response) {
    const { travelPlanId } = req.params;
    const reviews = await reviewService.getTravelPlanReviews(travelPlanId);
    sendResponse(res, 200, 'Travel plan reviews retrieved successfully', { reviews });
  },
};