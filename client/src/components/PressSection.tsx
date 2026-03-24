import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Mail } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'


const pressResources = [
  {
    title: 'Pressbook',
    subtitle: 'Complete Media Kit',
    description: 'Full biography, career highlights, achievements, photos, and media assets for journalists and media outlets.',
    size: '21.6 MB',
    icon: FileText,
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/Pressbook_File_Mathis_GHIO_Wingfoil_53cdbaff.pdf',
    color: '#0EA5E9',
    gold: false,
  },
  {
    title: 'Partnership File',
    subtitle: 'Sponsorship Opportunities',
    description: 'Detailed partnership packages, sponsorship tiers, brand visibility opportunities, and collaboration options.',
    size: '3.7 MB',
    icon: FileText,
    url: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/Partnership_File_Mathis_GHIO_Wingfoil_14562782.pdf',
    color: '#F59E0B',
    gold: true,
  },
]

export function PressSection() {
  const { ref, inView } = useInView(0.05)

  return (
    <section id="press" ref={ref} style={{ background: '#08090E' }}>

      {/* ── Lamp header : titre seul dans la zone lumineuse ── */}
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

      {/* ── Contenu : cartes + CTA, sous la lampe ── */}
      <div className="container relative z-10 pb-24 lg:pb-36">

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {pressResources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-sm p-8 card-hover transition-all duration-700"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${resource.gold ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 165, 233, 0.15)'}`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center mb-6"
                  style={{
                    background: `${resource.color}15`,
                    border: `1px solid ${resource.color}40`,
                  }}
                >
                  <resource.icon size={20} style={{ color: resource.color }} />
                </div>
                <h3
                  className="font-heading font-bold text-2xl mb-1"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif', color: resource.color }}
                >
                  {resource.title}
                </h3>
                <p
                  className="font-body text-xs uppercase tracking-wider mb-4"
                  style={{ color: 'rgba(148, 163, 184, 0.5)', letterSpacing: '0.1em' }}
                >
                  {resource.subtitle}
                </p>
                <p
                  className="font-body text-sm mb-6"
                  style={{ color: 'rgba(148, 163, 184, 0.75)', lineHeight: 1.6 }}
                >
                  {resource.description}
                </p>
                <div
                  className="flex items-center justify-between pt-4"
                  style={{
                    borderTop: `1px solid ${resource.gold ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 165, 233, 0.1)'}`,
                  }}
                >
                  <span className="font-body text-xs" style={{ color: 'rgba(148, 163, 184, 0.5)' }}>
                    {resource.size}
                  </span>
                  <div
                    className="flex items-center gap-2 font-heading font-semibold text-sm"
                    style={{ color: resource.color, fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    <span>Download</span>
                    <Download size={14} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

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
              <p
                className="font-body text-sm"
                style={{ color: 'rgba(148, 163, 184, 0.7)' }}
              >
                For interviews, press releases, photo requests, or media partnerships, please contact our press office.
              </p>
            </div>
            <a
              href="mailto:contact@mathisghio.com?subject=Media%20Inquiry"
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-sm font-heading font-bold text-sm uppercase tracking-wider text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
                letterSpacing: '0.15em',
                textDecoration: 'none',
              }}
            >
              <Mail size={16} />
              Contact Press
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
