// backend/src/modules/auth/auth.controller.ts
import type { Response } from 'express'
import type { AuthRequest } from '../../utils/types'
import { authService } from './auth.service'
import { sendResponse } from '../../utils/helpers'

export const authController = {
  async register(req: AuthRequest, res: Response) {
    const userData = req.body
    const result = await authService.register(userData)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      partitioned: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendResponse(res, 201, 'User registered successfully', {
      user: result.user,
    })
  },

  async login(req: AuthRequest, res: Response) {
    const credentials = req.body
    const result = await authService.login(credentials)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      partitioned: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendResponse(res, 200, 'Login successful', {
      user: result.user,
    })
  },

  async getMe(req: AuthRequest, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return sendResponse(res, 401, 'Unauthorized')
    }
    const user = await authService.getCurrentUser(userId)
    sendResponse(res, 200, 'User retrieved successfully', { user })
  },

  async logout(req: AuthRequest, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      partitioned: process.env.NODE_ENV === 'production' ? true : false,
    })

    await authService.logout()
    sendResponse(res, 200, 'Logged out successfully')
  },
}
