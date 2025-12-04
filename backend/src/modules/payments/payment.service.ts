// backend/src/modules/payments/payment.service.ts
import { stripe } from '../../config/stripe';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import Stripe from 'stripe';

export const paymentService = {
  async createSubscription(userId: string, priceId: string) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: { gte: new Date() },
      },
    });

    if (existingSubscription) {
      throw new AppError(400, 'User already has an active subscription');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    console.log( 'session:', session );

    return {
      sessionId: session.id,
      url: session.url,
    };
  },

  async createOneTimePayment(userId: string, amount: number, description: string) {
    // Create Stripe checkout session for one-time payment
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      metadata: {
        userId,
        type: 'one_time',
        description,
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  },

  async handleWebhook(event: Stripe.Event) {
    // Handle Stripe webhook events
    switch (event.type) {
      case 'checkout.session.completed':
        await this._handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.updated':
        await this._handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await this._handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await this._handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await this._handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
    }
  },

  async getUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        OR: [
          { status: 'active' },
          { 
            status: 'past_due',
            currentPeriodEnd: { gte: new Date() },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return null;
    }

    // Get subscription details from Stripe
    if (subscription.stripeSubId) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubId);
        return {
          ...subscription,
          stripeData: {
            status: stripeSub.status,
            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          },
        };
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    return subscription;
  },

  async cancelSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) {
      throw new AppError(404, 'No active subscription found');
    }

    if (!subscription.stripeSubId) {
      throw new AppError(400, 'Subscription not linked to Stripe');
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripeSubId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'canceled' },
    });

    return { message: 'Subscription will be canceled at the end of the billing period' };
  },

  // Private helper methods (now properly part of the object)
  async _handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { userId } = session.metadata || {};
    const subscriptionId = session.subscription as string;

    if (!userId) {
      console.error('No userId in session metadata');
      return;
    }

    if (subscriptionId) {
      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      await prisma.subscription.create({
        data: {
          userId,
          stripeSubId: subscriptionId,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      // Update user verification status
      await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });
    }
  },

  async _handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  },

  async _handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        status: 'canceled',
      },
    });
  },

  async _handleInvoicePaid(invoice: Stripe.Invoice) {
    // Handle successful invoice payment
    console.log(`Invoice ${invoice.id} paid for subscription ${invoice.subscription}`);
    
    if (invoice.subscription) {
      await prisma.subscription.updateMany({
        where: { stripeSubId: invoice.subscription as string },
        data: { status: 'active' },
      });
    }
  },

  async _handleInvoiceFailed(invoice: Stripe.Invoice) {
    // Handle failed invoice payment
    console.log(`Invoice ${invoice.id} payment failed for subscription ${invoice.subscription}`);
    
    if (invoice.subscription) {
      await prisma.subscription.updateMany({
        where: { stripeSubId: invoice.subscription as string },
        data: { status: 'past_due' },
      });
    }
  },
};