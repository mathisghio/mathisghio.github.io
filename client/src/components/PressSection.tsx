import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Maximize2, X } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'

const DOCS = [
  {
    id: 'pressbook',
    label: 'Pressbook',
    sublabel: 'Complete Media Kit',
    color: '#0EA5E9',
    url: 'https://canva.link/s85g1kf1ihu4mgu',
  },
  {
    id: 'partnership',
    label: 'Partnership File',
    sublabel: 'Sponsorship Opportunities',
    color: '#F59E0B',
    url: 'https://canva.link/zhyha69b76tu16b',
  },
]

function CanvaEmbed({
  doc,
  inView,
  delay = 0,
}: {
  doc: typeof DOCS[number]
  inView: boolean
  delay?: number
}) {
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <>
      <div
        className="transition-all duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(30px)',
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="section-line"
              style={{ background: `linear-gradient(90deg, ${doc.color}, transparent)` }}
            />
            <div>
              <span
                className="font-heading font-bold text-lg uppercase tracking-wider block"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', color: doc.color, letterSpacing: '0.12em' }}
              >
                {doc.label}
              </span>
              <span
                className="font-body text-xs uppercase tracking-widest"
                style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.18em' }}
              >
                {doc.sublabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => setFullscreen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm transition-all duration-200"
            style={{
              background: `${doc.color}0e`,
              border: `1px solid ${doc.color}30`,
              color: 'rgba(148,163,184,0.7)',
              fontSize: '0.7rem',
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${doc.color}60` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${doc.color}30` }}
          >
            <Maximize2 size={12} />
            Plein écran
          </button>
        </div>

        {/* iframe wrapper */}
        <div
          className="relative w-full rounded-sm overflow-hidden"
          style={{
            aspectRatio: '16/10',
            border: `1px solid ${doc.color}20`,
            boxShadow: `0 0 60px ${doc.color}08`,
            background: 'rgba(4,6,14,0.95)',
          }}
        >
          {/* Top glow edge */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
            style={{ background: `linear-gradient(90deg, transparent, ${doc.color}50, transparent)` }}
          />
          <iframe
            src={`${doc.url}?embed`}
            allowFullScreen
            allow="fullscreen"
            loading="lazy"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title={`Mathis Ghio — ${doc.label}`}
          />
        </div>

        {/* Caption */}
        <p
          className="mt-3 font-body text-xs text-center"
          style={{ color: 'rgba(148,163,184,0.4)', letterSpacing: '0.05em' }}
        >
          Document mis à jour en temps réel · Powered by Canva
        </p>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ background: 'rgba(4,6,14,0.97)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: `1px solid ${doc.color}20` }}
          >
            <div>
              <span
                className="font-heading font-bold uppercase tracking-wider"
                style={{ fontFamily: 'Barlow Condensed, sans-serif', color: doc.color, letterSpacing: '0.15em', fontSize: '1.1rem' }}
              >
                {doc.label}
              </span>
              <span
                className="ml-3 font-body text-xs uppercase"
                style={{ color: 'rgba(148,163,184,0.4)', letterSpacing: '0.1em' }}
              >
                {doc.sublabel}
              </span>
            </div>
            <button
              onClick={() => setFullscreen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(148,163,184,0.7)',
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 relative">
            <iframe
              src={`${doc.url}?embed`}
              allowFullScreen
              allow="fullscreen"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title={`Mathis Ghio — ${doc.label} (fullscreen)`}
            />
          </div>
        </div>
      )}
    </>
  )
}

export function PressSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section id="press" ref={ref} style={{ background: '#08090E' }}>

      {/* ── Lamp header ── */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="flex flex-col items-center text-center w-full"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="section-line" style={{ background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' }} />
            <span
              className="font-body text-xs uppercase tracking-widest"
              style={{ color: 'rgba(241, 245, 249, 0.6)', letterSpacing: '0.2em' }}
            >
              Press & Media
            </span>
          </div>
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
            MEDIA KIT
          </h2>
          <h2
            className="font-display leading-none"
            style={{
              fontSize: 'clamp(48px, 8vw, 110px)',
              background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            & RESOURCES
          </h2>
        </motion.div>
      </LampContainer>

      {/* ── Content ── */}
      <div className="container relative z-10 pb-24 lg:pb-36">

        {/* Two embeds stacked */}
        <div className="flex flex-col gap-16 mb-12">
          {DOCS.map((doc, i) => (
            <CanvaEmbed key={doc.id} doc={doc} inView={inView} delay={i * 150} />
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
            transitionDelay: '400ms',
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
