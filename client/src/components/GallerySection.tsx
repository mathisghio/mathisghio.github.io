import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { LampContainer } from '@/components/ui/lamp'
import { useInView } from '@/hooks/useInView'
import { ShinyButton } from '@/components/ui/shiny-button'
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2
} from 'lucide-react'

const MEDIA_VIDEO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663455151996/gejRxzH8i7adBy6yjBjf3b/media.mp4'

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

/* ─── Inline video player with custom controls ─────────────────────────── */
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]     = useState(true)
  const [muted, setMuted]         = useState(true)
  const [progress, setProgress]   = useState(0)
  const [duration, setDuration]   = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Auto-play on mount */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
    const onLoaded = () => setDuration(v.duration)
    v.addEventListener('loadedmetadata', onLoaded)
    return () => v.removeEventListener('loadedmetadata', onLoaded)
  }, [])

  /* Progress tracking */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => setProgress(v.currentTime / (v.duration || 1))
    v.addEventListener('timeupdate', onTime)
    return () => v.removeEventListener('timeupdate', onTime)
  }, [])

  /* Auto-hide controls */
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 2800)
  }, [])

  useEffect(() => { resetHideTimer() }, [resetHideTimer])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else          { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    v.currentTime = ratio * v.duration
  }

  const toggleFullscreen = () => {
    const el = videoRef.current?.parentElement as HTMLElement
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-sm"
      style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(14,165,233,0.15)' }}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (hideTimer.current) clearTimeout(hideTimer.current); setShowControls(false) }}
      onMouseEnter={resetHideTimer}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Controls bar — fades in/out */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          padding: '2rem 1rem 0.75rem',
        }}
      >
        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full mb-3 cursor-pointer group"
          style={{ background: 'rgba(255,255,255,0.2)' }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full relative transition-all"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)',
            }}
          >
            {/* Scrubber dot */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: '#fff', boxShadow: '0 0 6px rgba(14,165,233,0.8)', transform: 'translate(50%, -50%)' }}
            />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors p-1">
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Volume */}
          <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors p-1">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Time */}
          <span className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {fmt(progress * duration)} / {fmt(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 transition-colors p-1">
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Big play/pause overlay on click */}
      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />
    </div>
  )
}

/* ─── Scroll-reveal container (ContainerScroll pattern) ───────────────── */
function ScrollRevealVideo() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    /*
     * "start center" = animation begins when the top of the container
     *                  reaches the centre of the viewport
     * "end end"      = animation ends (fully open) when the bottom of the
     *                  container reaches the bottom of the viewport.
     * After that the user just continues scrolling normally.
     */
    offset: ['start center', 'end end'],
  })

  /* Clip-path inset: starts tight (40% each side) → fully open (0%) */
  const insetY = useTransform(scrollYProgress, [0, 0.85], [38, 0])
  const insetX = useTransform(scrollYProgress, [0, 0.85], [18, 0])
  /* Rounded corners: start pill-shaped → end sharp rectangle */
  const radius = useTransform(scrollYProgress, [0, 1], [28, 6])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`

  /* Label fades in as video opens */
  const labelOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const labelY       = useTransform(scrollYProgress, [0, 0.4], [20, 0])

  return (
    /*
     * min-h-[180vh] → gives ~80% of a viewport worth of scroll distance
     * for the reveal animation, then the remaining 100vh is "settled" time
     * where the video is fully visible and the user keeps scrolling.
     */
    <div ref={scrollRef} className="relative min-h-[180vh] w-full">
      <div className="sticky top-0 min-h-screen w-full flex flex-col items-center justify-center py-12">

        {/* Section label */}
        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="section-line" />
          <span className="font-body text-xs uppercase tracking-widest" style={{ color: '#0EA5E9', letterSpacing: '0.2em' }}>
            Race Highlights
          </span>
        </motion.div>

        {/* Clip-path reveal wrapper */}
        <motion.div
          style={{ clipPath, width: '100%', maxWidth: '960px' }}
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
    const script = document.createElement('script')
    script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js'
    script.async = true
    document.body.appendChild(script)
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
          <h2 className="font-display text-white leading-none" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
            RACING ACTION
          </h2>
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(48px, 8vw, 110px)', background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          >
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
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.6s ease, filter 0.4s ease', transform: hoveredIdx === i ? 'scale(1.08)' : 'scale(1)', filter: hoveredIdx === i ? 'saturate(1.3) brightness(1.1)' : 'saturate(1.0) brightness(0.9)' }}
                loading="lazy"
              />
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,9,14,0.7) 100%)', opacity: hoveredIdx === i ? 1 : 0 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll-reveal video ── */}
      <div className="container relative z-10">
        <ScrollRevealVideo />
      </div>

      {/* ── Social CTA buttons ── */}
      <div
        className="container relative z-10 pb-12 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <ShinyButton href="https://instagram.com/mathisghio" target="_blank" rel="noopener noreferrer">
            @mathisghio
          </ShinyButton>
          <ShinyButton
            href="https://www.facebook.com/MathisGhioWing"
            target="_blank"
            rel="noopener noreferrer"
            className="[--shiny-cta-highlight:#38BDF8] [--shiny-cta-bg:rgba(255,255,255,0.04)]"
          >
            Facebook
          </ShinyButton>
        </div>
      </div>

      {/* ── Instagram LightWidget ── */}
      <div
        className="container relative z-10 pb-12 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '550ms' }}
      >
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
