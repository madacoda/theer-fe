import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { TicketDetailPage } from './ticket-detail'
import type { Ticket } from '@/types/ticket'

interface TicketDetailModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
}

export function TicketDetailModal({ ticket, isOpen, onClose }: TicketDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 admin-theme">
        <VisuallyHidden>
          <DialogTitle>Ticket Details</DialogTitle>
        </VisuallyHidden>
        {ticket && (
          <TicketDetailPage ticketId={ticket.uuid} isModal={true} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
