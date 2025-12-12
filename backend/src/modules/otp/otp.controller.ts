// backend/src/modules/otp/otp.controller.ts

import type { Request, Response } from 'express'
import { otpService } from './otp.service'
import { sendResponse } from '../../utils/helpers'

export const OTPController = {
  async sendOTP(req: Request, res: Response) {
    const { email, name } = req.body

    await otpService.sendOtp(email, name)

    sendResponse(res, 200, 'OTP sent successfully')
  },

  async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body

    await otpService.verifyOtp(email, otp)

    sendResponse(res, 200, 'OTP verified successfully')
  },
}
