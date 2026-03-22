import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { InteractiveWaves } from './InteractiveWaves'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

const careerTimeline = [
  {
    period: '2007–2017', title: 'The Beginning', subtitle: 'Early sailing & competition',
    description: "I've been registered on France's Elite Athlete list since 2017. I started competing internationally at age 7 at AVCR. I've been passionate about watersports since childhood, building the foundations of my career as a champion.",
    highlights: ['International competition from age 7', 'French Elite Athlete list (2017)', 'AVCR club training'], icon: '🌊',
  },
  {
    period: '2018–2021', title: 'Rising Star', subtitle: 'Transition to wingfoil',
    description: 'I discovered wingfoil and immediately felt a deep connection to the sport. I progressed rapidly through national and European competitions, establishing myself as a major force in this emerging discipline.',
    highlights: ['National wingfoil competitions', 'European circuit debut', 'Equipment R&D with Ozone'], icon: '⚡',
  },
  {
    period: '2022', title: 'First World Title', subtitle: 'Breakthrough season',
    description: 'I claimed my first Wingfoil Racing World Championship title and GWA Race European Championship. It was a historic season that announced my arrival at the absolute top of the sport.',
    highlights: ['Wingfoil Racing World Champion', 'GWA Race European Champion', '1st at GWA World Cup'], icon: '🏆', highlight: true,
  },
  {
    period: '2023', title: 'Double Champion', subtitle: 'Dominance begins',
    description: "I defended and expanded my world titles, becoming Double Wingfoil Racing World Champion. Three World Cup victories and the Formula Wing European title cemented my status as the sport's dominant force.",
    highlights: ['Double Wingfoil Racing World Champion', 'Formula Wing European Champion', '3× World Cup wins', '1st Defi Wing Superstars'], icon: '🥇', highlight: true,
  },
  {
    period: '2024', title: 'Triple Crown', subtitle: 'Unprecedented dominance',
    description: 'I had an extraordinary season culminating in a Triple Wingfoil Racing World Championship and Double Formula Wing European title. Three more World Cup victories confirmed my total mastery of the discipline.',
    highlights: ['Triple Wingfoil Racing World Champion', 'Double Formula Wing European Champion', '3× World Cup wins', '1st Defi Wing'], icon: '👑', highlight: true,
  },
  {
    period: '2025', title: 'Quadruple Champion', subtitle: 'The greatest of all time',
    description: "The most dominant season in my wingfoil career. I became Quadruple Wingfoil Racing World Champion, Formula Wing World Champion, and Triple Formula Wing European Champion. I'm incredibly grateful for what I've achieved.",
    highlights: ['Quadruple Wingfoil Racing World Champion', 'Formula Wing World Champion', 'Triple Formula Wing European Champion', '2× World Cup wins', '1st Defi Wing'], icon: '🌟', highlight: true, gold: true,
  },
]

export function CareerSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section id="career" ref={ref} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: 'linear-gradient(180deg, #08090E 0%, #050810 50%, #08090E 100%)' }}>
      <div className="absolute inset-0 z-0" style={{ opacity: 0.8 }}>
        <InteractiveWaves strokeColor="rgba(14, 165, 233, 0.5)" backgroundColor="transparent" pointerSize={1} />
      </div>
      <div className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none hidden lg:block z-20" style={{ background: 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.15), transparent)' }} />
      <div className="container relative z-20">
        <div className="mb-20 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="section-line" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>MY CAREER HISTORY</span>
          </div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>MY JOURNEY</h2>
          <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TO THE TOP</h2>
          <p className="font-body text-base mt-6 max-w-xl" style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.7 }}>From a young sailor on the French Riviera to where I am today — a journey defined by passion and dedication.</p>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px lg:hidden" style={{ background: 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.3), transparent)' }} />
          <div className="flex flex-col gap-0">
            {careerTimeline.map((item, i) => (
              <motion.div key={i} className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.5, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}>
                <div className={`flex gap-6 lg:gap-12 pb-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-shrink-0 lg:hidden pt-1">
                    <div className="w-3 h-3 rounded-full ml-4" style={{ background: (item as any).gold ? '#F59E0B' : '#0EA5E9', boxShadow: (item as any).gold ? '0 0 10px rgba(245,158,11,0.6)' : '0 0 10px rgba(14,165,233,0.6)', marginTop: '6px' }} />
                  </div>
                  <div className="flex-1 p-6 lg:p-8 rounded-sm card-hover" style={{ background: item.highlight ? 'rgba(14, 165, 233, 0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${(item as any).gold ? 'rgba(245, 158, 11, 0.25)' : item.highlight ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl flex-shrink-0">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="font-display text-3xl" style={{ color: (item as any).gold ? '#F59E0B' : '#0EA5E9' }}>{item.period}</span>
                          {(item as any).gold && (
                            <span className="px-2 py-0.5 rounded-sm font-body text-xs uppercase tracking-widest" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', letterSpacing: '0.1em' }}>GOAT Season</span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-xl text-white mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>{item.title}</h3>
                        <p className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.1em' }}>{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="font-body text-sm mb-5" style={{ color: 'rgba(148, 163, 184, 0.8)', lineHeight: 1.7 }}>{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((h, j) => (
                        <span key={j} className="px-3 py-1 rounded-sm font-body text-xs" style={{ background: (item as any).gold ? 'rgba(245, 158, 11, 0.08)' : 'rgba(14, 165, 233, 0.06)', color: (item as any).gold ? 'rgba(245, 158, 11, 0.9)' : 'rgba(14, 165, 233, 0.9)', border: `1px solid ${(item as any).gold ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 165, 233, 0.15)'}` }}>{h}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
                    <div className="w-4 h-4 rounded-full mt-6" style={{ background: (item as any).gold ? '#F59E0B' : '#0EA5E9', boxShadow: (item as any).gold ? '0 0 15px rgba(245,158,11,0.7)' : '0 0 15px rgba(14,165,233,0.7)', flexShrink: 0 }} />
                    <div className="flex-1 w-px mt-2" style={{ background: 'rgba(14, 165, 233, 0.15)' }} />
                  </div>
                  <div className="hidden lg:block flex-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
