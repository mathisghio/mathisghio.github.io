import { useEffect, useState } from 'react'
import { InteractiveWaves } from './InteractiveWaves'
import { VideoBackground } from './VideoBackground'
import { ChevronDown } from 'lucide-react'
import { ShinyButton } from '@/components/ui/shiny-button'

const HERO_VIDEO     = 'https://res.cloudinary.com/duacto4ay/video/upload/q_auto/v1774426080/bg_pru1bh.mp4'
const HERO_GENERATED = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426876/podium-1_whf6pe.jpg'

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      <VideoBackground videoSrc={HERO_VIDEO} fallbackImageSrc={HERO_GENERATED} />

      {/* Gradient bas */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(8,9,14,0.65) 100%)' }}
      />

      {/* Gradient haut — masque le texte derrière le nav fixe */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: '130px', background: 'linear-gradient(to bottom, #08090E 0%, rgba(8,9,14,0.7) 50%, transparent 100%)' }}
      />

      {/* Waves — desktop uniquement */}
      <div className="absolute inset-0 z-30 hidden lg:block" style={{ opacity: 0.3 }}>
        <InteractiveWaves strokeColor="rgba(14, 165, 233, 0.22)" backgroundColor="transparent" pointerSize={0.8} />
      </div>

      {/* Lignes accent gauche — desktop */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:flex flex-col justify-center gap-2 pl-6 pointer-events-none" style={{ zIndex: 35 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px" style={{ width: `${20 + i * 8}px`, background: `rgba(14, 165, 233, ${0.2 + i * 0.08})` }} />
        ))}
      </div>

      {/*
       * ── CONTENU HERO ────────────────────────────────────────────────────
       * Ancré entre nav (top: 90px) et stats bar (bottom: 88px).
       * justify-end pousse le contenu vers le bas de cette zone bornée.
       * Résultat : les boutons restent toujours AU-DESSUS de la stats bar,
       * quelle que soit la hauteur du viewport (MacBook, 4K, mobile).
       */}
      <div
        className="absolute inset-x-0 z-40 flex flex-col justify-end"
        style={{ top: '90px', bottom: '88px' }}
      >
        <div className="container pb-6 lg:pb-8">

          {/* Titre */}
          <div
            className="transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}
          >
            <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(60px, 11vw, 160px)' }}>MATHIS</h1>
            <h1
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(60px, 11vw, 160px)',
                background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
              style={{
                color: '#0EA5E9',
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.22)',
                letterSpacing: '0.2em',
                backdropFilter: 'blur(8px)',
              }}
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
              I'm a professional wingfoil athlete, racing at the edge of what's possible. Passionate about pushing the sport forward.
            </p>
          </div>

          {/*
           * ── CTAs ──────────────────────────────────────────────────────
           * Desktop  : deux boutons côte à côte.
           * Mobile   : seulement "View My Achievements" ici.
           *            "My Journey" est repositionné en coin bas droit (FAB).
           */}
          <div
            className="mt-8 flex flex-wrap items-center gap-4 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '650ms' }}
          >
            <ShinyButton
              onClick={() => document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Achievements
            </ShinyButton>

            {/* My Journey — inline sur desktop uniquement */}
            <ShinyButton
              onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden lg:inline-flex [--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
            >
              My Journey
            </ShinyButton>
          </div>
        </div>
      </div>

      {/*
       * ── MY JOURNEY — mobile uniquement, coin bas droit ─────────────────
       * Réutilise la classe .shiny-cta avec position absolute en inline style
       * (override le position:relative de .shiny-cta via spécificité inline).
       * Positionné à droite, au même niveau que le hint SCROLL (bottom: 96px).
       */}
      <button
        onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
        className="lg:hidden shiny-cta [--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
        style={{
          position:        'absolute',
          right:           '20px',
          bottom:          '96px',
          zIndex:          40,
          padding:         '0.55rem 1.25rem',
          fontSize:        '0.72rem',
          opacity:         visible ? 1 : 0,
          transition:      'opacity 0.7s ease',
          transitionDelay: '650ms',
        }}
      >
        <span>My Journey</span>
      </button>

      {/* ── Scroll hint — centré, au-dessus de la stats bar ── */}
      <button
        onClick={scrollToAbout}
        className="absolute left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 transition-all duration-300 hover:opacity-70"
        style={{ bottom: '96px', color: 'rgba(241,245,249,0.5)' }}
      >
        <span className="font-body text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Scroll</span>
        <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
      </button>

      {/* ── Stats bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 transition-all duration-700"
        style={{
          opacity:       visible ? 1 : 0,
          transitionDelay: '800ms',
          borderTop:     '1px solid rgba(14,165,233,0.1)',
          background:    'rgba(8,9,14,0.6)',
          backdropFilter:'blur(10px)',
        }}
      >
        <div className="container">
          <div className="grid grid-cols-3">
            {[
              { value: '5×',        label: 'World Champion' },
              { value: '4×',        label: 'European Champion' },
              { value: '41.40 kts', label: 'Speed Record' },
            ].map((stat, i) => (
              <div
                key={i}
                className="py-4 px-6 flex flex-col items-center"
                style={{ borderRight: i < 2 ? '1px solid rgba(14,165,233,0.1)' : 'none' }}
              >
                <span
                  className="font-display text-2xl lg:text-3xl"
                  style={{
                    color:      i === 0 ? '#F59E0B' : '#0EA5E9',
                    textShadow: i === 0 ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 20px rgba(14,165,233,0.5)',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-body text-xs uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.1em' }}
                >
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
import { useEffect, useState } from 'react'
import { InteractiveWaves } from './InteractiveWaves'
import { VideoBackground } from './VideoBackground'
import { ChevronDown } from 'lucide-react'
import { ShinyButton } from '@/components/ui/shiny-button'

const HERO_VIDEO     = 'https://res.cloudinary.com/duacto4ay/video/upload/q_auto/v1774426080/bg_pru1bh.mp4'
const HERO_GENERATED = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426876/podium-1_whf6pe.jpg'

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      <VideoBackground videoSrc={HERO_VIDEO} fallbackImageSrc={HERO_GENERATED} />

      {/* Gradient bas */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(8,9,14,0.65) 100%)' }}
      />

      {/* Gradient haut — masque le texte derrière le nav fixe */}
      <div
        className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
        style={{ height: '130px', background: 'linear-gradient(to bottom, #08090E 0%, rgba(8,9,14,0.7) 50%, transparent 100%)' }}
      />

      {/* Waves — desktop uniquement */}
      <div className="absolute inset-0 z-30 hidden lg:block" style={{ opacity: 0.3 }}>
        <InteractiveWaves strokeColor="rgba(14, 165, 233, 0.22)" backgroundColor="transparent" pointerSize={0.8} />
      </div>

      {/* Lignes accent gauche — desktop */}
      <div className="absolute left-0 top-0 bottom-0 hidden lg:flex flex-col justify-center gap-2 pl-6 pointer-events-none" style={{ zIndex: 35 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px" style={{ width: `${20 + i * 8}px`, background: `rgba(14, 165, 233, ${0.2 + i * 0.08})` }} />
        ))}
      </div>

      {/*
       * ── CONTENU HERO ────────────────────────────────────────────────────
       * Ancré entre nav (top: 90px) et stats bar (bottom: 88px).
       * justify-end pousse le contenu vers le bas de cette zone bornée.
       * Résultat : les boutons restent toujours AU-DESSUS de la stats bar,
       * quelle que soit la hauteur du viewport (MacBook, 4K, mobile).
       */}
      <div
        className="absolute inset-x-0 z-40 flex flex-col justify-end"
        style={{ top: '90px', bottom: '88px' }}
      >
        <div className="container pb-6 lg:pb-8">

          {/* Titre */}
          <div
            className="transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}
          >
            <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(60px, 11vw, 160px)' }}>MATHIS</h1>
            <h1
              className="font-display leading-none"
              style={{
                fontSize: 'clamp(60px, 11vw, 160px)',
                background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
              style={{
                color: '#0EA5E9',
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.22)',
                letterSpacing: '0.2em',
                backdropFilter: 'blur(8px)',
              }}
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
              I'm a professional wingfoil athlete, racing at the edge of what's possible. Passionate about pushing the sport forward.
            </p>
          </div>

          {/*
           * ── CTAs ──────────────────────────────────────────────────────
           * Desktop  : deux boutons côte à côte.
           * Mobile   : seulement "View My Achievements" ici.
           *            "My Journey" est repositionné en coin bas droit (FAB).
           */}
          <div
            className="mt-8 flex flex-wrap items-center gap-4 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '650ms' }}
          >
            <ShinyButton
              onClick={() => document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Achievements
            </ShinyButton>

            {/* My Journey — inline sur desktop uniquement */}
            <ShinyButton
              onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden lg:inline-flex [--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
            >
              My Journey
            </ShinyButton>
          </div>
        </div>
      </div>

      {/*
       * ── MY JOURNEY — mobile uniquement, coin bas droit ─────────────────
       * Réutilise la classe .shiny-cta avec position absolute en inline style
       * (override le position:relative de .shiny-cta via spécificité inline).
       * Positionné à droite, au même niveau que le hint SCROLL (bottom: 96px).
       */}
      <button
        onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
        className="lg:hidden shiny-cta [--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
        style={{
          position:        'absolute',
          right:           '20px',
          bottom:          '96px',
          zIndex:          40,
          padding:         '0.55rem 1.25rem',
          fontSize:        '0.72rem',
          opacity:         visible ? 1 : 0,
          transition:      'opacity 0.7s ease',
          transitionDelay: '650ms',
        }}
      >
        <span>My Journey</span>
      </button>

      {/* ── Scroll hint — centré, au-dessus de la stats bar ── */}
      <button
        onClick={scrollToAbout}
        className="absolute left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 transition-all duration-300 hover:opacity-70"
        style={{ bottom: '96px', color: 'rgba(241,245,249,0.5)' }}
      >
        <span className="font-body text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Scroll</span>
        <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
      </button>

      {/* ── Stats bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 transition-all duration-700"
        style={{
          opacity:       visible ? 1 : 0,
          transitionDelay: '800ms',
          borderTop:     '1px solid rgba(14,165,233,0.1)',
          background:    'rgba(8,9,14,0.6)',
          backdropFilter:'blur(10px)',
        }}
      >
        <div className="container">
          <div className="grid grid-cols-3">
            {[
              { value: '5×',        label: 'World Champion' },
              { value: '4×',        label: 'European Champion' },
              { value: '41.40 kts', label: 'Speed Record' },
            ].map((stat, i) => (
              <div
                key={i}
                className="py-4 px-6 flex flex-col items-center"
                style={{ borderRight: i < 2 ? '1px solid rgba(14,165,233,0.1)' : 'none' }}
              >
                <span
                  className="font-display text-2xl lg:text-3xl"
                  style={{
                    color:      i === 0 ? '#F59E0B' : '#0EA5E9',
                    textShadow: i === 0 ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 20px rgba(14,165,233,0.5)',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="font-body text-xs uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(148,163,184,0.8)', letterSpacing: '0.1em' }}
                >
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
