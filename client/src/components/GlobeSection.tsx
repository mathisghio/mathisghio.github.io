'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/* ═══════════════════════════════════════════════════════════════════════════
   COMPETITION DATA
═══════════════════════════════════════════════════════════════════════════ */
type CompType = 'world_cup' | 'world_champ' | 'european' | 'national'
interface Comp {
  id: number; name: string; location: string
  flag: string; date: string; month: string
  lat: number; lng: number; type: CompType
}
const COMPS: Comp[] = [
  { id:0, name:'IWSA World Cup N°1',       location:'Hong Kong, China',               flag:'🇭🇰', date:'Feb 4–8',   month:'FEB', lat:22.30, lng:114.20, type:'world_cup'   },
  { id:1, name:'IWSA Formula Wing European Championship', location:'Naples, Italy',           flag:'🇮🇹', date:'Apr 8–12',  month:'APR', lat:40.85, lng:14.27,  type:'european'    },
  { id:2, name:'Defi Wing',              location:'Gruissan, France',        flag:'🇫🇷', date:'May 11–13', month:'MAY', lat:43.11, lng:3.09,   type:'national'    },
  { id:3, name:'IWSA World Cup N°2',       location:'Silvaplana, Switzerland', flag:'🇨🇭', date:'Jun 16–20', month:'JUN', lat:46.47, lng:9.80,   type:'world_cup'   },
  { id:4, name:'IWSA World Cup N°3',       location:'Gizzeria, Italy',         flag:'🇮🇹', date:'Jul 8–12',  month:'JUL', lat:38.97, lng:16.18,  type:'world_cup'   },
  { id:5, name:'IWSA Formula Wing World Championship',    location:'Istanbul, Türkiye',       flag:'🇹🇷', date:'Aug 11–15', month:'AUG', lat:41.01, lng:28.98,  type:'world_champ' },
  { id:6, name:'IWSA World Cup N°4',       location:'Daishan, China',          flag:'🇨🇳', date:'Sep 15–20', month:'SEP', lat:30.21, lng:122.20, type:'world_cup'   },
   { id:7, name:'IWSA World Cup N°5',            location:'Cagliari, Sardinia',      flag:'🇮🇹', date:'Sep 30–Oct 4',   month:'NOV', lat:39.22, lng:9.12,   type:'world_cup'   },
   { id:8, name:'French Championship',      location:'Granville, France',         flag:'🇫🇷', date:'Oct 23–25', month:'OCT', lat:48.84, lng:-1.60,   type:'national'    },
  { id:9, name:'IWSA World Cup N°6',       location:'Jericoacoara, Brazil',    flag:'🇧🇷', date:'Dec 1–5',   month:'DEC', lat:-2.80, lng:-40.50, type:'world_cup'   },
]
const TC: Record<CompType, string> = {
  world_champ: '#F59E0B', world_cup: '#EC4899',
  european:    '#0EA5E9', national:  '#A78BFA',
}
const TL: Record<CompType, string> = {
  world_champ: 'IWSA Formula Wing World Championship', world_cup: 'IWSA World Cup',
  european:    'IWSA Formula Wing European Champ.',    national:  'National',
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEO CACHE — GeoJSON + dot grid fetched/computed ONCE, shared by both views
═══════════════════════════════════════════════════════════════════════════ */
interface GeoBundle { features: d3.ExtendedFeatureCollection; dots: [number, number][] }
let _bundle: GeoBundle | null = null
let _bundlePromise: Promise<GeoBundle> | null = null

function _inRing(p: [number,number], ring: number[][]): boolean {
  const [x, y] = p; let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi) / (yj - yi)) + xi)
      inside = !inside
  }
  return inside
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _inFeature(p: [number,number], f: any): boolean {
  const g = f.geometry
  if (g.type === 'Polygon') {
    if (!_inRing(p, g.coordinates[0])) return false
    for (let i = 1; i < g.coordinates.length; i++) if (_inRing(p, g.coordinates[i])) return false
    return true
  }
  if (g.type === 'MultiPolygon') {
    for (const poly of g.coordinates) {
      if (_inRing(p, poly[0])) {
        let hole = false
        for (let i = 1; i < poly.length; i++) if (_inRing(p, poly[i])) { hole = true; break }
        if (!hole) return true
      }
    }
  }
  return false
}

