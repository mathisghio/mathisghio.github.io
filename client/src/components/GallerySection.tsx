import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'
import { GlassCards, GlassCardImage } from '@/components/ui/glass-cards'
import { VideoPlayerPro } from '@/components/VideoPlayerPro'
import { trackGalleryClick, trackSocialClick, trackVideoPlay, trackVideoEnd } from '@/lib/analytics'

/* q_auto pour la vidéo → Cloudinary choisit le bitrate optimal */
const MEDIA_VIDEO        = 'https://res.cloudinary.com/duacto4ay/video/upload/q_auto/v1774425298/media_1_mknwkz.mp4'
const MEDIA_VIDEO_POSTER = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1777807705/Cover-video_njzjgn.jpg'

/* q_auto,f_auto pour les images → WebP/AVIF selon le navigateur */
const galleryImages = [
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426735/index-gallery-1_wwaee1.jpg', alt: 'Mathis Ghio wingfoil racing action', span: 'col-span-2 row-span-2', pos: 'center 30%' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426727/index-gallery-2_kvqi4k.jpg', alt: '4th World Title', span: 'col-span-1 row-span-1', pos: 'center 20%' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426715/index-gallery-3_f9zuop.jpg', alt: 'Silvaplana World Cup win', span: 'col-span-1 row-span-1', pos: 'center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426741/index-gallery-4_lgsrmb.jpg', alt: 'Wingfoil land portrait', span: 'col-span-1 row-span-2', pos: 'center top' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426881/podium-5_lurawr.jpg', alt: 'Wingfoil frontflip', span: 'col-span-1 row-span-1', pos: 'center 25%' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774375894/IMG_7060_cdolxq.png', alt: 'Istanbul start', span: 'col-span-1 row-span-1', pos: 'center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774426858/IMG_7389_2_kzk1do.jpg', alt: 'Shadow start', span: 'col-span-1 row-span-1', pos: 'center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1774482083/IMG_8195_wortbf.jpg', alt: '5th World title', span: 'col-span-1 row-span-1', pos: 'center 15%' },
]

const stackedImages: GlassCardImage[] = [
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016055/More_photos_1_ks3r0q.jpg',  alt: '2025 Défi Wing winner', objectPosition: 'center 20%' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_2_pfp3ie.jpg',  alt: '2025 Formula Wing World Champion', objectPositionMobile: '25% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016055/More_photos_3_d9klwi.jpg',  alt: "Railey above Marseille's calanques", objectPosition: 'center top', objectPositionMobile: '40% top' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016055/More_photos_4_bcbi2t.jpg',  alt: '2025 Formula Wing European Champion', objectPositionMobile: '60% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_5_gipmuv.jpg',  alt: '2025 Formula Wing European Champion', objectPositionMobile: '55% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016055/More_photos_6_v0jnzc.jpg',  alt: 'Downwind mark rounding at 2025 World Cup in Morocco', objectPositionMobile: '65% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_7_ufk3ma.jpg',  alt: 'Focused before taking first place at 2025 World Cup in Silvaplana', objectPositionMobile: '10% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016055/More_photos_8_tzqwts.jpg',  alt: '2025 Morocco World Cup winner', objectPositionMobile: '65% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_9_ejotal.jpg',  alt: '2025 Brazil World Cup', objectPositionMobile: '20% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_10_xd4mim.jpg', alt: 'Foil slide at 2025 China World Cup', objectPositionMobile: '20% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016054/More_photos_11_ofnfl1.jpg', alt: 'Freestyle foil slide in Marseille', objectPositionMobile: '65% center' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto/v1778016161/More_photos_12_qqr8zh.jpg', alt: 'Focused approaching next mark at 2025 Formula Wing World Championship', objectPositionMobile: '25% center' },
]

