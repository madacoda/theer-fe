import { format } from 'date-fns'
import { MoreHorizontal, MessageSquare, Eye, CheckCircle2 } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Ticket } from '@/types/ticket'

interface TicketTableProps {
  tickets: Ticket[]
  onView: (ticket: Ticket) => void
  onResolve?: (ticket: Ticket) => void
  isAdmin?: boolean
}

export function TicketTable({ tickets, onView, onResolve, isAdmin }: TicketTableProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse">Processing</Badge>
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null
    switch (urgency) {
      case 'High':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm">High</Badge>
      case 'Medium':
        return <Badge className="bg-orange-400 hover:bg-orange-500 text-white border-none shadow-sm">Medium</Badge>
      case 'Low':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-none shadow-sm">Low</Badge>
      default:
        return <Badge variant="outline">{urgency}</Badge>
    }
  }

  if (!mounted) return null

  return (
    <div className="rounded-md border bg-card shadow-filament transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Subject</TableHead>
            {isAdmin && <TableHead>User</TableHead>}
            <TableHead>Category</TableHead>
            {isAdmin && <TableHead>Urgency</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                 No tickets found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium text-xs text-muted-foreground">#{ticket.id}</TableCell>
                <TableCell className="max-w-[200px] truncate font-semibold">{ticket.title}</TableCell>
                {isAdmin && <TableCell>{ticket.created_by?.name || 'Unknown'}</TableCell>}
                <TableCell>
                  {ticket.category ? (
                    <Badge variant="outline" className="font-medium">{ticket.category.title}</Badge>
                  ) : ticket.triage?.category ? (
                    <Badge variant="outline" className="font-medium">{ticket.triage.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Uncategorized</span>
                  )}
                </TableCell>
                {isAdmin && <TableCell>{getUrgencyBadge(ticket.urgency || ticket.triage?.urgency)}</TableCell>}
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(ticket.created_at), 'MMM dd, HH:mm')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(ticket)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Detail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isAdmin && ticket.status !== 'resolved' && (
                        <DropdownMenuItem 
                          onClick={() => onResolve?.(ticket)}
                          className="text-green-600 focus:text-green-600 focus:bg-green-50"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Resolve
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
