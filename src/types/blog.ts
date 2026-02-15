import { BlogCategory } from './blog-category'
import { GalleryImage } from './common'

export type BlogImage = GalleryImage

export interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  blog_category_id: string
  category?: BlogCategory
  images: BlogImage[]
  thumbnail?: string
  status: 'published' | 'draft'
  meta_title?: string
  meta_description?: string
  published_at?: string
  createdAt: string
  updatedAt: string
}

export interface BlogFormValues {
  title: string
  excerpt: string
  content: string
  blog_category_id: string
  images: BlogImage[]
  status: 'published' | 'draft'
  meta_title?: string
  meta_description?: string
  published_at?: string
}
