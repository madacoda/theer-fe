import { useNavigate, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
  UserCheck,
} from 'lucide-react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ticketService } from '@/services/admin/ticket.service'
import { adminRoute } from '@/routes/_admin'
import { User } from '@/types/auth'
import { Ticket } from '@/types/ticket'

interface TicketDetailPageProps {
  ticketId?: string
  isModal?: boolean
  onClose?: () => void
  isAdmin?: boolean
}

export function TicketDetailPage({ ticketId, isModal, onClose, isAdmin: propIsAdmin }: TicketDetailPageProps) {
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { ticketId?: string }
  const id = ticketId || params.ticketId

  const context = adminRoute.useRouteContext() as { user: User; isAdmin: boolean }
  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : context.isAdmin

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [editedDraft, setEditedDraft] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTicket()
    }
  }, [id, isAdmin])

  const fetchTicket = async () => {
    try {
      const data = await ticketService.getTicket(id!, isAdmin)
      setTicket(data)
      setEditedDraft(data.ai_draft || '')
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
      toast.error('Could not load ticket details')
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async () => {
    if (!ticket) return
    setIsResolving(true)
    try {
      await ticketService.resolveTicket(ticket.uuid, {
        final_response: editedDraft,
        status: 'resolved',
      })
      toast.success('Ticket resolved successfully')
      if (isModal) {
        onClose?.()
      } else {
        navigate({ to: '/ticket' })
      }
    } catch (error) {
      toast.error('Failed to resolve ticket')
    } finally {
      setIsResolving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
        <Button variant="link" onClick={() => navigate({ to: '/ticket' })}>
          Back to list
        </Button>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    processed: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    resolved: 'bg-green-50 text-green-700 border-green-100',
    failed: 'bg-red-50 text-red-700 border-red-100',
  }

  return (
    <div className={`flex flex-col h-full bg-background ${isModal ? 'p-8' : 'container mx-auto py-10 max-w-4xl'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 hover:bg-muted transition-colors"
            onClick={() => (isModal ? onClose?.() : navigate({ to: '/ticket' }))}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              Title: {ticket.title}
              <Badge 
                variant="outline"
                className={`font-black uppercase text-[10px] px-3 py-0.5 tracking-widest border-2 ${statusColors[ticket.status] || ''}`}
              >
                {ticket.status}
              </Badge>
            </h1>
            {isAdmin && (
              <div className="flex items-center gap-3 mt-1.5 text-muted-foreground text-xs font-medium">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider opacity-60">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {ticket.category?.title || 'General'}
                </span>
                <Separator orientation="vertical" className="h-3" />
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(ticket.created_at), 'MMM dd, yyyy · HH:mm')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-10">
        {/* Description Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Description</h2>
          </div>
          <Card className="border-none shadow-sm bg-muted/20 ring-1 ring-black/5">
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-sm font-medium">
                {ticket.content ?? 'No description provided.'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Resolution Info (Visible if Ticket is Resolved) */}
        {(ticket.resolved_by || ticket.status === 'resolved') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-green-600">
              <UserCheck className="h-4 w-4" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Resolution Details</h2>
            </div>
            
            <div className="space-y-4">
              {ticket.resolved_by && (
                <Card className="border-none shadow-sm bg-green-50/30 ring-1 ring-green-600/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-green-800 opacity-60 tracking-wider">Resolved By</p>
                      <p className="text-sm font-bold text-green-900">{ticket.resolved_by.name}</p>
                      <p className="text-[10px] text-green-700/70 font-bold">
                        {ticket.resolved_at ? format(new Date(ticket.resolved_at), 'MMM dd, yyyy · HH:mm') : 'Recently'}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                       <UserCheck className="h-5 w-5 text-green-700" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {ticket.status === 'resolved' && (
                <Card className="border-none shadow-sm bg-green-50/10 ring-1 ring-green-600/10">
                  <CardContent className="p-6">
                    {!isAdmin && <p className="text-xs font-black uppercase text-green-800 opacity-60 tracking-wider mb-3">Support Response</p>}
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground/90 text-sm font-serif italic">
                      "{ticket.ai_draft}"
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Admin Actions Section */}
        {isAdmin && ticket.status !== 'resolved' && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Admin Workbench</h2>
            </div>

            <Card className="border-2 border-primary/10 shadow-filament pt-6 pb-0">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="p-6">
                    <Textarea 
                      value={editedDraft}
                      onChange={(e) => setEditedDraft(e.target.value)}
                      className="min-h-[200px] shadow-inner font-sans leading-relaxed text-sm bg-background/50 border-none focus-visible:ring-0 p-0 resize-none placeholder:italic"
                      placeholder="Prepare the final resolution..."
                    />
                  </div>
                  
                  <div className="bg-muted/30 border-t p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest space-y-1">
                      <p className="flex justify-between w-40"><span>Urgency:</span> <span className="text-foreground">{ticket.urgency || 'Normal'}</span></p>
                      <p className="flex justify-between w-40"><span>Sentiment:</span> <span className="text-foreground">{ticket.sentiment_score ?? 0}/10</span></p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button 
                        variant="outline"
                        className="flex-1 sm:flex-none border-2 h-11 px-6 font-bold text-xs uppercase tracking-widest hover:bg-destructive/5 hover:text-destructive"
                        onClick={() => {
                          toast.info('Ticket closed.');
                          if (isModal) onClose?.();
                        }}
                      >
                        Close
                      </Button>
                      <Button 
                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-bold h-11 px-8 text-xs uppercase tracking-widest shadow-lg"
                        onClick={handleResolve}
                        disabled={isResolving || !editedDraft}
                      >
                        {isResolving ? (
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-2 h-4 w-4" />
                        )}
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Admin-only Metadata Footer */}
        {isAdmin && (
          <div className="pt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-40 hover:opacity-100 transition-opacity">
             <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest">Requester</p>
              <p className="text-[10px] font-bold">{ticket.created_by?.name || 'User'}</p>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest">Email</p>
              <p className="text-[10px] font-bold lowercase">{ticket.created_by?.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
