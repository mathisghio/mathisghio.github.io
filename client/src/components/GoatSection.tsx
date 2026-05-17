// ─────────────────────────────────────────────────────────────────────────────
// GoatSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const PODIUM_IMG = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774482083/IMG_8195_wortbf.jpg'

const STATS = [
  { num: '5',     suffix: '×', label: 'World Titles' },
  { num: '4',     suffix: '×', label: 'European Titles' },
  { num: '10',    suffix: '+', label: 'World Cup Victories' },
  { num: '41.40', suffix: '',  label: 'Knots Speed Record' },
]

const headlineContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
}

const headlineLine = {
  hidden: { opacity: 0, y: 64 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const statContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.9 } },
}

const statItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function GoatSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section id="goat" ref={ref} className="section-edge-fade relative py-10 lg:py-24 overflow-hidden" style={{ background: '#08090E' }}>
      <div role="img" aria-label="5th World Title podium" className="goat-podium-bg absolute inset-0 z-0"
        style={{ backgroundImage: `url(${PODIUM_IMG})`, backgroundSize: 'cover' }} />
      {/* Desktop: lighter overlay to let the photo breathe */}
      <div className="absolute inset-0 z-0 hidden lg:block" style={{ background: 'linear-gradient(to bottom, rgba(8,9,14,0.55), rgba(8,9,14,0.3), rgba(8,9,14,0.7))' }} />
      {/* Mobile: original darker overlay */}
      <div className="absolute inset-0 z-0 lg:hidden" style={{ background: 'linear-gradient(to bottom, rgba(8,9,14,0.8), rgba(8,9,14,0.6), rgba(8,9,14,0.9))' }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ top: `${15 + i * 14}%`, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, rgba(14, 165, 233, ${0.03 + i * 0.01}), transparent)` }} />
      ))}

      {/* Mobile: horizontal gradient darkens left/right edges behind split title */}
      <div className="absolute inset-0 z-[5] pointer-events-none lg:hidden"
        style={{ background: 'linear-gradient(90deg, rgba(8,9,14,0.82) 0%, transparent 36%, transparent 64%, rgba(8,9,14,0.82) 100%)' }} />

      <div className="container relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block font-body text-xs uppercase tracking-widest mb-5 lg:mb-8 px-4 py-2 rounded-sm"
            style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', letterSpacing: '0.25em' }}>
            AT THE HIGHEST LEVEL
          </span>
        </motion.div>

        {/* Headlines — DESKTOP */}
        <motion.div
          variants={headlineContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden lg:block"
        >
          <motion.h2 variants={headlineLine} className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
            NO ONE HAS
          </motion.h2>
          <motion.h2 variants={headlineLine} className="font-display leading-none mb-4" style={{ fontSize: 'clamp(56px, 10vw, 140px)', color: '#F59E0B' }}>
            EVER DONE IT
          </motion.h2>
          <motion.h2 variants={headlineLine} className="font-display text-white leading-none" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
            LIKE THIS
          </motion.h2>
        </motion.div>

        {/* Headlines — MOBILE: split layout frames the face */}
        <motion.div
          variants={headlineContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="lg:hidden"
        >
          {/* NO ONE HAS — centré */}
          <motion.h2 variants={headlineLine} className="font-display text-white leading-none mb-1" style={{ fontSize: 'clamp(36px, 9vw, 52px)' }}>
            NO ONE HAS
          </motion.h2>
          {/* EVER (gauche, or) ··· IT LIKE (droite, blanc) */}
          <motion.div variants={headlineLine} className="flex justify-between items-baseline leading-none">
            <span className="font-display" style={{ fontSize: 'clamp(52px, 13.5vw, 72px)', color: '#F59E0B', lineHeight: 1 }}>EVER</span>
            <span className="font-display text-white" style={{ fontSize: 'clamp(52px, 13.5vw, 72px)', lineHeight: 1 }}>IT LIKE</span>
          </motion.div>
          {/* DONE (gauche, or, collé à EVER) ··· THIS (droite, blanc, collé à IT LIKE) */}
          <motion.div variants={headlineLine} className="flex justify-between items-baseline leading-none -mt-2">
            <span className="font-display" style={{ fontSize: 'clamp(52px, 13.5vw, 72px)', color: '#F59E0B', lineHeight: 1 }}>DONE</span>
            <span className="font-display text-white" style={{ fontSize: 'clamp(52px, 13.5vw, 72px)', lineHeight: 1 }}>THIS</span>
          </motion.div>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 lg:mt-12 max-w-2xl mx-auto"
        >
          <p className="font-body text-lg" style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.7, letterSpacing: '0.01em' }}>
            Five consecutive world titles. No one has come close.
          </p>
        </motion.div>

        {/* Stats — glassmorphism cards on all screen sizes */}
        <motion.div
          variants={statContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto"
        >
          {STATS.map((s, i) => {
            const isGold = i === 0
            const rgb = isGold ? '245,158,11' : '14,165,233'
            const hex = isGold ? '#F59E0B' : '#0EA5E9'
            return (
              <motion.div
                key={i}
                variants={statItem}
                whileHover={{ scale: 1.04, y: -5 }}
                transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.22 }}
                className="relative overflow-hidden rounded-sm text-center cursor-default"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.24)`, backdropFilter: 'blur(10px)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${rgb},0.7), transparent)` }} />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0, 0.7, 0] }}
                  transition={{ duration: 2.8 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
                  style={{ background: `radial-gradient(ellipse at 50% 110%, rgba(${rgb},0.18) 0%, transparent 65%)` }}
                />
                <div className="relative z-10 p-5">
                  <div className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: hex, textShadow: `0 0 40px rgba(${rgb},0.55)`, lineHeight: 1 }}>
                    {s.num}{s.suffix}
                  </div>
                  <div className="font-body text-xs uppercase tracking-wider mt-2" style={{ color: 'rgba(148,163,184,0.65)', letterSpacing: '0.1em' }}>
                    {s.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
