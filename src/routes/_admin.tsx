import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'

import { AdminSidebar } from '@/components/admin/layout/sidebar'
import { AdminHeader } from '@/components/admin/layout/header'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { authService } from '@/services/auth.service'
import { isAuthenticated, removeToken } from '@/lib/auth'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ location }: { location: any }) => {
    // Only redirect on the client side for localStorage-based auth
    if (typeof window !== 'undefined') {
      if (!isAuthenticated()) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        })
      }

      try {
        const user = await authService.getProfile()
        const isAdmin = user.roles?.includes('admin') || user.email.includes('admin')

        // 1. Root redirect: If user hits /, send them to their respective home
        if (location.pathname === '/' || location.pathname === '') {
          throw redirect({
            to: isAdmin ? '/dashboard' : '/ticket',
          })
        }

        // 2. Simple RBAC: Protect admin-only routes
        const adminOnlyPaths = ['/dashboard', '/user', '/course', '/blog']
        const currentPath = location.pathname

        if (!isAdmin && adminOnlyPaths.some((path) => currentPath.startsWith(path))) {
          throw redirect({
            to: '/ticket',
          })
        }

        return { user, isAdmin }
      } catch (error) {
        // If it's already a redirect being thrown, re-throw it
        if (error && typeof error === 'object' && 'to' in error) {
          throw error
        }

        console.error('Auth verification failed:', error)
        removeToken()
        throw redirect({
          to: '/login',
        })
      }
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
  return (
    <SidebarProvider className="admin-theme">
      <AdminSidebar />
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
