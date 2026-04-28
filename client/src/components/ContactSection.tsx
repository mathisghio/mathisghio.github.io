import { motion } from 'framer-motion'
import { Instagram, Facebook, Linkedin } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { trackEmailClick } from '@/lib/analytics'

export function ContactSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <>
      <section id="contact" ref={ref} style={{ background: '#08090E' }}>

        {/* ── Lamp header ── */}
          <LampContainer minHeight="80vh">
          <motion.div
            initial={{ opacity: 0.5, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center w-full"
            style={{ marginTop: '6rem' }}
          >
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div
                className="section-line"
                style={{ background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' }}
              />
              <span
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: 'rgba(241, 245, 249, 0.6)', letterSpacing: '0.2em' }}
              >
                Contact
              </span>
            </div>
            <h2
              className="font-display text-white leading-none"
              style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
            >
              GET IN
            </h2>
            <h2
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(48px, 8vw, 110px)',
                color: '#0EA5E9',
              }}
            >
              TOUCH
            </h2>
          </motion.div>
        </LampContainer>

        {/* ── Primary CTA : email ── */}
        <div className="container relative z-10 pb-24 lg:pb-36">
          <div
            className="text-center transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <p
              className="font-body text-xs uppercase tracking-widest mb-6"
              style={{ color: 'rgba(148, 163, 184, 0.4)', letterSpacing: '0.2em' }}
            >
              Partnerships &amp; Media
            </p>
            <a
              href="mailto:contact@mathisghio.com"
              onClick={trackEmailClick}
              className="font-display text-white transition-colors duration-300 hover:text-cyan-400 block"
              style={{
                fontSize: 'clamp(28px, 5vw, 64px)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              contact@mathisghio.com
            </a>
          </div>

          {/* ── Secondary channels ── */}
          <div
            className="mt-16 flex items-center justify-center gap-12 transition-all duration-700"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: '200ms',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '2rem',
            }}
          >
            <a
              href="https://instagram.com/mathisghio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(148, 163, 184, 0.5)', textDecoration: 'none' }}
            >
              <Instagram size={16} />
              <span className="font-body text-sm">@mathisghio</span>
            </a>
            <a
              href="https://fr.linkedin.com/in/mathis-ghio-93075515a"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors duration-200 hover:text-white"
              style={{ color: 'rgba(148, 163, 184, 0.5)', textDecoration: 'none' }}
            >
              <Linkedin size={16} />
              <span className="font-body text-sm">Mathis Ghio</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 relative"
        style={{ background: '#050608', borderTop: '1px solid rgba(14, 165, 233, 0.08)' }}
      >
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-sm flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}
              >
                <span className="font-display text-white text-xs">MG</span>
              </div>
              <span
                className="font-heading font-semibold text-sm uppercase tracking-wider"
                style={{
                  color: 'rgba(241, 245, 249, 0.6)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Mathis Ghio
              </span>
            </div>
            <p
              className="font-body text-xs text-center"
              style={{ color: 'rgba(148, 163, 184, 0.4)' }}
            >
              © 2025 Mathis Ghio — Wingfoil Racing
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://instagram.com/mathisghio', icon: Instagram },
                { href: 'https://www.facebook.com/MathisGhioWing', icon: Facebook },
                { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a', icon: Linkedin },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-200 hover:text-cyan-400"
                  style={{ color: 'rgba(148, 163, 184, 0.4)' }}
                >
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
