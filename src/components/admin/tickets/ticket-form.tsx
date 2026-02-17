import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ticketService } from '@/services/admin/ticket.service'
import type { TicketCategoryOption } from '@/types/ticket'

const ticketSchema = z.object({
  title: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  category_id: z.string().min(1, { message: 'Please select a category' }),
})

type TicketFormValues = z.infer<typeof ticketSchema>

interface TicketFormProps {
  onSubmit: (data: TicketFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function TicketForm({ onSubmit, onCancel, isLoading }: TicketFormProps) {
  const { t } = useTranslation()
  const [categories, setCategories] = React.useState<TicketCategoryOption[]>([])

  React.useEffect(() => {
    ticketService.getCategories().then(setCategories).catch(console.error)
  }, [])

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: '',
      content: '',
      category_id: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 admin-theme">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Short summary of your issue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the most relevant category for faster triage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about your complaint or feedback..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6">
          <Button 
            className="hover:bg-accent/50 transition-all duration-200"
            type="button" 
            variant="ghost" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 shadow-filament hover:shadow-filament-hover active:scale-[0.98] transition-all duration-200 px-8 font-semibold"
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Ticket
          </Button>
        </div>
      </form>
    </Form>
  )
}
