import { Link, useLocation } from '@tanstack/react-router'
import {
  Command,
  LayoutDashboard,
  Ticket as TicketIcon,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

import { useAuthStore } from '@/store/auth.store'


export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [mounted, setMounted] = React.useState(false)
  const user = useAuthStore((state) => state.user)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const data = {
    user: {
      name: user?.name || 'Loading...',
      email: user?.email || '...',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`,
    },
    navMain: [
      {
        title: t('sidebar.dashboard'),
        url: '/dashboard',
        icon: LayoutDashboard,
        isActive: pathname === '/dashboard' || pathname === '/',
      },
      {
        title: 'Ticket',
        url: '#',
        icon: TicketIcon,
        isActive: pathname.includes('/ticket'),
        items: [
          {
            title: 'Ticket',
            url: '/ticket',
          },
          {
            title: 'Category',
            url: '/ticket/category',
          },
        ],
      },
      {
        title: t('sidebar.users'),
        url: '/user/',
        icon: Users,
        isActive: pathname.includes('/user'),
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-bold text-base tracking-tight text-primary">Theer</span>
                  <span className="text-[10px] tracking-wider text-muted-foreground font-medium">Ticket Empowered Response</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {mounted && (
          <NavMain items={data.navMain} />
        )}
      </SidebarContent>
      <SidebarFooter>{mounted && <NavUser user={data.user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
