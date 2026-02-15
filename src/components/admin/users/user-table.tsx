import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types/user'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  isLoading?: boolean
  pageSize?: number
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  isLoading,
  pageSize = 10,
}: UserTableProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <div className="rounded-md border bg-card shadow-filament transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={6}>
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  <Badge
                    className="capitalize"
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                  >
                    {user.status === 'active'
                      ? t('common.active')
                      : t('common.inactive')}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
