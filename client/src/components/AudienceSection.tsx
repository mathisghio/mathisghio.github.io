import { useInView } from '@/hooks/useInView'

const rows = [
  {
    label: 'Reach mensuel',
    value: '1 000 000',
    unit: 'impressions',
    detail: 'en période de compétition · 400K hors saison · 18 000 abonnés Instagram · engagement 2–4× supérieur au secteur lifestyle',
    hero: true,
  },
  {
    label: 'Audience terrain',
    value: '150–200K',
    unit: 'spectateurs',
    detail: '6–8 étapes mondiales IWSA · 20+ pays au calendrier 2025 · villages officiels et finales sur plage',
    hero: false,
  },
  {
    label: 'Retombées presse',
    value: '200+',
    unit: 'parutions',
    detail: "L'Équipe · Eurosport · Stade 2 · Wind Mag · Voiles et Voiliers · Ouest France · Le Télégramme · plusieurs millions de foyers via JT",
    hero: false,
  },
  {
    label: 'Profil audience',
    value: '25–44 ans',
    unit: 'CSP+',
    detail: '75% hommes · France · Italie · Espagne · Brésil — pratiquants engagés, fort pouvoir d\'achat, early adopters outdoor',
    hero: false,
  },
]

export function AudienceSection() {
  const { ref, inView } = useInView(0.08)

  return (
    <section
      ref={ref}
      className="relative py-14 lg:py-20 overflow-hidden"
      style={{
        background: '#070B12',
        borderTop:    '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
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
            Audience & Reach
          </span>
        </div>

        <div>
          {rows.map((row, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.05)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${140 + i * 90}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="grid lg:grid-cols-[180px_1fr_2fr] gap-x-10 gap-y-1 py-5 lg:py-7 items-baseline">

                <span
                  className="font-body text-xs uppercase tracking-widest self-center lg:self-auto"
                  style={{ color: 'rgba(148,163,184,0.45)', letterSpacing: '0.15em' }}
                >
                  {row.label}
                </span>

                <div className="flex items-baseline gap-2.5">
                  <span
                    className="font-display leading-none"
                    style={{
                      fontSize: row.hero ? 'clamp(2.4rem, 5vw, 3.8rem)' : 'clamp(1.6rem, 3.5vw, 2.4rem)',
                      color: row.hero ? '#0EA5E9' : 'rgba(241,245,249,0.9)',
                      textShadow: row.hero ? '0 0 32px rgba(14,165,233,0.3)' : 'none',
                    }}
                  >
                    {row.value}
                  </span>
                  <span
                    className="font-body text-xs uppercase tracking-wider"
                    style={{ color: row.hero ? 'rgba(14,165,233,0.55)' : 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}
                  >
                    {row.unit}
                  </span>
                </div>

                <p
                  className="font-body text-sm col-start-1 lg:col-start-auto mt-1 lg:mt-0"
                  style={{ color: 'rgba(148,163,184,0.6)', lineHeight: 1.65 }}
                >
                  {row.detail}
                </p>

              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
        </div>

      </div>
    </section>
  )
}
