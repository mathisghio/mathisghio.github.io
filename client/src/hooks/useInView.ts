// client/src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.15, rootMargin = '0px 0px -40px 0px') {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold, rootMargin }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}
