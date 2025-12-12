// backend/src/modules/otp/otp.service.ts

import crypto from 'crypto'
import { prisma } from '../../lib/prisma'
import { redisClient } from '../../config/redis'
import { AppError } from '../../middleware/errorHandler'
import { sendEmail } from '../../utils/sendOtpViaEmail'

const OTP_EXPIRATION = 5 * 60 // 5 minutes

class OtpService {
  // ------------------------------
  // Helper: Generate OTP
  // ------------------------------
  private generateOtp(length = 6): string {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
  }

  // ------------------------------
  // Helper: Redis Key
  // ------------------------------
  private getRedisKey(email: string): string {
    return `otp:${email}`
  }

  // ------------------------------
  // Send OTP
  // ------------------------------
  async sendOtp(email: string, name: string = 'User') {
    console.log({ email, name })

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    if (user.isEmailVerified) {
      throw new AppError(401, 'User is already verified')
    }

    const otp = this.generateOtp()
    const redisKey = this.getRedisKey(email)

    // Save OTP to redis
    await redisClient.set(redisKey, otp, {
      expiration: {
        type: 'EX',
        value: OTP_EXPIRATION,
      },
    })

    // Send OTP via email
    await sendEmail({
      to: email,
      otp,
    })

    return { message: 'OTP sent successfully' }
  }

  // ------------------------------
  // Verify OTP
  // ------------------------------
  async verifyOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    if (user.isEmailVerified) {
      throw new AppError(401, `User with email ${email} is already verified`)
    }

    const redisKey = this.getRedisKey(email)
    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
      throw new AppError(401, 'Invalid or expired OTP')
    }

    if (savedOtp !== otp) {
      throw new AppError(401, 'Invalid OTP')
    }

    // Update user
    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    })

    // Delete OTP
    await redisClient.del([redisKey])

    return { message: 'OTP verified successfully' }
  }
}

// Export instance to match your architecture
export const otpService = new OtpService()
