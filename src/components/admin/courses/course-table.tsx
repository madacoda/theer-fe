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
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Course, CourseCategory } from '@/types/course'

interface CourseTableProps {
  courses: Course[]
  categories: CourseCategory[]
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export function CourseTable({
  courses,
  categories,
  onEdit,
  onDelete,
}: CourseTableProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || 'Unknown'
  }

  if (!mounted) return null

  return (
    <div className="rounded-md border bg-card shadow-filament transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence initial={false} mode="popLayout">
            {courses.length === 0 ? (
              <motion.tr
                key="empty"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell className="h-24 text-center" colSpan={6}>
                  No courses found.
                </TableCell>
              </motion.tr>
            ) : (
              courses.map((course) => (
                <motion.tr
                  key={course.id}
                  layout
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                  exit={{ opacity: 0, scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.2,
                    layout: { type: 'spring', stiffness: 300, damping: 30 },
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {course.thumbnail && (
                        <img
                          alt=""
                          className="h-10 w-16 rounded object-cover shadow-sm bg-muted"
                          src={course.thumbnail}
                        />
                      )}
                      <div>
                        <div className="font-bold">{course.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {course.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryName(course.course_category_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        course.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {course.status === 'published'
                        ? t('common.published')
                        : t('common.draft')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.published_at ? (
                      formatDateTime(course.published_at)
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        N/A
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(course.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(course)}
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
