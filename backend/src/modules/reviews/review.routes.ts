// backend/src/modules/reviews/review.routes.ts
import { Router } from 'express'
import { reviewController } from './review.controller'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validation'
import { reviewSchema, reviewUpdateSchema } from '../../utils/types'

const router = Router()

router.post(
  '/',
  authenticate,
  validate(reviewSchema),
  reviewController.createReview
)
router.get('/my-reviews', authenticate, reviewController.getUserReviews)
router.get('/can-review/:userId', authenticate, reviewController.checkCanReview)
router.get(
  '/travel-plan/:travelPlanId',
  authenticate,
  reviewController.getTravelPlanReviews
)
router.get('/pending-reviews', authenticate, reviewController.getPendingReviews)
router.patch(
  '/:id',
  authenticate,
  validate(reviewUpdateSchema),
  reviewController.updateReview
)
router.delete('/:id', authenticate, reviewController.deleteReview)

export default router
