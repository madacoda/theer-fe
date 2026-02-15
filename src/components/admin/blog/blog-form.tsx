'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Image as ImageIcon, Layout, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichEditor } from '@/components/ui/rich-editor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { adminBlogService } from '@/services/admin/blog.service'
import { Blog, BlogFormValues, BlogImage } from '@/types/blog'
import { BlogCategory } from '@/types/blog-category'

import { ImageGallery } from '@/components/admin/shared/image-gallery'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  blog_category_id: z.string().min(1, 'Category is required'),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string().url(),
      order: z.number(),
    }),
  ),
  status: z.enum(['published', 'draft']),
  published_at: z.string().optional().or(z.literal('')),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof formSchema>

interface BlogFormProps {
  blog?: Blog
  categories: BlogCategory[]
  onSubmit: (data: BlogFormValues) => Promise<void>
  onCancel: () => void
}

export function BlogForm({
  blog,
  categories,
  onSubmit,
  onCancel,
}: BlogFormProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || '',
      excerpt: blog?.excerpt || '',
      content: blog?.content || '',
      blog_category_id: blog?.blog_category_id || '',
      images: (blog?.images || []) as BlogImage[],
      status: blog?.status || 'draft',
      published_at: blog?.published_at
        ? new Date(blog.published_at).toISOString().slice(0, 16)
        : '',
      meta_title: blog?.meta_title || '',
      meta_description: blog?.meta_description || '',
    },
  })

  const { watch } = form

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setIsSubmitting(true)
          try {
            await onSubmit(values as BlogFormValues)
          } finally {
            setIsSubmitting(false)
          }
        })}
      >
        <Tabs className="w-full" defaultValue="general">
          <TabsList className="grid w-full sm:w-[500px] grid-cols-3 gap-1 mb-8 bg-muted/50 p-1 border rounded-xl overflow-hidden h-12">
            <TabsTrigger
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
              value="general"
            >
              <Layout className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
              value="media"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
              value="seo"
            >
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent
            className="space-y-6 animate-in fade-in-50 duration-300 outline-none"
            value="general"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t('common.title')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-xl"
                          placeholder="Story title"
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
                      <FormLabel className="font-bold">
                        {t('common.description')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none h-24 rounded-xl"
                          placeholder="A brief summary..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Short summary for the post list.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t('common.content')}
                      </FormLabel>
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
              </div>

              <div className="space-y-6">
                <div className="p-5 border rounded-2xl bg-muted/5 space-y-5">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          {t('common.status')}
                        </FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">
                              {t('common.draft')}
                            </SelectItem>
                            <SelectItem value="published">
                              {t('common.published')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          {t('common.publishedAt')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 rounded-xl"
                            type="datetime-local"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="blog_category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          {t('common.category')}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent
            className="animate-in fade-in-50 duration-300 outline-none"
            value="media"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <ImageGallery
                    images={field.value}
                    onChange={field.onChange}
                    onUpload={(files) => adminBlogService.uploadImages(files)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent
            className="space-y-6 animate-in fade-in-50 duration-300 outline-none"
            value="seo"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t('common.metaTitle')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-xl"
                          placeholder="Meta title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        {t('common.metaDescription')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none h-32 rounded-xl"
                          placeholder="Meta description..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-6 border rounded-2xl bg-slate-50 border-slate-200 shadow-inner flex flex-col justify-center min-h-[200px]">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Search Result Preview
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
                      www.mclara.test › blog ›{' '}
                      {(watch('title') || '').toLowerCase().replace(/\s+/g, '-')}
                    </div>
                    <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer transition-all">
                      {watch('meta_title') ||
                        watch('title') ||
                        'Your Post Title Will Appear Here'}
                    </h3>
                    <p className="text-sm text-[#4d5156] line-clamp-2 leading-snug">
                      {watch('meta_description') ||
                        watch('excerpt') ||
                        'Your detailed meta description will show up here...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {blog ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
