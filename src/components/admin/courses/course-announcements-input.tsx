'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Edit2,
  Plus,
  Trash2,
} from 'lucide-react'
import * as React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CourseAnnouncementForm } from './course-announcement-form'

export function CourseAnnouncementsInput() {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'announcements',
  })

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)

  const handleOpenCreate = () => {
    setEditingIndex(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index)
    setIsModalOpen(true)
  }

  const handleSubmit = (values: any) => {
    if (editingIndex !== null) {
      update(editingIndex, {
        ...fields[editingIndex],
        ...values,
      })
    } else {
      append({
        id: Math.random().toString(36).substr(2, 9),
        ...values,
        createdAt: new Date().toISOString(),
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('courses.announcements', 'Announcements')}</h3>
        </div>
        <Button
          className="gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
          size="sm"
          type="button"
          variant="outline"
          onClick={handleOpenCreate}
        >
          <Plus className="h-4 w-4" />
          {t('courses.addAnnouncement', 'Add Announcement')}
        </Button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {fields.length === 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">{t('courses.noAnnouncements', 'No announcements yet')}</p>
            </motion.div>
          ) : (
            fields.map((field: any, index) => (
              <motion.div
                key={field.id}
                layout
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 border-primary/5 hover:border-primary/20"
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="font-bold text-foreground truncate">{field.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {field.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-none"
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => handleOpenEdit(index)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-none"
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null
                ? t('courses.editAnnouncement', 'Edit Announcement')
                : t('courses.addAnnouncement', 'Add Announcement')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CourseAnnouncementForm
              announcement={editingIndex !== null ? (fields[editingIndex] as any) : undefined}
              onCancel={() => setIsModalOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
