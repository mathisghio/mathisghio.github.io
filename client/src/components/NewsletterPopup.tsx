import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const STORAGE_KEY = 'mg_newsletter_seen'
const KIT_UID = '78f39e6484'
const KIT_SCRIPT_ID = 'kit-form-script'
const KIT_SCRIPT_SRC = `https://mathis-ghio-wingfoil.kit.com/78f39e6484/index.js`

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(t)
  }, [])

  // Load Kit script only after the popup (and its data-uid div) are in the DOM
  useEffect(() => {
    if (!visible) return
    if (document.getElementById(KIT_SCRIPT_ID)) return
    const script = document.createElement('script')
    script.id = KIT_SCRIPT_ID
    script.src = KIT_SCRIPT_SRC
    script.async = true
    script.setAttribute('data-uid', KIT_UID)
    document.head.appendChild(script)
  }, [visible])

  const close = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  return (
    <>
      {/* Kit form styling overrides — injected once regardless of popup visibility */}
      <style>{`
        .formkit-form { background: transparent !important; }
        .formkit-form * { font-family: 'DM Sans', sans-serif !important; }
        .formkit-field input {
          background: rgba(14,165,233,0.06) !important;
          border: 1px solid rgba(14,165,233,0.25) !important;
          border-radius: 6px !important;
          color: #F1F5F9 !important;
          padding: 10px 14px !important;
          width: 100% !important;
        }
        .formkit-field input::placeholder { color: rgba(148,163,184,0.5) !important; }
        .formkit-field input:focus { border-color: rgba(14,165,233,0.6) !important; outline: none !important; }
        .formkit-submit {
          background: #0EA5E9 !important;
          border: none !important;
          border-radius: 6px !important;
          color: #fff !important;
          font-weight: 600 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          padding: 10px 20px !important;
          cursor: pointer !important;
          width: 100% !important;
          margin-top: 8px !important;
          transition: opacity 0.2s !important;
        }
        .formkit-submit:hover { opacity: 0.85 !important; }
        .formkit-guarantee,
        .formkit-powered-by-convertkit-container { display: none !important; }
        .formkit-alert { color: #0EA5E9 !important; font-size: 0.8rem !important; }
      `}</style>

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
                    marginTop: 10, lineHeight: 1.55, margin: '10px 0 0',
                  }}>
                    Race results, behind-the-scenes and performance insights — straight to your inbox.
                  </p>
                </div>

                {/* Kit renders the form here */}
                <div data-uid={KIT_UID} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
