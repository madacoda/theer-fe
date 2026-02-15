export const AUTH_TOKEN_KEY = 'auth_token'

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export const isAuthenticated = () => !!getToken()
