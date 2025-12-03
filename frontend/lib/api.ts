// frontend/lib/api.ts
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // For cookie-based auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      const data = await response.json().catch(() => null)
      
      if (!response.ok) {
        throw new ApiError(
          data?.message || 'Something went wrong',
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        // Show error toast
        toast.error(error.message)
        throw error
      }
      
      // Network error
      toast.error('Network error. Please check your connection.')
      throw new ApiError('Network error')
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()

// Auth endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.patch('/users/profile', data),
  getPublicProfile: (id: string) => api.get(`/users/${id}`),
  searchUsers: (query: string, page = 1, limit = 10) => 
    api.get(`/users?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`),
}

// Travel Plan endpoints
export const travelPlanAPI = {
  create: (data: any) => api.post('/travel-plans', data),
  getMyPlans: (page = 1, limit = 10) => 
    api.get(`/travel-plans/my-plans?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get(`/travel-plans/${id}`),
  update: (id: string, data: any) => api.patch(`/travel-plans/${id}`, data),
  delete: (id: string) => api.delete(`/travel-plans/${id}`),
  search: (filters: any, page = 1, limit = 10) => 
    api.get(`/travel-plans/search?${new URLSearchParams(filters).toString()}&page=${page}&limit=${limit}`),
}

// Review endpoints
export const reviewAPI = {
  create: (data: any) => api.post('/reviews', data),
  getMyReviews: (type = 'received', page = 1, limit = 10) => 
    api.get(`/reviews/my-reviews?type=${type}&page=${page}&limit=${limit}`),
  update: (id: string, data: any) => api.patch(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  getTravelPlanReviews: (travelPlanId: string) => 
    api.get(`/reviews/travel-plan/${travelPlanId}`),
}

// Match endpoints
export const matchAPI = {
  create: (data: any) => api.post('/matches', data),
  getMyMatches: (type = 'received', status?: string, page = 1, limit = 10) => 
    api.get(`/matches?type=${type}&status=${status}&page=${page}&limit=${limit}`),
  updateStatus: (id: string, status: string) => 
    api.patch(`/matches/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/matches/${id}`),
  getSuggestions: (travelPlanId?: string, limit = 10) => 
    api.get(`/matches/suggestions?travelPlanId=${travelPlanId}&limit=${limit}`),
}

// Payment endpoints
export const paymentAPI = {
  createSubscription: (priceId: string) => 
    api.post('/payments/create-subscription', { priceId }),
  createOneTimePayment: (amount: number, description: string) => 
    api.post('/payments/create-payment', { amount, description }),
  getSubscription: () => api.get('/payments/subscription'),
  cancelSubscription: () => api.post('/payments/cancel-subscription'),
}

// Upload endpoints
export const uploadAPI = {
  uploadProfileImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    
    return fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(res => res.json())
  },
  
  uploadTripPhotos: (files: File[], travelPlanId?: string) => {
    const formData = new FormData()
    files.forEach(file => formData.append('photos', file))
    if (travelPlanId) formData.append('travelPlanId', travelPlanId)
    
    return fetch(`${API_BASE_URL}/upload/trip-photos`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then(res => res.json())
  },
  
  deleteImage: (url: string) => api.delete('/upload', { body: JSON.stringify({ url }) }),
}

// Admin endpoints
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getAllUsers: (page = 1, limit = 20, filters?: any) => 
    api.get(`/admin/users?page=${page}&limit=${limit}&${new URLSearchParams(filters).toString()}`),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, data: any) => api.patch(`/admin/users/${id}`, data),
  getAllTravelPlans: (page = 1, limit = 20, filters?: any) => 
    api.get(`/admin/travel-plans?page=${page}&limit=${limit}&${new URLSearchParams(filters).toString()}`),
  deleteTravelPlan: (id: string) => api.delete(`/admin/travel-plans/${id}`),
}