import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  videoSrcWebm?: string
  videoSrcMobile?: string
  videoSrcMobileWebm?: string
  fallbackImageSrc: string
  className?: string
}

export function VideoBackground({ videoSrc, videoSrcWebm, videoSrcMobile, videoSrcMobileWebm, fallbackImageSrc, className = '' }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoLoaded(true)
      video.play().catch(() => {})
    }
    const handleError = () => setVideoError(true)

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      {/* Image de fond — visible immédiatement, disparaît une fois la vidéo prête */}
      <div
        className="absolute inset-0 vbg-fallback"
        style={{
          backgroundImage: `url(${fallbackImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: videoLoaded && !videoError ? 0 : 1,
          transition: 'opacity 0.8s ease',
        }}
      />
      {!videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={fallbackImageSrc}
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          {videoSrcMobileWebm && <source src={videoSrcMobileWebm} type="video/webm" media="(max-width: 640px)" />}
          {videoSrcMobile    && <source src={videoSrcMobile}    type="video/mp4"  media="(max-width: 640px)" />}
          {videoSrcWebm      && <source src={videoSrcWebm}      type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
          <track kind="captions" src="/empty.vtt" srcLang="en" label="English" default />
        </video>
      )}
    </div>
  )
}
