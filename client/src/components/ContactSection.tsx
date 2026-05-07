import { useState } from 'react'
import type React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Facebook, Linkedin, Send, Mail, MapPin, Clock } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { ShinyButton } from '@/components/ui/shiny-button'
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

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-12"
    >
      {/* Animated ring */}
      <div className="relative mb-8" style={{ width: 88, height: 88 }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            border: '1px solid rgba(14,165,233,0.35)',
            boxShadow: '0 0 32px rgba(14,165,233,0.2)',
          }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', inset: 12, borderRadius: '50%',
            background: 'rgba(14,165,233,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <motion.path
              d="M5 14.5l6.5 6.5 11.5-13"
              stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="font-display uppercase tracking-wider mb-2"
        style={{ fontSize: '1.4rem', color: '#F1F5F9', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, letterSpacing: '0.06em' }}
      >
        Message sent!
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="font-body text-sm"
        style={{ color: 'rgba(148,163,184,0.6)', lineHeight: 1.65, maxWidth: 280 }}
      >
        I'll get back to you within 48 hours. Looking forward to connecting.
      </motion.p>
    </motion.div>
  )
}

function ContactForm() {
  const [form,    setForm]    = useState<FormState>(INITIAL)
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [focused, setFocused] = useState<string | null>(null)
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
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })
      if (res.ok) { setStatus('success'); trackLead('contact_form'); setForm(INITIAL) }
      else {
        const body = await res.json().catch(() => ({}))
        console.error('[Formspree]', res.status, body)
        setStatus('error')
      }
    } catch (err) {
      console.error('[Formspree] network error', err)
      setStatus('error')
    }
  }

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: focused === name ? 'rgba(14,165,233,0.04)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused === name ? 'rgba(14,165,233,0.55)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '4px',
    padding: '12px 16px',
    color: '#F1F5F9',
    fontSize: '14px',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
    boxShadow: focused === name ? '0 0 0 3px rgba(14,165,233,0.08)' : 'none',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: 'rgba(148,163,184,0.5)',
    marginBottom: '7px',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'color 0.2s ease',
  }

  if (status === 'success') return <SuccessState />

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            name="name" required value={form.name} onChange={handleChange}
            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
            placeholder="Marie Dupont"
            style={fieldStyle('name')}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            name="email" type="email" required value={form.email} onChange={handleChange}
            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
            placeholder="marie@brand.com"
            style={fieldStyle('email')}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Message *</label>
        <textarea
          name="message" required rows={5} value={form.message} onChange={handleChange}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
          placeholder="Tell me about your brand, your project, or your question…"
          style={{ ...fieldStyle('message'), resize: 'vertical', minHeight: 120 }}
        />
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="font-body text-xs"
            style={{ color: '#F87171' }}
          >
            Something went wrong. Email me directly:{' '}
            <a href="mailto:contact@mathisghio.com" style={{ color: '#0EA5E9' }}>contact@mathisghio.com</a>
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <ShinyButton type="submit" disabled={status === 'sending'}>
          <span className="flex items-center gap-2">
            <Send size={13} style={{ flexShrink: 0 }} />
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </span>
        </ShinyButton>
        {status === 'sending' && (
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-body text-xs"
            style={{ color: 'rgba(148,163,184,0.5)' }}
          >
            Sending…
          </motion.span>
        )}
      </div>
    </form>
  )
}

export function ContactSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <>
      <section id="contact" ref={ref} style={{ background: '#08090E' }}>

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
            <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>GET IN</h2>
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: '#0EA5E9' }}>TOUCH</h2>
          </motion.div>
        </LampContainer>

        <div className="container relative z-10 pb-24 lg:pb-36 -mt-[150px] lg:-mt-[200px]">

          {/* Two-column layout */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-6 lg:gap-8 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)' }}
          >

            {/* Left: info panel */}
            <div
              className="rounded-sm p-8 flex flex-col justify-between"
              style={{
                background: 'rgba(14,165,233,0.04)',
                border: '1px solid rgba(14,165,233,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative glow blob */}
              <div className="absolute bottom-0 left-0 pointer-events-none" style={{
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
                transform: 'translate(-30%, 30%)',
              }} />

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="section-line" />
                  <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
                    Reach out
                  </span>
                </div>

                <p className="font-body text-sm mb-8" style={{ color: 'rgba(148,163,184,0.65)', lineHeight: 1.75 }}>
                  Looking for a partnership, a media request, or just want to connect? I read every message personally.
                </p>

                <div className="flex flex-col gap-5 mb-8">
                  <a
                    href="mailto:contact@mathisghio.com"
                    onClick={trackEmailClick}
                    className="flex items-center gap-3 transition-colors duration-200 hover:text-white group"
                    style={{ color: 'rgba(148,163,184,0.7)', textDecoration: 'none' }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center transition-colors duration-200"
                      style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                      <Mail size={14} style={{ color: '#0EA5E9' }} />
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(148,163,184,0.4)', fontSize: '10px', letterSpacing: '0.15em' }}>Email</p>
                      <span className="font-body text-sm" style={{ color: 'rgba(241,245,249,0.8)' }}>contact@mathisghio.com</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-3" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                      <MapPin size={14} style={{ color: '#0EA5E9' }} />
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(148,163,184,0.4)', fontSize: '10px', letterSpacing: '0.15em' }}>Based in</p>
                      <span className="font-body text-sm" style={{ color: 'rgba(241,245,249,0.8)' }}>Marseille, France</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center"
                      style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                      <Clock size={14} style={{ color: '#0EA5E9' }} />
                    </div>
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(148,163,184,0.4)', fontSize: '10px', letterSpacing: '0.15em' }}>Response time</p>
                      <span className="font-body text-sm" style={{ color: 'rgba(241,245,249,0.8)' }}>Within 48 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(148,163,184,0.35)', letterSpacing: '0.18em' }}>Follow</p>
                <div className="flex flex-wrap gap-4">
                  {SOCIAL_CHANNELS.map(({ href, Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
                      style={{ color: 'rgba(148,163,184,0.5)', textDecoration: 'none' }}
                    >
                      <Icon size={14} />
                      <span className="font-body text-xs">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div
              className="rounded-sm p-8"
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
                style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)' }}
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

        </div>
      </section>

      {/* Footer */}
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
