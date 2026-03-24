import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { LampContainer } from '@/components/ui/lamp'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

const galleryImages = [
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-1_31f119eb.jpg', alt: 'Mathis Ghio wingfoil racing action', span: 'col-span-2 row-span-2' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-2_397d8419.JPG', alt: 'Wingfoil competition', span: 'col-span-1 row-span-1' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-3_1c7dc267.JPG', alt: 'Racing action', span: 'col-span-1 row-span-1' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-4_27ccf7aa.JPG', alt: 'Wingfoil portrait', span: 'col-span-1 row-span-2' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-5_2015d9ef.JPG', alt: 'Competition moment', span: 'col-span-1 row-span-1' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-6_19d7f02b.JPG', alt: 'Wingfoil speed', span: 'col-span-1 row-span-1' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/index-gallery-7_9dcd6816.JPG', alt: 'Racing podium', span: 'col-span-1 row-span-1' },
  { src: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/podium-main_ca0aec18.JPG', alt: 'World Championship podium', span: 'col-span-1 row-span-1' },
]

export function GallerySection() {
  const { ref, inView } = useInView(0.05)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section id="gallery" ref={ref} style={{ background: '#08090E' }}>

      {/* ── Lamp header ── */}
      <LampContainer>
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
              Media Gallery
            </span>
          </div>
          <h2
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
          >
            RACING ACTION
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
            & PODIUMS
          </h2>
        </motion.div>
      </LampContainer>

      {/* ── Grille photos ── */}
      <div className="container relative z-10 pb-24 lg:pb-36">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px] transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '200ms',
          }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm cursor-pointer ${img.span}`}
              style={{
                border: '1px solid rgba(14, 165, 233, 0.08)',
                transition: 'all 0.4s ease',
                transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)',
                zIndex: hoveredIdx === i ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                style={{
                  transition: 'transform 0.6s ease, filter 0.4s ease',
                  transform: hoveredIdx === i ? 'scale(1.08)' : 'scale(1)',
                  filter: hoveredIdx === i
                    ? 'saturate(1.3) brightness(1.1)'
                    : 'saturate(1.0) brightness(0.9)',
                }}
                loading="lazy"
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,14,0.7) 100%)',
                  opacity: hoveredIdx === i ? 1 : 0,
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-wrap gap-4 justify-center transition-all duration-700"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '400ms',
          }}
        >
          {[
            { href: 'https://instagram.com/mathisghio', label: '@mathisghio' },
            { href: 'https://www.facebook.com/MathisGhioWing', label: 'Facebook' },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-sm font-heading font-semibold text-sm uppercase tracking-wider transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(241, 245, 249, 0.8)',
                letterSpacing: '0.1em',
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
