import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Award } from 'lucide-react'
import { ShaderAnimation } from './ShaderAnimation'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView(0.3)
  const started = useRef(false)
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target * 100) / 100)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target, duration])
  return <span ref={ref}>{typeof target === 'number' && target % 1 !== 0 ? count.toFixed(2) : Math.round(count)}{suffix}</span>
}

const yearData = [
  { year: '2022', label: 'Breakthrough', color: '#0EA5E9', results: ['Wingfoil Racing World Champion', 'GWA Race European Champion', '1st at GWA World Cup'] },
  { year: '2023', label: 'Dominance Begins', color: '#0EA5E9', results: ['Double Wingfoil Racing World Champion', 'Formula Wing European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Defi Wing Superstars'] },
  { year: '2024', label: 'Triple Crown', color: '#0EA5E9', results: ['Triple Wingfoil Racing World Champion', 'Double Formula Wing European Champion', '3× 1st at Wingfoil Racing World Cups', '1st at Defi Wing'] },
  { year: '2025', label: 'Absolute Dominance', color: '#F59E0B', results: ['Quadruple Wingfoil Racing World Champion', 'Formula Wing World Champion', 'Triple Formula Wing European Champion', '2× 1st at Wingfoil Racing World Cups', '1st at Defi Wing'] },
]

export function AchievementsSection() {
  const { ref, inView } = useInView(0.1)
  const [activeYear, setActiveYear] = useState('2025')
  const activeData = yearData.find(y => y.year === activeYear)!

  return (
    <section id="achievements" ref={ref} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: '#08090E' }}>
     <div className="absolute inset-0 z-0" style={{ opacity: 0.4 }}>
        <ShaderAnimation />
      </div>
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(8,9,14,0.85) 0%, rgba(8,9,14,0.7) 50%, rgba(8,9,14,0.85) 100%)' }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display select-none pointer-events-none z-0" style={{ fontSize: 'clamp(200px, 30vw, 400px)', color: 'rgba(14, 165, 233, 0.03)', lineHeight: 1, right: '-2%' }}>5×</div>
      <div className="container relative z-10">
        <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="flex items-center gap-3 mb-6"><div className="section-line" /><span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Achievements</span></div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>MY WORLD TITLES</h2>
          <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>& PERSONAL RECORDS</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '200ms' }}>
          {[{ icon: Trophy, value: 5, suffix: '×', label: 'World Titles', gold: true }, { icon: Award, value: 4, suffix: '×', label: 'European Titles', gold: false }, { icon: Star, value: 10, suffix: '+', label: 'World Cup Wins', gold: false }, { icon: Zap, value: 41.40, suffix: ' kts', label: 'Speed Record', gold: false }].map((stat, i) => (
            <motion.div key={i} className="relative overflow-hidden rounded-sm p-6 card-hover" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.gold ? 'rgba(245, 158, 11, 0.25)' : 'rgba(14, 165, 233, 0.12)'}` }}>
              <stat.icon size={20} className="mb-3" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', opacity: 0.7 }} />
              <div className="font-display text-4xl lg:text-5xl" style={{ color: stat.gold ? '#F59E0B' : '#0EA5E9', textShadow: stat.gold ? '0 0 30px rgba(245, 158, 11, 0.4)' : '0 0 30px rgba(14, 165, 233, 0.4)' }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="font-body text-xs uppercase tracking-wider mt-2" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-20px)', transitionDelay: '400ms' }}>
            <h3 className="font-body text-xs uppercase tracking-widest mb-6" style={{ color: 'rgba(148, 163, 184, 0.6)', letterSpacing: '0.2em' }}>Season</h3>
            <div className="flex flex-col gap-2">
              {yearData.map((y) => (
                <button key={y.year} onClick={() => setActiveYear(y.year)} className="flex items-center gap-4 p-4 rounded-sm text-left transition-all duration-300" style={{ background: activeYear === y.year ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeYear === y.year ? y.color + '40' : 'rgba(255,255,255,0.05)'}` }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: activeYear === y.year ? y.color : 'rgba(148, 163, 184, 0.3)', boxShadow: activeYear === y.year ? `0 0 8px ${y.color}` : 'none' }} />
                  <div>
                    <div className="font-display text-2xl" style={{ color: activeYear === y.year ? y.color : 'rgba(241, 245, 249, 0.6)' }}>{y.year}</div>
                    <div className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.1em' }}>{y.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '500ms' }}>
            <div className="p-8 rounded-sm h-full" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeData.color}25`, minHeight: '300px' }}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="font-display text-6xl" style={{ color: activeData.color, textShadow: `0 0 30px ${activeData.color}60` }}>{activeData.year}</div>
                  <div className="font-body text-sm uppercase tracking-widest mt-1" style={{ color: 'rgba(148, 163, 184, 0.6)', letterSpacing: '0.15em' }}>{activeData.label}</div>
                </div>
                <Trophy size={32} style={{ color: activeData.color, opacity: 0.5 }} />
              </div>
              <div className="flex flex-col gap-3">
                {activeData.results.map((result, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeData.color }} />
                    <span className="font-body text-sm font-medium" style={{ color: 'rgba(241, 245, 249, 0.85)' }}>{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
