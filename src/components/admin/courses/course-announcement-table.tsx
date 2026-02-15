'use client'

import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CourseAnnouncement } from '@/types/course'

interface CourseAnnouncementTableProps {
  announcements: CourseAnnouncement[]
  onEdit: (announcement: CourseAnnouncement) => void
  onDelete: (announcement: CourseAnnouncement) => void
}

export function CourseAnnouncementTable({
  announcements,
  onEdit,
  onDelete,
}: CourseAnnouncementTableProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b bg-muted/30">
            <TableHead className="font-bold py-4">{t('common.title')}</TableHead>
            <TableHead className="font-bold py-4">{t('common.excerpt', 'Excerpt')}</TableHead>
            <TableHead className="font-bold py-4">{t('common.createdAt')}</TableHead>
            <TableHead className="w-[70px] py-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.length === 0 ? (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={4}>
                {t('common.noResults', 'No announcements found.')}
              </TableCell>
            </TableRow>
          ) : (
            announcements.map((announcement) => (
              <TableRow key={announcement.id} className="group transition-colors hover:bg-muted/30">
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell className="text-muted-foreground line-clamp-1 max-w-[300px]">
                  {announcement.excerpt}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 py-2"
                        onClick={() => onEdit(announcement)}
                      >
                        <Edit2 className="h-4 w-4" />
                        {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive"
                        onClick={() => onDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
