import { Router } from 'express'
import { travelPlanController } from './travelPlan.controller'
import { authenticate } from '../../middleware/auth'
import { validate } from '../../middleware/validation'
import { travelPlanSchema, travelPlanUpdateSchema } from '../../utils/types'

const router = Router()

router.post(
  '/',
  authenticate,
  validate(travelPlanSchema),
  travelPlanController.createTravelPlan
)
router.get('/my-plans', authenticate, travelPlanController.getUserTravelPlans)
router.get('/search', travelPlanController.searchTravelPlans)
router.get('/:id', travelPlanController.getTravelPlan)
router.patch(
  '/:id',
  authenticate,
  validate(travelPlanUpdateSchema),
  travelPlanController.updateTravelPlan
)
router.delete('/:id', authenticate, travelPlanController.deleteTravelPlan)

export default router
