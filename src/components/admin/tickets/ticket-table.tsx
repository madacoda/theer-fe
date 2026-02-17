import { format } from 'date-fns'
import { MoreHorizontal, Eye, CheckCircle2 } from 'lucide-react'
import * as React from 'react'

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
      case 'processed':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Processed</Badge>
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency?: string | null) => {
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
            {isAdmin && <TableHead className="text-center">AI Failed</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 9 : 7} className="h-24 text-center">
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
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Uncategorized</span>
                  )}
                </TableCell>
                {isAdmin && <TableCell>{getUrgencyBadge(ticket.urgency)}</TableCell>}
                {isAdmin && (
                  <TableCell className="text-center">
                    {ticket.is_ai_triage_failed ? (
                      <Badge variant="destructive" className="font-black uppercase text-[9px] tracking-tighter">
                        Failed
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground opacity-20">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(ticket.created_at), 'MMM dd, HH:mm')}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => onView(ticket)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
