import { useInView } from '@/hooks/useInView'

/* q_auto,f_auto : Cloudinary choisit le meilleur format (WebP/AVIF)
   et compresse automatiquement → -40 à -60 % de poids par image */
const ABOUT_WATER = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774375894/portrait_terre_debgqe.jpg'
const ABOUT_LAND  = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774428254/portrait_eau_ggldfg.jpg'
const HERO_IMG    = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426100/hero-main_zissjo.jpg'

export function AboutSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <section id="about" ref={ref} className="section-edge-fade relative py-10 lg:py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #08090E 0%, #0A0F1A 50%, #08090E 100%)' }}>
      <div className="about-hero-bg absolute inset-0 z-0" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', opacity: 0.25, filter: 'saturate(0.5)' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(14, 165, 233, 0.04) 0%, transparent 60%)' }} />
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-center relative z-10">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5 lg:mb-8 transition-all relative z-10" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-40px)', transitionDelay: '100ms', transitionDuration: '800ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="section-line" />
              <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>About</span>
            </div>
            <div className="transition-all relative z-10" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(44px)', transitionDelay: '200ms', transitionDuration: '900ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <h2 className="font-display text-white leading-none mb-2" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>THE ATHLETE</h2>
              <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: '#0EA5E9' }}>BEHIND THE WING</h2>
            </div>
            {[
              { text: "French professional wingfoil athlete. Five World Championships, four European titles, 41.40 knots speed record. International competition since age seven.", delay: '300ms' },
              { text: "Member of the French Elite Athlete list since 2017. Currently studying Materials Science Engineering at INSA Lyon (Sport-Study) — a rare combination of elite athletics and engineering studies that makes every R&D partnership credible.", delay: '400ms' },
              { text: "R&D partnerships with Ozone, Levitaz Hydrofoils, and Forward Wip. Four on-water sessions weekly, three indoor. Every detail optimized.", delay: '500ms' },
            ].map((p, i) => (
              <p key={i} className="font-body mb-5 transition-all duration-700" style={{ color: 'rgba(148, 163, 184, 0.9)', lineHeight: 1.8, fontSize: '1rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: p.delay, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>{p.text}</p>
            ))}
            <div className="mt-5 lg:mt-8 py-5 px-5 transition-all duration-700" style={{ background: 'rgba(14,165,233,0.04)', borderTop: '1px solid rgba(14,165,233,0.18)', borderBottom: '1px solid rgba(14,165,233,0.18)', opacity: inView ? 1 : 0, transitionDelay: '600ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <blockquote className="font-heading font-semibold text-lg italic" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'rgba(241, 245, 249, 0.85)', letterSpacing: '0.01em' }}>
                "Performance is built in silence. Results speak on the water."
              </blockquote>
            </div>
            <div className="mt-6 lg:mt-10 grid grid-cols-3 gap-4 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transitionDelay: '700ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {[{ value: '5×', label: 'World Champion', gold: true }, { value: '4×', label: 'European Champion', gold: false }, { value: '41.40 kts', label: 'Speed Record', gold: false }].map((stat, i) => (
                <div key={i} className="p-4 rounded-sm text-center card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.gold ? 'rgba(245, 158, 11, 0.3)' : 'rgba(14, 165, 233, 0.15)'}` }}>
                  <div className="font-display text-3xl whitespace-nowrap" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', textShadow: stat.gold ? '0 0 20px rgba(245, 158, 11, 0.4)' : '0 0 20px rgba(14, 165, 233, 0.4)' }}>
                    {i === 2 ? (
                      <><span className="hidden lg:inline">{stat.value}</span><span className="lg:hidden">41.40</span></>
                    ) : stat.value}
                  </div>
                  {i === 2 ? (
                    <>
                      <div className="font-body text-xs uppercase tracking-wider mt-1 hidden lg:block" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>{stat.label}</div>
                      <div className="font-body uppercase tracking-wider mt-1 lg:hidden" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.05em', fontSize: '0.6rem' }}>KTS SPEED RECORD</div>
                    </>
                  ) : (
                    <div className="font-body text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>{stat.label}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 transition-all" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(64px)', transitionDelay: '150ms', transitionDuration: '1000ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="about-photo-wrap relative rounded-sm overflow-hidden" style={{ border: '1px solid rgba(14, 165, 233, 0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src={ABOUT_WATER} alt="Mathis Ghio wingfoiling on water" className="about-photo-img w-full h-full object-cover" style={{ filter: 'saturate(1.1) contrast(1.05)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(8,9,14,0.6) 100%)' }} />
            </div>
            <div className="absolute -bottom-8 -left-8 w-2/5 rounded-sm overflow-hidden hidden lg:block" style={{ border: '2px solid rgba(14, 165, 233, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(14, 165, 233, 0.15)', aspectRatio: '3/4' }}>
              <img src={ABOUT_LAND} alt="Mathis Ghio portrait" className="w-full h-full object-cover" loading="lazy" style={{ objectPosition: 'center top' }} />
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-3 rounded-sm" style={{ background: 'rgba(8, 9, 14, 0.9)', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 0 25px rgba(245, 158, 11, 0.15)' }}>
              <div className="font-display text-2xl" style={{ color: '#F59E0B' }}>FRA</div>
              <div className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>France</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
