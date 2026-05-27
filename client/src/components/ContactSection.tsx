import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Instagram, Facebook, Linkedin, Send, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { ShinyButton } from '@/components/ui/shiny-button'
import { useInView } from '@/hooks/useInView'
import { trackEmailClick, trackLead, trackFormStart, trackSocialClick } from '@/lib/analytics'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqezkppz'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SOCIAL_CHANNELS = [
  { href: 'https://instagram.com/mathisghio',                         Icon: Instagram, label: '@mathisghio',     platform: 'instagram' },
  { href: 'https://www.facebook.com/MathisGhioWing/',                 Icon: Facebook,  label: 'MathisGhioWing', platform: 'facebook'  },
  { href: 'https://www.facebook.com/profile.php?id=100004821571602',  Icon: Facebook,  label: 'Facebook perso', platform: 'facebook'  },
  { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a',        Icon: Linkedin,  label: 'Mathis Ghio',    platform: 'linkedin'  },
]

function SocialPill({ href, Icon, label, onClick }: { href: string; Icon: React.ElementType; label: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '5px 11px', borderRadius: 100,
        background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
        color: hov ? 'rgba(241,245,249,0.9)' : 'rgba(148,163,184,0.5)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <Icon size={12} />
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}>{label}</span>
    </a>
  )
}

