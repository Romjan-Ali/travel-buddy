// backend/src/modules/upload/upload.controller.ts
import { type Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { uploadService } from './upload.service'
import { sendResponse } from '../../utils/helpers'

export const uploadController = {
  async uploadProfileImage(req: AuthRequest, res: Response) {
    if (!req.file) {
      return sendResponse(res, 400, 'No file provided')
    }
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    const result = await uploadService.uploadProfileImage(userId, req.file)
    sendResponse(res, 200, 'Profile image uploaded successfully', result)
  },

  async uploadTripPhotos(req: AuthRequest, res: Response) {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return sendResponse(res, 400, 'No files provided')
    }

    const files = req.files as Express.Multer.File[]
    const { travelPlanId } = req.body
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const result = await uploadService.uploadTripPhotos(
      userId,
      files,
      travelPlanId
    )
    sendResponse(res, 200, 'Photos uploaded successfully', result)
  },

  async deleteImage(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }

    const { url } = req.body

    if (!url) {
      return sendResponse(res, 400, 'Image URL is required')
    }

    const result = await uploadService.deleteImage(userId, url)
    sendResponse(res, 200, result.message)
  },
}
