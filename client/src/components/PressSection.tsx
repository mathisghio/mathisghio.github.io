import { motion } from 'framer-motion'
import { Mail, ExternalLink, FileText, Handshake } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'

const DOCS = [
  {
    id: 'pressbook',
    label: 'Pressbook',
    sublabel: 'Complete Media Kit',
    description:
      'Full press kit including athlete biography, competition results, high-resolution photos, and official statistics for media and press use.',
    icon: FileText,
    color: '#0EA5E9',
    url: 'https://canva.link/zhyha69b76tu16b',
    cta: 'Open Pressbook',
  },
  {
    id: 'partnership',
    label: 'Partnership File',
    sublabel: 'Sponsorship Opportunities',
    description:
      'Detailed sponsorship proposal including audience reach, brand exposure opportunities, activation formats, and partnership packages.',
    icon: Handshake,
    color: '#F59E0B',
    url: 'https://canva.link/s85g1kf1ihu4mgu',
    cta: 'Open Partnership File',
  },
]

function DocCard({
  doc,
  inView,
  delay = 0,
}: {
  doc: typeof DOCS[number]
  inView: boolean
  delay?: number
}) {
  const Icon = doc.icon

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="rounded-sm"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${doc.color}20`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top glow edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${doc.color}60, transparent)` }}
        />

        <div className="relative p-5 sm:p-8 lg:p-10">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Icon badge */}
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ background: `${doc.color}10`, border: `1px solid ${doc.color}30` }}
              >
                <Icon size={22} style={{ color: doc.color }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="section-line"
                    style={{ background: `linear-gradient(90deg, ${doc.color}, transparent)` }}
                  />
                </div>
                <h3
                  className="font-heading font-bold text-xl uppercase tracking-wider"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: doc.color, letterSpacing: '0.12em', lineHeight: 1 }}
                >
                  {doc.label}
                </h3>
                <p
                  className="font-body text-xs uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.18em' }}
                >
                  {doc.sublabel}
                </p>
              </div>
            </div>

            {/* Canva badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm flex-shrink-0 text-[0.75rem] sm:text-[0.7rem]"
              style={{
                background: `${doc.color}0e`,
                border: `1px solid ${doc.color}25`,
                color: doc.color,
                fontFamily: 'Barlow Condensed, sans-serif',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <ExternalLink size={11} />
              <span>Canva</span>
            </div>
          </div>

          {/* Description */}
          <p
            className="font-body text-sm mb-8"
            style={{ color: 'rgba(148,163,184,0.7)', lineHeight: 1.75, maxWidth: '560px' }}
          >
            {doc.description}
          </p>

          {/* CTA button */}
          <ShinyButton
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className={doc.id === 'partnership'
              ? '[--shiny-cta-highlight:#F59E0B] [--shiny-cta-bg:rgba(245,158,11,0.06)]'
              : ''}
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} style={{ flexShrink: 0 }} />
              {doc.cta}
            </span>
          </ShinyButton>
        </div>
      </div>
    </div>
  )
}

export function PressSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section id="press" ref={ref} style={{ background: '#08090E' }}>

      {/* ── Lamp header ── */}
      
    <LampContainer className="min-h-[58vh] lg:min-h-[80vh] lamp-lower-desktop">
      <motion.div
          initial={{ opacity: 0.5, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="flex flex-col items-center text-center w-full"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div
              className="section-line"
              style={{ background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' }}
            />
            <span
              className="font-body text-xs uppercase tracking-widest"
              style={{ color: 'rgba(241, 245, 249, 0.6)', letterSpacing: '0.2em' }}
            >
              Press & Media
            </span>
          </div>
          <h2
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          >
            MEDIA KIT
          </h2>
          <h2
            className="font-display leading-none"
            style={{
              fontSize: 'clamp(48px, 8vw, 110px)',
              color: '#0EA5E9',
            }}
          >
            & RESOURCES
          </h2>
        </motion.div>
      </LampContainer>

      {/* ── Content ── */}
      <div className="container relative z-20 pb-10 lg:pb-36 -mt-[140px] lg:mt-[28px]">

        {/* Intro text */}
        <div
          className="mb-12 transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <p
            className="font-body text-base max-w-xl"
            style={{ color: 'rgba(148,163,184,0.6)', lineHeight: 1.75 }}
          >
            Access the complete press kit and partnership documents. Both files open directly on Canva
            where you can view, download or share them.
          </p>
        </div>

        {/* Two document cards */}
        <div className="flex flex-col gap-5 mb-12">
          {DOCS.map((doc, i) => (
            <DocCard key={doc.id} doc={doc} inView={inView} delay={i * 120} />
          ))}
        </div>

        {/* ── Media inquiry CTA ── */}
        <div
          className="p-8 rounded-sm transition-all duration-700"
          style={{
            background: 'rgba(14, 165, 233, 0.04)',
            border: '1px solid rgba(14, 165, 233, 0.15)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '350ms',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3
                className="font-heading font-bold text-xl text-white mb-2"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              >
                Media Inquiries & Press Requests
              </h3>
              <p className="font-body text-sm" style={{ color: 'rgba(148, 163, 184, 0.7)' }}>
                For interviews, press releases, photo requests, or media partnerships, please contact our press office.
              </p>
            </div>
            <ShinyButton href="mailto:contact@mathisghio.com?subject=Media%20Inquiry">
              <span className="flex items-center gap-2"><Mail size={16} />Contact Press</span>
            </ShinyButton>
          </div>
        </div>

      </div>
    </section>
  )
}
