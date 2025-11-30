import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  travelInterests: z.array(z.string()).optional(),
  visitedCountries: z.array(z.string()).optional(),
  currentLocation: z.string().optional(),
  phoneNumber: z.string().optional(),
  socialLinks: z.array(z.string()).optional(),
});

export const travelPlanSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  travelType: z.enum(['SOLO', 'FAMILY', 'FRIENDS', 'COUPLE', 'BUSINESS']),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  subjectId: z.string().cuid(),
  travelPlanId: z.string().cuid().optional(),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type TravelPlanInput = z.infer<typeof travelPlanSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

export interface AuthRequest extends Express.Request {
  user: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}