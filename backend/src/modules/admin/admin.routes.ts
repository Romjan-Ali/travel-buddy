import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getSystemAnalytics);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id', adminController.updateUserStatus);
router.get('/travel-plans', adminController.getAllTravelPlans);
router.delete('/travel-plans/:id', adminController.deleteTravelPlan);

export default router;