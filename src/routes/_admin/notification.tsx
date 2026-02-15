import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { Bell, CheckCircle2, Clock, MoreHorizontal, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export const Route = createFileRoute('/_admin/notification')({
  component: NotificationsPage,
})

// Extended mock data to show functionality
const ALL_NOTIFICATIONS = Array.from({ length: 24 }).map((_, i) => ({
  id: `${i + 1}`,
  title: [
    'New order received',
    'System Update',
    'New user registered',
    'Password changed',
    'Backup completed',
    'Security Alert',
    'Inventory Low',
    'Message from Admin',
  ][i % 8],
  description: [
    'You have a new order from John Doe.',
    'The system will be down for maintenance at 2 AM.',
    'Jane Smith has joined the platform.',
    'Your password was successfully changed.',
    'Daily database backup has been completed.',
    'Unusual login detected from new device.',
    'Stock for product "Widget A" is below threshold.',
    'Please review the quarterly report.',
  ][i % 8],
  time: `${i + 1} ${i === 0 ? 'hour' : 'hours'} ago`,
  unread: i < 3,
  type: i % 4 === 0 ? 'order' : i % 4 === 1 ? 'system' : i % 4 === 2 ? 'user' : 'security',
}))

function NotificationsPage() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(ALL_NOTIFICATIONS.length / itemsPerPage)

  const currentNotifications = ALL_NOTIFICATIONS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="admin-theme flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view all your system notifications.
          </p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 text-primary transition-all">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 hover:border-destructive/30 border-destructive/10 transition-all">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-filament overflow-hidden">
        <CardHeader className="pb-3 border-b bg-background">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">All Notifications</CardTitle>
            <Badge className="bg-primary text-primary-foreground font-bold">
              {ALL_NOTIFICATIONS.filter(n => n.unread).length} Unread
            </Badge>
          </div>
          <CardDescription className="text-primary/60">
            Showing {currentNotifications.length} of {ALL_NOTIFICATIONS.length} items
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 bg-background">
          <div className="divide-y divide-primary/10">
            {currentNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`group flex items-start gap-4 p-5 transition-all hover:bg-primary/[0.03] ${
                  notification.unread ? 'bg-primary/[0.05] border-l-4 border-l-primary' : 'border-l-4 border-l-transparent bg-background'
                }`}
              >
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                  notification.unread 
                    ? 'bg-primary/20 text-primary shadow-sm' 
                    : 'bg-primary/5 text-primary/40'
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className={`text-sm font-semibold leading-none truncate ${
                        notification.unread ? 'text-primary' : 'text-foreground/80'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {notification.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:flex items-center text-[11px] font-medium text-primary/60 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                        <Clock className="mr-1 h-3 w-3" />
                        {notification.time}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as read
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 sm:hidden">
                    <span className="flex items-center text-[10px] font-medium text-muted-foreground/70">
                      <Clock className="mr-1 h-3 w-3" />
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={`transition-all ${currentPage === 1 ? 'pointer-events-none opacity-40' : 'hover:bg-primary/10 hover:text-primary cursor-pointer'}`}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(i + 1)
                  }}
                  className={`transition-all cursor-pointer ${
                    currentPage === i + 1 
                      ? 'bg-primary text-primary-foreground font-bold hover:bg-primary/90' 
                      : 'hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={`transition-all ${currentPage === totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-primary/10 hover:text-primary cursor-pointer'}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