function loadGeoBundle(): Promise<GeoBundle> {
  if (_bundle) return Promise.resolve(_bundle)
  if (_bundlePromise) return _bundlePromise
  _bundlePromise = fetch(
    'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
  )
    .then(r => { if (!r.ok) throw new Error('fetch'); return r.json() })
    .then(features => {
      const dots: [number, number][] = []
      const STEP = 1.35
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const feature of (features as any).features) {
        const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
        for (let lng = minLng; lng <= maxLng; lng += STEP)
          for (let lat = minLat; lat <= maxLat; lat += STEP)
            if (_inFeature([lng, lat], feature)) dots.push([lng, lat])
      }
      _bundle = { features, dots }
      return _bundle
    })
  return _bundlePromise
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED CANVAS RENDER HELPERS — identical visuals for both views
═══════════════════════════════════════════════════════════════════════════ */
function drawOceanFlat(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w * .5, h * .35, 0, w * .5, h * .5, w * .75)
  g.addColorStop(0,   '#031830')
  g.addColorStop(.65, '#020D1C')
  g.addColorStop(1,   '#010608')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .28, w / 2, h / 2, Math.max(w, h) * .72)
  v.addColorStop(0, 'transparent')
  v.addColorStop(1, 'rgba(1,6,9,0.72)')
  ctx.fillStyle = v
  ctx.fillRect(0, 0, w, h)
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBE 3D — D3 orthographic, slow auto-rotation, fly-to on hover
   BUG FIX: mousemove on CANVAS only — not on window
