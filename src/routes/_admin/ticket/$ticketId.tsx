import { createFileRoute } from '@tanstack/react-router'
import { TicketDetailPage } from '@/components/admin/tickets/ticket-detail'

export const Route = createFileRoute('/_admin/ticket/$ticketId')({
  component: TicketDetailPage,
})
