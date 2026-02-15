import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Plus, Search, X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CategoryForm } from '@/components/admin/ticket-categories/category-form'
import { CategoryTable } from '@/components/admin/ticket-categories/category-table'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { adminTicketCategoryService, type TicketCategory } from '@/services/admin/ticket-category.service'

export const Route = createFileRoute('/_admin/ticket/category')({
  component: TicketCategoriesPage,
})

function TicketCategoriesPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])

  const [categories, setCategories] = React.useState<TicketCategory[]>([])
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
        const { categories, meta } = await adminTicketCategoryService.getAll({
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
    [],
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

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

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchCategories(newPage, pagination.limit, searchQuery)
  }

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
  const [selectedCategory, setSelectedCategory] = React.useState<TicketCategory | undefined>()

  const handleCreate = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = async (category: TicketCategory) => {
    try {
      const categoryData = await adminTicketCategoryService.getOne(category.id)
      setSelectedCategory(categoryData)
      setIsFormOpen(true)
    } catch (error) {
      console.error('Failed to fetch category details:', error)
    }
  }

  const handleDeleteClick = (category: TicketCategory) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: Partial<TicketCategory>) => {
    try {
      if (selectedCategory) {
        await adminTicketCategoryService.update(selectedCategory.id, data)
        toast.success('Category updated successfully')
      } else {
        await adminTicketCategoryService.create(data)
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
        await adminTicketCategoryService.delete(selectedCategory.id)
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

  const toggleStatus = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter([])
    fetchCategories(1, pagination.limit, '')
  }

  // Filtering Logic (Local)
  const filteredCategories = categories.filter((category) => {
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(category.status)
    return matchesStatus
  })

  const activeFiltersCount = statusFilter.length

  if (!mounted) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ticket Categories
          </h2>
          <p className="text-muted-foreground">
            Manage your support ticket categories for better organization.
          </p>
        </div>
        <Button className="shadow-sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
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
                checked={statusFilter.includes('active')}
                onCheckedChange={() => toggleStatus('active')}
              >
                {t('common.active')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('inactive')}
                onCheckedChange={() => toggleStatus('inactive')}
              >
                {t('common.inactive')}
              </DropdownMenuCheckboxItem>

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
            {(searchQuery || activeFiltersCount > 0) && (
              <motion.div
                key="clear-filters"
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

      <AnimatePresence mode="wait">
        {(searchQuery || activeFiltersCount > 0) && (
          <motion.div
            key="results-count"
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between py-1 border-b overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <motion.p
              key={pagination.total}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm text-muted-foreground font-medium"
              initial={{ scale: 0.98, opacity: 0 }}
            >
              Showing{' '}
              <span className="text-foreground">
                {Math.min(
                  (pagination.page - 1) * pagination.limit + 1,
                  pagination.total,
                )}
                -
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="text-foreground">{pagination.total}</span>{' '}
              categories
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        <CategoryTable
          categories={filteredCategories}
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
                        : 'cursor-pointer'
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
                      pagination.page >=
                      Math.ceil(pagination.total / pagination.limit)
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? t('common.edit') : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? t('common.updateDetails', 'Update details here.')
                : t('common.enterDetails', 'Enter details to create a new one.')}
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
        <AlertDialogContent>
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
            <AlertDialogCancel>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all active:scale-[0.98]"
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
