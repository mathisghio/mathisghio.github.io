import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface GlassCardImage {
  src: string
  alt: string
  objectPosition?: string
}

interface CardProps {
  image: GlassCardImage
  index: number
  totalCards: number
  accentColor: string
}

const GlassCard: React.FC<CardProps> = ({ image, index, totalCards, accentColor }) => {
  const cardRef      = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card      = cardRef.current
    const container = containerRef.current
    if (!card || !container) return

    const targetScale = 1 - (totalCards - index) * 0.04

    gsap.set(card, { scale: 1, transformOrigin: 'center top' })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start:   'top center',
      end:     'bottom center',
      scrub:   1,
      /*
       * lazy: true — GSAP diffère les lectures DOM au prochain tick de rendu.
       * Évite les layout thrashing sur les appareils lents / connexions limitées.
       */
      lazy:    true,
      onUpdate: self => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress)
        gsap.set(card, { scale: Math.max(scale, targetScale), transformOrigin: 'center top' })
      },
    })

    return () => trigger.kill()
  }, [index, totalCards])

  return (
    <div
      ref={containerRef}
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0 }}
    >
      <div
        ref={cardRef}
        style={{
          position:        'relative',
          width:           'min(80%, 900px)',
          height:          'clamp(300px, 55vh, 560px)',
          borderRadius:    '20px',
          isolation:       'isolate',
          top:             `calc(-4vh + ${index * 22}px)`,
          transformOrigin: 'top',
        }}
      >
        {/* Conic border glow */}
        <div style={{
          position:     'absolute',
          inset:        '-2px',
          borderRadius: '22px',
          background:   `conic-gradient(from 0deg, transparent 0deg, ${accentColor} 60deg, ${accentColor.replace('0.9', '0.5')} 120deg, transparent 180deg, ${accentColor.replace('0.9', '0.3')} 240deg, transparent 360deg)`,
          zIndex:       -1,
        }} />

        {/* Image fill */}
        <div style={{
          position:     'relative',
          width:        '100%',
          height:       '100%',
          borderRadius: '20px',
          overflow:     'hidden',
          background:   '#08090E',
          border:       '1px solid rgba(255,255,255,0.1)',
          boxShadow:    '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}>
          <img
            src={image.src}
            alt={image.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: image.objectPosition ?? 'center', display: 'block' }}
            loading="lazy"
          />

          {/* Glass overlay */}
          <div style={{
            position:   'absolute',
            inset:       0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Top shine line */}
          <div style={{
            position:   'absolute',
            top:        '10px',
            left:       '10px',
            right:      '10px',
            height:     '1.5px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Caption */}
          <div style={{
            position:   'absolute',
            bottom:      0,
            left:        0,
            right:       0,
            padding:    '2rem 1.5rem 1.25rem',
            background: 'linear-gradient(to top, rgba(8,9,14,0.85) 0%, transparent 100%)',
          }}>
            <p style={{ margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '0.8rem', color: 'rgba(148,163,184,0.75)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {image.alt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface GlassCardsProps {
  images: GlassCardImage[]
}

export const GlassCards: React.FC<GlassCardsProps> = ({ images }) => {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
  }, [])

  return (
    <div ref={wrapRef}>
      {images.map((img, i) => (
        <GlassCard
          key={i}
          image={img}
          index={i}
          totalCards={images.length}
          accentColor="rgba(14,165,233,0.9)"
        />
      ))}
    </div>
  )
}
