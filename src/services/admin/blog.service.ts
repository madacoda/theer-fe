import apiClient from '@/lib/api-client'
import type { Blog } from '@/types/blog'
import type { ProcessedImage } from '@/types/common'

interface RawApiBlog {
  id: number
  uuid: string
  title: string
  excerpt: string
  content: string
  blog_category_uuid: string
  category?: {
    uuid: string
    name: string
  }
  images?: {
    uuid: string
    url: string
    order: number
  }[]
  status?: string
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at?: string
  updated_at?: string
}

function mapApiToBlog(data: RawApiBlog): Blog {
  const images = (data.images || [])
    .map((img) => ({
      id: img.uuid,
      url: img.url,
      order: img.order,
    }))
    .sort((a, b) => a.order - b.order)

  return {
    id: data.uuid,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    blog_category_id: data.blog_category_uuid,
    category: data.category
      ? {
          id: data.category.uuid,
          name: data.category.name,
          slug: '',
          status: 'active' as const,
          createdAt: '',
        }
      : undefined,
    images,
    thumbnail: images.length > 0 ? images[0].url : undefined,
    status: (data.status || 'draft') as 'published' | 'draft',
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    published_at: data.published_at,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  }
}

export const adminBlogService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    category_id?: string
    status?: string
  }): Promise<{
    blogs: Blog[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/blog', { params })
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
      blogs: rawData.map(mapApiToBlog),
      meta,
    }
  },

  async getOne(uuid: string): Promise<Blog> {
    const response = await apiClient.get(`/api/admin/blog/${uuid}`)
    const data = response.data.data || response.data
    return mapApiToBlog(data)
  },

  async create(blog: any): Promise<Blog> {
    const response = await apiClient.post('/api/admin/blog', blog)
    const data = response.data.data || response.data
    return mapApiToBlog(data)
  },

  async update(uuid: string, blog: any): Promise<Blog> {
    const response = await apiClient.put(`/api/admin/blog/${uuid}`, blog)
    const data = response.data.data || response.data
    return mapApiToBlog(data)
  },

  async uploadImages(files: FileList | File[]): Promise<ProcessedImage[]> {
    const formData = new FormData()
    Array.from(files).forEach((file) => {
      formData.append('images[]', file)
    })

    const response = await apiClient.post('/api/admin/blog/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data || response.data
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/blog/${uuid}`)
  },
}
