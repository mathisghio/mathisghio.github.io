import { useInView } from '@/hooks/useInView'

const ABOUT_WATER = 'https://res.cloudinary.com/duacto4ay/image/upload/v1774375894/portrait_terre_debgqe.jpg'
const ABOUT_LAND = 'https://res.cloudinary.com/duacto4ay/image/upload/v1774428254/portrait_eau_ggldfg.jpg'
const HERO_IMG = 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426100/hero-main_zissjo.jpg'



export function AboutSection() {
  const { ref, inView } = useInView(0.15)

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: 'linear-gradient(180deg, #08090E 0%, #0A0F1A 50%, #08090E 100%)' }}>
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25, filter: 'saturate(0.5)' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(14, 165, 233, 0.04) 0%, transparent 60%)' }} />
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 transition-all duration-700 relative z-10" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-20px)', transitionDelay: '100ms' }}>
              <div className="section-line" />
              <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>About</span>
            </div>
            <div className="transition-all duration-700 relative z-10" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}>
              <h2 className="font-display text-white leading-none mb-2" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>THE ATHLETE</h2>
              <h2 className="font-display leading-none mb-8" style={{ fontSize: 'clamp(48px, 7vw, 96px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>BEHIND THE WING</h2>
            </div>
            {[
              { text: "I\'m a French professional wingfoil and sailing athlete, competing internationally since childhood. I\'m a multiple-time World and European Champion in Wingfoil, competing at the highest international level.", delay: '300ms' },
              { text: "I\'m a member of the French Elite Athlete list (2017–2026), combining international competition with Materials Engineering studies at INSA Lyon in the Sport-Study program.", delay: '400ms' },
              { text: "I apply my engineering knowledge to product development and on-water testing through R&D collaborations with Ozone, Levitaz Hydrofoils, and Forward Wip. Weekly training: 4 on-water + 3 indoor/outdoor sessions. Focused on performance, innovation, and sharing wingfoil expertise globally.", delay: '500ms' },
            ].map((p, i) => (
              <p key={i} className="font-body mb-5 transition-all duration-700" style={{ color: 'rgba(148, 163, 184, 0.9)', lineHeight: 1.8, fontSize: '1rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(15px)', transitionDelay: p.delay }}>{p.text}</p>
            ))}
            <div className="mt-8 pl-5 transition-all duration-700" style={{ borderLeft: '3px solid #0EA5E9', opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-10px)', transitionDelay: '600ms' }}>
              <blockquote className="font-syne font-semibold text-lg italic" style={{ color: 'rgba(241, 245, 249, 0.9)' }}>
                "Performance is built in silence. Results speak on the water."
              </blockquote>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '700ms' }}>
              {[{ value: '5×', label: 'World Champion', gold: true }, { value: '4×', label: 'European Champion', gold: false }, { value: '77 km/h', label: 'Speed Record', gold: false }].map((stat, i) => (
                <div key={i} className="p-4 rounded-sm text-center card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.gold ? 'rgba(245, 158, 11, 0.3)' : 'rgba(14, 165, 233, 0.15)'}` }}>
                  <div className="font-display text-3xl" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', textShadow: stat.gold ? '0 0 20px rgba(245, 158, 11, 0.4)' : '0 0 20px rgba(14, 165, 233, 0.4)' }}>{stat.value}</div>
                  <div className="font-body text-xs uppercase tracking-wider mt-1" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 transition-all duration-1000" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(30px)', transitionDelay: '300ms' }}>
            <div className="relative rounded-sm overflow-hidden" style={{ aspectRatio: '4/5', border: '1px solid rgba(14, 165, 233, 0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src={ABOUT_WATER} alt="Mathis Ghio wingfoiling on water" className="w-full h-full object-cover" style={{ filter: 'saturate(1.1) contrast(1.05)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(8,9,14,0.6) 100%)' }} />
            </div>
            <div className="absolute -bottom-8 -left-8 w-2/5 rounded-sm overflow-hidden" style={{ border: '2px solid rgba(14, 165, 233, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(14, 165, 233, 0.15)', aspectRatio: '3/4' }}>
              <img src={ABOUT_LAND} alt="Mathis Ghio portrait" className="w-full h-full object-cover" />
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
