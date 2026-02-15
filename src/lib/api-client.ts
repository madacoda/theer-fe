import axios from 'axios'

import { getToken, removeToken } from './auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined'

    if (error.response?.status === 401) {
      removeToken()

      // Only redirect if we're in the browser and NOT already on the login page
      if (isBrowser && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
