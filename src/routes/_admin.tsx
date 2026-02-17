import * as React from 'react'
import { createFileRoute, Link, Outlet, redirect, useNavigate } from '@tanstack/react-router'

import { AdminSidebar } from '@/components/admin/layout/sidebar'
import { AdminHeader } from '@/components/admin/layout/header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { authService } from '@/services/auth.service'
import { isAuthenticated, removeToken } from '@/lib/auth'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ location }: { location: any }) => {
    // Immediate client-side check for token
    if (typeof window !== 'undefined' && !isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AdminLayout,
  notFoundComponent: AdminNotFound,
})

function AdminNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <h2 className="text-4xl font-bold tracking-tight text-primary/20 mb-2">
        404
      </h2>
      <h3 className="text-xl font-semibold mb-4">Admin Page Not Found</h3>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The administrative page you're trying to reach doesn't exist or you
        don't have permission to view it.
      </p>
      <Link
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        to="/dashboard"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}


function AdminLayout() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined' && isAuthenticated()) {
      authService.getProfile()
        .then((user) => {
          setUser(user)
          
          // RBAC and Redirects after profile fetch
          const isAdminRole = user.roles?.some((role: any) => 
            typeof role === 'string' && role.toLowerCase() === 'admin'
          )
          const pathname = window.location.pathname
          
          // RBAC protection (Previously handled root redirect here, now handled in index route)
          const adminOnlyPaths = ['/dashboard', '/user', '/course', '/blog']
          if (!isAdminRole && adminOnlyPaths.some(p => pathname.startsWith(p))) {
            navigate({ to: '/ticket' })
          }
        })
        .catch((error) => {
          console.error('AdminLayout hydration auth failed:', error)
          const isUnauthenticated = 
            error?.response?.status === 401 || 
            (error?.response?.status === 404 && error?.response?.data?.message === 'User not found')

          if (isUnauthenticated) {
            removeToken()
            navigate({ to: '/login' })
          }
        })
    }
  }, [setUser, navigate])

  // Hydration safety: Don't render role-based content on the server
  // This prevents the 'redirect to login on hard reload' bug
  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider className="admin-theme">
      {isAdmin && <AdminSidebar />}
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const adminRoute = Route
