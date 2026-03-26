import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'
import { GlassCards, GlassCardImage } from '@/components/ui/glass-cards'
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react'

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

/*
 * ── Replace each URL below with your 20 Cloudinary links ──────────────────
 * Format: { src: 'https://res.cloudinary.com/...', alt: 'description' }
 */
const stackedImages: GlassCardImage[] = [
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426735/index-gallery-1_wwaee1.jpg', alt: 'Photo 1' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426727/index-gallery-2_kvqi4k.jpg', alt: 'Photo 2' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426715/index-gallery-3_f9zuop.jpg', alt: 'Photo 3' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426741/index-gallery-4_lgsrmb.jpg', alt: 'Photo 4' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426881/podium-5_lurawr.jpg',        alt: 'Photo 5' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774375894/IMG_7060_cdolxq.png',        alt: 'Photo 6' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774426858/IMG_7389_2_kzk1do.jpg',      alt: 'Photo 7' },
  { src: 'https://res.cloudinary.com/duacto4ay/image/upload/v1774482083/IMG_8195_wortbf.jpg',        alt: 'Photo 8' },
  // ── Paste your 20 Cloudinary URLs here ── //
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

/* ─── Video player ─────────────────────────────────────────────────────── */
function VideoPlayer({ src }: { src: string }) {
  const videoRef      = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]         = useState(true)
  const [muted, setMuted]             = useState(true)   // autoplay requires muted start
  const [progress, setProgress]       = useState(0)
  const [duration, setDuration]       = useState(0)
  const [fullscreen, setFullscreen]   = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
    v.addEventListener('loadedmetadata', () => setDuration(v.duration))
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const fn = () => setProgress(v.currentTime / (v.duration || 1))
    v.addEventListener('timeupdate', fn)
    return () => v.removeEventListener('timeupdate', fn)
  }, [])

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 2800)
  }, [])

  useEffect(() => { resetHideTimer() }, [resetHideTimer])

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current; if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
  }

  const toggleFullscreen = () => {
    const el = videoRef.current?.closest('.video-player-root') as HTMLElement
    if (!document.fullscreenElement) { el?.requestFullscreen(); setFullscreen(true) }
    else { document.exitFullscreen(); setFullscreen(false) }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div
      className="video-player-root relative w-full overflow-hidden rounded-sm"
      style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(14,165,233,0.18)' }}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (hideTimer.current) clearTimeout(hideTimer.current); setShowControls(false) }}
      onMouseEnter={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay muted loop playsInline
      />

      {/* ── Sound badge — always visible until user unmutes ── */}
      {muted && (
        <button
          onClick={e => { e.stopPropagation(); toggleMute() }}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-200 hover:bg-white/20"
          style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
        >
          <VolumeX size={14} className="text-white" />
          <span className="font-body text-xs text-white uppercase tracking-wider" style={{ letterSpacing: '0.1em' }}>
            Son désactivé — cliquer pour activer
          </span>
        </button>
      )}

      {/* ── Controls bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{
          opacity:    showControls ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          padding:    '2.5rem 1.25rem 0.9rem',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        {/* Progress */}
        <div
          className="w-full h-1 rounded-full mb-3 cursor-pointer group"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full relative"
            style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)', transition: 'width 0.1s linear' }}
          >
            <div
              className="absolute right-0 top-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: '#fff', boxShadow: '0 0 6px rgba(14,165,233,0.8)', transform: 'translate(50%, -50%)' }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors p-1">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors p-1">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {fmt(progress * duration)} / {fmt(duration)}
          </span>
          <div className="flex-1" />
          <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 transition-colors p-1">
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Click overlay for play/pause — behind the sound badge */}
      <div className="absolute inset-0 cursor-pointer z-10" onClick={togglePlay} />
    </div>
  )
}

/* ─── Scroll-reveal wrapper ────────────────────────────────────────────── */
function ScrollRevealVideo() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  })

  /*
   * Bigger final size: video expands to full container width (no maxWidth cap
   * during the animation — the container itself is already max-w-[1200px]).
   * Larger starting inset (48% / 28%) → more dramatic reveal.
   */
  const insetY    = useTransform(scrollYProgress, [0, 0.85], [48, 0])
  const insetX    = useTransform(scrollYProgress, [0, 0.85], [28, 0])
  const radius    = useTransform(scrollYProgress, [0, 0.85], [32, 6])
  const clipPath  = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

  const labelOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1])
  const labelY       = useTransform(scrollYProgress, [0, 0.35], [24, 0])

  return (
    /* min-h-[220vh] gives more scroll space → the reveal feels slower + more cinematic */
    <div ref={scrollRef} className="relative min-h-[220vh] w-full">
      <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center py-12 px-4">

        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
            Race Highlights
          </span>
        </motion.div>

        {/*
         * maxWidth: min(96vw, 1200px) → video reaches near full screen width
         * when the inset animation finishes.
         */}
        <motion.div
          style={{ clipPath, width: '100%', maxWidth: 'min(96vw, 1200px)' }}
          className="overflow-hidden"
        >
          <VideoPlayer src={MEDIA_VIDEO} />
        </motion.div>
      </div>
    </div>
  )
}

/* ─── GallerySection ───────────────────────────────────────────────────── */
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
              <div className="absolute inset-0 transition-opacity duration-300" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,14,0.7) 100%)', opacity: hoveredIdx === i ? 1 : 0 }} />
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
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
              More moments
            </span>
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
          <ShinyButton href="https://instagram.com/mathisghio" target="_blank" rel="noopener noreferrer">
            @mathisghio
          </ShinyButton>
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
