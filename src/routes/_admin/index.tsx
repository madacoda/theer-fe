import { createFileRoute, redirect } from '@tanstack/react-router'
import { authService } from '@/services/auth.service'
import { isAuthenticated } from '@/lib/auth'

export const Route = createFileRoute('/_admin/')({
  beforeLoad: async () => {
    // 1. Unauthenticated -> Login
    if (!isAuthenticated()) {
      throw redirect({
        to: '/login',
      })
    }

    try {
      // 2. Fetch profile to determine role
      const user = await authService.getProfile()
      const isAdmin = user.roles?.some((role: any) => 
        typeof role === 'string' && role.toLowerCase() === 'admin'
      )
      
      // 3. Redirect based on role
      if (isAdmin) {
        throw redirect({ to: '/dashboard' })
      } else {
        throw redirect({ to: '/ticket' })
      }
    } catch (error) {
      // If it's a redirect thrown by us, rethrow it
      if (error && typeof error === 'object' && ('to' in error || 'href' in error)) {
        throw error
      }
      
      console.error('Root redirect failed:', error)
      throw redirect({ to: '/login' })
    }
  },
})
