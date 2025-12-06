// frontend/types/admin-dashboard.ts
import { ApiResponse } from ".";

// User profile
export interface UserProfile {
  fullName: string;
}

// Recent signup user
export interface RecentSignup {
  id: string;
  email: string;
  profile: UserProfile;
  createdAt: string; 
}

// Dashboard totals
export interface DashboardTotals {
  users: number;
  activeUsers: number;
  travelPlans: number;
  activeTravelPlans: number;
  reviews: number;
  matches: number;
  subscriptions: number;
}

// Dashboard stats data
export interface DashboardStats {
  totals: DashboardTotals;
  recentSignups: RecentSignup[];
}

// Combined API response type
export type DashboardStatsResponse = ApiResponse<DashboardStats>;