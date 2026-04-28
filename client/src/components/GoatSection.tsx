// ─────────────────────────────────────────────────────────────────────────────
// GoatSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'

const PODIUM_IMG = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774482083/IMG_8195_wortbf.jpg'

const STATS = [
  { num: '5',     suffix: '×', label: 'World Championships' },
  { num: '4',     suffix: '×', label: 'European Championships' },
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
    <section id="goat" ref={ref} className="relative py-24 lg:py-40 overflow-hidden" style={{ background: '#08090E' }}>
      <div role="img" aria-label="5th World Title podium" className="absolute inset-0 z-0"
        style={{ backgroundImage: `url(${PODIUM_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center 20%', opacity: 0.35, filter: 'saturate(0.6)' }} />
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(8,9,14,0.8), rgba(8,9,14,0.6), rgba(8,9,14,0.9))' }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ top: `${15 + i * 14}%`, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, rgba(14, 165, 233, ${0.03 + i * 0.01}), transparent)` }} />
      ))}

      <div className="container relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block font-body text-xs uppercase tracking-widest mb-8 px-4 py-2 rounded-sm"
            style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', letterSpacing: '0.25em' }}>
            AT THE HIGHEST LEVEL
          </span>
        </motion.div>

        {/* Headlines — each line staggers in */}
        <motion.div
          variants={headlineContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
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

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <p className="font-body text-lg" style={{ color: 'rgba(148, 163, 184, 0.7)', lineHeight: 1.7, letterSpacing: '0.01em' }}>
            Five consecutive world titles. No one has come close.
          </p>
        </motion.div>

        {/* Stats — staggered individually */}
        <motion.div
          variants={statContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {STATS.map((s, i) => (
            <motion.div key={i} variants={statItem} className="text-center">
              <div className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', color: i === 0 ? '#F59E0B' : '#0EA5E9', textShadow: i === 0 ? '0 0 40px rgba(245,158,11,0.5)' : '0 0 40px rgba(14,165,233,0.5)', lineHeight: 1 }}>
                {s.num}{s.suffix}
              </div>
              <div className="font-body text-xs uppercase tracking-wider mt-2" style={{ color: 'rgba(148,163,184,0.6)', letterSpacing: '0.1em' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
