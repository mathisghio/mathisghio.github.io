import { useInView } from '@/hooks/useInView'

const PODIUM_IMG = 'https://res.cloudinary.com/duacto4ay/image/upload/v1774482083/IMG_8195_wortbf.jpg'

export function GoatSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="goat" ref={ref} className="relative py-24 lg:py-40 overflow-hidden" style={{ background: '#08090E' }}>

      <div
        role="img"
        aria-label="5th World Title podium"
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${PODIUM_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          opacity: 0.35,
          filter: 'saturate(0.6)',
        }}
      />

      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(8,9,14,0.8), rgba(8,9,14,0.6), rgba(8,9,14,0.9))' }} />

      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ top: `${15 + i * 14}%`, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, rgba(14, 165, 233, ${0.03 + i * 0.01}), transparent)` }} />
      ))}

      <div className="container relative z-10 text-center">
        <div className="transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <span className="inline-block font-body text-xs uppercase tracking-widest mb-8 px-4 py-2 rounded-sm" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', letterSpacing: '0.25em' }}>
            AT THE HIGHEST LEVEL
          </span>
        </div>

        <div className="transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '150ms' }}>
          <h2 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>NO ONE HAS</h2>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: 'clamp(56px, 10vw, 140px)', background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>EVER DONE IT</h2>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>LIKE THIS</h2>
        </div>

        <div className="mt-12 max-w-3xl mx-auto transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '300ms' }}>
          <p className="font-body text-lg" style={{ color: 'rgba(148, 163, 184, 0.85)', lineHeight: 1.8 }}>
            I'm incredibly grateful for what I've been able to achieve in wingfoil racing. Five World Championships, four European titles, and a speed record of 41.40 knots represent years of dedication, hard work, and support from my team and sponsors.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '450ms' }}>
          {[
            { num: '5',     label: 'World Championships',   suffix: '×' },
            { num: '4',     label: 'European Championships', suffix: '×' },
            { num: '10',    label: 'World Cup Victories',    suffix: '+' },
            { num: '41.40', label: 'Knots Speed Record',     suffix: ''  },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 40px rgba(245,158,11,0.5)' : '0 0 40px rgba(14,165,233,0.5)', lineHeight: 1 }}>
                {s.num}{s.suffix}
              </div>
              <div className="font-body text-xs uppercase tracking-wider mt-2" style={{ color: 'rgba(148,163,184,0.6)', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
