import apiClient from '@/lib/api-client'
import type { BlogCategory } from '@/types/blog-category'

interface RawApiBlogCategory {
  id: number
  uuid: string
  name: string
  slug: string
  description?: string
  status?: string
  created_at?: string
  deleted_at?: string | null
}

function mapApiToBlogCategory(data: RawApiBlogCategory): BlogCategory {
  return {
    id: data.uuid,
    name: data.name,
    slug: data.slug,
    description: data.description,
    status: (data.deleted_at ? 'inactive' : data.status || 'active') as
      | 'active'
      | 'inactive',
    createdAt: data.created_at || new Date().toISOString(),
  }
}

export const adminBlogCategoryService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    categories: BlogCategory[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/blog/category', { params })
    const body = response.data

    const rawData = Array.isArray(body.data) ? body.data : []
    const metaData = body.meta

    const meta = {
      total:
        typeof metaData?.total === 'number'
          ? metaData.total
          : rawData.length,
      page:
        typeof metaData?.current_page === 'number'
          ? metaData.current_page
          : params?.page || 1,
      limit:
        typeof metaData?.per_page === 'number'
          ? metaData.per_page
          : params?.limit || 10,
    }

    return {
      categories: rawData.map(mapApiToBlogCategory),
      meta,
    }
  },

  async getOne(uuid: string): Promise<BlogCategory> {
    const response = await apiClient.get(`/api/admin/blog/category/${uuid}`)
    const data = response.data.data || response.data
    return mapApiToBlogCategory(data)
  },

  async create(category: Partial<BlogCategory>): Promise<BlogCategory> {
    const response = await apiClient.post('/api/admin/blog/category', category)
    const data = response.data.data || response.data
    return mapApiToBlogCategory(data)
  },

  async update(
    uuid: string,
    category: Partial<BlogCategory>,
  ): Promise<BlogCategory> {
    const response = await apiClient.put(
      `/api/admin/blog/category/${uuid}`,
      category,
    )
    const data = response.data.data || response.data
    return mapApiToBlogCategory(data)
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/blog/category/${uuid}`)
  },
}
