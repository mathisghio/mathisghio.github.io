import { useState, useRef, useEffect } from 'react'
import type React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ShinyButton } from '@/components/ui/shiny-button'
import { trackLead, trackFormStart } from '@/lib/analytics'
import { sendConfirmation } from '@/lib/emailjs'

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contact@mathisghio.com'

interface FormState {
  name: string
  company: string
  role: string
  email: string
  message: string
}

const INITIAL: FormState = { name: '', company: '', role: '', email: '', message: '' }

interface Props {
  trigger?: React.ReactNode
}

export function PartnershipFormModal({ trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [touched, setTouched] = useState(false)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'success') return
    successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const t = setTimeout(() => setOpen(false), 10000)
    return () => clearTimeout(t)
  }, [status])

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) setTimeout(() => setStatus('idle'), 300)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!touched) {
      setTouched(true)
      trackFormStart()
    }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:      form.name,
          email:     form.email,
          _replyto:  form.email,
          company:   form.company,
          role:      form.role,
          message:   form.message,
          _subject:      `Partnership inquiry from ${form.company} — ${form.name}`,
          _captcha:      'false',
          _template:     'table',
          _autoresponse: `Hi ${form.name},\n\nThank you for reaching out! Mathis has received your partnership inquiry and will get back to you within 48 hours.\n\nBest,\nMathis Ghio`,
        }),
      })
      if (res.ok) {
        setStatus('success')
        trackLead('partnership_form')
        sendConfirmation(form.name.split(' ')[0], form.email)
        setForm(INITIAL)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(14,165,233,0.2)',
    borderRadius: '4px',
    padding: '10px 14px',
    color: '#F1F5F9',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(148,163,184,0.75)',
    marginBottom: '6px',
    fontFamily: 'DM Sans, sans-serif',
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? <ShinyButton>Become a Partner</ShinyButton>}
      </DialogTrigger>

      <DialogContent
        className="max-w-lg border-0 p-0 overflow-hidden"
        style={{ background: '#0D0F17', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '8px' }}
      >
        <div style={{ padding: '32px' }}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: '32px', height: '1px', background: '#0EA5E9' }} />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0EA5E9', fontFamily: 'DM Sans, sans-serif' }}>
                Partnership
              </span>
            </div>
            <DialogTitle
              className="font-display"
              style={{ fontSize: '28px', color: '#F1F5F9', lineHeight: 1.1, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}
            >
              WORK WITH MATHIS
            </DialogTitle>
            <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.75)', marginTop: '6px', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
              Sponsorships, product development, brand activations, and long-term partnerships.
            </p>
          </DialogHeader>

          {status === 'success' ? (
            <div ref={successRef} style={{ marginTop: '32px', textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4 4 8-8" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ color: '#F1F5F9', fontSize: '16px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, marginBottom: '8px' }}>Message sent!</p>
              <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif' }}>
                Mathis will get back to you within 48h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* honeypot anti-spam — Formspree rejette toute soumission qui remplit ce champ */}
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Your name *</label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Marie Dupont" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Company *</label>
                  <input name="company" required value={form.company} onChange={handleChange} placeholder="Ozone Kites" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Your role</label>
                  <input name="role" value={form.role} onChange={handleChange} placeholder="Marketing Director" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="marie@brand.com" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your brand and what kind of partnership you have in mind..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: '12px', color: '#F87171', fontFamily: 'DM Sans, sans-serif' }}>
                  Something went wrong. Email directly: <a href="mailto:contact@mathisghio.com" style={{ color: '#0EA5E9' }}>contact@mathisghio.com</a>
                </p>
              )}

              <div style={{ marginTop: '4px' }}>
                <ShinyButton type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send Partnership Request'}
                </ShinyButton>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
