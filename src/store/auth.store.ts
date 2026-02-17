import { create } from 'zustand'
import type { User } from '@/services/auth.service'

interface AuthState {
  user: User | null
  isAdmin: boolean
  setUser: (user: User | null) => void
  setAdmin: (isAdmin: boolean) => void
  logout: () => void
}

/**
 * Auth Store
 * We explicitly do NOT use 'persist' middleware here because the user data
 * is re-fetched and synced in the route's beforeLoad hook.
 * Using persist can cause hydration race conditions where fresh data from 
 * the loader is overwritten by stale data from localStorage on mount.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => {
    // Definitive role check
    const roles = user?.roles || []
    const isAdmin = roles.some(role => 
      typeof role === 'string' && role.toLowerCase() === 'admin'
    )
    
    console.log('AuthStore: Setting User', { email: user?.email, roles, isAdmin })
    set({ user, isAdmin })
  },
  setAdmin: (isAdmin) => set({ isAdmin }),
  logout: () => set({ user: null, isAdmin: false }),
}))
