'use client'

import {
  Award,
  Check,
  Layout,
  Palette,
  Settings2,
  Type,
  Download,
  Loader2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CourseCertificatePreview } from './course-certificate-preview'

const VARIANTS = [
  {
    id: 'modern',
    name: 'Modern & Clean',
    description: 'Minimalist design with bold typography',
    icon: Layout,
    color: 'bg-blue-500',
  },
  {
    id: 'traditional',
    name: 'Traditional / Formal',
    description: 'Elegant with decorative borders and serif fonts',
    icon: Award,
    color: 'bg-amber-700',
  },
  {
    id: 'technical',
    name: 'Technical / Dark',
    description: 'High-tech aesthetic with monospaced fonts',
    icon: Settings2,
    color: 'bg-slate-900',
  },
] as const

export function CourseCertificateSettings() {
  const { t } = useTranslation()
  const { control, watch } = useFormContext()

  const config = watch('certificate_config')
  const courseTitle = watch('title') || 'Complete Course Title'

  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      setIsDownloading(true)
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4, // Very high resolution for printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${courseTitle.toLowerCase().replace(/\s+/g, '-')}-certificate.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {t('courses.certificateSettings', 'Certificate Designer')}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-bold flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('courses.chooseVariant', 'Choose Style')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={control}
                name="certificate_config.variant"
                render={({ field }) => (
                  <>
                    {VARIANTS.map((v) => (
                      <button
                        key={v.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 group',
                          field.value === v.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'hover:border-primary/50 hover:bg-muted/50',
                        )}
                        type="button"
                        onClick={() => field.onChange(v.id)}
                      >
                        <div
                          className={cn(
                            'p-2 rounded-lg transition-transform group-hover:scale-110 shadow-sm',
                            v.color,
                            'text-white',
                          )}
                        >
                          <v.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{v.name}</span>
                            {field.value === v.id && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {v.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-muted/30 space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 border-b pb-2">
              <Type className="h-4 w-4" />
              {t('courses.certificateContent', 'Custom Content')}
            </h4>

            <FormField
              control={control}
              name="certificate_config.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider opacity-60">
                    Headline
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 rounded-lg"
                      placeholder="e.g. Certificate of Achievement"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="certificate_config.issuing_authority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-wider opacity-60">
                    Organization
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-10 rounded-lg"
                      placeholder="e.g. Madacoda Engineering System"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="certificate_config.signature_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider opacity-60">
                      Signatory Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 rounded-lg"
                        placeholder="John Madacoda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="certificate_config.signature_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-wider opacity-60">
                      Signatory Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 rounded-lg"
                        placeholder="CTO & Founder"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="certificate_config.show_qr"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-bold">
                      Verification QR Code
                    </FormLabel>
                    <FormDescription className="text-[10px]">
                      Include a code for instant verification
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="sticky top-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" />
                <label className="text-sm font-extrabold uppercase tracking-tight">
                  {t('common.preview', 'Live Preview')}
                </label>
              </div>
              
              <Button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-10 font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex-shrink-0"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {t('common.downloadPreview', 'Download PDF')}
              </Button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono opacity-50 px-1">
              <span>CANVAS RENDERER (v4.0)</span>
              <span>A4 LANDSCAPE (297x210mm)</span>
            </div>

            <div className="border border-dashed rounded-2xl p-4 bg-muted/5">
              <CourseCertificatePreview
                ref={certificateRef}
                config={config}
                courseTitle={courseTitle}
              />
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary/80 leading-relaxed italic">
              <strong>Tip:</strong> This preview is exactly what the user will
              see. When generated as a PDF, it will use high-resolution vector
              assets and proper paper metadata for professional printing.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
