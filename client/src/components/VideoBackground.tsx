import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  fallbackImageSrc: string
  className?: string
}

export function VideoBackground({ videoSrc, fallbackImageSrc, className = '' }: VideoBackgroundProps) {
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

    const handleError = () => {
      setVideoError(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${fallbackImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
          opacity: videoLoaded && !videoError ? 0 : 1,
          transition: 'opacity 0.6s ease',
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
          style={{
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
