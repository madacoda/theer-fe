import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import type { CourseCategory } from '@/types/course'

interface CourseCategoryTableProps {
  categories: CourseCategory[]
  onEdit: (category: CourseCategory) => void
  onDelete: (category: CourseCategory) => void
}

export function CourseCategoryTable({
  categories,
  onEdit,
  onDelete,
}: CourseCategoryTableProps) {
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
          <AnimatePresence initial={false} mode="popLayout">
            {categories.length === 0 ? (
              <motion.tr
                key="empty"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell className="h-24 text-center" colSpan={4}>
                  No course categories found.
                </TableCell>
              </motion.tr>
            ) : (
              categories.map((category) => (
                <motion.tr
                  key={category.id}
                  layout
                  animate={{ opacity: 1, x: 0 }}
                  className="group"
                  exit={{ opacity: 0, x: 10 }}
                  initial={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.2,
                    layout: { type: 'spring', stiffness: 300, damping: 30 },
                  }}
                >
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {category.description || '-'}
                  </TableCell>
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
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
