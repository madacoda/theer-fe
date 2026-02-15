import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CategoryForm } from '@/components/admin/blog-categories/category-form'
import { CategoryTable } from '@/components/admin/blog-categories/category-table'
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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { adminBlogCategoryService } from '@/services/admin/blog-category.service'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import type { BlogCategory } from '@/types/blog-category'

export const Route = createFileRoute('/_admin/blog/category')({
  component: BlogCategoriesPage,
})

function BlogCategoriesPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  // const [statusFilter, setStatusFilter] = React.useState<string[]>([])

  const [categories, setCategories] = React.useState<BlogCategory[]>([])
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const isFirstRender = React.useRef(true)

  const lastRequestId = React.useRef(0)

  const fetchCategories = React.useCallback(
    async (page: number, limit: number, search: string) => {
      const requestId = ++lastRequestId.current
      setIsLoading(true)
      try {
        const { categories, meta } = await adminBlogCategoryService.getAll({
          page,
          limit,
          search,
        })
        
        if (requestId === lastRequestId.current) {
          setCategories(categories)
          setPagination(meta)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        if (requestId === lastRequestId.current) {
          setIsLoading(false)
        }
      }
    },
    [searchQuery],
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Debounced search effect
  React.useEffect(() => {
    if (!mounted) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      fetchCategories(1, pagination.limit, searchQuery)
      return
    }

    const handler = setTimeout(() => {
      fetchCategories(1, pagination.limit, searchQuery)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery, mounted, fetchCategories, pagination.limit])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchCategories(newPage, pagination.limit, searchQuery)
  }

  // Generate pagination range
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

  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<
    BlogCategory | undefined
  >()

  const handleCreate = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = async (category: BlogCategory) => {
    try {
      const categoryData = await adminBlogCategoryService.getOne(category.id)
      setSelectedCategory(categoryData)
      setIsFormOpen(true)
    } catch (error) {
      console.error('Failed to fetch category details:', error)
    }
  }

  const handleDeleteClick = (category: BlogCategory) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: Partial<BlogCategory>) => {
    try {
      if (selectedCategory) {
        await adminBlogCategoryService.update(selectedCategory.id, data)
        toast.success('Category updated successfully')
      } else {
        await adminBlogCategoryService.create(data)
        toast.success('Category created successfully')
      }
      await fetchCategories(pagination.page, pagination.limit, searchQuery)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to save category:', error)
      toast.error('Failed to save category')
      throw error
    }
  }

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await adminBlogCategoryService.delete(selectedCategory.id)
        toast.success('Category deleted successfully')
        await fetchCategories(pagination.page, pagination.limit, searchQuery)
        setIsDeleteDialogOpen(false)
        setSelectedCategory(undefined)
      } catch (error) {
        console.error('Failed to delete category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  /*
  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    )
  }
  */

  const clearFilters = () => {
    // setStatusFilter([])
    setSearchQuery('')
    fetchCategories(1, pagination.limit, '')
  }

  /*
  const filteredCategories = categories.filter((cat) => {
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(cat.status)
    return matchesStatus
  })

  const activeFiltersCount = statusFilter.length
  */

  if (!mounted) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('blogCategories.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('blogCategories.description')}
          </p>
        </div>
        <Button className="shadow-sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> {t('blogCategories.addCategory')}
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={`${t('common.search')}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Status Filter removed as not yet implemented */}

          <AnimatePresence>
            {searchQuery && (
              <motion.div
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -10 }}
                initial={{ opacity: 0, scale: 0.95, x: -10 }}
              >
                <Button
                  className="h-9 px-3 text-xs font-semibold"
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
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          pageSize={pagination.limit}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />

        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{' '}
              {Math.ceil(pagination.total / pagination.limit)}
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

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] admin-theme">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory
                ? t('common.edit')
                : t('blogCategories.addCategory')}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? t('common.updateDetails')
                : t('common.enterDetails')}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onCancel={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="admin-theme">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.deleteConfirmation')}{' '}
              <span className="font-semibold text-foreground">
                {selectedCategory?.name}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
