'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Layout,
  Plus,
  Trash2,
  Video,
} from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RichEditor } from '@/components/ui/rich-editor'
import { Textarea } from '@/components/ui/textarea'

export function CourseModulesInput() {
  const { t } = useTranslation()
  const { control } = useFormContext()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'modules',
  })

  const handleAddModule = () => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      content: '',
      video: '',
      order: fields.length,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('courses.modules')}</h3>
        </div>
        <Button
          className="gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
          size="sm"
          type="button"
          variant="outline"
          onClick={handleAddModule}
        >
          <Plus className="h-4 w-4" />
          {t('courses.addModule')}
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {fields.length === 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
            >
              <Layout className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">{t('courses.noModules')}</p>
            </motion.div>
          ) : (
            fields.map((field, index) => (
              <motion.div
                key={field.id}
                layout
                animate={{ opacity: 1, x: 0 }}
                className="group relative flex gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 border-primary/5 hover:border-primary/20"
                exit={{ opacity: 0, scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center gap-1 pt-2">
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    disabled={index === 0}
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => index > 0 && move(index, index - 1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <Button
                    className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                    disabled={index === fields.length - 1}
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      index < fields.length - 1 && move(index, index + 1)
                    }
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-4">
                    <FormField
                      control={control}
                      name={`modules.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              className="font-semibold text-base border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all h-auto p-2"
                              placeholder={t('courses.moduleTitle')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={control}
                    name={`modules.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[40px] resize-none border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all p-2 text-sm text-muted-foreground"
                            placeholder={t(
                              'courses.moduleDescription',
                              'Short description',
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                    <FormField
                      control={control}
                      name={`modules.${index}.video`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <Video className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold">
                              {t('courses.moduleVideo')}
                            </span>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                className="pl-9 bg-muted/20 border-muted-foreground/10 focus-visible:ring-primary/30 transition-all shadow-none"
                                placeholder="https://youtube.com/watch?v=..."
                              />
                              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            </div>
                          </FormControl>
                          <p className="text-[10px] text-muted-foreground">
                            {t('courses.videoHint')}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`modules.${index}.content`}
                      render={({ field }) => (
                        <FormItem className="space-y-3 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold">
                              {t('courses.moduleContent')}
                            </span>
                          </div>
                          <FormControl>
                            <div className="rounded-lg border bg-background/50 overflow-hidden ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                              <RichEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
