import apiClient from '@/lib/api-client'
import type { CourseCategory } from '@/types/course'

interface RawApiCourseCategory {
  id: number
  uuid: string
  name: string
  description?: string
  created_at?: string
}

function mapApiToCourseCategory(data: RawApiCourseCategory): CourseCategory {
  return {
    id: data.uuid,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at || new Date().toISOString(),
  }
}

export const adminCourseCategoryService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    categories: CourseCategory[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/course/category', { params })
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
      categories: rawData.map(mapApiToCourseCategory),
      meta,
    }
  },

  async getOne(uuid: string): Promise<CourseCategory> {
    const response = await apiClient.get(`/api/admin/course/category/${uuid}`)
    const data = response.data.data || response.data
    return mapApiToCourseCategory(data)
  },

  async create(category: Partial<CourseCategory>): Promise<CourseCategory> {
    const response = await apiClient.post('/api/admin/course/category', category)
    const data = response.data.data || response.data
    return mapApiToCourseCategory(data)
  },

  async update(
    uuid: string,
    category: Partial<CourseCategory>,
  ): Promise<CourseCategory> {
    const response = await apiClient.put(
      `/api/admin/course/category/${uuid}`,
      category,
    )
    const data = response.data.data || response.data
    return mapApiToCourseCategory(data)
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/course/category/${uuid}`)
  },
}
