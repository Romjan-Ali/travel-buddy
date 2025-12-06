// backend/src/config/imgbb.ts
import axios from 'axios'
import FormData from 'form-data'

export const uploadToImgBB = async (file: Buffer): Promise<string> => {
  
  try {
    if (!file || file.length === 0) {
      throw new Error('File buffer is empty')
    }

    const base64Image = file.toString('base64')

    const formData = new FormData()
    formData.append('image', base64Image)

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    )

    console.log(response)

    return response.data.data.url
  } catch (error: any) {
    console.error(
      'ImgBB upload error:',
      error?.response?.data || error.message
    )
    throw new Error('Image upload failed')
  }
}
