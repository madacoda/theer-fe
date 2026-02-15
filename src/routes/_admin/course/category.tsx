import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { CourseCategoryForm } from '@/components/admin/course-categories/course-category-form'
import { CourseCategoryTable } from '@/components/admin/course-categories/course-category-table'
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
import type { CourseCategory } from '@/types/course'

import { adminCourseCategoryService } from '@/services/admin/course-category.service'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/course/category')({
  component: CourseCategoriesPage,
})

function CourseCategoriesPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)

  const [categories, setCategories] = React.useState<CourseCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<
    CourseCategory | undefined
  >()

  const [searchQuery, setSearchQuery] = React.useState('')

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await adminCourseCategoryService.getAll({
        search: searchQuery,
      })
      setCategories(res.categories)
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  React.useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setSelectedCategory(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (category: CourseCategory) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (category: CourseCategory) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: { name: string; description?: string }) => {
    try {
      if (selectedCategory) {
        await adminCourseCategoryService.update(selectedCategory.id, data)
        toast.success(t('common.updateSuccess', 'Category updated successfully'))
      } else {
        await adminCourseCategoryService.create(data)
        toast.success(t('common.createSuccess', 'Category created successfully'))
      }
      setIsFormOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Failed to save category')
    }
  }

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await adminCourseCategoryService.delete(selectedCategory.id)
        toast.success(t('common.deleteSuccess', 'Category deleted successfully'))
        setIsDeleteDialogOpen(false)
        setSelectedCategory(undefined)
        fetchData()
      } catch (error) {
        toast.error('Failed to delete category')
      }
    }
  }

  // Filtering Logic
  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase()
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    )
  })

  if (!mounted) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('courseCategories.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('courseCategories.description')}
          </p>
        </div>
        <Button className="shadow-sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> {t('courseCategories.addCategory')}
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
          <AnimatePresence>
            {searchQuery && (
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
                  onClick={() => setSearchQuery('')}
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
        {searchQuery && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between py-1 border-b overflow-hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <motion.p
              key={filteredCategories.length}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm text-muted-foreground font-medium"
              initial={{ scale: 0.98, opacity: 0 }}
            >
              Showing{' '}
              <span className="text-foreground">
                {filteredCategories.length}
              </span>{' '}
              of <span className="text-foreground">{categories.length}</span>{' '}
              categories
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <CourseCategoryTable
          categories={filteredCategories}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] admin-theme">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory
                ? t('common.edit')
                : t('courseCategories.addCategory')}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? t('common.updateDetails', 'Update details here.')
                : t(
                    'common.enterDetails',
                    'Enter details to create a new one.',
                  )}
            </DialogDescription>
          </DialogHeader>
          <CourseCategoryForm
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
                {selectedCategory?.name}
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
