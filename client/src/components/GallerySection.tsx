import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'
import { GlassCards, GlassCardImage } from '@/components/ui/glass-cards'
import { VideoPlayerPro } from '@/components/VideoPlayerPro'
import { GalleryRainBackground } from '@/components/GalleryRainBackground'

const MEDIA_VIDEO = 'https://res.cloudinary.com/duacto4ay/video/upload/v1774425298/media_1_mknwkz.mp4'

const galleryImages = [
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426735/index-gallery-1_wwaee1.jpg', alt: 'Mathis Ghio wingfoil racing action', span: 'col-span-2 row-span-2' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426727/index-gallery-2_kvqi4k.jpg', alt: '4th World Title', span: 'col-span-1 row-span-1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426715/index-gallery-3_f9zuop.jpg', alt: 'Silvaplana World Cup win', span: 'col-span-1 row-span-1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426741/index-gallery-4_lgsrmb.jpg', alt: 'Wingfoil land portrait', span: 'col-span-1 row-span-2' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426881/podium-5_lurawr.jpg', alt: 'Wingfoil frontflip', span: 'col-span-1 row-span-1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774375894/IMG_7060_cdolxq.png', alt: 'Istanbul start', span: 'col-span-1 row-span-1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426858/IMG_7389_2_kzk1do.jpg', alt: 'Shadow start', span: 'col-span-1 row-span-1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774482083/IMG_8195_wortbf.jpg', alt: '5th World title', span: 'col-span-1 row-span-1' },
]

const stackedImages: GlassCardImage[] = [
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426735/index-gallery-1_wwaee1.jpg', alt: 'Photo 1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426727/index-gallery-2_kvqi4k.jpg', alt: 'Photo 2' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426715/index-gallery-3_f9zuop.jpg', alt: 'Photo 3' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426741/index-gallery-4_lgsrmb.jpg', alt: 'Photo 4' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426881/podium-5_lurawr.jpg',        alt: 'Photo 5' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774375894/IMG_7060_cdolxq.png',        alt: 'Photo 6' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426858/IMG_7389_2_kzk1do.jpg',      alt: 'Photo 7' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774482083/IMG_8195_wortbf.jpg',        alt: 'Photo 8' },
  { src: 'CLOUDINARY_URL_9',  alt: 'Photo 9'  },
  { src: 'CLOUDINARY_URL_10', alt: 'Photo 10' },
  { src: 'CLOUDINARY_URL_11', alt: 'Photo 11' },
  { src: 'CLOUDINARY_URL_12', alt: 'Photo 12' },
  { src: 'CLOUDINARY_URL_13', alt: 'Photo 13' },
  { src: 'CLOUDINARY_URL_14', alt: 'Photo 14' },
  { src: 'CLOUDINARY_URL_15', alt: 'Photo 15' },
  { src: 'CLOUDINARY_URL_16', alt: 'Photo 16' },
  { src: 'CLOUDINARY_URL_17', alt: 'Photo 17' },
  { src: 'CLOUDINARY_URL_18', alt: 'Photo 18' },
  { src: 'CLOUDINARY_URL_19', alt: 'Photo 19' },
  { src: 'CLOUDINARY_URL_20', alt: 'Photo 20' },
]

