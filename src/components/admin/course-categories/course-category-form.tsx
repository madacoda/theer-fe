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
import { Textarea } from '@/components/ui/textarea'
import type { CourseCategory } from '@/types/course'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CourseCategoryFormProps {
  category?: CourseCategory
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function CourseCategoryForm({
  category,
  onSubmit,
  onCancel,
}: CourseCategoryFormProps) {
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.name')}</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Programming" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.description')}</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder={t(
                    'courseCategories.descriptionPlaceholder',
                    'Enter category description...',
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-6">
          <Button
            className="hover:bg-accent/50 transition-all duration-200"
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 shadow-filament hover:shadow-filament-hover active:scale-[0.98] transition-all duration-200 px-8"
            type="submit"
          >
            {category ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
