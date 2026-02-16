import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/auth'

export const Route = createFileRoute('/_admin/')({
  beforeLoad: () => {
    // Parent _admin layout handles redirect to login if not authenticated on client
    // Here we just handle the redirect from / to /dashboard
    if (typeof window !== 'undefined' && isAuthenticated()) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})
