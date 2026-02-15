import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { BlogForm } from '@/components/admin/blog/blog-form'
import { Button } from '@/components/ui/button'
import { adminBlogService } from '@/services/admin/blog.service'
import { adminBlogCategoryService } from '@/services/admin/blog-category.service'
import { BlogFormValues } from '@/types/blog'
import { BlogCategory } from '@/types/blog-category'

export const Route = createFileRoute('/_admin/blog/create')({
  component: CreateBlogPage,
})

function CreateBlogPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminBlogCategoryService.getAll()
        setCategories(res.categories)
      } catch (error) {
        toast.error('Failed to fetch categories')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      await adminBlogService.create(values)
      toast.success(t('common.createSuccess', 'Post created successfully'))
      navigate({ to: '/blog' })
    } catch (error) {
      toast.error('Failed to create post')
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
          onClick={() => navigate({ to: '/blog' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Blog Post</h2>
          <p className="text-muted-foreground">
            Create a new story to share with your audience.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <BlogForm
            categories={categories}
            onCancel={() => navigate({ to: '/blog' })}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
