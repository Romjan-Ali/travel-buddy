// backend/src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (
  file: Buffer,
  folder: string = 'travel-buddy'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder,
          // upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' },
            { format: 'webp' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result.secure_url)
          } else {
            reject(new Error('Upload failed'))
          }
        }
      )
      .end(file)
  })
}

export const deleteFromCloudinary = async (imageUrl: string): Promise<any> => {
  try {
    // Extract public ID from Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl)

    if (!publicId) {
      throw new Error('Could not extract public ID from URL')
    }

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return result
  } catch (error) {
    const err = error as Error
    throw new Error(`Failed to delete image from Cloudinary: ${err.message}`)
  }
}

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')

    // Remove "upload" and version segments
    const uploadIndex = pathParts.findIndex((part) => part === 'upload')
    if (uploadIndex === -1) {
      return null
    }

    // Get the parts after upload (skip the version number if present)
    const relevantParts = pathParts.slice(uploadIndex + 2) // Skip 'upload' and version

    // Remove file extension
    const fileName = relevantParts[relevantParts.length - 1]
    if (!fileName) return null
    const publicIdWithoutExtension = fileName.split('.')[0]

    // Reconstruct the public ID with folder structure
    const folderParts = relevantParts.slice(0, -1)
    const publicId = [...folderParts, publicIdWithoutExtension].join('/')

    return publicId
  } catch (error) {
    return null
  }
}

export default cloudinary
