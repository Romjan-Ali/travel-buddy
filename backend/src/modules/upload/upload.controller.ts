import { Response } from 'express';
import { AuthRequest } from '../../utils/types';
import { uploadService } from './upload.service';
import { sendResponse } from '../../utils/helpers';

export const uploadController = {
  async uploadProfileImage(req: AuthRequest, res: Response) {
    if (!req.file) {
      return sendResponse(res, 400, 'No file provided');
    }

    const result = await uploadService.uploadProfileImage(req.user.id, req.file);
    sendResponse(res, 200, 'Profile image uploaded successfully', result);
  },

  async uploadTripPhotos(req: AuthRequest, res: Response) {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return sendResponse(res, 400, 'No files provided');
    }

    const files = req.files as Express.Multer.File[];
    const { travelPlanId } = req.body;
    
    const result = await uploadService.uploadTripPhotos(req.user.id, files, travelPlanId);
    sendResponse(res, 200, 'Photos uploaded successfully', result);
  },

  async deleteImage(req: AuthRequest, res: Response) {
    const { url } = req.body;
    
    if (!url) {
      return sendResponse(res, 400, 'Image URL is required');
    }

    const result = await uploadService.deleteImage(url);
    sendResponse(res, 200, result.message);
  },
};