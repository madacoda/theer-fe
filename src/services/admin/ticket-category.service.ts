import apiClient from '@/lib/api-client'

export interface TicketCategory {
  id: string
  title: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface RawApiTicketCategory {
  uuid: string
  title: string
  description?: string
  status?: string
  created_at?: string
  deleted_at?: string | null
}

function mapApiToTicketCategory(data: RawApiTicketCategory): TicketCategory {
  return {
    id: data.uuid,
    title: data.title,
    description: data.description,
    status: (data.deleted_at ? 'inactive' : data.status || 'active') as 'active' | 'inactive',
    createdAt: data.created_at || new Date().toISOString(),
  }
}

export const adminTicketCategoryService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    categories: TicketCategory[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/ticket/category', { params })
    const body = response.data

    const rawData = Array.isArray(body.data) ? body.data : []
    const metaData = body.meta

    const meta = {
      total: typeof metaData?.total === 'number' ? metaData.total : rawData.length,
      page: typeof metaData?.current_page === 'number' ? metaData.current_page : params?.page || 1,
      limit: typeof metaData?.per_page === 'number' ? metaData.per_page : params?.limit || 10,
    }

    return {
      categories: rawData.map(mapApiToTicketCategory),
      meta,
    }
  },

  async getOne(uuid: string): Promise<TicketCategory> {
    const response = await apiClient.get(`/api/admin/ticket/category/${uuid}`)
    const data = response.data.data || response.data
    return mapApiToTicketCategory(data)
  },

  async create(category: Partial<TicketCategory>): Promise<TicketCategory> {
    const response = await apiClient.post('/api/admin/ticket/category', category)
    const data = response.data.data || response.data
    return mapApiToTicketCategory(data)
  },

  async update(uuid: string, category: Partial<TicketCategory>): Promise<TicketCategory> {
    const response = await apiClient.put(`/api/admin/ticket/category/${uuid}`, category)
    const data = response.data.data || response.data
    return mapApiToTicketCategory(data)
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/ticket/category/${uuid}`)
  },
}
