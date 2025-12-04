import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { paymentService } from './payment.service'
import { sendResponse } from '../../utils/helpers'

export const paymentController = {
  async createSubscription(req: AuthRequest, res: Response) {
    const { priceId } = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    if (!priceId) {
      return sendResponse(res, 400, 'Price ID is required')
    }

    const result = await paymentService.createSubscription(userId, priceId)
    sendResponse(res, 200, 'Checkout session created', result)
  },

  async createOneTimePayment(req: AuthRequest, res: Response) {
    const { amount, description } = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    if (!amount || !description) {
      return sendResponse(res, 400, 'Amount and description are required')
    }

    const result = await paymentService.createOneTimePayment(
      userId,
      amount,
      description
    )
    sendResponse(res, 200, 'Checkout session created', result)
  },

  async handleWebhook(req: AuthRequest, res: Response) {
    const sig = req.headers['stripe-signature']
    const event = req.body

    console.log('Received Stripe webhook event:', event)

    try {
      await paymentService.handleWebhook(event)
      sendResponse(res, 200, 'Webhook processed successfully')
    } catch (error) {
      console.error('Webhook error:', error)
      sendResponse(res, 400, 'Webhook error')
    }
  },

  async getUserSubscription(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const subscription = await paymentService.getUserSubscription(userId)
    sendResponse(res, 200, 'Subscription retrieved successfully', {
      subscription,
    })
  },

  async cancelSubscription(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await paymentService.cancelSubscription(userId)
    sendResponse(res, 200, result.message)
  },
}
