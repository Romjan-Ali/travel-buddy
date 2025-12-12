// backend/src/modules/users/user.routes.ts
import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { profileSchema } from '../../utils/types';

const router = Router();

router.get('/profile', authenticate, userController.getProfile); // Get own profile
router.patch('/profile', authenticate, validate(profileSchema), userController.updateProfile);
router.get('/:id', authenticate, userController.getPublicProfile);
router.get('/', userController.searchUsers);

export default router;