function ScrollRevealVideo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  })

  const insetY   = useTransform(scrollYProgress, [0, 0.85], [48, 0])
  const insetX   = useTransform(scrollYProgress, [0, 0.85], [28, 0])
  const radius   = useTransform(scrollYProgress, [0, 0.85], [32, 6])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

  const labelOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1])
  const labelY       = useTransform(scrollYProgress, [0, 0.35], [24, 0])

  useEffect(() => {
    return scrollYProgress.on('change', v => {
      if (v > 0.3 && !revealed) setRevealed(true)
    })
  }, [scrollYProgress, revealed])

  return (
    <div ref={scrollRef} className="relative min-h-[220vh] w-full">
      <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center py-12 px-4">
        <motion.div style={{ opacity: labelOpacity, y: labelY }} className="flex items-center gap-3 mb-8">
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
            Race Highlights
          </span>
        </motion.div>
        <motion.div style={{ clipPath, width: '100%', maxWidth: 'min(96vw, 1200px)' }} className="overflow-hidden">
          {revealed ? (
            <VideoPlayerPro src={MEDIA_VIDEO} sound={false} />
          ) : (
            <div style={{ aspectRatio: '16/9', background: '#000' }} />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export function GallerySection() {
  const { ref, inView } = useInView(0.05)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    if (document.querySelector('script[src*="lightwidget"]')) return
    const s = document.createElement('script')
    s.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js'
    s.async = true
    document.body.appendChild(s)
  }, [])

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative"
      style={{ background: 'linear-gradient(180deg, #08090E 0%, #0A0F1A 50%, #08090E 100%)' }}
    >
      {/* ── Rain background — slower & lighter than Partners ── */}
      <GalleryRainBackground />

      {/* Edge fades to blend with adjacent sections */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #08090E 0%, transparent 10%, transparent 90%, #08090E 100%)' }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #08090E 0%, transparent 6%, transparent 94%, #08090E 100%)' }} />

      {/* ── Lamp header ── */}
      <div className="relative z-10">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="section-line" style={{ background: 'linear-gradient(90deg, rgba(241,245,249,0.4), transparent)' }} />
              <span className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(241,245,249,0.6)', letterSpacing: '0.2em' }}>
                Media Gallery
              </span>
            </div>
            <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>RACING ACTION</h2>
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              & PODIUMS
            </h2>
          </motion.div>
        </LampContainer>
      </div>

      {/* ── Image grid ── */}
      <div className="container relative z-10 pb-12 lg:pb-16">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px] transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '200ms' }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm cursor-pointer ${img.span}`}
              style={{ border: '1px solid rgba(14,165,233,0.08)', transition: 'all 0.4s ease', transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)', zIndex: hoveredIdx === i ? 10 : 1 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img
                src={img.src} alt={img.alt}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.6s ease, filter 0.4s ease', transform: hoveredIdx === i ? 'scale(1.08)' : 'scale(1)', filter: hoveredIdx === i ? 'saturate(1.3) brightness(1.1)' : 'saturate(1.0) brightness(0.9)' }}
                loading="lazy"
              />
              <div className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,14,0.7) 100%)', opacity: hoveredIdx === i ? 1 : 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll-reveal video ── */}
      <div className="container relative z-10">
        <ScrollRevealVideo />
      </div>

      {/* ── Glass stacked cards ── */}
      <div className="relative z-10 py-12">
        <div className="container mb-12">
          <div className="flex items-center gap-3">
            <div className="section-line" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>More moments</span>
          </div>
        </div>
        <GlassCards images={stackedImages.filter(img => !img.src.startsWith('CLOUDINARY_URL'))} />
      </div>

      {/* ── Social CTA ── */}
      <div
        className="container relative z-10 pb-12 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <ShinyButton href="https://instagram.com/mathisghio" target="_blank" rel="noopener noreferrer">@mathisghio</ShinyButton>
          <ShinyButton href="https://www.facebook.com/MathisGhioWing" target="_blank" rel="noopener noreferrer" className="[--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]">
            Facebook
          </ShinyButton>
        </div>
      </div>

      {/* ── Instagram LightWidget ── */}
      <div className="container relative z-10 pb-12 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transitionDelay: '550ms' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Latest on Instagram</span>
        </div>
        <iframe
          src="https://cdn.lightwidget.com/widgets/c150e04bd5dd5121bfcdce8fb511ff30.html"
          scrolling="no"
          allowTransparency={true}
          className="lightwidget-widget"
          style={{ width: '100%', border: 0, overflow: 'hidden', display: 'block', borderRadius: '4px' }}
        />
      </div>

      <div className="pb-12 lg:pb-24" />
    </section>
  )
}
