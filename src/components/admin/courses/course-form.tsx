'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import { 
  ImageIcon, 
  Video, 
  Loader2, 
  Upload, 
  X, 
  Layout, 
  Globe,
  Settings,
  MessageSquare,
  Megaphone,
  BookOpen
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { Course, CourseCategory } from '@/types/course'

import { CourseAnnouncementsInput } from './course-announcements-input'
import { CourseCertificateSettings } from './course-certificate-settings'
import { CourseCommentsManager } from './course-comments-manager'
import { CourseModulesInput } from './course-modules-input'
import { adminCourseService } from '@/services/admin/course.service'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  course_category_id: z.string().min(1, 'Category is required'),
  thumbnail: z.string().url('Must be a valid URL').or(z.literal('')),
  video: z.string().url('Must be a valid URL').or(z.literal('')),
  status: z.enum(['published', 'draft']),
  published_at: z.string().optional().or(z.literal('')),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  modules: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, 'Module title is required'),
        description: z.string().optional(),
        content: z.string().optional(),
        video: z.string().optional(),
        order: z.number(),
      }),
    )
    .optional(),
  announcements: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, 'Title is required'),
        excerpt: z.string().min(1, 'Excerpt is required'),
        content: z.string().min(1, 'Content is required'),
        createdAt: z.string().optional(),
      }),
    )
    .optional(),
  certificate_config: z.object({
    variant: z.enum(['modern', 'traditional', 'technical']),
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional().or(z.literal('')),
    issuing_authority: z.string().min(1, 'Authority is required'),
    signature_name: z.string().min(1, 'Signatory name is required'),
    signature_title: z.string().min(1, 'Signatory title is required'),
    logo_url: z.string().optional().or(z.literal('')),
    seal_url: z.string().optional().or(z.literal('')),
    show_qr: z.boolean(),
    accent_color: z.string().optional().or(z.literal('')),
  }),
})

type FormValues = z.infer<typeof formSchema>

