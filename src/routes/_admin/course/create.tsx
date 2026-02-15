import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CourseForm } from '@/components/admin/courses/course-form'
import { Button } from '@/components/ui/button'
import { adminCourseService } from '@/services/admin/course.service'
import { adminCourseCategoryService } from '@/services/admin/course-category.service'
import { CourseCategory } from '@/types/course'

export const Route = createFileRoute('/_admin/course/create')({
  component: CreateCoursePage,
})

function CreateCoursePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = React.useState<CourseCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminCourseCategoryService.getAll()
        setCategories(res.categories)
      } catch (error) {
        toast.error('Failed to fetch categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (values: any) => {
    try {
      await adminCourseService.create(values)
      toast.success(t('common.createSuccess', 'Course created successfully'))
      navigate({ to: '/course' })
    } catch (error) {
      toast.error('Failed to create course')
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          className="rounded-full"
          size="icon"
          variant="ghost"
          onClick={() => navigate({ to: '/course' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Course</h2>
          <p className="text-muted-foreground">
            Create a new course to share with your audience.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <CourseForm
            categories={categories}
            onCancel={() => navigate({ to: '/course' })}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
