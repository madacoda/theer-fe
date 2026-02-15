import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CourseForm } from '@/components/admin/courses/course-form'
import { Button } from '@/components/ui/button'
import { adminCourseService } from '@/services/admin/course.service'
import { adminCourseCategoryService } from '@/services/admin/course-category.service'
import { Course, CourseCategory } from '@/types/course'

export const Route = createFileRoute('/_admin/course/$courseId')({
  component: EditCoursePage,
})

function EditCoursePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { courseId } = useParams({ from: '/course/$courseId' })

  const [course, setCourse] = React.useState<Course | undefined>()
  const [categories, setCategories] = React.useState<CourseCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          adminCourseService.getOne(courseId),
          adminCourseCategoryService.getAll(),
        ])
        setCourse(courseRes)
        setCategories(catRes.categories)
      } catch (error) {
        toast.error('Failed to fetch course data')
        navigate({ to: '/course' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [courseId, navigate])

  const handleSubmit = async (values: any) => {
    try {
      await adminCourseService.update(courseId, values)
      toast.success(t('common.updateSuccess', 'Course updated successfully'))
      navigate({ to: '/course' })
    } catch (error) {
      toast.error('Failed to update course')
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
          <h2 className="text-3xl font-bold tracking-tight">Edit Course</h2>
          <p className="text-muted-foreground">
            Update your course content and settings.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : course ? (
          <CourseForm
            categories={categories}
            course={course}
            onCancel={() => navigate({ to: '/course' })}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Course not found.</p>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/course' })}
            >
              Back to Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
