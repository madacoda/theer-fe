export interface CourseCategory {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface CourseModule {
  id: string
  title: string
  description?: string
  content?: string
  video?: string
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  content: string
  course_category_id: string
  thumbnail: string
  video: string
  status: 'published' | 'draft'
  published_at?: string
  modules?: CourseModule[]
  announcements?: CourseAnnouncement[]
  certificate_config?: CourseCertificateConfig
  meta_title?: string
  meta_description?: string
  createdAt: string
}
export interface CourseAnnouncement {
  id: string
  course_id: string
  title: string
  excerpt: string
  content: string
  createdAt: string
  updatedAt: string
}
export interface CourseComment {
  id: string
  course_id: string
  user_name: string
  user_avatar?: string
  content: string
  status: 'visible' | 'hidden'
  createdAt: string
}
export interface CourseCertificateConfig {
  variant: 'modern' | 'traditional' | 'technical'
  title: string
  subtitle: string
  issuing_authority: string
  signature_name: string
  signature_title: string
  logo_url?: string
  seal_url?: string
  show_qr: boolean
  accent_color?: string
}
