import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { TicketDetailPage } from './ticket-detail'
import type { Ticket } from '@/types/ticket'

interface TicketDetailModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}

export function TicketDetailModal({ ticket, isOpen, onClose, isAdmin }: TicketDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-full max-h-[95vh] overflow-y-auto p-0 admin-theme border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Ticket Details</DialogTitle>
        </VisuallyHidden>
        {ticket && (
          <TicketDetailPage ticketId={ticket.uuid} isModal={true} onClose={onClose} isAdmin={isAdmin} />
        )}
      </DialogContent>
    </Dialog>
  )
}