function ScrollRevealVideo() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const prevVRef = useRef(0)
  const rectRef  = useRef<{ top: number; bottom: number } | null>(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  })

  const insetY   = useTransform(scrollYProgress, [0, 0.85], [48, 0])
  const insetX   = useTransform(scrollYProgress, [0, 0.85], [28, 0])
  const radius   = useTransform(scrollYProgress, [0, 0.85], [32, 6])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

  const labelOpacity      = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const labelY            = useTransform(scrollYProgress, [0, 0.15], [24, 0])
  const scrollHintOpacity = useTransform(scrollYProgress, [0.06, 0.20, 0.68, 0.82], [0, 1, 1, 0])

  /* Cache bounding rect — updated on mount and resize to avoid forced reflow on every scroll tick */
  useEffect(() => {
    const update = () => {
      const r = scrollRef.current?.getBoundingClientRect()
      if (r) rectRef.current = { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY }
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  /* Reset when section leaves viewport entirely */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setRevealed(false)
    }, { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Direction-aware reveal — uses cached rect to avoid forced reflow on every scroll tick */
  useEffect(() => {
    return scrollYProgress.on('change', v => {
      const rect = rectRef.current
      if (!rect) return
      const scrollY = window.scrollY
      const inView = scrollY + window.innerHeight > rect.top && scrollY < rect.bottom
      if (!inView) { prevVRef.current = v; return }
      const goingDown = v > prevVRef.current
      prevVRef.current = v
      if (goingDown && v >= 0.85) setRevealed(true)
      else if (!goingDown && v <= 0.95) setRevealed(true)
    })
  }, [scrollYProgress])

  /* Freeze scroll for 2s (wheel + touch) when the video fully reveals — desktop and mobile */
  useEffect(() => {
    if (!revealed) return
    const preventWheel = (e: WheelEvent) => { e.preventDefault() }
    const preventTouch = (e: TouchEvent) => { e.preventDefault() }
    document.addEventListener('wheel', preventWheel, { passive: false })
    document.addEventListener('touchmove', preventTouch, { passive: false })
    const t = setTimeout(() => {
      document.removeEventListener('wheel', preventWheel)
      document.removeEventListener('touchmove', preventTouch)
    }, 2000)
    return () => {
      clearTimeout(t)
      document.removeEventListener('wheel', preventWheel)
      document.removeEventListener('touchmove', preventTouch)
    }
  }, [revealed])

  /* Scroll-driven reveal animation */
  return (
    <div ref={scrollRef} className="relative min-h-[200vh] lg:min-h-[220vh] w-full">
      <div className="sticky top-0 w-full min-h-screen flex flex-col items-center justify-center lg:py-12 px-4 py-8">
        <motion.div style={{ opacity: labelOpacity, y: labelY }} className="flex items-center gap-3 mb-4 lg:mb-8">
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
            Race Highlights
          </span>
        </motion.div>
        {/* Wrapper — gives the scroll hint a reference box matching the video */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 'min(96vw, 900px)', margin: '0 auto' }}>
          <motion.div style={{ clipPath }} className="overflow-hidden">
            {revealed ? (
              <VideoPlayerPro src={MEDIA_VIDEO} poster={MEDIA_VIDEO_POSTER} sound={false} autoplay onPlayCallback={trackVideoPlay} onEndedCallback={trackVideoEnd} />
            ) : (
              <img src={MEDIA_VIDEO_POSTER} alt="Race highlights" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            )}
          </motion.div>

          {/* Scroll hint — centered over the video frame, outside the clip-path */}
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none select-none"
          >
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2em', textShadow: '0 1px 10px rgba(0,0,0,0.9)' }}>
              Scroll to reveal
            </span>
            <motion.svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M5 8l5 5 5-5" />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function GallerySection() {
  const { ref, inView } = useInView(0.05)
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null)
  const [igVisible,    setIgVisible]    = useState(false)
  const [lightboxIdx,  setLightboxIdx]  = useState<number | null>(null)
  const igRef = useRef<HTMLDivElement>(null)

  /* Keyboard navigation + Escape for lightbox */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
      else if (e.key === 'ArrowLeft')  setLightboxIdx(i => i !== null ? Math.max(0, i - 1) : null)
      else if (e.key === 'ArrowRight') setLightboxIdx(i => i !== null ? Math.min(galleryImages.length - 1, i + 1) : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Body scroll lock when lightbox is open */
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  /* Load LightWidget script + iframe only when section is ~400px away */
  useEffect(() => {
    const el = igRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      setIgVisible(true)
      if (!document.querySelector('script[src*="lightwidget"]')) {
        const s = document.createElement('script')
        s.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js'
        s.async = true
        document.body.appendChild(s)
      }
    }, { rootMargin: '400px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative"
      style={{ background: 'transparent' }}
    >

      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #08090E 0%, transparent 15%)' }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #08090E 0%, transparent 6%, transparent 94%, #08090E 100%)' }} />

      <div className="relative z-[15]">
        <LampContainer className="min-h-[58vh] lg:min-h-[80vh] lamp-lower-desktop" bgColor="transparent">
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
            <h2 className="font-display leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)', color: '#0EA5E9' }}>
              & PODIUMS
            </h2>
          </motion.div>
        </LampContainer>
      </div>

      <div className="container relative z-10 pb-0 lg:pb-16 -mt-[200px] lg:-mt-[200px]">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 auto-rows-[160px] lg:auto-rows-[200px] transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: '200ms' }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm cursor-pointer ${img.span}`}
              style={{ border: '1px solid rgba(14,165,233,0.08)', transition: 'all 0.4s ease', transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)', zIndex: hoveredIdx === i ? 10 : 1 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => { setLightboxIdx(i); trackGalleryClick(img.alt) }}
            >
              <img
                src={img.src} alt={img.alt}
                className={`w-full h-full object-cover${i < 3 ? ` gallery-img-${i}` : ''}`}
                style={{ transition: 'transform 0.6s ease, filter 0.4s ease', transform: hoveredIdx === i ? 'scale(1.08)' : 'scale(1)', filter: hoveredIdx === i ? 'saturate(1.3) brightness(1.1)' : 'saturate(1.0) brightness(0.9)', objectPosition: img.pos }}
                loading="lazy"
              />
              <div className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,14,0.7) 100%)', opacity: hoveredIdx === i ? 1 : 0 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="container relative z-10">
        <ScrollRevealVideo />
      </div>

      <div className="relative z-10 pt-0 pb-0 lg:py-12">
        <div className="container mb-1 lg:mb-4">
          <div className="flex items-center gap-3">
            <div className="section-line" />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>More moments</span>
          </div>
        </div>
        <GlassCards images={stackedImages} />
        <div className="h-[30vh] lg:h-0" />
      </div>

      <div
        className="container relative z-10 pt-4 lg:pt-6 pb-4 lg:pb-12 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <ShinyButton href="https://instagram.com/mathisghio" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('instagram')}>@mathisghio</ShinyButton>
          <ShinyButton href="https://www.facebook.com/MathisGhioWing" target="_blank" rel="noopener noreferrer" className="[--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]" onClick={() => trackSocialClick('facebook')}>
            Facebook
          </ShinyButton>
        </div>
      </div>

      <div ref={igRef} className="container relative z-10 pb-4 lg:pb-12 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transitionDelay: '550ms' }}>
        <div className="flex items-center gap-3 mb-4 lg:mb-6">
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>Latest on Instagram</span>
        </div>
        {igVisible && (
          <iframe
            src="https://cdn.lightwidget.com/widgets/c150e04bd5dd5121bfcdce8fb511ff30.html"
            scrolling="no"
            allowTransparency={true}
            className="lightwidget-widget"
            style={{ width: '100%', border: 0, overflow: 'hidden', display: 'block', borderRadius: '4px' }}
          />
        )}
      </div>

      <div className="pb-2 lg:pb-6" />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 300, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={() => setLightboxIdx(null)}
          >
            {/* Image */}
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              src={galleryImages[lightboxIdx].src}
              alt={galleryImages[lightboxIdx].alt}
              onClick={e => e.stopPropagation()}
              draggable={false}
              style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 6, display: 'block', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
            />

            {/* Close */}
            <button
              onClick={() => setLightboxIdx(null)}
              aria-label="Fermer"
              style={{ position: 'fixed', top: 20, right: 20, width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? i - 1 : null) }}
                aria-label="Photo précédente"
                style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next */}
            {lightboxIdx < galleryImages.length - 1 && (
              <button
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => i !== null ? i + 1 : null) }}
                aria-label="Photo suivante"
                style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Caption + counter */}
            <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, pointerEvents: 'none' }}>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textAlign: 'center', maxWidth: '80vw', margin: 0 }}>
                {galleryImages[lightboxIdx].alt}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em', margin: 0 }}>
                {lightboxIdx + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
