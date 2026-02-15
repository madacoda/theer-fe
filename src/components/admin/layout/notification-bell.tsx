import { Bell, Clock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock notifications structure
interface Notification {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New order received',
    description: 'You have a new order from John Doe.',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: '2',
    title: 'System Update',
    description: 'The system will be down for maintenance at 2 AM.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: '3',
    title: 'New user registered',
    description: 'Jane Smith has joined the platform.',
    time: '3 hours ago',
    unread: false,
  },
  {
    id: '4',
    title: 'Password changed',
    description: 'Your password was successfully changed.',
    time: '5 hours ago',
    unread: false,
  },
  {
    id: '5',
    title: 'Backup completed',
    description: 'Daily database backup has been completed.',
    time: '1 day ago',
    unread: false,
  },
]

export function NotificationBell() {
  const [notifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full px-0 py-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="admin-theme w-[340px] p-0 shadow-filament-lg border-border/50 overflow-hidden"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
          <span className="text-sm font-bold tracking-tight">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-[10px] h-5 px-1.5 font-bold">
              {unreadCount} New
            </Badge>
          )}
        </DropdownMenuLabel>
        <div className="max-h-[440px] overflow-y-auto divide-y divide-border/40">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex cursor-pointer flex-col items-start gap-1 p-4 transition-colors focus:bg-primary/5 active:bg-primary/10 ${
                  notification.unread ? 'bg-primary/[0.03]' : ''
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-[13px] font-semibold tracking-tight ${
                      notification.unread ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {notification.title}
                  </span>
                  {notification.unread && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  )}
                </div>
                <p className="line-clamp-2 text-xs leading-normal text-muted-foreground">
                  {notification.description}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-primary/60">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{notification.time}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-background">
              <div className="bg-muted/30 p-3 rounded-full mb-3">
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground/60">No new notifications</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t border-border/50 bg-muted/10">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 h-9"
          >
            <Link to="/notification">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
