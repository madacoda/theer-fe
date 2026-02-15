import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Blog } from '@/types/blog'

interface BlogTableProps {
  blogs: Blog[]
  onDelete: (blog: Blog) => void
  onEdit: (blog: Blog) => void
  isLoading?: boolean
  pageSize?: number
}

export function BlogTable({
  blogs,
  onDelete,
  onEdit,
  isLoading,
  pageSize = 10,
}: BlogTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px]">Thumbnail</TableHead>
            <TableHead>Title & Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                <TableCell>
                  <Skeleton className="h-12 w-16 rounded-lg" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : blogs.length === 0 ? (
            <TableRow>
              <TableCell
                className="h-32 text-center text-muted-foreground font-medium"
                colSpan={5}
              >
                No blog posts found.
              </TableCell>
            </TableRow>
          ) : (
            blogs.map((blog) => (
              <TableRow
                key={blog.id}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted border shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img
                      alt={blog.title}
                      className="h-full w-full object-cover"
                      src={
                        blog.thumbnail ||
                        'https://placehold.co/100x70?text=No+Image'
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-base leading-none group-hover:text-primary transition-colors">
                      {blog.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4.5 border-primary/20 bg-primary/5 text-primary"
                        variant="outline"
                      >
                        {blog.category?.name || 'Uncategorized'}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full px-3 py-0.5 font-bold transition-all shadow-sm ${
                      blog.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}
                  >
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground font-medium">
                  {blog.published_at ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(blog.published_at), 'PPP')}
                    </div>
                  ) : (
                    <span className="italic text-slate-400">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl shadow-xl border-slate-200"
                    >
                      <DropdownMenuLabel className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-3 py-2">
                        Management
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 py-2.5 hover:bg-muted"
                        onClick={() => onEdit(blog)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                        Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => onDelete(blog)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
