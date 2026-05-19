import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const STORAGE_KEY = 'mg_newsletter_seen'
const KIT_ENDPOINT = 'https://app.kit.com/forms/9462922/subscriptions'

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const body = new URLSearchParams({ email_address: email })
      const res = await fetch(KIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (res.ok || res.status === 200) {
        setStatus('success')
        setTimeout(close, 2500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(4,6,14,0.72)',
              backdropFilter: 'blur(8px)',
              zIndex: 900,
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280, mass: 0.8 }}
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 901, pointerEvents: 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                background: '#0A0C14',
                border: '1px solid rgba(14,165,233,0.2)',
                borderRadius: '12px',
                padding: '32px 28px 28px',
                width: 'min(420px, calc(100vw - 32px))',
                position: 'relative',
                boxShadow: '0 0 80px rgba(14,165,233,0.08), 0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Fermer"
                style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'none', border: 'none',
                  color: 'rgba(148,163,184,0.5)', cursor: 'pointer',
                  padding: 4, lineHeight: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(241,245,249,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.5)')}
              >
                <X size={18} />
              </button>

              {/* Accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 28, right: 28,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #0EA5E9, transparent)',
                borderRadius: '0 0 2px 2px',
              }} />

              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '0.6rem', color: '#0EA5E9',
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  Newsletter
                </p>
                <h2 style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: '1.9rem', color: '#F1F5F9',
                  letterSpacing: '0.06em', margin: 0, lineHeight: 1,
                }}>
                  Stay in the loop
                </h2>
                <p style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '0.82rem', color: 'rgba(148,163,184,0.65)',
                  margin: '10px 0 0', lineHeight: 1.55,
                }}>
                  Race results, behind-the-scenes and performance insights — straight to your inbox.
                </p>
              </div>

              {/* Form */}
              {status === 'success' ? (
                <p style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '0.85rem', color: '#0EA5E9',
                  textAlign: 'center', padding: '12px 0',
                }}>
                  You're in! Check your inbox to confirm.
                </p>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      background: 'rgba(14,165,233,0.06)',
                      border: '1px solid rgba(14,165,233,0.25)',
                      borderRadius: '6px',
                      color: '#F1F5F9',
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '0.875rem',
                      padding: '10px 14px',
                      outline: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.6)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)')}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      background: '#0EA5E9',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      padding: '10px 20px',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      opacity: status === 'loading' ? 0.6 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {status === 'loading' ? 'Sending…' : 'Send it to me'}
                  </button>
                  {status === 'error' && (
                    <p style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '0.75rem', color: '#f87171',
                      margin: 0, textAlign: 'center',
                    }}>
                      Something went wrong — try again.
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
