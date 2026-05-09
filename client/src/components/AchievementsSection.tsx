import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Trophy, Star, Zap, Award } from 'lucide-react'
import { ShaderAnimation } from './ShaderAnimation'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'


function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView(0.3)
  const started = useRef(false)
  /*
   * useReducedMotion() — retourne true si l'utilisateur a activé
   * "Réduire les animations" (préférence OS / batterie faible).
   * Dans ce cas on affiche directement la valeur finale sans RAF.
   */
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (shouldReduceMotion) {
      setCount(target)
      return
    }

    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target * 100) / 100)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target, duration, shouldReduceMotion])

  return <span ref={ref}>{typeof target === 'number' && target % 1 !== 0 ? count.toFixed(2) : Math.round(count)}{suffix}</span>
}

const yearData = [
  { year: '2022', label: 'Breakthrough', color: '#0EA5E9', results: [
    'Wingfoil Racing World Champion — 1st title',
    'GWA Race European Champion — 1st European title',
    'First place at GWA World Cup',
    'First place at Wingfoil Racing World Cup',
  ]},
  { year: '2023', label: 'Dominance Begins', color: '#0EA5E9', results: [
    'Wingfoil Racing World Champion — 2nd consecutive title',
    'Formula Wing European Champion — 2nd consecutive European title',
    'First place at GWA World Cup',
    '3× First place at Wingfoil Racing World Cups',
    'First place at Défi Wing Superstars',
  ]},
  { year: '2024', label: 'Triple Crown', color: '#0EA5E9', results: [
    'Wingfoil Racing World Champion — 3rd consecutive title',
    'Formula Wing European Champion — 3rd consecutive European title',
    '3× First place at Wingfoil Racing World Cups',
    'First place at Défi Wing',
  ]},
  { year: '2025', label: 'Absolute Dominance', color: '#F59E0B', results: [
    'Wingfoil Racing World Champion — 4th consecutive title',
    'Formula Wing World Champion',
    'Formula Wing European Champion — 4th consecutive European title',
    '2× First place at Wingfoil Racing World Cups',
    'First place at Défi Wing',
  ]},
]

