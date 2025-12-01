import { type Response } from 'express';
import type { AuthRequest } from '../../utils/types';
import { adminService } from './admin.service';
import { sendResponse } from '../../utils/helpers';

export const adminController = {
  async getDashboardStats(req: AuthRequest, res: Response) {
    const stats = await adminService.getDashboardStats();
    sendResponse(res, 200, 'Dashboard stats retrieved successfully', stats);
  },

  async getAllUsers(req: AuthRequest, res: Response) {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await adminService.getAllUsers(
      parseInt(page as string),
      parseInt(limit as string),
      filters
    );
    sendResponse(res, 200, 'Users retrieved successfully', result);
  },

  async getUserDetails(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const user = await adminService.getUserDetails(id);
    sendResponse(res, 200, 'User details retrieved successfully', { user });
  },

  async updateUserStatus(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    const user = await adminService.updateUserStatus(id, updates);
    sendResponse(res, 200, 'User status updated successfully', { user });
  },

  async getAllTravelPlans(req: AuthRequest, res: Response) {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await adminService.getAllTravelPlans(
      parseInt(page as string),
      parseInt(limit as string),
      filters
    );
    sendResponse(res, 200, 'Travel plans retrieved successfully', result);
  },

  async deleteTravelPlan(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const result = await adminService.deleteTravelPlan(id);
    sendResponse(res, 200, result.message);
  },

  async getSystemAnalytics(req: AuthRequest, res: Response) {
    const analytics = await adminService.getSystemAnalytics();
    sendResponse(res, 200, 'System analytics retrieved successfully', analytics);
  },
};