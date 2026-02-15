export type TicketStatus = 'pending' | 'processing' | 'resolved' | 'failed'
export type TicketUrgency = 'High' | 'Medium' | 'Low'
export type TicketCategory = 'Billing' | 'Technical' | 'Feature Request'

export interface TicketTriage {
  category: TicketCategory
  sentiment_score: number
  urgency: TicketUrgency
  ai_draft: string
  processed_at?: string
  retry_count: number
}

export interface Ticket {
  id: number
  uuid: string
  user_id: number
  title: string
  description: string
  urgency?: TicketUrgency
  sentiment_score?: number
  category_id?: number
  status: TicketStatus
  triage?: TicketTriage
  resolved_by?: number
  resolved_at?: string
  created_at: string
  updated_at: string
  created_by?: {
    id: number
    name: string
    email: string
  }
  category?: {
    id: number
    title: string
  }
}

export interface TicketCategoryOption {
  id: number
  title: string
  description: string
}
