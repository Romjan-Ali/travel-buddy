import z from 'zod/v4'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.url(),

  // Database
  DATABASE_URL: z.url(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(4),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_UPLOAD_PRESET: z.string(),

  // ImgBB
  IMGBB_API_KEY: z.string(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  // SMTP (Gmail)
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.email(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.email(),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
})

export const env = envSchema.parse(process.env)
