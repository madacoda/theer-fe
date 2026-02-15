import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Filter, Plus, Search, X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { BlogTable } from '@/components/admin/blog/blog-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { adminBlogService } from '@/services/admin/blog.service'
import { adminBlogCategoryService } from '@/services/admin/blog-category.service'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Blog } from '@/types/blog'
import { BlogCategory } from '@/types/blog-category'

export const Route = createFileRoute('/_admin/blog/')({
  component: BlogPostsPage,
})

function BlogPostsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [blogs, setBlogs] = React.useState<Blog[]>([])
  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
  })

  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([])

  // Modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedBlog, setSelectedBlog] = React.useState<Blog | undefined>()

  const lastRequestId = React.useRef(0)

  const fetchData = React.useCallback(
    async (page: number = pagination.page, limit: number = pagination.limit) => {
      const requestId = ++lastRequestId.current
      setIsLoading(true)
      try {
        const [blogRes, catRes] = await Promise.all([
          adminBlogService.getAll({
            page,
            limit,
            search,
            status: statusFilter.length === 1 ? statusFilter[0] : undefined,
            category_id:
              categoryFilter.length === 1 ? categoryFilter[0] : undefined,
          }),
          adminBlogCategoryService.getAll(),
        ])
        
        if (requestId === lastRequestId.current) {
          setBlogs(blogRes.blogs)
          setPagination(blogRes.meta)
          setCategories(catRes.categories)
          setIsLoading(false)
        }
      } catch (error) {
        toast.error('Failed to fetch blog data')
        console.error(error)
        if (requestId === lastRequestId.current) {
          setIsLoading(false)
        }
      }
    },
    [search, statusFilter, categoryFilter, pagination.page, pagination.limit],
  )

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchData(newPage, pagination.limit)
  }

  // Generate pagination range with ellipses
  const getPaginationRange = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit)
    if (totalPages <= 1) return []
    const current = pagination.page
    const siblings = 1

    const range: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - siblings && i <= current + siblings)
      ) {
        range.push(i)
      } else if (i === current - siblings - 1 || i === current + siblings + 1) {
        range.push('...')
      }
    }

    return range.filter(
      (item, index) => item !== '...' || range[index - 1] !== '...',
    )
  }

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    navigate({ to: '/blog/create' })
  }

  const handleEdit = (blog: Blog) => {
    navigate({ to: `/blog/${blog.id}` })
  }

  const handleDeleteClick = (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedBlog) return
    try {
      await adminBlogService.delete(selectedBlog.id)
      toast.success(t('common.deleteSuccess', 'Post deleted successfully'))
      setIsDeleteDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Failed to delete post')
      console.error(error)
    }
  }

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  const toggleCategory = (id: string) => {
    setCategoryFilter((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter([])
    setCategoryFilter([])
  }

  const activeFiltersCount = statusFilter.length + categoryFilter.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">
            {t('courses.description', 'Manage your blog content and SEO.')}
          </p>
        </div>
        <Button className="shadow-sm font-bold" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            className="pl-8"
            placeholder={`${t('common.search')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 gap-2" variant="outline">
                <Filter className="h-4 w-4" />
                {t('common.filters')}
                {activeFiltersCount > 0 && (
                  <Badge
                    className="px-1 font-normal lg:hidden"
                    variant="secondary"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
                {activeFiltersCount > 0 && (
                  <span className="hidden space-x-1 lg:flex items-center">
                    <span className="mx-2 h-4 w-px bg-border" />
                    <Badge
                      className="rounded-sm px-1 font-normal"
                      variant="secondary"
                    >
                      {activeFiltersCount} selected
                    </Badge>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('published')}
                onCheckedChange={() => toggleStatus('published')}
              >
                Published
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('draft')}
                onCheckedChange={() => toggleStatus('draft')}
              >
                Draft
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              {categories.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={cat.id}
                  checked={categoryFilter.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </DropdownMenuCheckboxItem>
              ))}

              {activeFiltersCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    className="w-full justify-start px-2 text-sm font-normal text-destructive hover:text-destructive"
                    variant="ghost"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.clearFilters')}
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <AnimatePresence>
            {(search || activeFiltersCount > 0) && (
              <motion.div
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="h-9 px-3 text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 transition-all"
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-3 w-3" />
                  {t('common.clearAll')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <BlogTable
          blogs={blogs}
          isLoading={isLoading}
          pageSize={10}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />

        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="text-foreground">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="text-foreground">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="text-foreground">{pagination.total}</span>{' '}
              results
            </p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      pagination.page === 1
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    onClick={() =>
                      handlePageChange(Math.max(1, pagination.page - 1))
                    }
                  />
                </PaginationItem>

                {getPaginationRange().map((page, i) => (
                  <PaginationItem key={i}>
                    {page === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        className="cursor-pointer"
                        isActive={pagination.page === page}
                        onClick={() => handlePageChange(Number(page))}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className={
                      pagination.page ===
                      Math.ceil(pagination.total / pagination.limit)
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                    onClick={() =>
                      handlePageChange(
                        Math.min(
                          Math.ceil(pagination.total / pagination.limit),
                          pagination.page + 1,
                        ),
                      )
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="shadow-2xl border-destructive/10 admin-theme">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              {t('common.areYouSure', 'Are you absolutely sure?')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground/90">
              {t(
                'common.deleteConfirmation',
                'This action cannot be undone. This will permanently delete',
              )}
              <span className="font-bold text-foreground mx-1">
                {selectedBlog?.title}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 mt-2 border-t">
            <AlertDialogCancel className="hover:bg-accent transition-all duration-200">
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all duration-200 active:scale-[0.98] font-semibold px-6"
              onClick={confirmDelete}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
