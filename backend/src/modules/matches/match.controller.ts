// backend/src/modules/matches/match.controller.ts
import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { matchService } from './match.service'
import { sendResponse } from '../../utils/helpers'

export const matchController = {
  async createMatch(req: AuthRequest, res: Response) {
    const { receiverId, travelPlanId } = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const match = await matchService.createMatch(
      userId,
      receiverId,
      travelPlanId
    )
    sendResponse(res, 201, 'Match request sent successfully', { match })
  },

  async getUserMatches(req: AuthRequest, res: Response) {
    const { type = 'received', status, page = 1, limit = 10 } = req.query
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await matchService.getUserMatches(
      userId,
      type as 'sent' | 'received',
      status as string,
      parseInt(page as string),
      parseInt(limit as string)
    )
    sendResponse(res, 200, 'Matches retrieved successfully', result)
  },

  async updateMatchStatus(req: AuthRequest, res: Response) {
    const { id } = req.params
    const { status } = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return sendResponse(res, 400, 'Invalid status')
    }

    const match = await matchService.updateMatchStatus(
      id,
      userId,
      status as 'ACCEPTED' | 'REJECTED'
    )
    sendResponse(res, 200, `Match ${status.toLowerCase()} successfully`, {
      match,
    })
  },

  async getMatchSuggestions(req: AuthRequest, res: Response) {
    const { travelPlanId, limit = 10 } = req.query
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const suggestions = await matchService.getMatchSuggestions(
      userId,
      travelPlanId as string,
      parseInt(limit as string)
    )
    sendResponse(res, 200, 'Match suggestions retrieved successfully', {
      suggestions,
    })
  },

  async deleteMatch(req: AuthRequest, res: Response) {
    const { id } = req.params
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await matchService.deleteMatch(id, userId)
    sendResponse(res, 200, result.message)
  },
}
