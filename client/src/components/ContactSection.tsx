import { useState } from 'react'
import type React from 'react'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Linkedin, Send, Mail } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { trackEmailClick, trackLead, trackFormStart } from '@/lib/analytics'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqezkppz'

const SOCIAL_CHANNELS = [
  { href: 'https://instagram.com/mathisghio',                               Icon: Instagram, label: '@mathisghio'     },
  { href: 'https://www.facebook.com/MathisGhioWing/',                       Icon: Facebook,  label: 'MathisGhioWing' },
  { href: 'https://www.facebook.com/profile.php?id=100004821571602',        Icon: Facebook,  label: 'Facebook perso' },
  { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a',               Icon: Linkedin,  label: 'Mathis Ghio'   },
]

interface FormState { name: string; email: string; message: string }
const INITIAL: FormState = { name: '', email: '', message: '' }

function ContactForm() {
  const [form,    setForm]    = useState<FormState>(INITIAL)
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!touched) { setTouched(true); trackFormStart() }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Message from ${form.name}` }),
      })
      if (res.ok) { setStatus('success'); trackLead('contact_form'); setForm(INITIAL) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const fieldBorder = (name: string) =>
    focused === name
      ? 'rgba(14,165,233,0.65)'
      : hovered === name
        ? 'rgba(14,165,233,0.35)'
        : 'rgba(255,255,255,0.08)'

  const fieldShadow = (name: string) =>
    focused === name ? '0 0 0 3px rgba(14,165,233,0.09)' : 'none'

  const baseInput: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#F1F5F9',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(148,163,184,0.6)',
    marginBottom: '6px',
    fontFamily: 'DM Sans, sans-serif',
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center py-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(14,165,233,0.08)',
            border: '1px solid rgba(14,165,233,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
            boxShadow: '0 0 24px rgba(14,165,233,0.15)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <motion.path
              d="M4 11.5l5 5 9-9"
              stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
        <p className="font-display" style={{ color: '#F1F5F9', fontSize: '1.25rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' }}>
          Message sent!
        </p>
        <p className="font-body text-sm" style={{ color: 'rgba(148,163,184,0.65)', lineHeight: 1.6 }}>
          I'll get back to you within 48h.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* honeypot */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            name="name" required value={form.name}
            onChange={handleChange}
            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
            onMouseEnter={() => setHovered('name')} onMouseLeave={() => setHovered(null)}
            placeholder="Marie Dupont"
            style={{ ...baseInput, border: `1px solid ${fieldBorder('name')}`, boxShadow: fieldShadow('name') }}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            name="email" type="email" required value={form.email}
            onChange={handleChange}
            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
            onMouseEnter={() => setHovered('email')} onMouseLeave={() => setHovered(null)}
            placeholder="marie@brand.com"
            style={{ ...baseInput, border: `1px solid ${fieldBorder('email')}`, boxShadow: fieldShadow('email') }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Message *</label>
        <textarea
          name="message" required rows={5} value={form.message}
          onChange={handleChange}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
          onMouseEnter={() => setHovered('message')} onMouseLeave={() => setHovered(null)}
          placeholder="Tell me about your brand, your project, or your question…"
          style={{ ...baseInput, border: `1px solid ${fieldBorder('message')}`, boxShadow: fieldShadow('message'), resize: 'vertical', minHeight: 120 }}
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-xs" style={{ color: '#F87171' }}>
          Something went wrong. Email me directly:{' '}
          <a href="mailto:contact@mathisghio.com" style={{ color: '#0EA5E9' }}>contact@mathisghio.com</a>
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-sm font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300"
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: '0.12em',
            background: status === 'sending' ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.3)',
            color: status === 'sending' ? 'rgba(14,165,233,0.5)' : '#0EA5E9',
            cursor: status === 'sending' ? 'not-allowed' : 'pointer',
            boxShadow: status === 'sending' ? 'none' : undefined,
          }}
          onMouseEnter={e => {
            if (status !== 'sending') {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,165,233,0.18)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(14,165,233,0.2)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(14,165,233,0.55)'
            }
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,165,233,0.1)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(14,165,233,0.3)'
          }}
        >
          <Send size={14} style={{ transition: 'transform 0.2s ease' }}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}

export function ContactSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <>
      <section id="contact" ref={ref} style={{ background: '#08090E' }}>

        {/* ── Lamp header ── */}
        <LampContainer className="min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0.5, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="section-line" style={{ background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' }} />
              <span className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(241,245,249,0.6)', letterSpacing: '0.2em' }}>
                Contact
              </span>
            </div>
            <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
              GET IN
            </h2>
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: '#0EA5E9' }}>
              TOUCH
            </h2>
          </motion.div>
        </LampContainer>

        <div className="container relative z-10 pb-24 lg:pb-36 -mt-[150px] lg:-mt-[200px]">

          {/* ── Contact form ── */}
          <div
            className="mb-12 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(24px)',
            }}
          >
            <div
              className="p-8 rounded-sm"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(14,165,233,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top glow edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }}
              />

              <div className="flex items-center gap-3 mb-8">
                <div className="section-line" />
                <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
                  Send a Message
                </span>
              </div>

              <ContactForm />
            </div>
          </div>

          {/* ── Email direct ── */}
          <div
            className="text-center transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '150ms',
            }}
          >
            <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(148,163,184,0.35)', letterSpacing: '0.2em' }}>
              Or reach out directly
            </p>
            <a
              href="mailto:contact@mathisghio.com"
              onClick={trackEmailClick}
              className="inline-flex items-center gap-3 font-display text-white transition-colors duration-300 hover:text-cyan-400"
              style={{ fontSize: 'clamp(18px, 3vw, 36px)', textDecoration: 'none', letterSpacing: '0.02em' }}
            >
              <Mail size={20} style={{ flexShrink: 0, opacity: 0.6 }} />
              contact@mathisghio.com
            </a>
          </div>

          {/* ── Social channels ── */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '280ms',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2rem',
            }}
          >
            {SOCIAL_CHANNELS.map(({ href, Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(148,163,184,0.5)', textDecoration: 'none' }}
              >
                <Icon size={16} />
                <span className="font-body text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 relative" style={{ background: '#050608', borderTop: '1px solid rgba(14,165,233,0.08)' }}>
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
                <span className="font-display text-white text-xs">MG</span>
              </div>
              <span className="font-heading font-semibold text-sm uppercase tracking-wider"
                style={{ color: 'rgba(241,245,249,0.6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.15em' }}>
                Mathis Ghio
              </span>
            </div>
            <p className="font-body text-xs text-center" style={{ color: 'rgba(148,163,184,0.4)' }}>
              © 2026 Mathis Ghio · Wingfoil Racing · Robert Hajduk · Jean Souville · JM. Cornu · Iset Segura
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://instagram.com/mathisghio', icon: Instagram },
                { href: 'https://www.facebook.com/MathisGhioWing', icon: Facebook },
                { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a', icon: Linkedin },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="transition-all duration-200 hover:text-cyan-400"
                  style={{ color: 'rgba(148,163,184,0.4)' }}>
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
