// frontend/types/index.ts

// ==================== ENUMS ====================
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum TravelType {
  SOLO = 'SOLO',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  COUPLE = 'COUPLE',
  BUSINESS = 'BUSINESS',
}

export enum MatchStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

// ==================== BASE TYPES ====================
export interface BaseEntity {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
}

// ==================== USER & PROFILE ====================
export interface Profile extends BaseEntity {
  id: string
  userId: string
  fullName: string
  bio?: string | null
  profileImage?: string | null
  dateOfBirth?: Date | string | null
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation?: string | null
  phoneNumber?: string | null
  socialLinks: string[]

  // Relations
  user?: User
}

export interface User extends BaseEntity {
  id: string
  email: string
  password: string
  role: Role
  isVerified: boolean
  isActive: boolean

  // Optional relations (include based on your needs)
  profile?: Profile | null
  travelPlans?: TravelPlan[]
  reviewsGiven?: Review[]
  reviewsReceived?: Review[]
  subscriptions?: Subscription[]
  matchesInitiated?: Match[]
  matchesReceived?: Match[]
  sentMessages?: Message[]
  receivedMessages?: Message[]
  tripPhotos?: TripPhoto[]
}

export interface UserWithProfile extends User {
  profile: Profile
}

// ==================== TRAVEL PLAN ====================
export interface TravelPlan extends BaseEntity {
  id: string
  destination: string
  startDate: Date | string
  endDate: Date | string
  budget: string
  travelType: TravelType
  description?: string | null
  isPublic: boolean

  // Foreign keys
  userId: string

  // Relations
  user?: User
  matches?: Match[]
  reviews?: Review[]
  tripPhotos?: TripPhoto[]
}

export interface TravelPlanWithRelations extends TravelPlan {
  user?: User
  tripPhotos?: TripPhoto[]
  matches?: Match[]
}

// ==================== TRIP PHOTO ====================
export interface TripPhoto extends BaseEntity {
  id: string
  url: string
  caption?: string | null
  orderIndex: number
  isPrimary: boolean

  // Foreign keys
  travelPlanId: string
  uploadedById?: string | null

  // Relations
  travelPlan?: TravelPlan
  uploadedBy?: User | null
}

// ==================== REVIEW ====================
export interface Review extends BaseEntity {
  id: string
  rating: number
  comment?: string | null

  // Foreign keys
  authorId: string
  subjectId: string
  travelPlanId?: string | null

  // Relations
  author: User
  subject: User
  travelPlan?: TravelPlan | null
}

// ==================== MATCH ====================
export interface Match extends BaseEntity {
  id: string
  status: MatchStatus

  // Foreign keys
  initiatorId: string
  receiverId: string
  travelPlanId?: string | null

  // Relations
  initiator: User
  receiver: User
  travelPlan?: TravelPlan | null
  messages?: Message[]
}

export interface MatchWithRelations extends Match {
  initiator: UserWithProfile
  receiver: UserWithProfile
  travelPlan?: TravelPlan
  messages?: Message[]
}

// ==================== SUBSCRIPTION ====================
export interface Subscription extends BaseEntity {
  id: string
  stripeSubId?: string | null
  status: string
  currentPeriodStart: Date | string
  currentPeriodEnd: Date | string

  // Foreign key
  userId: string

  // Relation
  user?: User
}

// ==================== MESSAGE ====================
export interface Message extends BaseEntity {
  id: string
  content: string
  senderId: string
  receiverId: string
  matchId?: string | null
  read: boolean
  deleted: boolean
  deletedAt?: Date | string | null

  // Relations
  sender: User
  receiver: User
  match?: Match | null
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardTotals {
  users: number
  activeUsers: number
  travelPlans: number
  activeTravelPlans: number
  reviews: number
  matches: number
  subscriptions: number
}

export interface RecentSignup {
  id: string
  email: string
  profile: {
    fullName: string
  }
  createdAt: string
}

export interface DashboardStats {
  totals: DashboardTotals
  recentSignups: RecentSignup[]
}

// ==================== FORM & INPUT TYPES ====================
export interface CreateTravelPlanInput {
  destination: string
  startDate: Date | string
  endDate: Date | string
  budget: string
  travelType: TravelType
  description?: string
  isPublic?: boolean
}

export interface UpdateProfileInput {
  fullName?: string
  bio?: string
  profileImage?: string
  dateOfBirth?: Date | string
  travelInterests?: string[]
  visitedCountries?: string[]
  currentLocation?: string
  phoneNumber?: string
  socialLinks?: string[]
}

export interface CreateMatchInput {
  receiverId: string
  travelPlanId?: string
  message?: string
}

export interface SendMessageInput {
  receiverId: string
  matchId?: string
  content: string
}

// ==================== FILTER TYPES ====================
export interface TravelPlanFilters {
  destination?: string
  startDate?: Date
  endDate?: Date
  travelType?: TravelType
  budgetRange?: {
    min?: number
    max?: number
  }
  isPublic?: boolean
  userId?: string
}

export interface UserFilters {
  search?: string
  role?: Role
  isVerified?: boolean
  isActive?: boolean
  hasProfile?: boolean
}

// ==================== AUTH TYPES ====================
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullName: string
  confirmPassword: string
}

export interface AuthResponse {
  user: UserWithProfile
  token: string
  refreshToken?: string
}

// ==================== COMPONENT PROP TYPES ====================
export interface TravelPlanCardProps {
  plan: TravelPlanWithRelations
  showUserInfo?: boolean
  onLike?: (planId: string) => void
  onMessage?: (userId: string) => void
  onViewDetails?: (planId: string) => void
}

export interface MatchCardProps {
  match: MatchWithRelations
  currentUserId: string
  onAccept?: (matchId: string) => void
  onReject?: (matchId: string) => void
  onMessage?: (matchId: string) => void
}

export interface MessageThreadProps {
  matchId: string
  currentUser: UserWithProfile
  otherUser: UserWithProfile
  messages: Message[]
  onSendMessage: (content: string) => Promise<void>
}

// ==================== UTILITY TYPES ====================
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Nullable<T> = T | null
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

// Type guards
export function isUserWithProfile(
  user: User | unknown
): user is UserWithProfile {
  return (
    typeof user === 'object' &&
    user !== null &&
    'profile' in user &&
    (user as User).profile !== undefined
  )
}

export function isTravelPlanWithRelations(
  plan: unknown
): plan is TravelPlanWithRelations {
  return typeof plan === 'object' && plan !== null && 'user' in plan
}

// ==================== Response Types ====================

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface TravelPlansData {
  plans: TravelPlan[]
  pagination: Pagination
}

export type TravelPlansResponse = ApiResponse<TravelPlansData>

export interface MatchesData {
  matches: Match[]
  pagination: Pagination
}

export type MatchesResponse = ApiResponse<MatchesData>
