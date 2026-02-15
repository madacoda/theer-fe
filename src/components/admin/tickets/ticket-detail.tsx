import { useNavigate, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  MessageSquare, 
  User, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  Smile, 
  Send,
  CheckCircle,
  Edit3
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ticketService } from '@/services/admin/ticket.service'
import { authService } from '@/services/auth.service'
import type { Ticket } from '@/types/ticket'

// Add props interface
interface TicketDetailPageProps {
  ticketId?: string
  isModal?: boolean
  onClose?: () => void
}

export function TicketDetailPage({ ticketId: propTicketId, isModal, onClose }: TicketDetailPageProps) {
  // Use propId if available, otherwise get from params
  const params = useParams({ strict: false }) as { ticketId?: string }
  const ticketId = propTicketId || params.ticketId
  const navigate = useNavigate()
  
  /* State restoration and logic update for modal support */
  const [ticket, setTicket] = React.useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isResolving, setIsResolving] = React.useState(false)
  const [editedDraft, setEditedDraft] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    if (!ticketId) return
    setIsLoading(true)
    try {
      const [profile, ticketData] = await Promise.all([
        authService.getProfile(),
        ticketService.getTicket(ticketId, isAdmin)
      ])
      
      const adminRole = profile.roles?.includes('admin') || profile.email.includes('admin')
      setIsAdmin(adminRole)
      setTicket(ticketData)
      setEditedDraft(ticketData.triage?.ai_draft || '')
    } catch (error) {
      console.error('Failed to fetch ticket detail:', error)
      toast.error('Failed to load ticket details.')
    } finally {
      setIsLoading(false)
    }
  }, [ticketId, isAdmin])

  React.useEffect(() => {
    if (ticketId) {
      fetchData()
    }
  }, [fetchData, ticketId])

  const handleResolve = async () => {
    if (!ticket) return
    setIsResolving(true)
    try {
      await ticketService.resolveTicket(ticket.uuid, {
        final_response: editedDraft,
        status: 'resolved'
      })
      toast.success('Ticket resolved successfully!')
      fetchData()
    } catch (error) {
      console.error('Failed to resolve ticket:', error)
      toast.error('Failed to resolve ticket.')
    } finally {
      setIsResolving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading ticket details...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold">Ticket Not Found</h2>
        <Button variant="link" onClick={() => navigate({ to: '/ticket' })}>Back to list</Button>
      </div>
    )
  }

  const sentimentColor = 
    ticket.triage?.sentiment_score && ticket.triage.sentiment_score > 7 ? 'text-green-500' : 
    ticket.triage?.sentiment_score && ticket.triage.sentiment_score < 4 ? 'text-red-500' : 'text-orange-500'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/ticket' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <Badge variant={ticket.status === 'resolved' ? 'outline' : 'secondary'} className={ticket.status === 'resolved' ? 'bg-green-50 text-green-700' : ''}>
              {ticket.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
            <Clock className="h-3.5 w-3.5" />
            Submitted on {format(new Date(ticket.created_at), 'MMMM do, yyyy HH:mm')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-none bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {ticket.status === 'resolved' ? (
            <Card className="shadow-md border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Resolution Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-background rounded-lg border border-green-100 shadow-sm leading-relaxed">
                  {ticket.triage?.ai_draft}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Zap className="h-5 w-5 fill-primary" />
                    AI-Suggested Response
                  </CardTitle>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="mr-2 h-3.5 w-3.5" />
                      {isEditing ? 'View Draft' : 'Edit Draft'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={editedDraft}
                      onChange={(e) => setEditedDraft(e.target.value)}
                      className="min-h-[200px] shadow-inner font-sans leading-relaxed"
                      placeholder="Type your response here..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditedDraft(ticket.triage?.ai_draft || ''); setIsEditing(false); }}>
                        Discard
                      </Button>
                      <Button size="sm" onClick={() => setIsEditing(false)}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none italic text-muted-foreground leading-relaxed">
                    {editedDraft || 'Draft being generated by AI...'}
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-8 pt-6 border-t flex justify-end">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-200 px-8"
                      onClick={handleResolve}
                      disabled={isResolving || !editedDraft}
                    >
                      {isResolving ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Finalize & Resolve Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                AI Triage Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">AI Category</label>
                <div className="p-3 bg-muted/30 rounded-lg flex items-center justify-between border">
                  <span className="font-semibold">{ticket.triage?.category || 'Not Classified'}</span>
                  <Badge variant="outline" className="text-[10px] uppercase font-black opacity-50">Auto</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Urgency Level</label>
                <div className={`p-3 rounded-lg flex items-center justify-between border ${
                  ticket.triage?.urgency === 'High' ? 'bg-red-50 border-red-100' : 
                  ticket.triage?.urgency === 'Medium' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'
                }`}>
                  <span className={`font-bold ${
                    ticket.triage?.urgency === 'High' ? 'text-red-700' : 
                    ticket.triage?.urgency === 'Medium' ? 'text-orange-700' : 'text-green-700'
                  }`}>
                    {ticket.triage?.urgency || 'Determining...'}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1.5 w-3 rounded-full ${
                        ticket.triage?.urgency === 'High' ? 'bg-red-300' : 
                        ticket.triage?.urgency === 'Medium' ? (i < 3 ? 'bg-orange-300' : 'bg-muted') : 
                        (i === 1 ? 'bg-green-300' : 'bg-muted')
                      }`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Sentiment Score</label>
                <div className="p-4 bg-muted/10 rounded-xl border flex items-center gap-4">
                  <div className={`text-3xl font-black ${sentimentColor}`}>
                    {ticket.triage?.sentiment_score || '0'}
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full relative overflow-hidden">
                    <motion.div 
                      className={`absolute inset-y-0 left-0 rounded-full ${
                        ticket.triage?.sentiment_score && ticket.triage.sentiment_score > 7 ? 'bg-green-500' : 
                        ticket.triage?.sentiment_score && ticket.triage.sentiment_score < 4 ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(ticket.triage?.sentiment_score || 0) * 10}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <Smile className={`h-6 w-6 ${sentimentColor}`} />
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">1 = Angry, 10 = Delightful</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">User ID</p>
                <p className="font-semibold">#{ticket.user_id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="font-semibold">{ticket.created_by?.name || 'Loading...'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{ticket.created_by?.email || 'Loading...'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
