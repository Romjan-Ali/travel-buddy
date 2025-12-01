import { uploadToCloudinary } from '../../config/cloudinary';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export const uploadService = {
  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(400, 'Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new AppError(400, 'File size too large. Maximum size is 5MB.');
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(file.buffer, 'travel-buddy/profiles');

    // Update user profile with new image URL
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: { profileImage: uploadResult },
            update: { profileImage: uploadResult },
          },
        },
      },
      select: {
        profile: {
          select: {
            profileImage: true,
            fullName: true,
          },
        },
      },
    });

    return {
      url: uploadResult,
      profile: updatedUser.profile,
    };
  },

  async uploadTripPhotos(userId: string, files: Express.Multer.File[], travelPlanId?: string) {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, `travel-buddy/trips/${userId}`)
    );

    const uploadedUrls = await Promise.all(uploadPromises);

    // Here you could store these URLs in a separate database table for trip photos
    // For now, we'll just return the URLs

    return {
      urls: uploadedUrls,
      count: uploadedUrls.length,
    };
  },

  async deleteImage(imageUrl: string) {
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];
    const folder = urlParts[urlParts.length - 2];

    // In a real implementation, you would use Cloudinary's destroy method
    // For now, we'll just remove from database if it's a profile image

    const user = await prisma.user.findFirst({
      where: {
        profile: {
          profileImage: imageUrl,
        },
      },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          profile: {
            update: {
              profileImage: null,
            },
          },
        },
      });
    }

    return { message: 'Image removed successfully' };
  },
};