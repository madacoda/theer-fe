'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import type { User } from '@/types/user'
import { adminUserService } from '@/services/admin/user.service'

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.string().min(1, 'Role is required'), // Allow dynamic roles
    status: z.enum(['active', 'inactive']),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, validation requires confirmation to match
      if (data.password && data.password !== data.password_confirmation) {
        return false
      }
      return true
    },
    {
      message: "Passwords don't match",
      path: ['password_confirmation'],
    },
  )

type UserFormValues = z.infer<typeof formSchema>

interface UserFormProps {
  user?: User
  onSubmit: (data: Partial<UserFormValues>) => Promise<void>
  onCancel: () => void
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [roles, setRoles] = useState<{ id: number; label: string }[]>([])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role, // This might need mapping if user.role is a name but we need ID
          status: user.status,
          password: '',
          password_confirmation: '',
        }
      : {
          name: '',
          email: '',
          role: '', // Will be set after fetch
          status: 'active',
          password: '',
          password_confirmation: '',
        },
  })

  // Fetch roles and set default role for new users
  useEffect(() => {
    adminUserService.getRoles().then((data) => {
      setRoles(data)
      if (!user && data.length > 0) {
        // Set default role to 'User' if creating new
        const userRole = data.find((r: { label: string }) => r.label.toLowerCase() === 'user')
        if (userRole) {
          form.setValue('role', String(userRole.id))
        }
      }
    }).catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true)
    try {
      // Filter out empty password fields if not set, to avoid sending empty strings
      const payload = { ...values }
      if (!payload.password) delete payload.password
      if (!payload.password_confirmation) delete payload.password_confirmation

      await onSubmit(payload)
    } catch (error: any) {
      console.error('Form submission error:', error)
      const responseData = error.response?.data

      if (responseData?.errors) {
        const serverErrors = responseData.errors
        Object.keys(serverErrors).forEach((key) => {
          const errorObj = serverErrors[key]
          const message =
            typeof errorObj === 'string'
              ? errorObj
              : (Object.values(errorObj)[0] as string)
          form.setError(key as any, { type: 'server', message })
        })
      } else if (responseData?.message) {
        form.setError('root', { message: responseData.message })
      } else if (responseData?.data && typeof responseData.data === 'object') {
        const serverErrors = responseData.data
        Object.keys(serverErrors).forEach((key) => {
          const errorObj = serverErrors[key]
          const message =
            typeof errorObj === 'string'
              ? errorObj
              : (Object.values(errorObj)[0] as string)
          form.setError(key as any, { type: 'server', message })
        })
      } else {
        form.setError('root', { message: 'An unexpected error occurred.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate spacing based on errors directly in the className logic or use a helper,
  // but here we'll just use a consistent spacious layout that accommodates errors gracefully.
  // We can use 'space-y-6' on the form to give more room.

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
        {form.formState.errors.root && (
          <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md font-medium">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.name', 'Name')}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.password', 'Password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={
                        user ? 'Leave blank to keep current' : 'Enter password'
                      }
                      {...field}
                    />
                    <Button
                      className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('common.confirmPassword', 'Confirm Password')}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={
                        user
                          ? 'Leave blank to keep current'
                          : 'Confirm password'
                      }
                      {...field}
                    />
                    <Button
                      className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.role')}</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('common.selectRole', 'Select a role')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.status')}</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('common.selectStatus', 'Select status')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t('common.active')}</SelectItem>
                    <SelectItem value="inactive">
                      {t('common.inactive')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            className="hover:bg-accent/50 transition-all duration-200"
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 shadow-filament hover:shadow-filament-hover active:scale-[0.98] transition-all duration-200 px-8"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {user ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
