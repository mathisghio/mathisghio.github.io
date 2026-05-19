import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'mg_nl_shown'
const DELAY_MS = 5000

export function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptInjected = useRef(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => {
      setOpen(true)
      localStorage.setItem(STORAGE_KEY, '1')
    }, DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open || scriptInjected.current || !containerRef.current) return
    scriptInjected.current = true
    const s = document.createElement('script')
    s.async = true
    s.setAttribute('data-uid', 'f8b2bd3ed1')
    s.src = 'https://mathis-ghio-wingfoil.kit.com/f8b2bd3ed1/index.js'
    containerRef.current.appendChild(s)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 300, background: 'rgba(4,6,14,0.88)', backdropFilter: 'blur(12px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm"
            style={{
              background: 'linear-gradient(160deg, #080C15 0%, #06090E 100%)',
              border: '1px solid rgba(14,165,233,0.28)',
              borderRadius: '8px',
              boxShadow: '0 0 0 1px rgba(14,165,233,0.06), 0 0 60px rgba(14,165,233,0.12), 0 32px 80px rgba(0,0,0,0.85)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent 0%, #0EA5E9 40%, #38BDF8 60%, transparent 100%)' }} />

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(148,163,184,0.6)',
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <X size={13} />
            </button>

            {/* Header */}
            <div style={{ padding: '22px 24px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA5E9', boxShadow: '0 0 8px #0EA5E9', flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.22em' }}>Newsletter</span>
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.7rem, 6vw, 2.1rem)', color: '#F1F5F9', lineHeight: 1.05, marginBottom: 10 }}>
                STAY IN<br />THE RACE
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.83rem', color: 'rgba(148,163,184,0.68)', lineHeight: 1.65 }}>
                Competition results, behind-the-scenes content and exclusive insights from the 2026 world circuit.
              </p>
            </div>

            {/* Kit form — script injects here */}
            <div ref={containerRef} className="mg-newsletter-kit" style={{ padding: '0 8px 12px', minHeight: 100 }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
