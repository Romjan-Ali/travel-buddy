// backend/src/modules/travel-plans/travelPlan.controller.ts
import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { travelPlanService } from './travelPlan.service'
import { sendResponse } from '../../utils/helpers'

export const travelPlanController = {
  async createTravelPlan(req: AuthRequest, res: Response) {
    const planData = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const travelPlan = await travelPlanService.createTravelPlan(
      userId,
      planData
    )
    sendResponse(res, 201, 'Travel plan created successfully', { travelPlan })
  },

  async getUserTravelPlans(req: AuthRequest, res: Response) {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await travelPlanService.getUserTravelPlans(
      userId,
      parseInt(page as string),
      parseInt(limit as string)
    )
    sendResponse(res, 200, 'Travel plans retrieved successfully', result)
  },

  async getTravelPlan(req: AuthRequest, res: Response) {
    const { id } = req.params
    const travelPlan = await travelPlanService.getTravelPlanById(id)
    sendResponse(res, 200, 'Travel plan retrieved successfully', { travelPlan })
  },

  async updateTravelPlan(req: AuthRequest, res: Response) {
    const { id } = req.params
    const updateData = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const travelPlan = await travelPlanService.updateTravelPlan(
      id,
      userId,
      updateData
    )
    sendResponse(res, 200, 'Travel plan updated successfully', { travelPlan })
  },

  async deleteTravelPlan(req: AuthRequest, res: Response) {
    const { id } = req.params
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await travelPlanService.deleteTravelPlan(id, userId)
    sendResponse(res, 200, result.message)
  },

  async searchTravelPlans(req: AuthRequest, res: Response) {
    const { page, limit, ...filtersQuery } = req.query
    const interests =
      typeof req.query.interests === 'string'
        ? req.query.interests.split(',')
        : undefined
    const sort = req.query.sort as 'upcoming' | 'most_recent' | undefined
    const filters = { ...filtersQuery, interests, sort }

    const result = await travelPlanService.searchTravelPlans(
      filters as any,
      parseInt(page as string),
      parseInt(limit as string)
    )

    sendResponse(res, 200, 'Travel plans retrieved successfully', result)
  },
}
