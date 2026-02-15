export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  status: 'active' | 'inactive'
  createdAt: string
}
