import { useEffect, useRef, useState } from 'react'
import { Mail, Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

const contactCards = [
  { icon: Mail, title: 'Management & Partnerships', description: 'Sponsorships, brand collaborations, product development and long-term strategic partnerships.', action: 'contact@mathisghio.com', href: 'mailto:contact@mathisghio.com', type: 'email' },
  { icon: Instagram, title: 'Instagram', description: 'Follow race updates, performance insights and behind-the-scenes content.', action: '@mathisghio', href: 'https://instagram.com/mathisghio', type: 'social' },
  { icon: Facebook, title: 'Facebook', description: 'Official Facebook page with news, events and competition updates.', action: 'Mathis Ghio – WingFoil', href: 'https://www.facebook.com/MathisGhioWing', type: 'social' },
  { icon: Linkedin, title: 'LinkedIn', description: 'Professional profile and career updates.', action: 'Mathis Ghio', href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a', type: 'social' },
]

export function ContactSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <>
      <section id="contact" ref={ref} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: '#08090E' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="container relative z-10">
          <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
            <div className="flex items-center gap-3 mb-6"><div className="section-line" /><span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Contact</span></div>
            <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>GET IN</h2>
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TOUCH</h2>
            <p className="font-body text-base mt-4 max-w-lg" style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.7 }}>For partnerships, media inquiries, professional opportunities and collaboration. Open to brand collaborations, media features and performance-driven projects.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card, i) => (
              <a key={i} href={card.href} target={card.type === 'social' ? '_blank' : undefined} rel={card.type === 'social' ? 'noopener noreferrer' : undefined} className="group p-6 rounded-sm card-hover flex flex-col" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(14, 165, 233, 0.1)', textDecoration: 'none', transitionDelay: `${i * 80}ms`, opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}>
                <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                  <card.icon size={18} style={{ color: '#0EA5E9' }} />
                </div>
                <h3 className="font-heading font-bold text-white mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem' }}>{card.title}</h3>
                <p className="font-body text-xs mb-4 flex-1" style={{ color: 'rgba(148, 163, 184, 0.6)', lineHeight: 1.6 }}>{card.description}</p>
                <div className="flex items-center gap-2 font-body text-sm font-medium" style={{ color: 'rgba(14, 165, 233, 0.8)' }}>
                  <span className="truncate">{card.action}</span><ExternalLink size={12} className="flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-16 text-center transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '500ms' }}>
            <p className="font-body text-sm mb-4" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>Preferred contact</p>
            <a href="mailto:contact@mathisghio.com" className="font-display text-white transition-all duration-300 hover:text-cyan-400" style={{ fontSize: 'clamp(24px, 4vw, 48px)', textDecoration: 'none', letterSpacing: '0.02em' }}>contact@mathisghio.com</a>
          </div>
        </div>
      </section>
      <footer className="py-8 relative" style={{ background: '#050608', borderTop: '1px solid rgba(14, 165, 233, 0.08)' }}>
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
                <span className="font-display text-white text-xs">MG</span>
              </div>
              <span className="font-heading font-semibold text-sm uppercase tracking-wider" style={{ color: 'rgba(241, 245, 249, 0.6)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.15em' }}>Mathis Ghio</span>
            </div>
            <p className="font-body text-xs text-center" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>© 2025 Mathis Ghio — Wingfoil Racing</p>
            <div className="flex items-center gap-4">
              {[{ href: 'https://instagram.com/mathisghio', icon: Instagram }, { href: 'https://www.facebook.com/MathisGhioWing', icon: Facebook }, { href: 'https://fr.linkedin.com/in/mathis-ghio-93075515a', icon: Linkedin }].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-cyan-400" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
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
