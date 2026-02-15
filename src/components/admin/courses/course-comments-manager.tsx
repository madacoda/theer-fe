'use client'

import { Eye, EyeOff, MessageSquare, Trash2 } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import type { CourseComment } from '@/types/course'

const DUMMY_COMMENTS: CourseComment[] = [
  {
    id: '1',
    course_id: 'c1',
    user_name: 'John Doe',
    content: 'Very helpful course! I learned a lot about Next.js.',
    status: 'visible',
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '2',
    course_id: 'c1',
    user_name: 'Jane Smith',
    content: 'I found some parts a bit confusing, but overall it is good.',
    status: 'visible',
    createdAt: '2024-02-11T12:00:00Z',
  },
  {
    id: '3',
    course_id: 'c1',
    user_name: 'Spammer 123',
    content: 'BUY BITCOIN NOW! Visit my website at example.com',
    status: 'hidden',
    createdAt: '2024-02-12T09:00:00Z',
  },
]

export function CourseCommentsManager() {
  const { t } = useTranslation()
  const [comments, setComments] = React.useState<CourseComment[]>(DUMMY_COMMENTS)

  const toggleStatus = (id: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              status: comment.status === 'visible' ? 'hidden' : 'visible',
            }
          : comment,
      ),
    )
    toast.success(t('common.updateSuccess', 'Status updated successfully'))
  }

  const deleteComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id))
    toast.success(t('common.deleteSuccess', 'Comment deleted successfully'))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{t('courses.comments', 'Course Comments')}</h3>
      </div>

      <div className="rounded-xl border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b bg-muted/30">
              <TableHead className="font-bold py-4">{t('common.user', 'User')}</TableHead>
              <TableHead className="font-bold py-4">{t('common.comment', 'Comment')}</TableHead>
              <TableHead className="font-bold py-4">{t('common.status')}</TableHead>
              <TableHead className="font-bold py-4">{t('common.createdAt')}</TableHead>
              <TableHead className="w-[100px] py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={5}>
                  {t('common.noResults', 'No comments found.')}
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user_avatar} />
                        <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{comment.user_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[400px]">
                    <p className={`text-sm ${comment.status === 'hidden' ? 'italic text-muted-foreground line-through' : ''}`}>
                      {comment.content}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-full px-2"
                      variant={comment.status === 'visible' ? 'default' : 'secondary'}
                    >
                      {comment.status === 'visible' ? t('common.visible', 'Visible') : t('common.hidden', 'Hidden')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-none"
                        size="icon"
                        title={comment.status === 'visible' ? t('common.hide', 'Hide') : t('common.show', 'Show')}
                        type="button"
                        variant="ghost"
                        onClick={() => toggleStatus(comment.id)}
                      >
                        {comment.status === 'visible' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-none"
                        size="icon"
                        title={t('common.delete')}
                        type="button"
                        variant="ghost"
                        onClick={() => deleteComment(comment.id)}
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
    </div>
  )
}
