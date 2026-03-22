import { useEffect, useState } from 'react'
import { Waves } from './Waves'
import { VideoBackground } from './VideoBackground'
import { ShimmerText } from './ShimmerText'
import { ChevronDown } from 'lucide-react'

const HERO_VIDEO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/bg_4011f03b.mp4'
const HERO_GENERATED = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/hero-bg-generated_0e69783e.jpg'

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="relative w-full overflow-hidden" style={{ height: '100svh', minHeight: '600px' }}>
      <VideoBackground videoSrc={HERO_VIDEO} fallbackImageSrc={HERO_GENERATED} />
      <div className="absolute inset-0 z-20" style={{ background: 'linear-gradient(to bottom, rgba(8,9,14,0.6) 0%, rgba(8,9,14,0.4) 40%, rgba(8,9,14,0.8) 100%)' }} />
      <div className="absolute inset-0 z-30 hidden lg:block" style={{ opacity: 0.3 }}>
        <Waves strokeColor="rgba(14, 165, 233, 0.12)" backgroundColor="transparent" />
      </div>
      <div className="absolute left-0 top-0 bottom-0 z-30 flex flex-col justify-center gap-2 pl-6 hidden lg:flex">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px" style={{ width: `${20 + i * 8}px`, background: `rgba(14, 165, 233, ${0.2 + i * 0.08})` }} />
        ))}
      </div>
      <div className="relative z-40 h-full flex flex-col justify-end pb-24 lg:pb-32">
        <div className="container">
          <div className="mb-6 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}>
            <span className="inline-flex items-center gap-3 font-body text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-sm" style={{ color: '#0EA5E9', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.25)', letterSpacing: '0.2em' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0EA5E9', boxShadow: '0 0 6px #0EA5E9' }} />
              5× World Champion · 41.40 kts Speed Record
            </span>
          </div>
          <div className="transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '350ms' }}>
            <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}>MATHIS</h1>
            <h1 className="font-display leading-none" style={{ fontSize: 'clamp(72px, 14vw, 200px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>GHIO</h1>
          </div>
          <div className="mt-6 max-w-xl transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '500ms' }}>
            <p className="font-body text-lg font-light" style={{ color: 'rgba(241, 245, 249, 0.75)', lineHeight: 1.6 }}>
              I'm a professional wingfoil athlete, racing at the edge of what's possible. Passionate about pushing the sport forward.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '650ms' }}>
            <button
              onClick={() => document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative overflow-hidden px-8 py-3 font-heading font-bold text-sm uppercase tracking-widest text-white rounded-sm transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)', letterSpacing: '0.15em' }}
            >
              View My Achievements
            </button>
            <button
              onClick={() => document.querySelector('#career')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 font-heading font-semibold text-sm uppercase tracking-widest rounded-sm transition-all duration-300"
              style={{ color: 'rgba(241, 245, 249, 0.85)', border: '1px solid rgba(241, 245, 249, 0.2)', letterSpacing: '0.15em', background: 'rgba(255,255,255,0.04)' }}
            >
              My Journey
            </button>
          </div>
        </div>
      </div>
      <button onClick={scrollToAbout} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 transition-all duration-300 hover:opacity-70" style={{ color: 'rgba(241, 245, 249, 0.5)' }}>
        <span className="font-body text-xs uppercase tracking-widest" style={{ letterSpacing: '0.2em' }}>Scroll</span>
        <ChevronDown size={16} style={{ animation: 'float 2s ease-in-out infinite' }} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 z-40 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transitionDelay: '800ms', borderTop: '1px solid rgba(14, 165, 233, 0.1)', background: 'rgba(8, 9, 14, 0.6)', backdropFilter: 'blur(10px)' }}>
        <div className="container">
          <div className="grid grid-cols-3">
            {[{ value: '5×', label: 'World Champion' }, { value: '4×', label: 'European Champion' }, { value: '41.40 kts', label: 'Speed Record' }].map((stat, i) => (
              <div key={i} className="py-4 px-6 flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid rgba(14, 165, 233, 0.1)' : 'none' }}>
                <span className="font-display text-2xl lg:text-3xl" style={{ color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 20px rgba(245, 158, 11, 0.5)' : '0 0 20px rgba(14, 165, 233, 0.5)' }}>{stat.value}</span>
                <span className="font-body text-xs uppercase tracking-widest mt-1" style={{ color: 'rgba(148, 163, 184, 0.8)', letterSpacing: '0.1em' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
