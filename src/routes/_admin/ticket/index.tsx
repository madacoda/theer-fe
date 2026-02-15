import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Plus, Search, X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { TicketTable } from '@/components/admin/tickets/ticket-table'
import { TicketForm } from '@/components/admin/tickets/ticket-form'
import { TicketDetailModal } from '@/components/admin/tickets/ticket-detail-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ticketService } from '@/services/admin/ticket.service'
import { authService } from '@/services/auth.service'
import type { Ticket } from '@/types/ticket'

export const Route = createFileRoute('/_admin/ticket/')({
  component: TicketsPage,
})

function TicketsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  // Check role and fetch data
  const fetchData = React.useCallback(async (page: number, limit: number) => {
    setIsLoading(true)
    try {
      const profile = await authService.getProfile()
      const adminRole = profile.roles?.includes('admin') || profile.email.includes('admin')
      setIsAdmin(adminRole)

      const result = adminRole 
        ? await ticketService.getAdminTickets({ page, limit, search: search })
        : await ticketService.getUserTickets({ page, limit, search: search })
      
      setTickets(result.tickets)
      setPagination(result.meta)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      toast.error('Failed to load tickets. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }, [search])

  React.useEffect(() => {
    fetchData(pagination.page, pagination.limit)
  }, [fetchData, pagination.page, pagination.limit])

  const handleCreateTicket = async (values: any) => {
    try {
      setIsLoading(true)
      await ticketService.createTicket({
        ...values,
        category_id: parseInt(values.category_id)
      })
      toast.success('Ticket created successfully! Our AI is triaging it now.')
      setIsFormOpen(false)
      fetchData(1, pagination.limit)
    } catch (error) {
      console.error('Failed to create ticket:', error)
      toast.error('Failed to create ticket. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const handleViewDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailOpen(true)
  }

  const getPaginationRange = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit)
    if (totalPages <= 1) return []
    const current = pagination.page
    const siblings = 1
    const range: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - siblings && i <= current + siblings)
      ) {
        range.push(i)
      } else if (i === current - siblings - 1 || i === current + siblings + 1) {
        range.push('...')
      }
    }
    return range.filter(
      (item, index) => item !== '...' || range[index - 1] !== '...',
    )
  }

  const clearFilters = () => {
    setSearch('')
    fetchData(1, pagination.limit)
  }

  const activeFiltersCount = 0 // Tickets currently only has search in the UI I see

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Support Tickets
          </h2>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Manage and resolve all incoming user complaints.' 
              : 'View and track your support requests.'}
          </p>
        </div>
        {!isAdmin && (
          <Button className="shadow-sm" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={`${t('common.search')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData(1, pagination.limit)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-9 gap-2" variant="outline">
            <Filter className="h-4 w-4" />
            {t('common.filters')}
          </Button>

          <AnimatePresence>
            {search && (
              <motion.div
                key="clear-filters"
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="h-9 px-3 text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 transition-all"
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-3 w-3" />
                  {t('common.clearAll')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {search && (
          <motion.div
            key="results-count"
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between py-1 border-b overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <motion.p
              key={pagination.total}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm text-muted-foreground font-medium"
              initial={{ scale: 0.98, opacity: 0 }}
            >
              Showing{' '}
              <span className="text-foreground">
                {Math.min(
                  (pagination.page - 1) * pagination.limit + 1,
                  pagination.total,
                )}
                -
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="text-foreground">{pagination.total}</span>{' '}
              tickets
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse font-medium">Fetching tickets...</p>
          </div>
        ) : (
          <>
            <TicketTable 
              tickets={tickets} 
              onView={handleViewDetail} 
              isAdmin={isAdmin} 
            />
            
            {pagination.total > pagination.limit && (
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Page {pagination.page} of{' '}
                  {Math.ceil(pagination.total / pagination.limit)}
                </p>
                <Pagination className="mx-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                        onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))} 
                      />
                    </PaginationItem>
                    {getPaginationRange().map((page, i) => (
                      <PaginationItem key={i}>
                        {page === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            className="cursor-pointer"
                            isActive={pagination.page === page}
                            onClick={() => setPagination(p => ({ ...p, page: Number(page) }))}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        className={pagination.page >= Math.ceil(pagination.total / pagination.limit) ? 'pointer-events-none opacity-50' : 'cursor-pointer'} 
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Submit New Complaint
            </DialogTitle>
            <DialogDescription>
              Our AI Support Engine will prioritize your ticket as soon as you submit.
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            onSubmit={handleCreateTicket}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      <TicketDetailModal 
        ticket={selectedTicket}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  )
}