export function AchievementsSection() {
  const { ref, inView } = useInView(0.1)
  const [activeYear, setActiveYear] = useState('2025')
  const [hoveredYear, setHoveredYear] = useState<string | null>(null)
  const [hoveredResult, setHoveredResult] = useState<number | null>(null)
  const activeData = yearData.find(y => y.year === activeYear)!
  const shouldReduceMotion = useReducedMotion()
  const resultsRef = useRef<HTMLDivElement>(null)

  return (
    <section id="achievements" ref={ref} className="section-edge-fade relative py-10 lg:py-20 overflow-hidden" style={{ background: '#08090E' }}>
     <div className="absolute inset-0 z-0" style={{ opacity: 0.4 }}>
        <ShaderAnimation />
      </div>
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(8,9,14,0.85) 0%, rgba(8,9,14,0.7) 50%, rgba(8,9,14,0.85) 100%)' }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display select-none pointer-events-none z-0" style={{ fontSize: 'clamp(200px, 30vw, 400px)', color: 'rgba(14, 165, 233, 0.03)', lineHeight: 1, right: '-2%' }}>5×</div>
      <div className="container relative z-10">
        <div className="mb-10 lg:mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <SectionHeader label="Achievements" line1="MY WORLD TITLES" line2="& PERSONAL RECORDS" goldGradient />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-10 lg:mb-20 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '200ms' }}>
          {[{ icon: Trophy, value: 5, suffix: '×', label: 'World Titles', gold: true }, { icon: Award, value: 4, suffix: '×', label: 'European Titles', gold: false }, { icon: Star, value: 10, suffix: '+', label: 'World Cup Wins', gold: false }, { icon: Zap, value: 41.40, suffix: ' kts', label: 'Speed Record', gold: false }].map((stat, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-sm p-4 lg:p-6 card-hover"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : i * 0.1, ease: 'easeOut' }}
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.gold ? 'rgba(245, 158, 11, 0.25)' : 'rgba(14, 165, 233, 0.12)'}` }}
            >
              <stat.icon size={20} className="mb-3" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', opacity: 0.7 }} />
              <div className="font-display text-4xl lg:text-5xl" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', textShadow: stat.gold ? '0 0 30px rgba(245, 158, 11, 0.4)' : '0 0 30px rgba(14, 165, 233, 0.4)' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-body text-xs uppercase tracking-wider mt-2" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-5 lg:gap-8">
          <div className="lg:col-span-2 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-20px)', transitionDelay: '400ms' }}>
            <h3 className="font-body text-xs uppercase tracking-widest mb-3 lg:mb-6" style={{ color: 'rgba(148, 163, 184, 0.6)', letterSpacing: '0.2em' }}>Season</h3>
            <div className="flex flex-col gap-2">
              {yearData.map((y) => {
                const isActive = activeYear === y.year
                const isHovered = hoveredYear === y.year
                return (
                  <button
                    key={y.year}
                    onClick={() => {
                      setActiveYear(y.year)
                      setHoveredResult(null)
                      if (window.innerWidth < 1024) {
                        setTimeout(() => {
                          if (resultsRef.current) {
                            const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - 100
                            window.scrollTo({ top, behavior: 'smooth' })
                          }
                        }, 50)
                      }
                    }}
                    onMouseEnter={() => setHoveredYear(y.year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="flex items-center gap-4 p-3 lg:p-4 rounded-sm text-left"
                    style={{
                      background: isActive ? 'rgba(14, 165, 233, 0.08)' : isHovered ? 'rgba(14, 165, 233, 0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isActive ? y.color + '40' : isHovered ? y.color + '28' : 'rgba(255,255,255,0.05)'}`,
                      transform: !isActive && isHovered ? 'translateX(5px)' : 'translateX(0)',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                      background: isActive ? y.color : isHovered ? y.color + 'aa' : 'rgba(148, 163, 184, 0.3)',
                      boxShadow: isActive ? `0 0 8px ${y.color}` : isHovered ? `0 0 5px ${y.color}60` : 'none',
                      transition: 'all 0.25s ease',
                    }} />
                    <div>
                      <div className="font-display text-2xl" style={{
                        color: isActive ? y.color : isHovered ? 'rgba(241, 245, 249, 0.85)' : 'rgba(241, 245, 249, 0.6)',
                        transition: 'color 0.25s ease',
                      }}>{y.year}</div>
                      <div className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.1em' }}>{y.label}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div ref={resultsRef} className="lg:col-span-3 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '500ms' }}>
            <div className="p-5 lg:p-8 rounded-sm h-full" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeData.color}25`, minHeight: '280px' }}>
              <div className="flex items-start justify-between mb-5 lg:mb-8">
                <div>
                  <div className="font-display text-4xl lg:text-6xl" style={{ color: activeData.color, textShadow: `0 0 30px ${activeData.color}60` }}>{activeData.year}</div>
                  <div className="font-body text-sm uppercase tracking-widest mt-1" style={{ color: 'rgba(148, 163, 184, 0.6)', letterSpacing: '0.15em' }}>{activeData.label}</div>
                </div>
                <Trophy size={32} style={{ color: activeData.color, opacity: 0.5 }} />
              </div>
              <div className="flex flex-col gap-3">
                {activeData.results.map((result, i) => {
                  const isHov = hoveredResult === i
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredResult(i)}
                      onMouseLeave={() => setHoveredResult(null)}
                      className="flex items-center gap-3 p-3 rounded-sm cursor-default"
                      style={{
                        background: isHov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isHov ? activeData.color + '35' : 'rgba(255,255,255,0.04)'}`,
                        transform: isHov ? 'translateX(4px)' : 'translateX(0)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                        background: activeData.color,
                        boxShadow: isHov ? `0 0 6px ${activeData.color}` : 'none',
                        transition: 'box-shadow 0.2s ease',
                      }} />
                      <span className="font-body text-sm font-medium" style={{
                        color: isHov ? 'rgba(241, 245, 249, 1)' : 'rgba(241, 245, 249, 0.85)',
                        transition: 'color 0.2s ease',
                      }}>{result}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
