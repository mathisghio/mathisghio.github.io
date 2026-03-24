'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
  x: number
  y: number
  wave: { x: number; y: number }
  cursor: { x: number; y: number; vx: number; vy: number }
}

interface InteractiveWavesProps {
  className?: string
  strokeColor?: string
  backgroundColor?: string
  pointerSize?: number
}

export function InteractiveWaves({
  className = '',
  strokeColor = 'rgba(14, 165, 233, 0.4)',
  backgroundColor = 'transparent',
  pointerSize = 1,
}: InteractiveWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const dotRef       = useRef<HTMLDivElement>(null)

  const mouseRef = useRef({
    x: -1000, y: -1000,   // start off-screen so no deformation at mount
    lx: 0,    ly: 0,
    sx: -1000, sy: -1000,
    v: 0, vs: 0, a: 0,
    set: false,
  })

  const pathsRef   = useRef<SVGPathElement[]>([])
  const linesRef   = useRef<Point[][]>([])
  const noiseRef   = useRef<((x: number, y: number) => number) | null>(null)
  const rafRef     = useRef<number | null>(null)
  const boundingRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return
    noiseRef.current = createNoise2D()
    setSize()
    setLines()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    containerRef.current.addEventListener('touchmove', onTouchMove, { passive: false })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      containerRef.current?.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  /* ── Size ────────────────────────────────────────────────────────── */
  const setSize = () => {
    if (!containerRef.current || !svgRef.current) return
    boundingRef.current = containerRef.current.getBoundingClientRect()
    const { width, height } = boundingRef.current
    svgRef.current.style.width  = `${width}px`
    svgRef.current.style.height = `${height}px`
  }

  /* ── Lines ───────────────────────────────────────────────────────── */
  const setLines = () => {
    if (!svgRef.current || !boundingRef.current) return
    const { width, height } = boundingRef.current
    linesRef.current = []
    pathsRef.current.forEach(p => p.remove())
    pathsRef.current = []

    const xGap = 8, yGap = 8
    const totalLines  = Math.ceil((width  + 200) / xGap)
    const totalPoints = Math.ceil((height +  30) / yGap)
    const xStart = (width  - xGap * totalLines)  / 2
    const yStart = (height - yGap * totalPoints) / 2

    for (let i = 0; i < totalLines; i++) {
      const points: Point[] = []
      for (let j = 0; j < totalPoints; j++) {
        points.push({
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave:   { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        })
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('fill',   'none')
      path.setAttribute('stroke', strokeColor)
      path.setAttribute('stroke-width', '1')
      svgRef.current.appendChild(path)
      pathsRef.current.push(path)
      linesRef.current.push(points)
    }
  }

  const onResize = () => { setSize(); setLines() }

  /* ── Mouse / Touch ───────────────────────────────────────────────── */
  const onMouseMove  = (e: MouseEvent) => updatePos(e.clientX, e.clientY)
  const onTouchMove  = (e: TouchEvent) => {
    e.preventDefault()
    updatePos(e.touches[0].clientX, e.touches[0].clientY)
  }

  /**
   * FIXED: use clientX/clientY (viewport-relative) and re-read the
   * bounding rect on every move.
   *
   * The previous formula was:
   *   mouse.y = pageY - rect.top + scrollY
   * which expands to:
   *   (clientY + scrollY) - rect.top + scrollY  ← scrollY counted twice!
   *
   * Correct formula:
   *   mouse.y = clientY - rect.top
   * Since both clientY and rect.top are viewport-relative, this always
   * gives the cursor position inside the container regardless of scroll.
   */
  const updatePos = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    // Re-read every time: the container moves as the user scrolls
    const rect = containerRef.current.getBoundingClientRect()
    const mouse = mouseRef.current

    mouse.x = clientX - rect.left
    mouse.y = clientY - rect.top

    if (!mouse.set) {
      mouse.sx = mouse.x; mouse.sy = mouse.y
      mouse.lx = mouse.x; mouse.ly = mouse.y
      mouse.set = true
    }

    // Update the CSS vars so the dot follows instantly (before smoothing)
    containerRef.current.style.setProperty('--mx', `${mouse.x}px`)
    containerRef.current.style.setProperty('--my', `${mouse.y}px`)
  }

  /* ── Physics ─────────────────────────────────────────────────────── */
  const movePoints = (time: number) => {
    const { current: lines } = linesRef
    const { current: mouse } = mouseRef
    const { current: noise } = noiseRef
    if (!noise) return

    lines.forEach(points => {
      points.forEach(p => {
        // Ambient wave
        const move   = noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8
        p.wave.x = Math.cos(move) * 12
        p.wave.y = Math.sin(move) * 6

        // Cursor repulsion — only fires when the cursor is actually inside
        if (mouse.set) {
          const dx = p.x - mouse.sx
          const dy = p.y - mouse.sy
          const d  = Math.hypot(dx, dy)
          const l  = Math.max(200, mouse.vs)

          if (d < l) {
            const s = 1 - d / l
            const f = Math.cos(d * 0.001) * s
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00045
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00045
          }
        }

        // Spring back
        p.cursor.vx += (0 - p.cursor.x) * 0.012
        p.cursor.vy += (0 - p.cursor.y) * 0.012
        p.cursor.vx *= 0.94
        p.cursor.vy *= 0.94
        p.cursor.x  += p.cursor.vx
        p.cursor.y  += p.cursor.vy
        p.cursor.x   = Math.min(60, Math.max(-60, p.cursor.x))
        p.cursor.y   = Math.min(60, Math.max(-60, p.cursor.y))
      })
    })
  }

  const moved = (p: Point, withCursor = true) => ({
    x: p.x + p.wave.x + (withCursor ? p.cursor.x : 0),
    y: p.y + p.wave.y + (withCursor ? p.cursor.y : 0),
  })

  const drawLines = () => {
    linesRef.current.forEach((points, i) => {
      if (points.length < 2 || !pathsRef.current[i]) return
      const fp = moved(points[0], false)
      let d = `M ${fp.x} ${fp.y}`
      for (let j = 1; j < points.length; j++) {
        const c = moved(points[j])
        d += `L ${c.x} ${c.y}`
      }
      pathsRef.current[i].setAttribute('d', d)
    })
  }

  /* ── RAF loop ────────────────────────────────────────────────────── */
  const tick = (time: number) => {
    const mouse = mouseRef.current

    // Smooth mouse position (for deformation lag)
    mouse.sx += (mouse.x - mouse.sx) * 0.12
    mouse.sy += (mouse.y - mouse.sy) * 0.12

    // Velocity
    const dx = mouse.x - mouse.lx
    const dy = mouse.y - mouse.ly
    const d  = Math.hypot(dx, dy)
    mouse.v   = d
    mouse.vs += (d - mouse.vs) * 0.1
    mouse.vs  = Math.min(100, mouse.vs)
    mouse.lx  = mouse.x
    mouse.ly  = mouse.y
    mouse.a   = Math.atan2(dy, dx)

    // Update smooth dot CSS vars
    if (containerRef.current) {
      containerRef.current.style.setProperty('--sx', `${mouse.sx}px`)
      containerRef.current.style.setProperty('--sy', `${mouse.sy}px`)
    }

    movePoints(time)
    drawLines()
    rafRef.current = requestAnimationFrame(tick)
  }

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div
      ref={containerRef}
      className={`waves-component ${className}`}
      style={{
        backgroundColor,
        position:   'absolute',
        top: 0, left: 0,
        width:  '100%',
        height: '100%',
        overflow: 'hidden',
        '--mx': '-1000px',
        '--my': '-1000px',
        '--sx': '-1000px',
        '--sy': '-1000px',
      } as React.CSSProperties}
    >
      <svg
        ref={svgRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      />

      {/*
       * Glowing pointer dot
       * --mx/--my follow the raw mouse instantly (no lag)
       * so the dot feels directly attached to the cursor.
       */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position:      'absolute',
          top:    0,
          left:   0,
          width:  `${pointerSize}rem`,
          height: `${pointerSize}rem`,
          borderRadius:  '50%',
          background:    strokeColor,
          boxShadow:     `0 0 ${pointerSize * 8}px 2px ${strokeColor}, 0 0 ${pointerSize * 20}px 4px rgba(14,165,233,0.3)`,
          transform:     'translate3d(calc(var(--mx) - 50%), calc(var(--my) - 50%), 0)',
          willChange:    'transform',
          pointerEvents: 'none',
          transition:    'opacity 0.2s ease',
        }}
      />
    </div>
  )
}
