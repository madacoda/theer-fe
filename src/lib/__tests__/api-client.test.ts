import { describe, expect, it } from 'vitest'
import apiClient from '../api-client'

describe('apiClient', () => {
  it('should have the correct baseURL from environment or fallback', () => {
    // Current fallback in code is '/'
    expect(apiClient.defaults.baseURL).toBeDefined()
    // We want it to be '/' or a relative path so proxying works
    expect(['/', '/api']).toContain(apiClient.defaults.baseURL)
  })

  it('should generate the correct full URL for a request', () => {
    const relativePath = '/api/user/me'
    const requestConfig = apiClient.getUri({ url: relativePath })
    
    // Result MUST be /api/user/me
    expect(requestConfig).toBe('/api/user/me')
    
    // This is the FAIL CASE we want to avoid:
    // If the environment set VITE_API_URL to '/api', 
    // and the code uses '/api/user/me', we get '/api/api/user/me'
    // We must ensure VITE_API_URL is just '/'
    expect(apiClient.defaults.baseURL).not.toBe('/api')
  })
})
