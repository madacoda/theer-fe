import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { BlogForm } from '@/components/admin/blog/blog-form'
import { Button } from '@/components/ui/button'
import { adminBlogService } from '@/services/admin/blog.service'
import { adminBlogCategoryService } from '@/services/admin/blog-category.service'
import { Blog, BlogFormValues } from '@/types/blog'
import { BlogCategory } from '@/types/blog-category'

export const Route = createFileRoute('/_admin/blog/$blogId')({
  component: EditBlogPage,
})

function EditBlogPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { blogId } = useParams({ from: '/blog/$blogId' })

  const [blog, setBlog] = React.useState<Blog | undefined>()
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          adminBlogService.getById(blogId),
          adminBlogCategoryService.getAll(),
        ])
        setBlog(blogRes.blog)
        setCategories(catRes.categories)
      } catch (error) {
        toast.error('Failed to fetch blog data')
        navigate({ to: '/blog' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [blogId, navigate])

  const handleSubmit = async (values: BlogFormValues) => {
    try {
      await adminBlogService.update(blogId, values)
      toast.success(t('common.updateSuccess', 'Post updated successfully'))
      navigate({ to: '/blog' })
    } catch (error) {
      toast.error('Failed to update post')
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
          <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
          <p className="text-muted-foreground">
            Update your post content and settings.
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : blog ? (
          <BlogForm
            blog={blog}
            categories={categories}
            onCancel={() => navigate({ to: '/blog' })}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Post not found.</p>
            <Button
              variant="link"
              onClick={() => navigate({ to: '/blog' })}
            >
              Back to Blog Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
