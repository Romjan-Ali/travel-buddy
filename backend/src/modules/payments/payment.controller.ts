import { Response } from 'express';
import { AuthRequest } from '../../utils/types';
import { paymentService } from './payment.service';
import { sendResponse } from '../../utils/helpers';

export const paymentController = {
  async createSubscription(req: AuthRequest, res: Response) {
    const { priceId } = req.body;
    
    if (!priceId) {
      return sendResponse(res, 400, 'Price ID is required');
    }

    const result = await paymentService.createSubscription(req.user.id, priceId);
    sendResponse(res, 200, 'Checkout session created', result);
  },

  async createOneTimePayment(req: AuthRequest, res: Response) {
    const { amount, description } = req.body;
    
    if (!amount || !description) {
      return sendResponse(res, 400, 'Amount and description are required');
    }

    const result = await paymentService.createOneTimePayment(req.user.id, amount, description);
    sendResponse(res, 200, 'Checkout session created', result);
  },

  async handleWebhook(req: AuthRequest, res: Response) {
    const sig = req.headers['stripe-signature'];
    const event = req.body;

    try {
      await paymentService.handleWebhook(event);
      sendResponse(res, 200, 'Webhook processed successfully');
    } catch (error) {
      console.error('Webhook error:', error);
      sendResponse(res, 400, 'Webhook error');
    }
  },

  async getUserSubscription(req: AuthRequest, res: Response) {
    const subscription = await paymentService.getUserSubscription(req.user.id);
    sendResponse(res, 200, 'Subscription retrieved successfully', { subscription });
  },

  async cancelSubscription(req: AuthRequest, res: Response) {
    const result = await paymentService.cancelSubscription(req.user.id);
    sendResponse(res, 200, result.message);
  },
};