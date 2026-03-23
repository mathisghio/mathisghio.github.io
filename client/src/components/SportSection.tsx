import { useEffect, useRef, useState } from 'react'
import { Wind, Zap, Waves, Target } from 'lucide-react'
import { ShaderAnimation2 } from './ShaderAnimation2'

const FOIL_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/wingfoil-action-generated_c89eb0f5.jpg'

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

const sportFacts = [
  { icon: Wind, title: 'The Wing', description: 'A handheld inflatable wing that captures wind power. The athlete controls angle and power with both hands, generating lift and speed across the water surface.' },
  { icon: Zap, title: 'The Hydrofoil', description: 'An underwater wing system attached to the board. As speed increases, hydrodynamic lift raises the board completely above the water, reducing drag dramatically.' },
  { icon: Waves, title: 'The Board', description: 'A specially designed board that acts as the platform. Once foiling, the board flies 30–80cm above the water surface, creating a sensation of flying over the ocean.' },
  { icon: Target, title: 'Racing', description: 'Wingfoil racing involves buoy courses at high speed, tactical decision-making, and precise control. Top athletes reach speeds exceeding 40 knots (74 km/h).' },
]

export function SportSection() {
  const { ref, inView } = useInView(0.1)
  return (
    <section id="sport" ref={ref} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: 'linear-gradient(180deg, #08090E 0%, #060A14 50%, #08090E 100%)' }}>
      <div className="absolute inset-0 z-0" style={{ opacity: 0.18 }}>
        <ShaderAnimation2 />
      </div>
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(8,9,14,0.7) 0%, rgba(8,9,14,0.5) 50%, rgba(8,9,14,0.7) 100%)' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }} />
      <div className="container relative z-10">
        <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="flex items-center gap-3 mb-6"><div className="section-line" /><span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>The Sport</span></div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>WHAT IS</h2>
          <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>WINGFOIL?</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative transition-all duration-1000" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-30px)', transitionDelay: '200ms' }}>
            <div className="rounded-sm overflow-hidden" style={{ border: '1px solid rgba(14, 165, 233, 0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', aspectRatio: '1/1' }}>
              <img src={FOIL_IMG} alt="Wingfoil action" className="w-full h-full object-cover" style={{ filter: 'saturate(1.2) contrast(1.1)' }} />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 p-5 rounded-sm" style={{ background: 'rgba(8, 9, 14, 0.92)', border: '1px solid rgba(14, 165, 233, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(14, 165, 233, 0.1)' }}>
              <div className="font-display text-4xl" style={{ color: '#0EA5E9', textShadow: '0 0 20px rgba(14,165,233,0.5)' }}>41.40</div>
              <div className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(148, 163, 184, 0.7)', letterSpacing: '0.1em' }}>knots</div>
              <div className="font-body text-xs mt-1" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>World Speed Record</div>
            </div>
          </div>
          <div className="transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(30px)', transitionDelay: '300ms' }}>
            <p className="font-body text-base mb-8" style={{ color: 'rgba(148, 163, 184, 0.85)', lineHeight: 1.8 }}>Wingfoil is one of the fastest-growing water sports in the world. Combining a handheld inflatable wing with a hydrofoil board, athletes literally fly above the water surface, reaching extraordinary speeds with minimal equipment.</p>
            <p className="font-body text-base mb-10" style={{ color: 'rgba(148, 163, 184, 0.85)', lineHeight: 1.8 }}>The sport demands exceptional balance, wind reading ability, and physical conditioning. Racing involves tactical buoy courses where split-second decisions determine the winner.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sportFacts.map((fact, i) => (
                <div key={i} className="p-5 rounded-sm card-hover" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                  <fact.icon size={18} className="mb-3" style={{ color: '#0EA5E9' }} />
                  <h4 className="font-heading font-bold text-white mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem' }}>{fact.title}</h4>
                  <p className="font-body text-xs" style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.6 }}>{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
