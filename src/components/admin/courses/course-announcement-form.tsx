'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichEditor } from '@/components/ui/rich-editor'
import { Textarea } from '@/components/ui/textarea'
import type { CourseAnnouncement } from '@/types/course'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
})

type FormValues = z.infer<typeof formSchema>

interface CourseAnnouncementFormProps {
  announcement?: CourseAnnouncement
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function CourseAnnouncementForm({
  announcement,
  onSubmit,
  onCancel,
}: CourseAnnouncementFormProps) {
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: announcement?.title || '',
      excerpt: announcement?.excerpt || '',
      content: announcement?.content || '',
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('common.title')}</FormLabel>
              <FormControl>
                <Input
                  className="h-11 rounded-xl"
                  placeholder={t('courses.announcementTitlePlaceholder', 'Announcement title')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('common.excerpt', 'Excerpt')}</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-24 rounded-xl"
                  placeholder={t(
                    'courses.announcementExcerptPlaceholder',
                    'Brief summary of the announcement',
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">{t('common.content')}</FormLabel>
              <FormControl>
                <RichEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            className="hover:bg-accent/50 transition-all duration-200 rounded-xl"
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 shadow-filament hover:shadow-filament-hover active:scale-[0.98] transition-all duration-200 px-8 rounded-xl font-bold"
            type="submit"
          >
            {announcement ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
