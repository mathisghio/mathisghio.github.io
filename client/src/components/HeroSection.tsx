import { useEffect, useState } from 'react'
import { InteractiveWaves } from './InteractiveWaves'
import { VideoBackground } from './VideoBackground'
import { ChevronDown } from 'lucide-react'
import { ShinyButton } from '@/components/ui/shiny-button'
import { PartnershipFormModal } from './PartnershipFormModal'

const HERO_VIDEO      = 'https://res.cloudinary.com/duacto4ay/video/upload/q_auto,w_1920/v1774426080/bg_pru1bh.mp4'
const HERO_VIDEO_WEBM = 'https://res.cloudinary.com/duacto4ay/video/upload/q_auto,w_1920/v1774426080/bg_pru1bh.webm'
const HERO_GENERATED  = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426876/podium-1_whf6pe.jpg'

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollToAbout = () => {
    const el = document.getElementById('about')
    if (!el) return
    const navHeight = 87 + 8
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      <VideoBackground videoSrc={HERO_VIDEO} videoSrcWebm={HERO_VIDEO_WEBM} fallbackImageSrc={HERO_GENERATED} />

      {/* Gradient bas */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(8,9,14,0.65) 100%)' }}
      />

      {/* Gradient haut */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: '130px', background: 'linear-gradient(to bottom, #08090E 0%, rgba(8,9,14,0.7) 50%, transparent 100%)' }}
      />

      {/* Waves — desktop uniquement */}
      <div className="absolute inset-0 z-30 hidden lg:block" style={{ opacity: 0.3 }}>
        <InteractiveWaves strokeColor="rgba(14, 165, 233, 0.22)" backgroundColor="transparent" pointerSize={0.8} interactive={false} />
      </div>

      {/* Lignes accent gauche — desktop */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:flex flex-col justify-center gap-2 pl-6 pointer-events-none" style={{ zIndex: 35 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px" style={{ width: `${20 + i * 8}px`, background: `rgba(14, 165, 233, ${0.2 + i * 0.08})` }} />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP (lg+)
          Contenu ancré entre nav (top 90px) et stats bar (bottom 88px).
          justify-end pousse titre + badge + tagline + boutons vers le bas.
          Les deux boutons sont côte à côte (flex-row) comme à l'origine.
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 z-40 hidden lg:flex flex-col justify-end"
        style={{ top: '90px', bottom: '88px' }}
      >
        <div className="container pb-8">

          {/* Titre */}
          <div
            className="transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}
          >
            <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(60px, 11vw, 160px)' }}>
              MATHIS
            </h1>
            <h1
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(60px, 11vw, 160px)',
                color: '#0EA5E9',
              }}
            >
              GHIO
            </h1>
          </div>

          {/* Badge */}
          <div
            className="mt-5 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '450ms' }}
          >
            <span
              className="inline-flex items-center gap-3 font-body text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-sm"
              style={{ color: '#0EA5E9', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.22)', letterSpacing: '0.2em', backdropFilter: 'blur(8px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#0EA5E9', boxShadow: '0 0 6px #0EA5E9' }} />
              5× World Champion · 41.40 kts Speed Record
            </span>
          </div>

          {/* Tagline */}
          <div
            className="mt-5 max-w-xl transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '550ms' }}
          >
            <p className="font-body text-lg font-light" style={{ color: 'rgba(241,245,249,0.75)', lineHeight: 1.6 }}>
              Five world titles. A speed record. A materials science engineering student. The sport's most credible athlete for brands that demand performance.
            </p>
          </div>

          {/* Boutons côte à côte — desktop */}
          <div
            className="mt-8 flex items-center gap-4 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '650ms' }}
          >
            <ShinyButton onClick={() => document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' })}>
              My Achievements
            </ShinyButton>
            <ShinyButton
              onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
              className="[--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
            >
              My Journey
            </ShinyButton>
            <PartnershipFormModal
              trigger={
                <ShinyButton className="[--shiny-cta-highlight:#F59E0B] [--shiny-cta-bg:rgba(245,158,11,0.06)]">
                  Partner with Me
                </ShinyButton>
              }
            />
          </div>

        </div>
      </div>

      {/* SCROLL — desktop uniquement, centré au-dessus de la stats bar */}
      <button
        onClick={scrollToAbout}
        className="absolute left-1/2 -translate-x-1/2 z-40 hidden lg:flex flex-col items-center gap-2 transition-all duration-300 hover:opacity-70"
        style={{ bottom: '96px', color: 'rgba(241,245,249,0.5)' }}
      >
        <span className="font-body text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Scroll</span>
        <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
      </button>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE (< lg) — justify-between : titre en haut, boutons+stats
          collés en bas. La stats bar est dans le flux, toujours visible.
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 z-40 flex lg:hidden flex-col justify-between transition-all duration-700"
        style={{ top: '90px', bottom: '0', opacity: visible ? 1 : 0 }}
      >
        {/* ── Haut : titre + badge + tagline ── */}
        <div className="container pt-3">
          <div
            className="transition-all duration-700"
            style={{ transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}
          >
            <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(72px, 18vw, 120px)' }}>
              MATHIS
            </h1>
            <h1 className="font-display leading-none" style={{ fontSize: 'clamp(72px, 18vw, 120px)', color: '#0EA5E9' }}>
              GHIO
            </h1>
          </div>

          <div
            className="mt-2 transition-all duration-700"
            style={{ transform: visible ? 'translateY(0)' : 'translateY(16px)', transitionDelay: '450ms' }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 font-body text-xs font-medium uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#0EA5E9', boxShadow: '0 0 6px #0EA5E9' }} />
                5× World Champion
              </span>
              <span className="font-body text-xs font-medium uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em', paddingLeft: '18px' }}>
                41.40 kts Speed Record
              </span>
            </div>
          </div>

          <div
            className="mt-3 transition-all duration-700"
            style={{ transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '550ms' }}
          >
            <p className="font-body text-sm font-light" style={{ color: 'rgba(241,245,249,0.75)', lineHeight: 1.6 }}>
              Five world titles. A speed record.<br />
              A materials science engineering student.<br />
              The sport's most credible athlete<br />
              for brands that demand performance.
            </p>
          </div>
        </div>

        {/* ── Bas : boutons + scroll + stats bar ── */}
        <div
          className="transition-all duration-700"
          style={{ transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '650ms' }}
        >
          {/* Boutons */}
          <div className="container pb-3 flex flex-col items-center gap-3">
            <div className="flex gap-3 w-full justify-center">
              <ShinyButton onClick={() => document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' })}>
                Achievements
              </ShinyButton>
              <ShinyButton
                onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
                className="[--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
              >
                My Journey
              </ShinyButton>
            </div>
            <PartnershipFormModal
              trigger={
                <ShinyButton className="[--shiny-cta-highlight:#F59E0B] [--shiny-cta-bg:rgba(245,158,11,0.06)]">
                  Partner with Me
                </ShinyButton>
              }
            />
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToAbout}
            className="mb-3 flex flex-col items-center gap-1.5 w-full hover:opacity-70 transition-opacity duration-300"
            style={{ color: 'rgba(241,245,249,0.5)' }}
          >
            <span className="font-body text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Scroll</span>
            <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
          </button>

          {/* Stats bar — intégrée dans le flux mobile */}
          <div style={{ borderTop: '1px solid rgba(14,165,233,0.15)', background: 'rgba(8,9,14,0.25)', backdropFilter: 'blur(16px)' }}>
            <div className="container">
              <div className="grid grid-cols-3">
                {[
                  { value: '5×',       label: 'World Champion'    },
                  { value: '4×',       label: 'European Champion' },
                  { value: '41.4 kts', label: 'Speed Record'      },
                ].map((stat, i) => (
                  <div key={i} className="py-2 px-1 flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid rgba(14,165,233,0.1)' : 'none' }}>
                    <span className="font-display text-xl whitespace-nowrap" style={{ color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 20px rgba(14,165,233,0.5)' }}>
                      {stat.value}
                    </span>
                    <span className="font-body text-[0.6rem] uppercase tracking-widest mt-0.5 text-center leading-tight" style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.08em' }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar — DESKTOP uniquement ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 hidden lg:block transition-all duration-700"
        style={{
          opacity:         visible ? 1 : 0,
          transitionDelay: '800ms',
          borderTop:       '1px solid rgba(14,165,233,0.1)',
          background:      'rgba(8,9,14,0.6)',
          backdropFilter:  'blur(10px)',
        }}
      >
        <div className="container">
          <div className="grid grid-cols-3">
            {[
              { value: '5×',       label: 'World Champion'    },
              { value: '4×',       label: 'European Champion' },
              { value: '41.4 kts', label: 'Speed Record'      },
            ].map((stat, i) => (
              <div key={i} className="py-4 px-6 flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid rgba(14,165,233,0.1)' : 'none' }}>
                <span className="font-display text-3xl" style={{ color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 20px rgba(14,165,233,0.5)' }}>
                  {stat.value}
                </span>
                <span className="font-body text-xs uppercase tracking-widest mt-1 text-center" style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.1em' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
