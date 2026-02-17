import apiClient from '@/lib/api-client'
import type { Ticket, TicketCategoryOption } from '@/types/ticket'

export const ticketService = {
  // User endpoints
  async getUserTickets(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    tickets: Ticket[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/ticket', { params })
    return {
      tickets: response.data.data,
      meta: {
        total: response.data.meta.total,
        page: response.data.meta.current_page,
        limit: response.data.meta.per_page,
      },
    }
  },

  async createTicket(data: {
    title: string
    content: string
    category_id: number
  }): Promise<Ticket> {
    const response = await apiClient.post('/api/ticket', data)
    return response.data.data
  },

  // Admin endpoints
  async getAdminTickets(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    urgency?: string
  }): Promise<{
    tickets: Ticket[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/ticket', { params })
    return {
      tickets: response.data.data,
      meta: {
        total: response.data.meta.total,
        page: response.data.meta.current_page,
        limit: response.data.meta.per_page,
      },
    }
  },

  async getTicket(uuid: string, isAdmin = false): Promise<Ticket> {
    const endpoint = isAdmin ? `/api/admin/ticket/${uuid}` : `/api/ticket/${uuid}`
    const response = await apiClient.get(endpoint)
    return response.data.data
  },

  async resolveTicket(
    uuid: string,
    data: {
      final_response: string
      status: 'resolved'
    },
  ): Promise<Ticket> {
    const response = await apiClient.put(`/api/admin/ticket/${uuid}/resolve`, data)
    return response.data.data
  },

  async getCategories(): Promise<TicketCategoryOption[]> {
    const response = await apiClient.get('/api/ticket/category')
    return response.data.data.map((category: TicketCategoryOption) => ({
      id: category.id,
      title: category.title,
      description: category.description,
    }))
  },
}
