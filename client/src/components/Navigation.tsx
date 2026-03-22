import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Career', href: '#career' },
  { label: 'The Sport', href: '#sport' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Partners', href: '#partners' },
  { label: 'Press', href: '#press' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(8, 9, 14, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(14, 165, 233, 0.1)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
              }}
            >
              <span className="font-display text-white text-sm leading-none">MG</span>
            </div>
            <div className="hidden sm:block">
              <span
                className="font-heading font-bold text-white text-lg tracking-wider uppercase"
                style={{ letterSpacing: '0.15em' }}
              >
                Mathis Ghio
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="font-body text-sm font-medium uppercase tracking-widest transition-all duration-200 group relative"
                style={{ color: 'rgba(241, 245, 249, 0.7)', letterSpacing: '0.1em' }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#0EA5E9' }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(241, 245, 249, 0.7)' }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: '#0EA5E9' }}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          background: 'rgba(8, 9, 14, 0.97)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col items-center justify-start min-h-full pt-24 pb-12 gap-6 overflow-y-auto h-full px-8">
          {navLinks.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="font-display text-3xl text-white uppercase tracking-widest transition-all duration-200 hover:text-cyan-400 flex-shrink-0"
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="mailto:contact@mathisghio.com"
            className="mt-4 px-8 py-3 font-heading font-bold text-sm uppercase tracking-widest text-white rounded-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', letterSpacing: '0.15em' }}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  )
}
