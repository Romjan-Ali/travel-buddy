import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler'

// Import routes (to be created)
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/user.routes'
import travelPlanRoutes from './modules/travel-plans/travelPlan.routes'
import reviewRoutes from './modules/reviews/review.routes'
import matchRoutes from './modules/matches/match.routes'
// import paymentRoutes from './modules/payments/payment.routes'
import adminRoutes from './modules/admin/admin.routes'
import uploadRoutes from './modules/upload/upload.routes'

// Load environment variables
dotenv.config()

const app = express()

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel Buddy API is running!',
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/travel-plans', travelPlanRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/matches', matchRoutes)
// app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL}`)
})

export default app
