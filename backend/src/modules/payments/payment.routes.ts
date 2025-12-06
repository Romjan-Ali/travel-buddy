// backend/src/modules/payments/payment.routes.ts
import { Router } from 'express';
import { paymentController } from './payment.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/auth';

const router = Router();

router.post('/create-subscription', authenticate, paymentController.createSubscription);
router.post('/create-payment', authenticate, paymentController.createOneTimePayment);
router.get('/subscription', authenticate, paymentController.getUserSubscription);
router.post('/cancel-subscription', authenticate, paymentController.cancelSubscription);

// Stripe webhook (no authentication required)
router.post('/webhook', paymentController.handleWebhook);

export default router;