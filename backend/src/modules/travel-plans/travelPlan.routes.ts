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
router.get('/:id', optionalAuthenticate, travelPlanController.getTravelPlan)
router.patch(
  '/:id',
  authenticate,
  validate(travelPlanUpdateSchema),
  travelPlanController.updateTravelPlan
)
router.post('/:id/save', authenticate, travelPlanController.toggleSaveTravelPlan)
router.delete('/:id', authenticate, travelPlanController.deleteTravelPlan)

export default router