interface CourseFormProps {
  course?: Course
  categories: CourseCategory[]
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function CourseForm({
  course,
  categories,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const { t } = useTranslation()
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      content: course?.content || '',
      course_category_id: course?.course_category_id || '',
      thumbnail: course?.thumbnail || '',
      video: course?.video || '',
      status: course?.status || 'draft',
      published_at: course?.published_at
        ? new Date(course.published_at).toISOString().slice(0, 16)
        : '',
      meta_title: course?.meta_title || '',
      meta_description: course?.meta_description || '',
      modules: course?.modules || [],
      announcements: course?.announcements || [],
      certificate_config: course?.certificate_config || {
        variant: 'modern',
        title: 'Certificate of Achievement',
        subtitle: 'This is to certify that',
        issuing_authority: 'Madacoda Engineering System',
        signature_name: 'John Madacoda',
        signature_title: 'CTO & Founder',
        show_qr: true,
      },
    },
  })

  const handleFileUpload = async (type: 'thumbnail' | 'video', file: File) => {
    const isThumbnail = type === 'thumbnail'
    const setUploading = isThumbnail ? setIsUploadingThumbnail : setIsUploadingVideo

    setUploading(true)
    try {
      const url = await adminCourseService.upload(file)
      form.setValue(type, url)
      toast.success(t('common.uploadSuccess', `${type} uploaded successfully`))
    } catch (error) {
      toast.error(t('common.uploadFailed', `Failed to upload ${type}`))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs className="w-full" defaultValue="content">
          <div className="overflow-x-auto pb-1 mb-6 -mx-2 px-2">
            <TabsList className="flex w-full min-w-max gap-1 bg-muted/50 p-1 border rounded-xl h-12">
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="content"
              >
                <Layout className="h-4 w-4 mr-2" />
                {t('common.content')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="media"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {t('common.media', 'Media')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="module"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t('common.module', 'Module')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="announcement"
              >
                <Megaphone className="h-4 w-4 mr-2" />
                {t('courses.announcements', 'Announcements')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="comment"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('common.comments', 'Comments')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="certificate"
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('common.certificate', 'Certificate')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all h-full rounded-lg font-bold"
                value="seo"
              >
                <Globe className="h-4 w-4 mr-2" />
                {t('common.seo')}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Tab */}
          <TabsContent
            className="space-y-6 animate-in fade-in-50 duration-300 outline-none"
            value="content"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('common.title')}</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 rounded-xl"
                        placeholder={t(
                          'courses.titlePlaceholder',
                          'Course title',
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
                name="course_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('common.category')}</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue
                            placeholder={t(
                              'common.selectCategory',
                              'Select a category',
                            )}
                          />
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">{t('common.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none h-24 rounded-xl"
                      placeholder={t(
                        'courses.descriptionPlaceholder',
                        'Brief overview of the course',
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">{t('common.status')}</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue
                            placeholder={t(
                              'common.selectStatus',
                              'Select status',
                            )}
                          />
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
                    <FormLabel className="font-bold">{t('common.publishedAt')}</FormLabel>
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
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent
            className="space-y-6 animate-in fade-in-50 duration-300 outline-none"
            value="media"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {t('common.thumbnail')}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Input
                            className="h-11 rounded-xl flex-1"
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                          <Button
                            asChild
                            className="h-11 rounded-xl"
                            disabled={isUploadingThumbnail}
                            type="button"
                            variant="outline"
                          >
                            <label className="cursor-pointer">
                              {isUploadingThumbnail ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {t('common.upload', 'Upload')}
                              <input
                                accept="image/*"
                                className="hidden"
                                type="file"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleFileUpload('thumbnail', e.target.files[0])
                                }
                              />
                            </label>
                          </Button>
                        </div>
                        {field.value && (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border bg-muted shadow-inner">
                            <img
                              alt="Thumbnail preview"
                              className="object-cover w-full h-full"
                              src={field.value}
                            />
                            <Button
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-destructive hover:text-white transition-colors"
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={() => field.onChange('')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t('common.video')}
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Input
                            className="h-11 rounded-xl flex-1"
                            placeholder="https://youtube.com/..."
                            {...field}
                          />
                          <Button
                            asChild
                            className="h-11 rounded-xl"
                            disabled={isUploadingVideo}
                            type="button"
                            variant="outline"
                          >
                            <label className="cursor-pointer">
                              {isUploadingVideo ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              {t('common.upload', 'Upload')}
                              <input
                                accept="video/*"
                                className="hidden"
                                type="file"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleFileUpload('video', e.target.files[0])
                                }
                              />
                            </label>
                          </Button>
                        </div>
                        {field.value && (
                          <div className="p-4 border rounded-2xl bg-muted/30 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Video className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-sm truncate">
                                {field.value}
                              </span>
                            </div>
                            <Button
                              className="h-8 w-8 rounded-full hover:bg-destructive hover:text-white transition-colors"
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={() => field.onChange('')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          {/* Module Tab */}
          <TabsContent
            className="animate-in fade-in-50 duration-300 outline-none"
            value="module"
          >
            <CourseModulesInput />
          </TabsContent>

          {/* Announcement Tab */}
          <TabsContent
            className="animate-in fade-in-50 duration-300 outline-none"
            value="announcement"
          >
            <CourseAnnouncementsInput />
          </TabsContent>

          {/* Comment Tab */}
          <TabsContent
            className="animate-in fade-in-50 duration-300 outline-none"
            value="comment"
          >
            <CourseCommentsManager />
          </TabsContent>

          {/* Certificate Tab */}
          <TabsContent
            className="animate-in fade-in-50 duration-300 outline-none"
            value="certificate"
          >
            <CourseCertificateSettings />
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
                      <FormLabel className="font-bold">{t('common.metaTitle')}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-xl"
                          placeholder="Meta Title for Google Search"
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
                      <FormLabel className="font-bold">{t('common.metaDescription')}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none h-32 rounded-xl"
                          placeholder="Short summary for search results..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SEO Preview */}
              <div className="p-6 border rounded-2xl bg-slate-50 border-slate-200 shadow-inner flex flex-col justify-center min-h-[200px]">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Search Result Preview
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 truncate">
                      www.mclara.test › course ›{' '}
                      {(form.watch('title') || '').toLowerCase().replace(/\s+/g, '-')}
                    </div>
                    <h3 className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer transition-all">
                      {form.watch('meta_title') ||
                        form.watch('title') ||
                        'Your Course Title Will Appear Here'}
                    </h3>
                    <p className="text-sm text-[#4d5156] line-clamp-2 leading-snug">
                      {form.watch('meta_description') ||
                        form.watch('description') ||
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
            type="submit"
          >
            {course ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
