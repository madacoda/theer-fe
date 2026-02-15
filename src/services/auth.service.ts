import apiClient from '@/lib/api-client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  uuid: string
  name: string
  email: string
  roles: string[]
  created_at: string
}

export interface AuthResponse {
  status: string
  message: string
  data: {
    token: string
    user: User
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', credentials)
    return response.data
  },

  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', credentials)
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/api/user/me')
    // Assuming this also returns the wrapped format
    return response.data.data || response.data
  },
}
