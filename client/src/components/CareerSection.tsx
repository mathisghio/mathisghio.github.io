import { useEffect, useRef, useState } from 'react'
import { InteractiveWaves } from './InteractiveWaves'
import { Timeline } from '@/components/ui/timeline'

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Card component reused per entry ─────────────────────────────────────────
function CareerCard({
  icon,
  subtitle,
  description,
  highlights,
  badge,
  gold,
  highlight,
}: {
  icon: string
  subtitle: string
  description: string
  highlights: string[]
  badge?: string
  gold?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className="p-6 lg:p-8 rounded-sm mb-2"
      style={{
        background: highlight ? 'rgba(14, 165, 233, 0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${gold ? 'rgba(245, 158, 11, 0.25)' : highlight ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.05)'}`,
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            {badge && (
              <span
                className="px-2 py-0.5 rounded-sm font-body text-xs uppercase tracking-widest"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  letterSpacing: '0.1em',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <p
            className="font-body text-xs uppercase tracking-wider"
            style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.1em' }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <p
        className="font-body text-sm mb-5"
        style={{ color: 'rgba(148, 163, 184, 0.8)', lineHeight: 1.7 }}
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {highlights.map((h, j) => (
          <span
            key={j}
            className="px-3 py-1 rounded-sm font-body text-xs"
            style={{
              background: gold
                ? 'rgba(245, 158, 11, 0.08)'
                : 'rgba(14, 165, 233, 0.06)',
              color: gold
                ? 'rgba(245, 158, 11, 0.9)'
                : 'rgba(14, 165, 233, 0.9)',
              border: `1px solid ${gold ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 165, 233, 0.15)'}`,
            }}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline data ────────────────────────────────────────────────────────────
const timelineData = [
  {
    title: '2007–2017',
    content: (
      <CareerCard
        icon="🌊"
        subtitle="Early sailing & competition"
        description="I've been registered on France's Elite Athlete list since 2017. I started competing internationally at age 7 at AVCR. I've been passionate about watersports since childhood, building the foundations of my career as a champion."
        highlights={['International competition from age 7', 'French Elite Athlete list (2017)', 'AVCR club training']}
      />
    ),
  },
  {
    title: '2018–2021',
    content: (
      <CareerCard
        icon="⚡"
        subtitle="Transition to wingfoil"
        description="I discovered wingfoil and immediately felt a deep connection to the sport. I progressed rapidly through national and European competitions, establishing myself as a major force in this emerging discipline."
        highlights={['National wingfoil competitions', 'European circuit debut', 'Equipment R&D with Ozone']}
        highlight
      />
    ),
  },
  {
    title: '2022',
    content: (
      <CareerCard
        icon="🏆"
        subtitle="Breakthrough season"
        description="I claimed my first Wingfoil Racing World Championship title and GWA Race European Championship. It was a historic season that announced my arrival at the absolute top of the sport."
        highlights={['Wingfoil Racing World Champion', 'GWA Race European Champion', '1st at GWA World Cup']}
        highlight
      />
    ),
  },
  {
    title: '2023',
    content: (
      <CareerCard
        icon="🥇"
        subtitle="Dominance begins"
        description="I defended and expanded my world titles, becoming Double Wingfoil Racing World Champion. Three World Cup victories and the Formula Wing European title cemented my status as the sport's dominant force."
        highlights={['Double Wingfoil Racing World Champion', 'Formula Wing European Champion', '3× World Cup wins', '1st Defi Wing Superstars']}
        highlight
      />
    ),
  },
  {
    title: '2024',
    content: (
      <CareerCard
        icon="👑"
        subtitle="Unprecedented dominance"
        description="I had an extraordinary season culminating in a Triple Wingfoil Racing World Championship and Double Formula Wing European title. Three more World Cup victories confirmed my total mastery of the discipline."
        highlights={['Triple Wingfoil Racing World Champion', 'Double Formula Wing European Champion', '3× World Cup wins', '1st Defi Wing']}
        highlight
      />
    ),
  },
  {
    title: '2025',
    content: (
      <CareerCard
        icon="🌟"
        subtitle="The greatest of all time"
        description="The most dominant season in my wingfoil career. I became Quadruple Wingfoil Racing World Champion, Formula Wing World Champion, and Triple Formula Wing European Champion. I'm incredibly grateful for what I've achieved."
        highlights={['Quadruple Wingfoil Racing World Champion', 'Formula Wing World Champion', 'Triple Formula Wing European Champion', '2× World Cup wins', '1st Defi Wing']}
        badge="GOAT Season"
        gold
        highlight
      />
    ),
  },
]

// ─── Section ──────────────────────────────────────────────────────────────────
export function CareerSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section
      id="career"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #08090E 0%, #050810 50%, #08090E 100%)' }}
    >
      {/* Interactive wave background */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.8 }}>
        <InteractiveWaves
          strokeColor="rgba(14, 165, 233, 0.5)"
          backgroundColor="transparent"
          pointerSize={1}
        />
      </div>

      <div className="container relative z-20">
        {/* Section header */}
        <div
          className="mb-20 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="section-line" />
            <span
              className="font-body text-xs uppercase tracking-widest"
              style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}
            >
              MY CAREER HISTORY
            </span>
          </div>
          <h2
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          >
            MY JOURNEY
          </h2>
          <h2
            className="font-display leading-none"
            style={{
              fontSize: 'clamp(48px, 8vw, 110px)',
              background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TO THE TOP
          </h2>
          <p
            className="font-body text-base mt-6 max-w-xl"
            style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.7 }}
          >
            From a young sailor on the French Riviera to where I am today — a journey defined by passion and dedication.
          </p>
        </div>

        {/* Aceternity Timeline */}
        <div
          className="transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transitionDelay: '200ms',
          }}
        >
          <Timeline data={timelineData} />
        </div>
      </div>
    </section>
  )
}
