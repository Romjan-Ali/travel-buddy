// backend/src/modules/upload/upload.service.ts
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../config/cloudinary'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/errorHandler'

export const uploadService = {
  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        400,
        'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new AppError(400, 'File size too large. Maximum size is 5MB.')
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      'travel-buddy/profiles'
    )

    // Get user to check if profile exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    let updatedProfile

    if (user.profile) {
      // Update existing profile
      updatedProfile = await prisma.profile.update({
        where: { userId },
        data: {
          profileImage: uploadResult,
        },
        select: {
          profileImage: true,
          fullName: true,
        },
      })
    } else {
      // Create profile if it doesn't exist
      // First, we need to get the user's full name (you might want to pass this as a parameter)
      // For now, let's use email as fallback
      const defaultFullName = user.email.split('@')[0] || 'Anonymous'

      updatedProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: defaultFullName,
          profileImage: uploadResult,
        },
        select: {
          profileImage: true,
          fullName: true,
        },
      })
    }

    return {
      url: uploadResult,
      profile: updatedProfile,
    }
  },

  async uploadProfileImageV2(
    userId: string,
    file: Express.Multer.File,
    fullName?: string
  ) {
    // Alternative version with fullName parameter

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        400,
        'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new AppError(400, 'File size too large. Maximum size is 5MB.')
    }

    console.log('file', file)

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      'travel-buddy/profiles'
    )

    // Update or create profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: {
              fullName: fullName || `User_${userId.slice(0, 8)}`, // Default fullName
              profileImage: uploadResult,
            },
            update: {
              profileImage: uploadResult,
            },
          },
        },
      },
      include: {
        profile: {
          select: {
            profileImage: true,
            fullName: true,
          },
        },
      },
    })

    return {
      url: uploadResult,
      profile: updatedUser.profile,
    }
  },

  async uploadTripPhotos(
    userId: string,
    files: Express.Multer.File[],
    travelPlanId?: string
  ) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    // Validate all files
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB per file

    files.forEach((file) => {
      if (!allowedTypes.includes(file.mimetype)) {
        throw new AppError(
          400,
          `Invalid file type: ${file.originalname}. Only images are allowed.`
        )
      }
      if (file.size > maxSize) {
        throw new AppError(
          400,
          `File too large: ${file.originalname}. Maximum size is 10MB.`
        )
      }
    })

    // Upload files to Cloudinary
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file.buffer, `travel-buddy/trips/${userId}`)
    )

    const uploadedUrls = await Promise.all(uploadPromises)

    // If travelPlanId is provided, you could store these URLs in a separate database table
    // For example:

    if (travelPlanId) {
      // Check if travel plan exists and belongs to user
      const travelPlan = await prisma.travelPlan.findFirst({
        where: {
          id: travelPlanId,
          userId: userId,
        },
      })

      if (travelPlan) {
        // Here you could create trip photos records
        await prisma.tripPhoto.createMany({
          data: uploadedUrls.map((url) => ({
            url,
            travelPlanId,
            uploadedById: userId,
          })),
        })
      }
    }

    return {
      urls: uploadedUrls,
      count: uploadedUrls.length,
    }
  },  

  async deleteImage(currentUserId: string, imageUrl: string) {
    // First, check if the image belongs to a user profile
    const userWithProfileImage = await prisma.user.findFirst({
      where: {
        profile: {
          profileImage: imageUrl,
        },
      },
      include: { profile: true },
    })

    // Check if the image belongs to a trip photo
    const tripPhoto = await prisma.tripPhoto.findFirst({
      where: {
        url: imageUrl,
      },
      include: {
        travelPlan: {
          include: {
            user: true,
          },
        },
      },
    })

    // If it's a profile image
    if (userWithProfileImage?.profile) {
      // Authorization: Only allow users to delete their own profile image
      if (userWithProfileImage.id !== currentUserId) {
        throw new AppError(403, 'Not authorized to delete this image')
      }

      // Delete from Cloudinary
      try {
        await deleteFromCloudinary(imageUrl)
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        throw new AppError(500, 'Failed to delete image from storage')
      }

      // Remove from database
      await prisma.profile.update({
        where: { id: userWithProfileImage.profile.id },
        data: {
          profileImage: null,
        },
      })

      return {
        message: 'Profile image deleted successfully',
        removedFromProfile: true,
        deletedFromStorage: true,
      }
    }

    // If it's a trip photo
    if (tripPhoto) {
      // Authorization: Only allow trip owner to delete their trip photos
      if (tripPhoto.travelPlan.user.id !== currentUserId) {
        throw new AppError(403, 'Not authorized to delete this trip photo')
      }

      // Delete from Cloudinary
      try {
        await deleteFromCloudinary(imageUrl)
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        throw new AppError(500, 'Failed to delete image from storage')
      }

      // Remove from database
      await prisma.tripPhoto.delete({
        where: { id: tripPhoto.id },
      })

      return {
        message: 'Trip photo deleted successfully',
        removedFromTrip: true,
        deletedFromStorage: true,
        tripId: tripPhoto.travelPlan.id,
      }
    }

    // If image exists in other places (like user profile, reviews, etc.), add checks here
    // Check for other potential image references
    const userWithOtherImage = await prisma.user.findFirst({
      where: {
        profile: {
          OR: [
            { profileImage: imageUrl },
            // Add other image fields if they exist
          ],
        },
      },
    })

    // If not found in any database records, just delete from Cloudinary
    if (!userWithOtherImage) {
      try {
        await deleteFromCloudinary(imageUrl)
        return {
          message: 'Image deleted from storage (not found in database)',
          deletedFromStorage: true,
        }
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error)
        throw new AppError(500, 'Failed to delete image from storage')
      }
    }

    throw new AppError(404, 'Image not found in any accessible records')
  },

  async getCurrentProfileImage(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: {
          select: {
            profileImage: true,
            fullName: true,
          },
        },
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return {
      profileImage: user.profile?.profileImage || null,
      fullName: user.profile?.fullName || 'No profile',
    }
  },
}
