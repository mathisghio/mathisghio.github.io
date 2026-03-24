import { useEffect, useRef, useState } from 'react'
import { FallingPattern } from '@/components/FallingPattern'
import { useInView } from '@/hooks/useInView'


const titlePartners = [
  { name: 'Ozone', url: 'https://ozonekites.com/team/mathis-ghio/', description: 'Wing & kite manufacturer — R&D partner', logoText: 'OZONE' },
  { name: 'Levitaz', url: 'https://levitaz.com/team-rider/mathis-ghio/', description: 'Hydrofoil manufacturer — R&D partner', logoText: 'LEVITAZ' },
  { name: 'Forward WIP', url: 'https://www.forward-wip.com/fr/team/mathis-ghio/', description: 'Protection & accessories partner', logoText: 'FORWARD WIP' },
]

const officialPartners = [
  { name: 'Overstims', url: 'https://www.overstims.com/', description: 'Nutrition partner' },
  { name: 'FFVoile', url: 'https://hn.ffvoile.fr/', description: 'French Sailing Federation' },
  { name: 'INSA Lyon', url: 'https://www.insa-lyon.fr/', description: 'Engineering school' },
  { name: 'Département 13', url: 'https://www.departement13.fr/', description: 'Bouches-du-Rhône' },
  { name: 'Métropole AMP', url: 'https://ampmetropole.fr/', description: 'Aix-Marseille-Provence' },
]

export function PartnersSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section
      id="partners"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #08090E 0%, #0A0F1A 50%, #08090E 100%)' }}
    >
      {/* Falling pattern background */}
      <div className="absolute inset-0 z-0">
        <FallingPattern
          color="rgba(14, 165, 233, 0.35)"
          backgroundColor="transparent"
          duration={120}
          blurIntensity="0.5em"
          density={1}
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlays to fade edges and keep readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, #08090E 0%, transparent 15%, transparent 85%, #08090E 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, #08090E 0%, transparent 10%, transparent 90%, #08090E 100%)',
        }}
      />

      <div className="container relative z-10">
        <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="section-line" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Partners</span>
          </div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>TRUSTED BY</h2>
          <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>THE BEST</h2>
        </div>

        <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}>
          <h3 className="font-body text-xs uppercase tracking-widest mb-8" style={{ color: 'rgba(245, 158, 11, 0.7)', letterSpacing: '0.2em' }}>Title Partners</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {titlePartners.map((partner, i) => (
              <a key={i} href={partner.url} target="_blank" rel="noopener noreferrer"
                className="group p-8 rounded-sm card-hover flex flex-col items-center text-center"
                style={{ background: 'rgba(8, 9, 14, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(245, 158, 11, 0.15)', textDecoration: 'none' }}>
                <div className="font-display text-3xl mb-3 transition-all duration-300 group-hover:text-cyan-400" style={{ color: 'rgba(241, 245, 249, 0.9)' }}>{partner.logoText}</div>
                <p className="font-body text-xs" style={{ color: 'rgba(148, 163, 184, 0.6)' }}>{partner.description}</p>
                <div className="mt-4 w-8 h-px transition-all duration-300 group-hover:w-16" style={{ background: '#0EA5E9' }} />
              </a>
            ))}
          </div>
        </div>

        <div className="transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}>
          <h3 className="font-body text-xs uppercase tracking-widest mb-8" style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.2em' }}>Official Partners</h3>
          <div className="flex flex-wrap gap-3">
            {officialPartners.map((partner, i) => (
              <a key={i} href={partner.url} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3 rounded-sm transition-all duration-300"
                style={{ background: 'rgba(8, 9, 14, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}>
                <span className="font-heading font-semibold text-sm transition-all duration-300 group-hover:text-cyan-400" style={{ color: 'rgba(241, 245, 249, 0.7)', fontFamily: 'Barlow Condensed, sans-serif' }}>{partner.name}</span>
                <span className="font-body text-xs" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>{partner.description}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 rounded-sm transition-all duration-700"
          style={{ background: 'rgba(8, 9, 14, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(14, 165, 233, 0.15)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '600ms' }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>Interested in a Partnership?</h3>
              <p className="font-body text-sm" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>Sponsorships, brand collaborations, product development and long-term strategic partnerships.</p>
            </div>
            <ShinyButton href="mailto:contact@mathisghio.com">
              Become a Partner
            </ShinyButton>
          </div>
        </div>
      </div>
    </section>
  )
}
