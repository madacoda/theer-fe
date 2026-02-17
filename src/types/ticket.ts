export type TicketStatus = 'pending' | 'processing' | 'processed' | 'resolved' | 'failed'
export type TicketUrgency = 'High' | 'Medium' | 'Low'
export type TicketCategory = 'Billing' | 'Technical Support' | 'Feature Request'

export interface Ticket {
  id: number
  uuid: string
  title: string
  content: string | null
  description?: string // fallbacks
  status: TicketStatus
  sentiment_score: number | null
  urgency: TicketUrgency | null
  ai_draft: string | null
  category: {
    id: number
    uuid: string
    title: string
    description: string
  } | null
  created_by: {
    uuid: string
    name: string
    email: string
    roles: string[]
  } | null
  resolved_by: {
    uuid: string
    name: string
  } | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface TicketCategoryOption {
  id: number
  title: string
  description: string
}
