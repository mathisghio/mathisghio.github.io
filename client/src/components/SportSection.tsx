import { motion } from 'framer-motion'
import { Globe, Trophy, Zap, Target, ExternalLink } from 'lucide-react'
import { ShaderAnimation2 } from './ShaderAnimation2'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'
import { ShinyButton } from '@/components/ui/shiny-button'
import { PartnershipFormModal } from './PartnershipFormModal'

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
    description: 'Branded presence at 12 international competitions across 3 continents on the 2026 circuit. On-site visibility where the audience is live and engaged.',
  },
]

export function SportSection() {
  const { ref, inView } = useInView(0.1)

  return (
    <section
      id="sport"
      ref={ref}
      className="section-edge-fade relative py-10 lg:py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #08090E 0%, #060A14 50%, #08090E 100%)' }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.65 }}>
        <ShaderAnimation2 />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(8,9,14,0.60) 0%, rgba(8,9,14,0.48) 50%, rgba(8,9,14,0.60) 100%)' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 1 }} />

      <div className="container relative z-10">
        <div className="mb-10 lg:mb-16 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <SectionHeader label="For Brands" line1="WHY" line2="PARTNER?" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative transition-all duration-1000" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateX(0)' : 'translateX(-30px)', transitionDelay: '200ms' }}>
            <div className="rounded-sm overflow-hidden" style={{ border: '1px solid rgba(14,165,233,0.15)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', aspectRatio: '1/1' }}>
              <img src={FOIL_IMG} alt="Mathis Ghio racing at world championship speed" className="w-full h-full object-cover" style={{ filter: 'saturate(1.2) contrast(1.1)' }} loading="lazy" />
            </div>
            {/* Desktop badge — overlapping image */}
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
            {/* ── Block 1 ── */}
            <div className="mb-5 lg:mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Target size={13} style={{ color: '#0EA5E9', flexShrink: 0 }} />
                <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.18em' }}>
                  Targeting a High-Performance Audience
                </span>
              </div>
              <p className="font-body text-base" style={{ color: 'rgba(241,245,249,0.92)', lineHeight: 1.85 }}>
                Wingfoil racing connects with{' '}
                <strong style={{ color: '#fff', fontWeight: 700 }}>tech-savvy achievers</strong>{' '}
                aged 18–40. This audience values an active lifestyle and high-end innovation.
              </p>
            </div>

            {/* ── Block 2 ── */}
            <div className="mb-6 lg:mb-10">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={13} style={{ color: '#0EA5E9', flexShrink: 0 }} />
                <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.18em' }}>
                  Global Reach &amp; Technical Expertise
                </span>
              </div>
              <p className="font-body text-base" style={{ color: 'rgba(241,245,249,0.85)', lineHeight: 1.85 }}>
                The world circuit spans{' '}
                <span className="inline-flex items-center gap-1 align-middle font-semibold" style={{ background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.32)', borderRadius: 6, padding: '1px 8px', color: '#38BDF8', fontSize: '0.88em' }}>
                  <Globe size={11} />3 continents
                </span>{' '}
                to ensure a truly global presence. My track record includes{' '}
                <span className="inline-flex items-center gap-1 align-middle font-semibold" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.32)', borderRadius: 6, padding: '1px 8px', color: '#F59E0B', fontSize: '0.88em' }}>
                  <Trophy size={11} />5 world titles
                </span>{' '}
                and a{' '}
                <span className="inline-flex items-center gap-1 align-middle font-semibold" style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, padding: '1px 8px', color: '#FBB740', fontSize: '0.88em' }}>
                  <Zap size={11} />speed record
                </span>.{' '}
                As a{' '}
                <strong style={{ color: '#fff', fontWeight: 700 }}>Materials Science Engineering student</strong>{' '}
                at INSA Lyon, I bring hands-on technical credibility to every partnership. Four distinct competition formats allow us to{' '}
                <strong style={{ color: '#fff', fontWeight: 700 }}>tailor</strong> our strategy to your specific{' '}
                <strong style={{ color: '#fff', fontWeight: 700 }}>brand objectives</strong>.
              </p>
            </div>
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
                  className="sport-format-card flex items-start gap-5"
                >
                  <span
                    className="font-display text-sm flex-shrink-0 mt-0.5"
                    style={{ color: 'rgba(14,165,233,0.9)', letterSpacing: '0.1em', minWidth: '2rem', textShadow: '0 0 12px rgba(14,165,233,0.4)' }}
                  >
                    {format.number}
                  </span>
                  <div>
                    <h4 className="font-heading font-bold text-white mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                      {format.title}
                    </h4>
                    <p className="font-body text-sm" style={{ color: 'rgba(241,245,249,0.75)', lineHeight: 1.65 }}>
                      {format.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Partnership CTA ── */}
        <div
          className="mt-10 lg:mt-16 p-5 lg:p-8 rounded-sm transition-all duration-700"
          style={{
            background: 'rgba(8,9,14,0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(14,165,233,0.15)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '700ms',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="lg:max-w-[620px]">
              <h3
                className="font-heading font-bold text-2xl text-white mb-2"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                Make your brand part of the story.
              </h3>
              <p className="font-body text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
                Four activation formats, 12 events across 5 continents —<br className="hidden lg:block" />
                an engineering-driven athlete who knows what performance brands need.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <ShinyButton
                href="https://canva.link/s85g1kf1ihu4mgu"
                target="_blank"
                rel="noopener noreferrer"
                className="[--shiny-cta-highlight:#F59E0B] [--shiny-cta-bg:rgba(245,158,11,0.06)]"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={13} style={{ flexShrink: 0 }} />
                  Explore the Partnership Deck
                </span>
              </ShinyButton>
              <PartnershipFormModal trigger={<ShinyButton>Send a Direct Message</ShinyButton>} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