function InfoRow({
  icon: Icon, sublabel, value, href, onClick,
}: {
  icon: React.ElementType; sublabel: string; value: string; href?: string; onClick?: () => void
}) {
  const [hov, setHov] = useState(false)
  const inner = (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 6,
        background: hov ? 'rgba(14,165,233,0.055)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(14,165,233,0.18)' : 'transparent'}`,
        transform: hov ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.22s ease',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      <div style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: 6,
        background: hov ? 'rgba(14,165,233,0.14)' : 'rgba(14,165,233,0.08)',
        border: `1px solid ${hov ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.22s ease',
        boxShadow: hov ? '0 0 12px rgba(14,165,233,0.15)' : 'none',
      }}>
        <Icon size={15} style={{ color: '#0EA5E9' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'rgba(148,163,184,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'DM Sans, sans-serif', marginBottom: 2 }}>
          {sublabel}
        </p>
        <span style={{ color: hov ? 'rgba(241,245,249,1)' : 'rgba(241,245,249,0.8)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', transition: 'color 0.22s ease' }}>
          {value}
        </span>
      </div>
      {href && (
        <ArrowUpRight
          size={14}
          style={{ color: hov ? 'rgba(14,165,233,0.7)' : 'rgba(148,163,184,0.2)', transition: 'color 0.22s ease', flexShrink: 0 }}
        />
      )}
    </div>
  )
  if (href) return (
    <a href={href} onClick={onClick} style={{ textDecoration: 'none', display: 'block', margin: '0 -12px' }}>
      {inner}
    </a>
  )
  return <div style={{ margin: '0 -12px' }}>{inner}</div>
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-12"
    >
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
        style={{ fontSize: '1.4rem', color: '#F1F5F9', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}
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
  const formRef      = useRef<HTMLFormElement>(null)
  const emailRef     = useRef<HTMLInputElement>(null)
  const [status,     setStatus]     = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [focused,    setFocused]    = useState<string | null>(null)
  const [hovered,    setHovered]    = useState<string | null>(null)
  const [touched,    setTouched]    = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [msgLen,     setMsgLen]     = useState(0)

  const saved = useRef<Record<string, string>>({})
  useEffect(() => {
    try { saved.current = JSON.parse(localStorage.getItem('mg-contact') || '{}') } catch { /* noop */ }
  }, [])

  const handleInput = () => { if (!touched) { setTouched(true); trackFormStart() } }

  const handleEmailBlur = () => {
    setFocused(null)
    const val = emailRef.current?.value || ''
    if (val) setEmailError(EMAIL_RE.test(val) ? null : 'Adresse e-mail invalide')
  }

  const handleEmailInput = (e: React.FormEvent<HTMLInputElement>) => {
    handleInput()
    if (emailError && EMAIL_RE.test((e.target as HTMLInputElement).value)) setEmailError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const emailVal = emailRef.current?.value || ''
    if (!EMAIL_RE.test(emailVal)) {
      setEmailError('Adresse e-mail invalide')
      emailRef.current?.focus()
      return
    }
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    const payload = {
      firstName: data.get('firstName') as string,
      lastName:  data.get('lastName')  as string,
      email:     emailVal,
      message:   data.get('message')   as string,
    }
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        try {
          localStorage.setItem('mg-contact', JSON.stringify({
            firstName: payload.firstName,
            lastName:  payload.lastName,
            email:     payload.email,
          }))
        } catch { /* noop */ }
        setStatus('success'); trackLead('contact_form')
        formRef.current?.reset()
        setMsgLen(0)
        setTimeout(() => setStatus('idle'), 6000)
      } else {
        const body = await res.json().catch(() => ({}))
        console.error('[Formspree]', res.status, body)
        setStatus('error')
      }
    } catch (err) {
      console.error('[Formspree] network error', err)
      setStatus('error')
    }
  }

  const fieldBorder = (name: string, error?: boolean) => {
    if (error) return 'rgba(248,113,113,0.55)'
    if (focused === name) return 'rgba(14,165,233,0.55)'
    if (hovered === name) return 'rgba(255,255,255,0.16)'
    return 'rgba(255,255,255,0.08)'
  }
  const fieldBg = (name: string, error?: boolean) => {
    if (error) return 'rgba(248,113,113,0.04)'
    if (focused === name) return 'rgba(14,165,233,0.04)'
    if (hovered === name) return 'rgba(255,255,255,0.045)'
    return 'rgba(255,255,255,0.03)'
  }
  const fieldShadow = (name: string, error?: boolean) => {
    if (error) return '0 0 0 3px rgba(248,113,113,0.08)'
    if (focused === name) return '0 0 0 3px rgba(14,165,233,0.08)'
    return 'none'
  }

  const fieldStyle = (name: string, error?: boolean): React.CSSProperties => ({
    width: '100%',
    background: fieldBg(name, error),
    border: `1px solid ${fieldBorder(name, error)}`,
    borderRadius: 4,
    padding: '12px 16px',
    color: '#F1F5F9',
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
    boxShadow: fieldShadow(name, error),
  })

  const labelStyle = (name: string, error?: boolean): React.CSSProperties => ({
    display: 'block',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: error
      ? 'rgba(248,113,113,0.8)'
      : focused === name ? 'rgba(14,165,233,0.85)' : 'rgba(148,163,184,0.5)',
    marginBottom: 7,
    fontFamily: 'DM Sans, sans-serif',
    transition: 'color 0.2s ease',
  })

  if (status === 'success') return (
    <AnimatePresence>
      <SuccessState key="success" />
    </AnimatePresence>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} autoComplete="on" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" style={labelStyle('firstName')}>Prénom *</label>
          <input
            id="firstName" name="firstName" required
            defaultValue={saved.current.firstName || ''}
            onFocus={() => setFocused('firstName')} onBlur={() => setFocused(null)}
            onMouseEnter={() => setHovered('firstName')} onMouseLeave={() => setHovered(null)}
            onInput={handleInput}
            placeholder="Marie" autoComplete="given-name"
            style={fieldStyle('firstName')}
          />
        </div>
        <div>
          <label htmlFor="lastName" style={labelStyle('lastName')}>Nom *</label>
          <input
            id="lastName" name="lastName" required
            defaultValue={saved.current.lastName || ''}
            onFocus={() => setFocused('lastName')} onBlur={() => setFocused(null)}
            onMouseEnter={() => setHovered('lastName')} onMouseLeave={() => setHovered(null)}
            onInput={handleInput}
            placeholder="Dupont" autoComplete="family-name"
            style={fieldStyle('lastName')}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle('email', !!emailError)}>Email *</label>
        <input
          ref={emailRef}
          id="email" name="email" type="email" required
          defaultValue={saved.current.email || ''}
          onFocus={() => setFocused('email')} onBlur={handleEmailBlur}
          onMouseEnter={() => setHovered('email')} onMouseLeave={() => setHovered(null)}
          onInput={handleEmailInput}
          placeholder="marie@brand.com" autoComplete="email"
          style={fieldStyle('email', !!emailError)}
        />
        <AnimatePresence>
          {emailError && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <p className="font-body text-xs mt-1.5 flex items-center gap-1.5"
                style={{ color: 'rgba(248,113,113,0.85)' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="6" cy="6" r="5.25" stroke="rgba(248,113,113,0.7)" strokeWidth="1.5" />
                  <path d="M6 3.5v3M6 8.5v.25" stroke="rgba(248,113,113,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {emailError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 7 }}>
          <label htmlFor="message" style={{ ...labelStyle('message'), marginBottom: 0 }}>Message *</label>
          <AnimatePresence>
            {msgLen > 0 && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(148,163,184,0.3)' }}
              >
                {msgLen} car.
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <textarea
          id="message" name="message" required rows={5}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
          onMouseEnter={() => setHovered('message')} onMouseLeave={() => setHovered(null)}
          onInput={(e) => { handleInput(); setMsgLen((e.target as HTMLTextAreaElement).value.length) }}
          placeholder="Tell me about your brand, your project, or your question…"
          style={{ ...fieldStyle('message'), resize: 'vertical', minHeight: 120 }}
        />
      </div>

      {/* Network error */}
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

      {/* Submit */}
      <div className="flex justify-center sm:justify-start">
        <ShinyButton type="submit" disabled={status === 'sending'} className="justify-center">
          <span className="flex items-center gap-2">
            {status === 'sending' ? (
              <>
                <motion.svg
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  style={{ flexShrink: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </motion.svg>
                Sending…
              </>
            ) : (
              <>
                <Send size={13} style={{ flexShrink: 0 }} />
                Send Message
              </>
            )}
          </span>
        </ShinyButton>
      </div>
    </form>
  )
}

export function ContactSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <>
      <section id="contact" ref={ref} style={{ background: '#08090E' }}>

        <LampContainer className="min-h-[58vh] lg:min-h-[80vh] lamp-lower-desktop">
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

        <div className="container relative z-10 pb-10 lg:pb-36 -mt-[140px] lg:mt-[28px]">
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-6 lg:gap-8 transition-all duration-700"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)' }}
          >

            {/* Left: info panel */}
            <div
              className="rounded-sm p-5 lg:p-8 flex flex-col justify-between"
              style={{
                background: 'rgba(14,165,233,0.04)',
                border: '1px solid rgba(14,165,233,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="absolute bottom-0 left-0 pointer-events-none" style={{
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
                transform: 'translate(-30%, 30%)',
              }} />

              <div>
                <div className="flex items-center gap-3 mb-5 lg:mb-8">
                  <div className="section-line" />
                  <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
                    Reach out
                  </span>
                </div>

                <p className="font-body text-sm mb-5 lg:mb-8" style={{ color: 'rgba(148,163,184,0.65)', lineHeight: 1.75 }}>
                  Looking for a partnership, a media request, or just want to connect? I read every message personally.
                </p>

                <div className="flex flex-col gap-2 mb-5 lg:mb-8">
                  <InfoRow
                    icon={Mail} sublabel="Email" value="contact@mathisghio.com"
                    href="mailto:contact@mathisghio.com" onClick={trackEmailClick}
                  />
                  <InfoRow icon={MapPin} sublabel="Based in" value="Marseille, France" />
                  <InfoRow icon={Clock} sublabel="Response time" value="Within 48 hours" />
                </div>
              </div>

              {/* Social links */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(148,163,184,0.35)', letterSpacing: '0.18em' }}>Follow</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_CHANNELS.map(({ href, Icon, label, platform }) => (
                    <SocialPill key={href} href={href} Icon={Icon} label={label} onClick={() => trackSocialClick(platform)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div
              className="rounded-sm p-5 lg:p-8"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(14,165,233,0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)' }}
              />

              <div className="flex items-center gap-3 mb-5 lg:mb-8">
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
            <div className="text-center">
              <p className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.4)' }}>
                © 2026 Mathis Ghio · Wingfoil Racing<br className="sm:hidden" /><span className="hidden sm:inline"> · </span>Photos&nbsp;: Robert Hajduk · Jean Souville · JM. Cornu · Iset Segura
              </p>
              <p className="font-body mt-1" style={{ fontSize: '10px', color: 'rgba(148,163,184,0.2)' }}>
                Protected by reCAPTCHA —{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(148,163,184,0.2)', textDecoration: 'underline' }}>Privacy</a>
                {' '}&amp;{' '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(148,163,184,0.2)', textDecoration: 'underline' }}>Terms</a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://instagram.com/mathisghio', icon: Instagram, platform: 'instagram' },
                { href: 'https://www.facebook.com/MathisGhioWing', icon: Facebook, platform: 'facebook' },
                { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a', icon: Linkedin, platform: 'linkedin' },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackSocialClick(social.platform)}
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
