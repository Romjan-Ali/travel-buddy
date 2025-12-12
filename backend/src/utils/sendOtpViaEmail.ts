// backend/src/utils/sendOtpViaEmail.ts
import nodemailer from 'nodemailer'
import { AppError } from '../middleware/errorHandler'

const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  port: Number(process.env.SMTP_PORT),
  host: process.env.SMTP_HOST,
})

interface SendEmailOptions {
  to: string
  otp: string
}

const generateOtpTemplate = (otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 520px; background: #ffffff; padding: 25px; border-radius: 12px; margin: auto;">
      
      <h2 style="color: #222; margin-bottom: 10px;">Your Verification Code</h2>

      <p style="font-size: 15px; color: #444; line-height: 1.6;">
        Hey there! 👋<br/>
        Here’s your one-time verification code. Use it to complete your sign-in or account setup.
      </p>

      <div style="
        font-size: 36px;
        letter-spacing: 4px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
        margin: 25px 0;
        color: #111;
        background: #f0f0f0;
        border-radius: 8px;
      ">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.5;">
        This code is valid for the next <strong>5 minutes</strong>.  
        If you didn’t request this, don’t worry — just ignore this email.
      </p>

      <p style="font-size: 14px; color: #555; margin-top: 20px;">
        Thanks, <br/>
        <span style="font-weight: bold;">Travel Buddy Team</span>
      </p>

    </div>
  </div>
`
}

export const sendEmail = async ({
  to,
  otp,
}: SendEmailOptions) => {
  try {
    const html = generateOtpTemplate(otp)

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Your OTP Code',
      html,
    })

    console.log(`📧 OTP email sent to ${to}: ${info.messageId}`)
  } catch (error: any) {
    console.log('email sending error', error.message)
    throw new AppError(401, 'Email error')
  }
}
