import { motion } from 'framer-motion'
import { ShaderAnimation2 } from './ShaderAnimation2'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

const formatContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.55 } },
}

const formatLine = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const FOIL_IMG = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774497631/AI_Generated_Foil_ljznrd.png'

const partnershipFormats = [
  {
    number: '01',
    title: 'Title Sponsor',
    description: 'Brand naming rights across competition gear, wetsuit, and board. Maximum visibility in race footage, podium coverage, and media.',
  },
  {
    number: '02',
    title: 'R&D Collaboration',
    description: 'Co-develop performance products with a materials science engineering student who tests them at world-championship level. Real conditions, real feedback.',
  },
  {
    number: '03',
    title: 'Ambassador',
    description: 'Sustained brand presence across social channels, events, and content. Authentic reach to an active, international audience.',
  },
  {
    number: '04',
    title: 'Event & Activation',
    description: 'Branded presence at 10+ international competitions across 4 continents. On-site visibility where the audience is live and engaged.',
  },
]

export function SportSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section
      id="sport"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #08090E 0%, #060A14 50%, #08090E 100%)' }}
    >
      <div className="absolute inset-0 z-0" style={{ opacity: 0.65 }}>
        <ShaderAnimation2 />
      </div>
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(8,9,14,0.60) 0%, rgba(8,9,14,0.48) 50%, rgba(8,9,14,0.60) 100%)' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }} />

      <div className="container relative z-10">
        <div className="mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <SectionHeader label="For Brands" line1="WHY" line2="PARTNER?" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative transition-all duration-1000" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-30px)', transitionDelay: '200ms' }}>
            <div className="rounded-sm overflow-hidden" style={{ border: '1px solid rgba(14,165,233,0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', aspectRatio: '1/1' }}>
              <img src={FOIL_IMG} alt="Mathis Ghio racing at world championship speed" className="w-full h-full object-cover" style={{ filter: 'saturate(1.2) contrast(1.1)' }} />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 p-5 rounded-sm hidden lg:block"
              style={{ background: 'rgba(8,9,14,0.92)', border: '1px solid rgba(14,165,233,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(14,165,233,0.1)' }}>
              <div className="font-display text-4xl" style={{ color: '#0EA5E9', textShadow: '0 0 20px rgba(14,165,233,0.5)' }}>41.40</div>
              <div className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.7)', letterSpacing: '0.1em' }}>knots</div>
              <div className="font-body text-xs mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>World Speed Record</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-body text-base mb-4" style={{ color: 'rgba(241,245,249,0.92)', lineHeight: 1.8 }}>
              Wingfoil racing reaches an international audience of performance-oriented, tech-savvy adults aged 18–40. Active lifestyle, high disposable income, early adopters.
            </p>
            <p className="font-body text-base mb-10" style={{ color: 'rgba(241,245,249,0.85)', lineHeight: 1.8 }}>
              A worldwide circuit spanning five continents. Five world titles and a speed record. Materials science engineering studies that make co-branding credible. Four formats to match your objectives.
            </p>
            <motion.div
              variants={formatContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="flex flex-col gap-0"
            >
              {partnershipFormats.map((format, i) => (
                <motion.div
                  key={i}
                  variants={formatLine}
                  className="flex items-start gap-6 py-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span
                    className="font-display text-xs flex-shrink-0 mt-1"
                    style={{ color: 'rgba(14,165,233,0.9)', letterSpacing: '0.1em', minWidth: '2rem' }}
                  >
                    {format.number}
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-white mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.05rem' }}>
                      {format.title}
                    </h4>
                    <p className="font-body text-sm" style={{ color: 'rgba(241,245,249,0.78)', lineHeight: 1.6 }}>
                      {format.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
