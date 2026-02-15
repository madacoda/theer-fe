import apiClient from '@/lib/api-client'
import type { User } from '@/types/user'

interface RawApiUser {
  id: number
  uuid: string
  name: string
  email: string
  role_id: number
  role?: string
  status?: string
  deleted_at?: string | null
  created_at?: string
}

function mapApiUserToUser(data: RawApiUser): User {
  // If role name is directly provided by API, use it.
  // Otherwise, fallback to a map or default to 'user'. 
  // Since we are moving to dynamic roles, we ideally want the API to return the role name.
  // If role_id is returned, we might need a way to look it up, but for the list view,
  // we often get the role name joined.
  
  return {
    id: data.uuid,
    name: data.name,
    email: data.email,
    role: (data.role || 'user') as User['role'], // Assuming API now returns the role name string or we accept it might be just a string
    status: (data.deleted_at ? 'inactive' : data.status || 'active') as
      | 'active'
      | 'inactive',
    createdAt: data.created_at || new Date().toISOString(),
  }
}

export const adminUserService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    role_id?: string
  }): Promise<{
    users: User[]
    meta: {
      total: number
      page: number
      limit: number
    }
  }> {
    const response = await apiClient.get('/api/admin/user', { params })
    const body = response.data

    // The API structure is a standard Laravel resource response: { data: [], meta: { current_page, last_page, per_page, total, ... } }
    const rawUsers = Array.isArray(body.data) ? body.data : []
    const metaData = body.meta

    const meta = {
      total:
        typeof metaData?.total === 'number'
          ? metaData.total
          : rawUsers.length,
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
      users: rawUsers.map(mapApiUserToUser),
      meta,
    }
  },

  async getOne(uuid: string): Promise<User> {
    const response = await apiClient.get(`/api/admin/user/${uuid}`)
    const data = response.data.data || response.data
    return mapApiUserToUser(data)
  },

  async create(user: Partial<User>): Promise<User> {
    const response = await apiClient.post('/api/admin/user', user)
    const data = response.data.data || response.data
    return mapApiUserToUser(data)
  },

  async update(uuid: string, user: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/api/admin/user/${uuid}`, user)
    const data = response.data.data || response.data
    return mapApiUserToUser(data)
  },

  async delete(uuid: string): Promise<void> {
    await apiClient.delete(`/api/admin/user/${uuid}`)
  },

  async getRoles(): Promise<{ id: number; label: string }[]> {
    const response = await apiClient.get('/api/role')
    // Assuming API returns { data: [{ id, name, ... }] }
    // We map 'name' to 'label' for UI consistency if needed, or return as is.
    // Adjust based on actual API response structure.
    return response.data.data.map((role: any) => ({
      id: role.id,
      label: role.name || role.label, // Fallback
    }))
  },
}
