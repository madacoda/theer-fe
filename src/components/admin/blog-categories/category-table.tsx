import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import * as React from 'react'

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
import type { BlogCategory } from '@/types/blog-category'

interface CategoryTableProps {
  categories: BlogCategory[]
  onEdit: (category: BlogCategory) => void
  onDelete: (category: BlogCategory) => void
  isLoading?: boolean
  pageSize?: number
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  isLoading,
  pageSize = 10,
}: CategoryTableProps) {
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
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={4}>
                 No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow
                key={category.id}
                className="group hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(category)}
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
