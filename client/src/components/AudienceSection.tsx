import { useState } from 'react'
import { useInView } from '@/hooks/useInView'

const rows = [
  {
    label: 'Monthly Reach',
    value: '1,000,000',
    unit: 'impressions',
    detail: 'peak during competition season · 400K off-season · 19,800 Instagram followers · engagement 2–4× above lifestyle influencer average',
    hero: true,
  },
  {
    label: 'Live Audience',
    value: '150–200K',
    unit: 'spectators',
    detail: '7 IWSA World Cups on the 2026 circuit · 10+ countries · official race villages and beach finals',
    hero: false,
  },
  {
    label: 'Media Coverage',
    value: '200+',
    unit: 'features',
    detail: "L'Équipe · Eurosport · Stade 2 · Wind Mag · Voiles et Voiliers · Ouest France · Le Télégramme · millions of households via sports broadcasts",
    hero: false,
  },
  {
    label: 'Audience Profile',
    value: '25–44',
    unit: 'years old',
    detail: '75% male · high disposable income · France · Italy · Spain · Brazil · active practitioners, early adopters, performance-oriented',
    hero: false,
  },
]

export function AudienceSection() {
  const { ref, inView } = useInView(0.08)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="relative py-14 lg:py-20 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Subtle right glow */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: '40%', height: '100%',
          background: 'radial-gradient(ellipse at 90% 30%, rgba(14,165,233,0.04) 0%, transparent 65%)',
        }}
      />

      <div className="container relative z-10">

        <div
          className="flex items-center gap-3 mb-10 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '50ms',
            transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="section-line" />
          <span
            className="font-body text-xs uppercase tracking-widest"
            style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}
          >
            Audience &amp; Reach
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row, i) => {
            const isHovered = hoveredRow === i
            return (
              <div
                key={i}
                className="transition-all duration-700 cursor-default"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(24px)',
                  transitionDelay: `${120 + i * 80}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div
                  className="rounded-sm"
                  style={{
                    background: isHovered
                      ? row.hero ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.05)'
                      : row.hero ? 'rgba(14,165,233,0.04)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${isHovered
                      ? row.hero ? 'rgba(14,165,233,0.32)' : 'rgba(14,165,233,0.18)'
                      : row.hero ? 'rgba(14,165,233,0.18)' : 'rgba(255,255,255,0.06)'}`,
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
                  }}
                >
                  {/* Mobile: label + number on one line */}
                  <div className="flex items-baseline justify-between pt-5 pb-2 px-5 lg:hidden">
                    <span
                      className="font-body text-xs uppercase tracking-widest"
                      style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.15em' }}
                    >
                      {row.label}
                    </span>
                    <div className="flex items-baseline gap-2 ml-4">
                      <span
                        className="font-display leading-none transition-all duration-300"
                        style={{
                          fontSize: row.hero ? '1.9rem' : '1.45rem',
                          color: row.hero
                            ? '#0EA5E9'
                            : isHovered ? 'rgba(241,245,249,1)' : 'rgba(241,245,249,0.9)',
                          textShadow: row.hero
                            ? `0 0 ${isHovered ? '40px' : '24px'} rgba(14,165,233,${isHovered ? 0.5 : 0.3})`
                            : 'none',
                        }}
                      >
                        {row.value}
                      </span>
                      <span
                        className="font-body text-xs uppercase tracking-wider"
                        style={{ color: row.hero ? 'rgba(14,165,233,0.6)' : 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}
                      >
                        {row.unit}
                      </span>
                    </div>
                  </div>
                  {/* Mobile: detail below */}
                  <p
                    className="font-body text-xs pb-4 px-5 lg:hidden"
                    style={{ color: 'rgba(148,163,184,0.55)', lineHeight: 1.65 }}
                  >
                    {row.detail}
                  </p>

                  {/* Desktop: 3-column grid */}
                  <div className="hidden lg:grid lg:grid-cols-[180px_1fr_2fr] lg:gap-x-10 lg:items-baseline lg:py-6 px-6">
                    <span
                      className="font-body text-xs uppercase tracking-widest"
                      style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.15em' }}
                    >
                      {row.label}
                    </span>
                    <div className="flex items-baseline gap-2.5">
                      <span
                        className="font-display leading-none transition-all duration-300"
                        style={{
                          fontSize: row.hero ? 'clamp(2.4rem, 5vw, 3.8rem)' : 'clamp(1.6rem, 3.5vw, 2.4rem)',
                          color: row.hero
                            ? '#0EA5E9'
                            : isHovered ? 'rgba(241,245,249,1)' : 'rgba(241,245,249,0.9)',
                          textShadow: row.hero
                            ? `0 0 ${isHovered ? '48px' : '32px'} rgba(14,165,233,${isHovered ? 0.5 : 0.3})`
                            : 'none',
                        }}
                      >
                        {row.value}
                      </span>
                      <span
                        className="font-body text-xs uppercase tracking-wider"
                        style={{ color: row.hero ? 'rgba(14,165,233,0.6)' : 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}
                      >
                        {row.unit}
                      </span>
                    </div>
                    <p
                      className="font-body text-sm"
                      style={{ color: isHovered ? 'rgba(148,163,184,0.85)' : 'rgba(148,163,184,0.6)', lineHeight: 1.65, transition: 'color 0.25s ease' }}
                    >
                      {row.detail}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
