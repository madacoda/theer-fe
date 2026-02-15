import apiClient from '@/lib/api-client'
import type { Course, CourseModule } from '@/types/course'

interface RawApiCourse {
  id: number
  uuid: string
  title: string
  description: string
  content: string
  course_category_uuid?: string
  course_category_id?: string // Handle both cases
  thumbnail: string
  video: string
  status: string
  published_at?: string
  meta_title?: string
  meta_description?: string
  created_at?: string
  updated_at?: string
  modules?: {
    uuid: string
    title: string
    description?: string
    content?: string
    video?: string
    order: number
  }[]
}

function mapApiToCourse(data: RawApiCourse): Course {
  const modules: CourseModule[] = (data.modules || [])
    .map((m) => ({
      id: m.uuid,
      title: m.title,
      description: m.description,
      content: m.content,
      video: m.video,
      order: m.order,
    }))
    .sort((a, b) => a.order - b.order)

  return {
    id: data.uuid,
    title: data.title,
    description: data.description,
    content: data.content,
    course_category_id: data.course_category_uuid || data.course_category_id || '',
    thumbnail: data.thumbnail,
    video: data.video,
    status: (data.status || 'draft') as 'published' | 'draft',
    published_at: data.published_at,
    modules: modules,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    createdAt: data.created_at || new Date().toISOString(),
  }
}

export const adminCourseService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    category_id?: string
    status?: string
  }): Promise<{
    courses: Course[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/course', { params })
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
      courses: rawData.map(mapApiToCourse),
      meta,
    }
  },

  async getOne(uuid: string): Promise<Course> {
    const response = await apiClient.get(`/api/admin/course/${uuid}`)
    const data = response.data.data || response.data
    return mapApiToCourse(data)
  },

  async create(course: any): Promise<Course> {
    const response = await apiClient.post('/api/admin/course', course)
    const data = response.data.data || response.data
    return mapApiToCourse(data)
  },

  async update(uuid: string, course: any): Promise<Course> {
    const response = await apiClient.put(`/api/admin/course/${uuid}`, course)
    const data = response.data.data || response.data
    return mapApiToCourse(data)
  },

  async upload(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/api/admin/course/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Assuming backend returns the URL of the uploaded file
    return response.data.data?.url || response.data.url || response.data
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/course/${uuid}`)
  },
}
