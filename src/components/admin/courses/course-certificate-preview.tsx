'use client'

import { forwardRef } from 'react'
import { QrCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { CourseCertificateConfig } from '@/types/course'
import { cn } from '@/lib/utils'

interface CourseCertificatePreviewProps {
  config: CourseCertificateConfig
  courseTitle: string
  studentName?: string
  completionDate?: string
  certificateId?: string
}

export const CourseCertificatePreview = forwardRef<
  HTMLDivElement,
  CourseCertificatePreviewProps
>(({ config, courseTitle, studentName = 'John Doe', completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }), certificateId = 'CERT-1234-5678' }, ref) => {
  const { t } = useTranslation()

  const variants = {
    modern: {
      container: "bg-white text-slate-900 font-sans border-[12px] border-slate-100",
      accent: config.accent_color || "#3b82f6",
      header: "text-4xl font-black tracking-tighter uppercase mb-2",
      divider: "h-1 w-24 bg-primary mb-8",
      name: "text-6xl font-serif italic my-8 text-slate-800",
    },
    traditional: {
      container: "bg-[#fdfcf0] text-[#2c1810] font-serif border-[20px] border-double border-[#8b5e3c] relative",
      accent: config.accent_color || "#8b5e3c",
      header: "text-3xl font-bold uppercase tracking-[0.2em] mb-4 border-b-2 border-[#8b5e3c] pb-2 px-8",
      divider: "hidden",
      name: "text-5xl font-bold italic my-10 font-[cursive]",
    },
    technical: {
      container: "bg-slate-950 text-slate-100 font-mono border-2 border-slate-800 p-2 relative overflow-hidden",
      accent: config.accent_color || "#06b6d4",
      header: "text-2xl font-bold tracking-widest uppercase mb-4 text-cyan-400",
      divider: "h-[1px] w-full bg-slate-800 mb-8",
      name: "text-5xl font-bold text-white my-8",
    }
  }

  const v = (config?.variant && variants[config.variant]) || variants.modern

  return (
    <div className="w-full flex justify-center bg-muted/20 p-8 rounded-2xl overflow-hidden min-h-[500px] items-center">
      <div
        ref={ref}
        className={cn(
          "relative shadow-2xl transition-all duration-500 overflow-hidden print:shadow-none print:m-0",
          v.container
        )}
        style={{
          width: '100%',
          maxWidth: '1000px',
          aspectRatio: '1.414/1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
          textAlign: 'center'
        }}
      >
        {config.variant === 'technical' && (
          <>
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/30 -translate-x-16 -translate-y-16" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyan-500/30 translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyan-500/30 -translate-x-16 translate-y-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30 translate-x-16 translate-y-16" />
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </>
        )}

        {config.logo_url ? (
          <img 
            alt="Logo" 
            className="h-16 mb-8 object-contain" 
            src={config.logo_url} 
          />
        ) : (
          <div className="h-16 mb-8 flex items-center justify-center">
            <span className="text-2xl font-black italic tracking-tighter">
              MADACODA<span className="text-primary">.</span>
            </span>
          </div>
        )}

        <h1 className={v.header}>
          {config.title || t('courses.certificateTitle', 'Certificate of Achievement')}
        </h1>
        
        <div className={v.divider} />
        
        <p className="text-xl uppercase tracking-widest opacity-60 mb-2">
          {config.subtitle || t('courses.certificateSubtitle', 'This is to certify that')}
        </p>

        <h2 className={cn(v.name, "px-4")}>
          {studentName}
        </h2>

        <p className="text-xl opacity-80 max-w-[80%] mx-auto leading-relaxed">
          {t('courses.certificateBody', 'has successfully completed the course requirements for')}
        </p>
        
        <h3 className="text-3xl font-bold mt-4 mb-12 px-6">
          {courseTitle}
        </h3>

        <div className="mt-auto w-full grid grid-cols-3 items-end pt-8">
          <div className="text-left space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">
              {t('common.date', 'Issued Date')}
            </p>
            <p className="text-lg font-medium">{completionDate}</p>
            <p className="text-sm border-t pt-2 opacity-60">
              {config.issuing_authority || 'Madacoda Engineering System'}
            </p>
          </div>

          <div className="flex justify-center flex-col items-center gap-4">
            {config.show_qr && (
              <div className="p-2 border rounded-lg bg-white shadow-sm">
                <QrCode className="h-16 w-16 text-slate-800" />
              </div>
            )}
            <p className="text-[10px] font-mono opacity-40 uppercase">
              Verify at mclara.test/verify/{certificateId}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="mb-2 h-16 flex items-end">
              <span className="font-[cursive] text-4xl italic border-b-2 border-slate-300 px-4 pb-2">
                {config.signature_name}
              </span>
            </div>
            <p className="text-base font-bold">{config.signature_name}</p>
            <p className="text-xs opacity-60">{config.signature_title}</p>
          </div>
        </div>

        {config.variant === 'traditional' && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-[#8b5e3c]/20" />
        )}
      </div>
    </div>
  )
})

CourseCertificatePreview.displayName = 'CourseCertificatePreview'
