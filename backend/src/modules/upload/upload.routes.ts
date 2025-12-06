// backend/src/modules/upload/upload.routes.ts
import { Router } from 'express'
import multer from 'multer'
import { uploadController } from './upload.controller'
import { authenticate } from '../../middleware/auth'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})

router.post(
  '/profile-image',
  authenticate,
  upload.single('image'),
  uploadController.uploadProfileImage
)
router.post(
  '/trip-photos',
  authenticate,
  upload.array('photos', 10),
  uploadController.uploadTripPhotos
)
router.delete('/', authenticate, uploadController.deleteImage)

export default router
