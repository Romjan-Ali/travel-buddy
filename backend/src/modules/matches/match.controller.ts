import { type Response } from 'express';
import type { AuthRequest } from '../../utils/types';
import { matchService } from './match.service';
import { sendResponse } from '../../utils/helpers';

export const matchController = {
  async createMatch(req: AuthRequest, res: Response) {
    const { receiverId, travelPlanId } = req.body;
    const match = await matchService.createMatch(req.user.id, receiverId, travelPlanId);
    sendResponse(res, 201, 'Match request sent successfully', { match });
  },

  async getUserMatches(req: AuthRequest, res: Response) {
    const { type = 'received', status, page = 1, limit = 10 } = req.query;
    const result = await matchService.getUserMatches(
      req.user.id,
      type as 'sent' | 'received',
      status as string,
      parseInt(page as string),
      parseInt(limit as string)
    );
    sendResponse(res, 200, 'Matches retrieved successfully', result);
  },

  async updateMatchStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return sendResponse(res, 400, 'Invalid status');
    }

    const match = await matchService.updateMatchStatus(id, req.user.id, status as 'ACCEPTED' | 'REJECTED');
    sendResponse(res, 200, `Match ${status.toLowerCase()} successfully`, { match });
  },

  async getMatchSuggestions(req: AuthRequest, res: Response) {
    const { travelPlanId, limit = 10 } = req.query;
    const suggestions = await matchService.getMatchSuggestions(
      req.user.id,
      travelPlanId as string,
      parseInt(limit as string)
    );
    sendResponse(res, 200, 'Match suggestions retrieved successfully', { suggestions });
  },

  async deleteMatch(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await matchService.deleteMatch(id, req.user.id);
    sendResponse(res, 200, result.message);
  },
};