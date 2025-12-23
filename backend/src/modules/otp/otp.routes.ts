// backend/src/modules/otp/otp.routes.ts
import express from 'express'
import { OtpController } from './otp.controller'

const router = express.Router()

router.post('/send', OtpController.sendOTP)
router.post('/verify', OtpController.verifyOTP)

export default router
