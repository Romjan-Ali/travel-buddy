import { Router } from 'express'
import { travelPlanController } from './travelPlan.controller'
import { authenticate, optionalAuthenticate } from '../../middleware/auth'
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
router.get('/search', optionalAuthenticate, travelPlanController.searchTravelPlans)
router.get('/:id', travelPlanController.getTravelPlan)
router.patch(
  '/:id',
  authenticate,
  validate(travelPlanUpdateSchema),
  travelPlanController.updateTravelPlan
)
router.post('/:id/like', authenticate, travelPlanController.likeTravelPlan)
router.delete('/:id', authenticate, travelPlanController.deleteTravelPlan)

export default router
