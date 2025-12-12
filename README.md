# Travel Buddy - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Installation Guide](#installation-guide)
7. [Configuration](#configuration)
8. [API Documentation](#api-documentation)
9. [Development Guide](#development-guide)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [Troubleshooting](#troubleshooting)

---

## 🔑 User Credentials (Testing Purpose)

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@travelbuddy.com  | admin123   |
| User  | user.email.2@gmail.com | w3password |
| User  | user.email.1@gmail.com | w3password |

---

## 🌍 Project Overview

**Travel Buddy** is a full-stack web application designed to help travelers connect, plan trips, and share experiences. Built with modern TypeScript technologies, it provides a seamless platform for travel enthusiasts to discover destinations, coordinate with fellow travelers, and manage their journeys.

## ✨ Features

- **User Authentication & Roles**: Secure registration and login with email/password. Role-based access control for Users and Admins.
- **Profile Management**: Create and manage user profiles with details like name, bio, travel interests, and profile picture.
- **Travel Plan Management**: Users can create, view, update, and delete their travel plans.
- **Search & Matching**: Find travel buddies based on destination, date, and interests.
- **Review & Rating System**: Leave reviews and ratings for fellow travelers after a trip.
- **Payment Integration**: Subscription plans for premium features. Users cannot create plans, match with others, or view profiles without an active subscription.
- **Admin Dashboard**: Admins can manage users, travel plans, and other content.

---

## 🔗 Live Demo

- **Frontend**: https://travel-buddy-meetup.onrender.com  
- **Backend API**: https://travel-buddy-lk56.onrender.com/api

---

## 🏗️ Architecture

Travel Buddy follows a modern client-server architecture:

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│   Frontend      │◄───────►│    Backend      │
│   (React/Next)  │  HTTP   │   (Node.js)     │
│                 │  REST   │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    Database     │
                            │  (PostgreSQL/   │
                            │   MongoDB)      │
                            └─────────────────┘
```

### Design Patterns

- **MVC Pattern**: Separation of concerns between models, views, and controllers
- **RESTful API**: Standard HTTP methods for CRUD operations
- **Component-Based**: Reusable UI components in the frontend
- **Middleware**: Request/response processing and authentication

---

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Fetch API
- **Routing**: Next.js Routing

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT
- **Validation**: Zod

### Database
- **Primary DB**: PostgreSQL
- **ORM/ODM**: Prisma
- **Caching**: Redis

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Deployment**: Render
- **Package Manager**: bun
- **Linting**: ESLint
- **Formatting**: Prettier

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **Git**
- **PostgreSQL** or **MongoDB** (depending on implementation)

### Quick Start

```sh
# Clone the repository
git clone https://github.com/Romjan-Ali/travel-buddy.git

# Navigate to project directory
cd travel-buddy

# Install dependencies for both frontend and backend
npm run install:all
# or
cd frontend && npm install
cd ../backend && npm install
```

---

## 📁 Project Structure

```
travel-buddy/
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   │   ├── 20251130035549_init
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src
│   │   ├── config
│   │   │   ├── cloudinary.ts
│   │   │   ├── imgbb.ts
│   │   │   ├── redis.ts
│   │   │   └── stripe.ts
│   │   ├── generated
│   │   │   └── prisma
│   │   │       ├── internal
│   │   │       ├── models
│   │   │       │   ├── Match.ts
│   │   │       │   ├── Message.ts
│   │   │       │   ├── Profile.ts
│   │   │       │   ├── Review.ts
│   │   │       │   ├── Subscription.ts
│   │   │       │   ├── TravelPlan.ts
│   │   │       │   ├── TripPhoto.ts
│   │   │       │   └── User.ts
│   │   │       ├── browser.ts
│   │   │       ├── client.ts
│   │   │       ├── commonInputTypes.ts
│   │   │       ├── enums.ts
│   │   │       └── models.ts
│   │   ├── lib
│   │   │   └── prisma.ts
│   │   ├── middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── modules
│   │   │   ├── admin
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.routes.ts
│   │   │   │   └── admin.service.ts
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── matches
│   │   │   │   ├── match.controller.ts
│   │   │   │   ├── match.routes.ts
│   │   │   │   └── match.service.ts
│   │   │   ├── messages
│   │   │   │   ├── message.controller.ts
│   │   │   │   ├── message.routes.ts
│   │   │   │   ├── message.service.ts
│   │   │   │   └── socket.service.ts
│   │   │   ├── otp
│   │   │   │   ├── otp.controller.ts
│   │   │   │   ├── otp.routes.ts
│   │   │   │   └── otp.service.ts
│   │   │   ├── payments
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.routes.ts
│   │   │   │   └── payment.service.ts
│   │   │   ├── reviews
│   │   │   │   ├── review.controller.ts
│   │   │   │   ├── review.routes.ts
│   │   │   │   └── review.service.ts
│   │   │   ├── travel-plans
│   │   │   │   ├── travelPlan.controller.ts
│   │   │   │   ├── travelPlan.routes.ts
│   │   │   │   └── travelPlan.service.ts
│   │   │   ├── upload
│   │   │   │   ├── upload.controller.ts
│   │   │   │   ├── upload.routes.ts
│   │   │   │   └── upload.service.ts
│   │   │   └── users
│   │   │       ├── user.controller.ts
│   │   │       ├── user.routes.ts
│   │   │       └── user.service.ts
│   │   ├── utils
│   │   │   ├── helpers.ts
│   │   │   ├── sendOtpViaEmail.ts
│   │   │   └── types.ts
│   │   └── app.ts
│   ├── bun.lock
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── prisma.config.ts
│   ├── README.md
│   └── tsconfig.json
├── frontend
│   ├── app
│   │   ├── admin
│   │   │   ├── dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── travel-plans
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       └── page.tsx
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── explore
│   │   │   └── page.tsx
│   │   ├── matches
│   │   │   └── page.tsx
│   │   ├── messages
│   │   │   └── page.tsx
│   │   ├── payment
│   │   │   ├── cancel
│   │   │   │   └── page.tsx
│   │   │   └── success
│   │   │       └── page.tsx
│   │   ├── payments
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   ├── edit
│   │   │   │   └── page.tsx
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── reviews
│   │   │   └── page.tsx
│   │   ├── travel-plans
│   │   │   ├── [id]
│   │   │   │   ├── edit
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── matches
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── unauthorized
│   │   │   └── page.tsx
│   │   ├── verify-email
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── dashboard
│   │   │   └── review-widget.tsx
│   │   ├── explore
│   │   │   └── explore-content.tsx
│   │   ├── home
│   │   │   ├── cta-section.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   └── testimonials.tsx
│   │   ├── layout
│   │   │   ├── navbar
│   │   │   │   ├── DesktopNav.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── NavItems.tsx
│   │   │   │   ├── Notifications.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navbar.tsx
│   │   ├── matches
│   │   │   └── match-request.tsx
│   │   ├── messages
│   │   │   ├── chat-window.tsx
│   │   │   └── quick-chat.tsx
│   │   ├── payments
│   │   │   ├── premium-guard.tsx
│   │   │   └── subscription-plans.tsx
│   │   ├── profile
│   │   │   ├── edit-form.tsx
│   │   │   ├── ProfileAboutTab.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfilePlansTab.tsx
│   │   │   ├── ProfileReviewsTab.tsx
│   │   │   ├── ProfileSidebar.tsx
│   │   │   ├── ProfileTabs.tsx
│   │   │   └── ReviewOpportunityBanner.tsx
│   │   ├── reviews
│   │   │   ├── edit-review-dialog.tsx
│   │   │   ├── GivenReviewsTab.tsx
│   │   │   ├── index.ts
│   │   │   ├── leave-review-dialog.tsx
│   │   │   ├── RatingDistribution.tsx
│   │   │   ├── ReceivedReviewsTab.tsx
│   │   │   ├── review-card.tsx
│   │   │   ├── review-form.tsx
│   │   │   ├── review-notifications.tsx
│   │   │   ├── ReviewsHeader.tsx
│   │   │   ├── review-sorting.tsx
│   │   │   ├── ReviewsStats.tsx
│   │   │   ├── ReviewsTabs.tsx
│   │   │   ├── ReviewTips.tsx
│   │   │   └── star-rating.tsx
│   │   ├── travel-plans
│   │   │   ├── index.ts
│   │   │   ├── MatchRequestDialog.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── TravelPlanDetails.tsx
│   │   │   ├── TravelPlanHeader.tsx
│   │   │   ├── TravelPlanMatches.tsx
│   │   │   ├── TravelPlanOrganizer.tsx
│   │   │   ├── TravelPlanReviews.tsx
│   │   │   ├── TravelPlanSidebar.tsx
│   │   │   ├── TravelPlanStats.tsx
│   │   │   ├── TravelPlanTabs.tsx
│   │   │   └── TravelPlanTimeline.tsx
│   │   ├── ui
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   └── ...
│   │   ├── upload
│   │   │   └── image-upload.tsx
│   │   └── loading.tsx
│   ├── lib
│   │   ├── api.ts
│   │   ├── auth-context.tsx
│   │   ├── config.ts
│   │   ├── jwt.ts
│   │   ├── socket.ts
│   │   └── utils.ts
│   ├── public
│   │   ├── images
│   │   │   └── home-page
│   │   │       └── destinations
│   │   │           ├── bali-indonesia.jpg
│   │   │           ├── bangkok-thailand.jpg
│   │   │           ├── new-york-usa.jpg
│   │   │           └── ...
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── types
│   │   └── index.ts
│   ├── bun.lock
│   ├── components.json
│   ├── .env.local
│   ├── .env.local.example
│   ├── eslint.config.mjs
│   ├── .gitignore
│   ├── global.d.ts
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── README.md
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── Project Instructions.md
└── README.md
```

---

## 📦 Installation Guide

### Backend Setup

1. **Navigate to backend directory**

```sh
   cd backend
```

2. **Install dependencies**

```sh
   npm install
```

3. **Configure environment variables**

```sh
   cp .env.example .env
```

4. **Edit .env file** with your configuration:

```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/travelbuddy
   JWT_SECRET=your-secret-key
   NODE_ENV=development
```

5. **Run database migrations**

```sh
   npm run migrate
```

6. **Seed database (optional)**

```sh
   npm run seed
```

7. **Start development server**

```sh
   npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**

```sh
   cd frontend
```

2. **Install dependencies**

```sh
   npm install
```

3. **Configure environment variables**

```sh
   cp .env.example .env.local
```

4. **Edit .env.local file**:

```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Start development server**

```sh
   npm run dev
```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

```env
#############################
# Database
#############################
DATABASE_URL="postgresql://user:password@localhost:5432/travelbuddy?schema=public"

#############################
# JWT
#############################
JWT_SECRET="supersecretjwtkey123"
JWT_EXPIRES_IN="7d"

#############################
# Cloudinary
#############################
CLOUDINARY_CLOUD_NAME="sample_cloud"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abc123xyz456def789"
CLOUDINARY_UPLOAD_PRESET="travelbuddy_uploads"

#############################
# ImgBB
#############################
IMGBB_API_KEY="your-imgbb-api-key"

#############################
# Stripe
#############################
STRIPE_SECRET_KEY="sk_test_51OrSampleSecretKey000000"
STRIPE_WEBHOOK_SECRET="whsec_123456789example"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51OrSamplePublicKey000000"

#############################
# Application
#############################
NODE_ENV="development"
PORT="5000"
CLIENT_URL="http://localhost:3000"

#############################
# SMTP (Gmail)
#############################
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Travel Buddy <your-email@gmail.com>"

#############################
# Redis
#############################
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_USERNAME="default"
REDIS_PASSWORD="your_redis_password"

```

#### Frontend (.env.local)

```env
#########################################
# API Configuration
#########################################

# Base URL of your backend API (Example)
NEXT_PUBLIC_API_URL=http://localhost:5000/api


#########################################
# Stripe Configuration
#########################################

# Public Stripe key (Safe for frontend exposure)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key


#########################################
# Cloudinary Configuration
#########################################

# Cloud name from Cloudinary dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Upload preset (unsigned preset for client-side upload)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name


#########################################
# Feature Flags
#########################################

# Enable or disable payment features (true/false)
NEXT_PUBLIC_PAYMENT_ENABLED=true

# Enable or disable maps or location features
NEXT_PUBLIC_MAPS_ENABLED=true


#########################################
# Application
#########################################

# Frontend site URL (Example)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://travel-buddy-lk56.onrender.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Login user and get authentication token |
| `POST` | `/api/auth/logout` | Logout current user session |
| `GET` | `/api/auth/me` | Get current authenticated user details |
| `POST` | `/api/auth/refresh` | Refresh authentication token |
| `POST` | `/api/auth/forgot-password` | Request password reset email |
| `POST` | `/api/auth/reset-password` | Reset user password with token |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Get all users (admin only) |
| `GET` | `/api/users/:id` | Get specific user profile by ID |
| `GET` | `/api/users/profile` | Get current user's profile |
| `PUT` | `/api/users/profile` | Update current user's profile |
| `DELETE` | `/api/users/:id` | Delete user account (admin only) |
| `PATCH` | `/api/users/:id/status` | Update user status (admin only) |
| `GET` | `/api/users/:id/travel-plans` | Get user's travel plans |
| `GET` | `/api/users/:id/reviews` | Get reviews for a user |

### Travel Plan Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/travel-plans` | Get all travel plans with filters |
| `POST` | `/api/travel-plans` | Create a new travel plan |
| `GET` | `/api/travel-plans/:id` | Get specific travel plan details |
| `PUT` | `/api/travel-plans/:id` | Update travel plan (owner only) |
| `DELETE` | `/api/travel-plans/:id` | Delete travel plan (owner only) |
| `GET` | `/api/travel-plans/:id/matches` | Get matches for a travel plan |
| `POST` | `/api/travel-plans/:id/photos` | Upload photos to travel plan |
| `DELETE` | `/api/travel-plans/:id/photos/:photoId` | Delete travel plan photo |

### Match Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/matches` | Get all matches for current user |
| `POST` | `/api/matches` | Send match request to another user |
| `GET` | `/api/matches/:id` | Get specific match details |
| `PUT` | `/api/matches/:id` | Update match status (accept/reject) |
| `DELETE` | `/api/matches/:id` | Cancel/delete a match |
| `GET` | `/api/matches/pending` | Get pending match requests |
| `GET` | `/api/matches/accepted` | Get accepted matches |

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages` | Get all conversations for current user |
| `GET` | `/api/messages/:userId` | Get messages with specific user |
| `POST` | `/api/messages` | Send a new message |
| `PUT` | `/api/messages/:id` | Edit a message |
| `DELETE` | `/api/messages/:id` | Delete a message |
| `PATCH` | `/api/messages/read` | Mark messages as read |
| `GET` | `/api/messages/unread` | Get unread message count |

### Review Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get all reviews (filterable by user) |
| `POST` | `/api/reviews` | Create a new review for a user |
| `GET` | `/api/reviews/:id` | Get specific review details |
| `PUT` | `/api/reviews/:id` | Update review (author only) |
| `DELETE` | `/api/reviews/:id` | Delete review (author/admin only) |
| `GET` | `/api/reviews/user/:userId` | Get reviews for specific user |
| `GET` | `/api/reviews/given` | Get reviews written by current user |
| `GET` | `/api/reviews/received` | Get reviews received by current user |

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payments/create-checkout` | Create Stripe checkout session |
| `GET` | `/api/payments/session/:id` | Get checkout session details |
| `POST` | `/api/payments/webhook` | Handle Stripe webhook events |
| `GET` | `/api/payments/subscription` | Get current subscription status |
| `POST` | `/api/payments/cancel` | Cancel active subscription |
| `GET` | `/api/payments/history` | Get payment history |

### Upload Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload/image` | Upload single image to cloud storage |
| `POST` | `/api/upload/images` | Upload multiple images |
| `DELETE` | `/api/upload/image` | Delete image from cloud storage |

### OTP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/otp/send` | Send OTP to user's email |
| `POST` | `/api/otp/verify` | Verify OTP code |
| `POST` | `/api/otp/resend` | Resend OTP code |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | Get admin dashboard statistics |
| `GET` | `/api/admin/users` | Get all users with pagination |
| `PATCH` | `/api/admin/users/:id/role` | Update user role |
| `DELETE` | `/api/admin/users/:id` | Permanently delete user |
| `GET` | `/api/admin/travel-plans` | Get all travel plans (admin view) |
| `DELETE` | `/api/admin/travel-plans/:id` | Delete any travel plan |
| `GET` | `/api/admin/reviews` | Get all reviews (admin view) |
| `DELETE` | `/api/admin/reviews/:id` | Delete any review |
| `GET` | `/api/admin/reports` | Get reported content |
| `PATCH` | `/api/admin/reports/:id` | Handle report (approve/reject) |

---

## 🛠️ Development Guide

### Available Scripts

#### Frontend

```sh
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

#### Backend

```sh
# Development
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server

# Database
npm run migrate      # Run database migrations
npm run migrate:undo # Rollback last migration
npm run seed         # Seed database with sample data

# Testing
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests

# Linting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Coding Standards

#### TypeScript
- Use strict TypeScript configuration
- Define explicit types for all function parameters and return values
- Avoid using `any` type
- Use interfaces for object shapes
- Use enums for constants

```ts
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// Bad
const getUser = async (id) => {
  // implementation
};
```

#### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `validateEmail.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

#### Component Structure

```ts
import React, { useState, useEffect } from 'react';
import { SomeType } from '@/types';

interface Props {
  title: string;
  onSubmit: (data: SomeType) => void;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
  // State
  const [data, setData] = useState<SomeType | null>(null);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handleSubmit = () => {
    // Handler logic
  };

  // Render
  return (
    <div>
      <h1>{title}</h1>
      {/* Component JSX */}
    </div>
  );
};
```

### Git Workflow

#### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `bugfix/bug-description`
- Hotfix: `hotfix/critical-fix`
- Release: `release/version-number`

#### Commit Messages
Follow conventional commits:
```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify trip creation logic
test: add unit tests for auth service
chore: update dependencies
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**

```sh
   npm install -g vercel
```

2. **Login to Vercel**

```sh
   vercel login
```

3. **Deploy**

```sh
   cd frontend
   vercel
```

4. **Set environment variables** in Vercel dashboard

5. **Configure custom domain** (optional)

### Backend Deployment (Railway/Render)

#### Using Railway

1. **Install Railway CLI**

```sh
   npm install -g @railway/cli
```

2. **Login**

```sh
   railway login
```

3. **Initialize project**

```sh
   cd backend
   railway init
```

4. **Add environment variables**

```sh
   railway variables set KEY=value
```

5. **Deploy**

```sh
   railway up
```

#### Using Docker

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=travelbuddy
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=travelbuddy
    volumes:
      - postgres_data:/var/lib/postgresql/data

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}

volumes:
  postgres_data:
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**

```sh
   git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Write clean, readable code
   - Follow coding standards
   - Add tests for new features
   - Update documentation

4. **Commit your changes**

```sh
   git commit -m 'feat: add amazing feature'
```

5. **Push to your fork**

```sh
   git push origin feature/amazing-feature
```

6. **Open a Pull Request**

### Pull Request Guidelines

- Provide clear description of changes
- Reference related issues
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers

### Code Review Process

1. Automated checks run (tests, linting)
2. Review by at least one maintainer
3. Address feedback
4. Approval and merge

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

```sh
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

#### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure database is running and credentials are correct in `.env`

#### Module Not Found
```
Error: Cannot find module
```
**Solution**:

```sh
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```sh
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

#### CORS Issues
**Solution**: Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL

### Getting Help

- 📧 Email: 000romjanali@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Romjan-Ali/travel-buddy/issues)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Romjan Ali** - [@Romjan-Ali](https://github.com/Romjan-Ali)

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by travel communities worldwide
- Built with amazing open-source tools

---

**Happy Traveling! 🌏✈️**