═══════════════════════════════════════════════════════════════════════════ */
function Globe3DD3({ visible, hoveredId, onHover }: {
  visible: boolean; hoveredId: number | null
  onHover: (comp: Comp | null, x: number, y: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  // ref-mirrors so the d3.timer RAF loop always sees fresh values
  const onHoverRef   = useRef(onHover)
  const hoveredIdRef = useRef<number | null>(null)
  const rotRef       = useRef<[number, number]>([0, -18])
  const targetRotRef = useRef<[number, number] | null>(null)
  const isDragging   = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError,  setLoadError]  = useState(false)

  useEffect(() => { onHoverRef.current   = onHover },    [onHover])
  useEffect(() => { hoveredIdRef.current = hoveredId }, [hoveredId])

  // Whenever a competition is hovered (from list OR globe), set fly-to target
  useEffect(() => {
    if (hoveredId !== null) {
      const comp = COMPS.find(c => c.id === hoveredId)
      if (comp) targetRotRef.current = [-comp.lng, Math.max(-70, Math.min(70, -comp.lat))]
    } else {
      targetRotRef.current = null // clears target → auto-rotation resumes
    }
  }, [hoveredId])

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = container.clientWidth, H = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width  = W * dpr; canvas.height = H * dpr
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.43

    const projection = d3.geoOrthographic()
      .scale(r).translate([cx, cy]).clipAngle(90).rotate(rotRef.current)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geoPath = d3.geoPath().projection(projection).context(ctx as any)

    let bundle: GeoBundle | null = null

    /* ── render ──────────────────────────────────────────────────────── */
    const render = (elapsed: number) => {
      ctx.clearRect(0, 0, W, H)

      // Outer atmosphere glow
      const atm = ctx.createRadialGradient(cx, cy, r * .82, cx, cy, r * 1.22)
      atm.addColorStop(0,   'transparent')
      atm.addColorStop(.55, 'rgba(14,165,233,0.07)')
      atm.addColorStop(1,   'rgba(14,165,233,0.01)')
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.22, 0, 2 * Math.PI)
      ctx.fillStyle = atm; ctx.fill()

      // Ocean sphere
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      const ocean = ctx.createRadialGradient(cx - r * .28, cy - r * .28, 0, cx, cy, r)
      ocean.addColorStop(0,   '#031830')
      ocean.addColorStop(.65, '#020D1C')
      ocean.addColorStop(1,   '#010608')
      ctx.fillStyle = ocean; ctx.fill()
      ctx.strokeStyle = 'rgba(56,189,248,0.30)'; ctx.lineWidth = 1.5; ctx.stroke()

      if (bundle) {
        // Graticule
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctx.beginPath(); geoPath(d3.geoGraticule()() as any)
        ctx.strokeStyle = 'rgba(56,189,248,0.07)'; ctx.lineWidth = 0.7; ctx.stroke()

        // Land dots
        ctx.fillStyle = 'rgba(14,165,233,0.44)'
        for (const [lng, lat] of bundle.dots) {
          const pt = projection([lng, lat])
          if (!pt) continue
          const [px, py] = pt
          if ((px - cx) ** 2 + (py - cy) ** 2 > r * r * 1.01) continue
          ctx.beginPath(); ctx.arc(px, py, 1.05, 0, 2 * Math.PI); ctx.fill()
        }

        // Land outlines
        ctx.beginPath()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bundle.features.features.forEach(f => geoPath(f as any))
        ctx.strokeStyle = 'rgba(56,189,248,0.52)'; ctx.lineWidth = 0.75; ctx.stroke()

        // Competition markers
        COMPS.forEach((comp, i) => {
          const pt = projection([comp.lng, comp.lat])
          if (!pt) return
          const [px, py] = pt
          if ((px - cx) ** 2 + (py - cy) ** 2 > r * r * 1.01) return

          const isHov = hoveredIdRef.current === comp.id
          const color = TC[comp.type]
          const pulse = 1 + 0.28 * Math.sin(elapsed * 0.0018 + i * 0.85)

          ctx.save()
          if (isHov) {
            ctx.beginPath(); ctx.arc(px, py, 20, 0, 2 * Math.PI); ctx.fillStyle = color + '0e'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py, 12, 0, 2 * Math.PI); ctx.fillStyle = color + '22'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py,  7, 0, 2 * Math.PI); ctx.fillStyle = color + '48'; ctx.fill()
            ctx.shadowColor = color; ctx.shadowBlur = 20
            ctx.beginPath(); ctx.arc(px, py, 3.8, 0, 2 * Math.PI); ctx.fillStyle = '#fff'; ctx.fill()
            ctx.shadowBlur = 0
          } else {
            ctx.beginPath(); ctx.arc(px, py, 6 * pulse, 0, 2 * Math.PI); ctx.fillStyle = color + '14'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py, 4 * pulse, 0, 2 * Math.PI); ctx.fillStyle = color + '28'; ctx.fill()
            ctx.shadowColor = color; ctx.shadowBlur = 5
            ctx.beginPath(); ctx.arc(px, py, 2.4, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill()
            ctx.shadowBlur = 0
          }
          ctx.restore()
        })
      }
    }

    /* ── load geo ────────────────────────────────────────────────────── */
    loadGeoBundle()
      .then(b => { bundle = b; setIsLoading(false) })
      .catch(() => { setLoadError(true); setIsLoading(false) })

    /* ── animation loop ──────────────────────────────────────────────── */
    const AUTO_SPEED = 0.10   // °/frame — much slower than reference
    const LERP_K     = 0.048  // fly-to smoothness

    const timer = d3.timer((elapsed: number) => {
      if (targetRotRef.current !== null && !isDragging.current) {
        const [tLng, tLat] = targetRotRef.current
        let [cLng, cLat]   = rotRef.current
        let dLng = tLng - cLng
        while (dLng >  180) dLng -= 360
        while (dLng < -180) dLng += 360
        rotRef.current = [cLng + dLng * LERP_K, cLat + (tLat - cLat) * LERP_K]
      } else if (!isDragging.current) {
        rotRef.current = [rotRef.current[0] + AUTO_SPEED, rotRef.current[1]]
      }
      projection.rotate(rotRef.current)
      render(elapsed)
    })

    /* ── mouse drag ──────────────────────────────────────────────────── */
    let dragStart = { x: 0, y: 0 }, dragStartRot = [0, 0]
    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseDown = (e: MouseEvent) => {
      const { x, y } = getPos(e)
      if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) return
      isDragging.current = true
      dragStart = { x, y }; dragStartRot = [...rotRef.current]
      canvas.style.cursor = 'grabbing'
    }

    /* ──────────────────────────────────────────────────────────────────
       KEY FIX: mousemove on CANVAS, not window.
       When mouse is over competition cards (to the right), this handler
       no longer fires → hoveredId set by card's onMouseEnter stays intact.
       Previously: window.addEventListener fired over cards and called
       onHover(null) constantly, cancelling card hover immediately.
    ─────────────────────────────────────────────────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getPos(e)

      if (isDragging.current) {
        rotRef.current = [
          dragStartRot[0] + (x - dragStart.x) * 0.4,
          Math.max(-80, Math.min(80, dragStartRot[1] - (y - dragStart.y) * 0.4)),
        ]
        return
      }

      const onGlobe = (x - cx) ** 2 + (y - cy) ** 2 <= r * r
      canvas.style.cursor = onGlobe ? 'grab' : 'default'

      let closest: Comp | null = null, closestD = 22
      for (const comp of COMPS) {
        const pt = projection([comp.lng, comp.lat])
        if (!pt) continue
        const dist = Math.hypot(pt[0] - x, pt[1] - y)
        if (dist < closestD) { closestD = dist; closest = comp }
      }
      if (closest) {
        onHoverRef.current(closest, e.clientX, e.clientY)
        canvas.style.cursor = 'pointer'
      } else if (onGlobe) {
        onHoverRef.current(null, 0, 0)
      }
      // if NOT on globe, do nothing — card hover state is managed by card itself
    }

    // mouseup stays on window so drag-release works if mouse left canvas
    const onMouseUp    = () => { isDragging.current = false; canvas.style.cursor = 'grab' }
    const onMouseLeave = () => { isDragging.current = false; onHoverRef.current(null, 0, 0) }

    canvas.addEventListener('mousedown',  onMouseDown)
    canvas.addEventListener('mousemove',  onMouseMove)  // ← canvas only, not window
    canvas.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('mouseup',    onMouseUp)    // window for drag-release only

    return () => {
      timer.stop()
      canvas.removeEventListener('mousedown',  onMouseDown)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseup',    onMouseUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once; all live state bridges via refs

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        opacity:       visible ? 1 : 0,
        transform:     visible ? 'scale(1)'  : 'scale(1.04)',
        filter:        visible ? 'blur(0px)' : 'blur(14px)',
        transition:    'opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <AnimatePresence>
        {isLoading && !loadError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(14,165,233,0.15)', borderTop: '2px solid #0EA5E9', animation: 'gsSpin 0.9s linear infinite' }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', color: 'rgba(148,163,184,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading globe</span>
            </div>
          </motion.div>
        )}
        {loadError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center">
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.72rem', color: 'rgba(148,163,184,0.4)' }}>
              Unable to load globe data
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes gsSpin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAP 2D FLAT — D3 equirectangular, same visual language as globe
   Ocean gradient · land dots · outlines · competition markers
═══════════════════════════════════════════════════════════════════════════ */
function Map2DFlat({ visible, hoveredId, onHover }: {
  visible: boolean; hoveredId: number | null
  onHover: (comp: Comp | null, x: number, y: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const [dims, setDims]     = useState({ w: 0, h: 0 })
  const [bundle, setBundle] = useState<GeoBundle | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => {
      const { width, height } = e[0].contentRect
      setDims({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    loadGeoBundle().then(setBundle).catch(() => {})
  }, [])

  /* ── render canvas when bundle + dims are ready ──────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !bundle || dims.w === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h } = dims
    const dpr = window.devicePixelRatio || 1
    canvas.width  = w * dpr; canvas.height = h * dpr
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    // Use same equirectangular projection as the marker positioning below
    const proj = d3.geoEquirectangular()
      .scale(w / (2 * Math.PI))
      .translate([w / 2, h / 2])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gp = d3.geoPath().projection(proj).context(ctx as any)

    // Ocean (same gradient palette as globe)
    drawOceanFlat(ctx, w, h)

    // Graticule — same subtle cyan as globe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx.beginPath(); gp(d3.geoGraticule()() as any)
    ctx.strokeStyle = 'rgba(56,189,248,0.07)'; ctx.lineWidth = 0.7; ctx.stroke()

    // Equator — slightly brighter
    ctx.setLineDash([])
    ctx.strokeStyle = 'rgba(56,189,248,0.18)'; ctx.lineWidth = 1.0
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke()

    // Tropics & polar circles — dashed
    ctx.setLineDash([18, 14])
    ctx.strokeStyle = 'rgba(56,189,248,0.09)'; ctx.lineWidth = 0.8
    for (const lat of [-66.5, -23.5, 23.5, 66.5]) {
      const pt0 = proj([-180, lat]), pt1 = proj([180, lat])
      if (!pt0 || !pt1) continue
      ctx.beginPath(); ctx.moveTo(pt0[0], pt0[1]); ctx.lineTo(pt1[0], pt1[1]); ctx.stroke()
    }
    ctx.setLineDash([])

    // Land dots — same color/size as globe
    ctx.fillStyle = 'rgba(14,165,233,0.44)'
    for (const [lng, lat] of bundle.dots) {
      const pt = proj([lng, lat])
      if (!pt) continue
      ctx.beginPath(); ctx.arc(pt[0], pt[1], 1.05, 0, 2 * Math.PI); ctx.fill()
    }

    // Land outlines — same stroke as globe
    ctx.beginPath()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bundle.features.features.forEach(f => gp(f as any))
    ctx.strokeStyle = 'rgba(56,189,248,0.52)'; ctx.lineWidth = 0.75; ctx.stroke()

    // Vignette
    drawVignette(ctx, w, h)

    setMapReady(true)
  }, [bundle, dims])

  /* ── compute marker positions using same D3 projection as canvas ── */
  const markerPositions = useMemo(() => {
    if (dims.w === 0) return []
    const proj = d3.geoEquirectangular()
      .scale(dims.w / (2 * Math.PI))
      .translate([dims.w / 2, dims.h / 2])
    return COMPS.map(comp => {
      const pt = proj([comp.lng, comp.lat])
      return pt ? { comp, x: pt[0], y: pt[1] } : null
    }).filter(Boolean) as { comp: Comp; x: number; y: number }[]
  }, [dims])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity:       visible ? 1 : 0,
        transform:     visible ? 'scale(1)'  : 'scale(0.96)',
        filter:        visible ? 'blur(0px)' : 'blur(14px)',
        transition:    'opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ display: 'block' }} />

      {/* Competition markers — DOM on top of canvas */}
      {mapReady && markerPositions.map(({ comp, x, y }) => {
        const color = TC[comp.type]
        const isA   = hoveredId === comp.id
        return (
          <div
            key={comp.id}
            className="absolute"
            style={{ left: x, top: y, transform: 'translate(-50%,-50%)', zIndex: 10, cursor: 'pointer' }}
            onMouseEnter={e => onHover(comp, e.clientX, e.clientY)}
            onMouseLeave={() => onHover(null, 0, 0)}
          >
            {/* Outer ring */}
            <div className="absolute rounded-full" style={{
              width: isA ? '44px' : '22px', height: isA ? '44px' : '22px',
              top:  isA ? '-22px' : '-11px', left: isA ? '-22px' : '-11px',
              background:  `${color}${isA ? '16' : '0e'}`,
              border:      `1.5px solid ${color}${isA ? '72' : '42'}`,
              boxShadow:   isA ? `0 0 22px ${color}45` : 'none',
              animation:   'gsMapPulse 2.2s ease-in-out infinite',
              animationDelay: `${comp.id * 0.18}s`,
              transition:  'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
            {/* Middle ring */}
            <div className="absolute rounded-full" style={{
              width:  isA ? '22px' : '12px', height: isA ? '22px' : '12px',
              top:    isA ? '-11px' : '-6px', left:   isA ? '-11px' : '-6px',
              background: `${color}${isA ? '28' : '18'}`,
              border:     `1.5px solid ${color}${isA ? '88' : '55'}`,
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
            {/* Core dot */}
            <div className="relative rounded-full" style={{
              width: isA ? '10px' : '7px', height: isA ? '10px' : '7px',
              background: color,
              boxShadow:  `0 0 ${isA ? '18px' : '6px'} ${color}`,
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }} />

            {/* Floating label */}
            <AnimatePresence>
              {isA && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: .9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: .9 }}
                  transition={{ duration: .2 }}
                  className="absolute whitespace-nowrap px-2 py-1.5 rounded-sm pointer-events-none"
                  style={{
                    bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(4,6,14,0.97)', border: `1px solid ${color}55`,
                    backdropFilter: 'blur(12px)', boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 14px ${color}15`,
                  }}
                >
                  <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: 'rgba(241,245,249,0.95)', letterSpacing: '0.04em' }}>
                    {comp.flag} {comp.name}
                  </p>
                  <p style={{ fontSize: '0.62rem', color: 'rgba(148,163,184,0.55)', marginTop: '1px', fontFamily: "'DM Sans',sans-serif" }}>
                    {comp.location} · {comp.date}
                  </p>
                  <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '8px', height: '8px', background: 'rgba(4,6,14,0.97)', borderRight: `1px solid ${color}55`, borderBottom: `1px solid ${color}55` }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      <style>{`@keyframes gsMapPulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.65);opacity:.12}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW TOGGLE — pill in top-right of map container
═══════════════════════════════════════════════════════════════════════════ */
function ViewToggle({ mode, onToggle }: { mode: '2d' | '3d'; onToggle: () => void }) {
  return (
    <div
      className="absolute top-3 right-3 z-30 flex items-center p-0.5 rounded-full"
      style={{ background: 'rgba(6,8,15,0.88)', border: '1px solid rgba(14,165,233,0.22)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
    >
      {(['2d', '3d'] as const).map(m => {
        const active = mode === m
        return (
          <button
            key={m}
            onClick={() => { if (!active) onToggle() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              background:  active ? 'rgba(14,165,233,0.22)' : 'transparent',
              border:      `1px solid ${active ? 'rgba(14,165,233,0.52)' : 'transparent'}`,
              boxShadow:   active ? '0 0 12px rgba(14,165,233,0.22)' : 'none',
              cursor:      active ? 'default' : 'pointer',
            }}
          >
            {m === '2d'
              ? <Map   size={13} style={{ color: active ? '#38bdf8' : 'rgba(148,163,184,0.4)' }} />
              : <Globe size={13} style={{ color: active ? '#38bdf8' : 'rgba(148,163,184,0.4)' }} />}
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'rgba(241,245,249,0.95)' : 'rgba(148,163,184,0.4)', transition: 'color 0.2s' }}>
              {m === '2d' ? 'Flat' : '3D'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPETITION CARD
═══════════════════════════════════════════════════════════════════════════ */
function CompCard({ comp, isActive, onEnter, onLeave }: {
  comp: Comp; isActive: boolean; onEnter: () => void; onLeave: () => void
}) {
  const color = TC[comp.type]
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: 'flex', alignItems: 'stretch', borderRadius: '6px', overflow: 'hidden',
        background:  isActive ? `${color}0e` : 'rgba(255,255,255,0.02)',
        border:      `1px solid ${isActive ? color + '48' : 'rgba(255,255,255,0.05)'}`,
        boxShadow:   isActive ? `0 0 28px ${color}14, inset 0 0 16px ${color}06` : 'none',
        transform:   isActive ? 'translateX(-5px)' : 'none',
        transition:  'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default', flexShrink: 0,
      }}
    >
      {/* Color bar */}
      <div style={{ width: '3px', background: isActive ? `linear-gradient(to bottom,${color},${color}55)` : `${color}28`, flexShrink: 0, transition: 'background 0.25s' }} />
      {/* Month */}
      <div style={{ padding: '9px 11px', borderRight: '1px solid rgba(255,255,255,0.04)', minWidth: '52px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.05rem', color: isActive ? color : 'rgba(148,163,184,0.42)', letterSpacing: '0.06em', lineHeight: 1.1, transition: 'color 0.25s' }}>{comp.month}</div>
        <div style={{ fontSize: '0.52rem', color: 'rgba(148,163,184,0.22)', marginTop: '2px', letterSpacing: '0.1em', fontFamily: "'DM Sans',sans-serif" }}>2026</div>
      </div>
      {/* Info */}
      <div style={{ flex: 1, padding: '9px 11px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.82rem', lineHeight: 1 }}>{comp.flag}</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.84rem', color: isActive ? 'rgba(241,245,249,1)' : 'rgba(241,245,249,0.7)', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color 0.25s' }}>{comp.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ color: 'rgba(148,163,184,0.38)', fontSize: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif" }}>{comp.location}</span>
          <span style={{ color: isActive ? color : 'rgba(148,163,184,0.32)', fontSize: '0.58rem', flexShrink: 0, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: 'color 0.25s' }}>{comp.date}</span>
        </div>
      </div>
      {/* Status dot */}
      <div style={{ padding: '9px 10px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: isActive ? `0 0 10px ${color}, 0 0 22px ${color}50` : 'none', transition: 'box-shadow 0.25s', flexShrink: 0 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════════════════════ */
export function GlobeSection() {
  const { ref: sectionRef, inView } = useInView(0.1)
  const [mode, setMode] = useState<'2d' | '3d'>('3d')

  /* ── Shared hover state — drives globe markers, map markers AND cards ── */
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [tipPos,    setTipPos]    = useState({ x: 0, y: 0 })
  const [showTip,   setShowTip]   = useState(false)

  // From globe / flat-map marker (shows floating tooltip)
  const handleMapHover = useCallback((comp: Comp | null, x: number, y: number) => {
    setHoveredId(comp?.id ?? null)
    setShowTip(comp !== null)
    if (comp) setTipPos({ x, y })
  }, [])

  // From competition list card (no tooltip — card IS the label)
  const handleListEnter = useCallback((id: number) => { setHoveredId(id); setShowTip(false) }, [])
  const handleListLeave = useCallback(()            => { setHoveredId(null); setShowTip(false) }, [])

  const hoveredComp = COMPS.find(c => c.id === hoveredId)

  return (
    <section id="season" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden" style={{ background: '#08090E' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(14,165,233,0.03) 0%, transparent 70%)' }} />

      <div className="container relative z-10">

        {/* Header */}
        <div className="mb-14 transition-all duration-700" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}>
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* Globe / Map */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{ height: 520, border: '1px solid rgba(14,165,233,0.12)', background: '#020510', boxShadow: '0 0 80px rgba(14,165,233,0.05), inset 0 0 80px rgba(14,165,233,0.03)' }}
          >
            <Map2DFlat  visible={mode === '2d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <Globe3DD3  visible={mode === '3d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <ViewToggle mode={mode} onToggle={() => setMode(m => m === '2d' ? '3d' : '2d')} />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none" style={{ color: 'rgba(148,163,184,0.22)', fontSize: '10px', fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
              {mode === '3d' ? 'drag to rotate · hover markers' : 'hover markers for details'}
            </div>
          </div>

          {/* Competition schedule */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: .4, delay: .1 }}
              className="flex items-center justify-between mb-4"
            >
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.65rem', color: 'rgba(148,163,184,0.32)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                10 events · 9 countries
              </p>
              <div className="flex items-center gap-2.5">
                {(Object.entries(TC) as [CompType, string][]).map(([type, color]) => (
                  <div key={type} style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col gap-1.5">
              {COMPS.map((comp, i) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: .4, delay: .1 + i * .05 }}
                >
                  <CompCard
                    comp={comp}
                    isActive={hoveredId === comp.id}
                    onEnter={() => handleListEnter(comp.id)}
                    onLeave={handleListLeave}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: .4, delay: .75 }}
              className="mt-5 pt-4 flex flex-wrap gap-x-4 gap-y-1.5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              {(Object.entries(TL) as [CompType, string][]).map(([type, label]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: TC[type], flexShrink: 0 }} />
                  <span style={{ color: 'rgba(148,163,184,0.36)', fontSize: '0.62rem', fontFamily: "'DM Sans',sans-serif", letterSpacing: '0.06em' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating tooltip — only from globe / flat-map marker hover */}
      <AnimatePresence>
        {showTip && hoveredComp && (
          <div className="fixed z-50 pointer-events-none" style={{ left: tipPos.x + 16, top: tipPos.y, transform: 'translateY(-50%)' }}>
            <motion.div
              initial={{ opacity: 0, y: 4, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: .97 }}
              transition={{ duration: .15 }}
              className="px-4 py-3 rounded-sm"
              style={{ background: 'rgba(4,6,14,0.98)', border: `1px solid ${TC[hoveredComp.type]}48`, backdropFilter: 'blur(20px)', minWidth: '188px', boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${TC[hoveredComp.type]}12` }}
            >
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'rgba(241,245,249,0.95)', letterSpacing: '0.05em' }}>{hoveredComp.flag} {hoveredComp.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', color: 'rgba(148,163,184,0.6)', marginTop: '3px' }}>{hoveredComp.location}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.7rem', fontWeight: 500, color: TC[hoveredComp.type], marginTop: '2px' }}>{hoveredComp.date}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '0.58rem', color: 'rgba(148,163,184,0.28)', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{TL[hoveredComp.type]}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
