'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/* ═══════════════════════════════════════════════════════
   COMPETITION DATA
═══════════════════════════════════════════════════════ */
type CompType = 'world_cup' | 'world_champ' | 'european' | 'national'
interface Comp { id:number; name:string; location:string; flag:string; date:string; month:string; lat:number; lng:number; type:CompType }

const COMPS: Comp[] = [
  { id:0, name:'World Cup IWSA R',        location:'Hong Kong',           flag:'🇭🇰', date:'Feb 4–7',    month:'FEB', lat:22.3,   lng:114.2,  type:'world_cup'   },
  { id:1, name:'European Champ. IWSA F',  location:'Naples, Italy',       flag:'🇮🇹', date:'Apr 8–11',   month:'APR', lat:40.85,  lng:14.27,  type:'european'    },
  { id:2, name:'Défi Wing',               location:'Gruissan, France',    flag:'🇫🇷', date:'May 11–14',  month:'MAY', lat:43.11,  lng:3.09,   type:'national'    },
  { id:3, name:'World Cup IWSA R',        location:'Silvaplana, Switzerland', flag:'🇨🇭', date:'Jun 17–20', month:'JUN', lat:46.47, lng:9.80,  type:'world_cup'   },
  { id:4, name:'World Cup IWSA R',        location:'Gizzeria, Italy',     flag:'🇮🇹', date:'Jul 8–11',   month:'JUL', lat:38.97,  lng:16.18,  type:'world_cup'   },
  { id:5, name:'World Champ. IWSA F',     location:'Istanbul, Türkiye',   flag:'🇹🇷', date:'Aug 11–14',  month:'AUG', lat:41.01,  lng:28.98,  type:'world_champ' },
  { id:6, name:'World Cup IWSA R',        location:'Daishan, China',      flag:'🇨🇳', date:'Oct 16–20',  month:'OCT', lat:30.21,  lng:122.21, type:'world_cup'   },
  { id:7, name:'French Champ. S&R',       location:'Leucate, France',     flag:'🇫🇷', date:'Oct 23–25',  month:'OCT', lat:42.92,  lng:3.04,   type:'national'    },
  { id:8, name:'IWSA Racing',             location:'Cagliari, Sardinia',  flag:'🇮🇹', date:'Nov 1–3',    month:'NOV', lat:39.22,  lng:9.12,   type:'world_cup'   },
  { id:9, name:'World Cup IWSA R',        location:'Jericoacoara, Brazil',flag:'🇧🇷', date:'Dec 1–4',    month:'DEC', lat:-2.80,  lng:-40.51, type:'world_cup'   },
]

const TYPE_COLOR: Record<CompType,string> = {
  world_champ: '#F59E0B',
  world_cup:   '#EC4899',
  european:    '#0EA5E9',
  national:    '#A78BFA',
}
const TYPE_LABEL: Record<CompType,string> = {
  world_champ: 'World Championship',
  world_cup:   'World Cup',
  european:    'European Champ.',
  national:    'National / Invitational',
}

/* ═══════════════════════════════════════════════════════
   SIMPLIFIED CONTINENT POLYGONS  [lat, lng]
   Traced from Natural Earth 110m — recognisable shapes
═══════════════════════════════════════════════════════ */
const CONTINENTS: [number,number][][] = [
  // ── North America ─────────────────────────────────
  [[72,-78],[70,-95],[68,-115],[62,-140],[60,-147],[58,-152],[54,-130],[48,-124],
   [38,-122],[32,-117],[22,-105],[15,-90],[8,-77],[10,-65],[15,-62],[18,-68],
   [20,-76],[22,-80],[25,-77],[26,-80],[30,-81],[35,-75],[42,-70],[47,-53],
   [52,-56],[58,-64],[63,-68],[65,-64],[68,-64],[70,-74],[73,-85],[75,-90],
   [75,-110],[73,-125],[72,-78]],

  // ── South America ─────────────────────────────────
  [[10,-65],[8,-61],[5,-52],[2,-50],[0,-50],[-5,-35],[-10,-37],[-15,-39],
   [-20,-40],[-25,-48],[-30,-50],[-33,-53],[-38,-62],[-42,-65],[-50,-68],
   [-55,-65],[-53,-70],[-50,-75],[-45,-74],[-38,-62],[-30,-50],[-20,-40],
   [-10,-37],[-5,-35],[0,-50],[5,-52],[8,-61],[10,-65]],

  // ── Europe ────────────────────────────────────────
  [[70,28],[68,16],[66,14],[65,14],[63,8],[60,5],[58,8],[55,8],[52,5],[51,1],
   [50,-3],[47,-2],[44,-8],[42,-8],[39,-9],[37,-9],[36,-6],[40,-1],[42,3],
   [44,8],[45,12],[45,14],[43,16],[42,18],[40,20],[38,22],[38,26],[40,28],
   [42,28],[42,26],[44,20],[46,20],[48,18],[50,14],[52,15],[52,18],[54,18],
   [54,20],[56,21],[58,23],[60,25],[63,25],[64,26],[65,25],[68,25],[70,24],
   [72,24],[74,28],[72,26],[70,28]],

  // ── Africa ────────────────────────────────────────
  [[37,10],[37,15],[30,32],[22,36],[15,41],[11,43],[5,41],[0,42],[-5,40],
   [-10,40],[-20,35],[-25,33],[-34,26],[-35,20],[-33,18],[-30,17],[-20,14],
   [-10,14],[-5,10],[0,10],[5,2],[3,-2],[5,-5],[4,-8],[1,-10],[-1,-10],
   [4,-2],[5,0],[5,3],[5,5],[8,3],[10,4],[10,7],[12,9],[12,14],[15,12],
   [18,14],[20,15],[17,15],[15,17],[15,22],[20,26],[22,30],[22,36],
   [30,32],[37,15],[37,10]],

  // ── Asia (main body) ─────────────────────────────
  [[70,28],[70,58],[68,57],[66,57],[63,55],[60,56],[58,57],[55,55],[55,42],
   [52,42],[50,45],[48,44],[46,44],[44,44],[42,44],[40,42],[40,36],[38,28],
   [36,36],[38,44],[42,50],[40,50],[38,57],[36,60],[36,66],[24,66],[22,68],
   [20,73],[8,77],[8,80],[12,80],[20,86],[26,90],[22,90],[20,92],[16,94],
   [16,100],[10,104],[5,100],[0,104],[0,108],[5,115],[10,120],[16,120],
   [20,110],[22,114],[26,120],[32,121],[35,120],[38,120],[40,120],[42,130],
   [45,135],[50,140],[52,140],[55,135],[55,130],[50,130],[50,120],[55,120],
   [58,114],[60,116],[65,124],[70,130],[68,140],[70,150],[68,160],[65,170],
   [72,170],[75,170],[78,175],[78,170],[72,162],[76,155],[80,148],[80,140],
   [78,133],[75,130],[72,120],[75,115],[80,110],[80,100],[80,90],[75,90],
   [75,80],[78,80],[80,72],[80,60],[78,55],[75,55],[72,52],[70,58],[70,28]],

  // ── Australia ─────────────────────────────────────
  [[-14,128],[-12,130],[-14,136],[-16,136],[-13,136],[-15,130],[-18,122],
   [-22,114],[-26,114],[-32,116],[-35,118],[-38,140],[-38,148],[-35,150],
   [-33,152],[-28,154],[-22,150],[-18,146],[-14,144],[-12,136],[-14,128]],

  // ── Greenland ─────────────────────────────────────
  [[83,-20],[83,-50],[80,-55],[76,-68],[72,-68],[68,-50],[64,-52],[66,-38],
   [70,-26],[76,-22],[80,-18],[83,-18],[83,-20]],

  // ── Great Britain ─────────────────────────────────
  [[50,-5],[52,-5],[54,-3],[56,-2],[58,0],[57,2],[55,2],[54,0],[52,0],
   [50,-3],[50,-5]],

  // ── Japan (simplified) ────────────────────────────
  [[30,130],[32,131],[34,132],[34,134],[36,136],[38,140],[40,141],[42,141],
   [44,145],[43,140],[42,141],[40,141],[38,140],[36,136],[34,134],[34,132],
   [32,131],[30,130]],

  // ── New Zealand (North Island) ────────────────────
  [[-36,174],[-38,176],[-41,175],[-41,174],[-38,178],[-36,174]],

  // ── Iceland ───────────────────────────────────────
  [[64,-22],[65,-14],[66,-14],[66,-18],[65,-24],[64,-22]],

  // ── Madagascar ────────────────────────────────────
  [[-12,50],[-14,48],[-18,44],[-22,44],[-25,46],[-24,48],[-18,48],[-14,50],[-12,50]],
]

/* ═══════════════════════════════════════════════════════
   PROJECTION HELPERS
═══════════════════════════════════════════════════════ */
// Equirectangular → canvas pixel (maps perfectly onto THREE sphere texture)
function toPixel(lat:number, lng:number, W:number, H:number) {
  return { x: (lng + 180) / 360 * W, y: (90 - lat) / 180 * H }
}

// Lat/lng → 3D sphere point
function toSphere(lat:number, lng:number, r:number) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

/* ═══════════════════════════════════════════════════════
   BUILD CONTINENT CANVAS TEXTURE (2048 × 1024)
═══════════════════════════════════════════════════════ */
function buildMapCanvas(): HTMLCanvasElement {
  const W = 2048, H = 1024
  const c  = document.createElement('canvas')
  c.width  = W
  c.height = H
  const ctx = c.getContext('2d')!

  // Background
  ctx.fillStyle = '#06080f'
  ctx.fillRect(0, 0, W, H)

  // Grid lines (latitude/longitude)
  ctx.strokeStyle = 'rgba(14,165,233,0.07)'
  ctx.lineWidth   = 1
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = (90 - lat) / 180 * H
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = (lng + 180) / 360 * W
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }

  // Draw each continent
  CONTINENTS.forEach(poly => {
    if (poly.length < 3) return

    // Filled shape (slightly lighter than bg)
    ctx.beginPath()
    poly.forEach(([lat, lng], i) => {
      const p = toPixel(lat, lng, W, H)
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(14,165,233,0.09)'
    ctx.fill()

    // Stroke outline
    ctx.strokeStyle = 'rgba(14,165,233,0.55)'
    ctx.lineWidth   = 2.5
    ctx.lineJoin    = 'round'
    ctx.stroke()
  })

  return c
}

/* ═══════════════════════════════════════════════════════
   MARKER DOT (2D)
   Projected to equirectangular then scaled to container
═══════════════════════════════════════════════════════ */
interface DotPos { x: number; y: number }
function markerPos2D(lat: number, lng: number, W: number, H: number): DotPos {
  return { x: (lng + 180) / 360 * W, y: (90 - lat) / 180 * H }
}

/* ═══════════════════════════════════════════════════════
   THREE.JS GLOBE COMPONENT
═══════════════════════════════════════════════════════ */
function Globe3D({
  mapCanvas,
  visible,
  onHover,
}: {
  mapCanvas: HTMLCanvasElement | null
  visible: boolean
  onHover: (comp: Comp | null, x: number, y: number) => void
}) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !mapCanvas) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000)
    camera.position.set(0, 0, 5.0)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const sun = new THREE.DirectionalLight(0x0EA5E9, 1.8)
    sun.position.set(4, 2, 4)
    scene.add(sun)
    const rim = new THREE.DirectionalLight(0x0284C7, 0.5)
    rim.position.set(-5, -3, -3)
    scene.add(rim)

    const earth = new THREE.Group()
    scene.add(earth)

    const R = 2

    // Globe with map canvas texture
    const texture = new THREE.CanvasTexture(mapCanvas)
    const globeMat = new THREE.MeshPhongMaterial({
      map:         texture,
      shininess:   15,
      transparent: false,
    })
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), globeMat))

    // Atmosphere glow
    earth.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.18, 64, 64),
      new THREE.MeshPhongMaterial({ color:0x0EA5E9, transparent:true, opacity:0.05, side:THREE.BackSide }),
    ))

    // Competition markers
    const dotMeshes: THREE.Mesh[] = []
    const ringMeshes: THREE.Mesh[] = []

    COMPS.forEach(comp => {
      const pos   = toSphere(comp.lat, comp.lng, R + 0.05)
      const color = new THREE.Color(TYPE_COLOR[comp.type])

      const ring = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 10, 10),
        new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.25 }),
      )
      ring.position.copy(pos)
      earth.add(ring)
      ringMeshes.push(ring)

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 10, 10),
        new THREE.MeshBasicMaterial({ color }),
      )
      dot.position.copy(pos)
      dot.userData = { comp }
      earth.add(dot)
      dotMeshes.push(dot)
    })

    // Raycaster
    const ray   = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-999, -999)

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      ray.setFromCamera(mouse, camera)
      const hits = ray.intersectObjects(dotMeshes)
      if (hits.length > 0) {
        const comp = hits[0].object.userData.comp as Comp
        onHover(comp, e.clientX, e.clientY)
        mount.style.cursor = 'pointer'
      } else {
        onHover(null, 0, 0)
        mount.style.cursor = 'default'
      }
    }
    mount.addEventListener('mousemove', onMouseMove)

    // Drag
    let dragging = false, prev = { x: 0, y: 0 }
    let autoSpin = true, spinVel = 0.0010

    const onDown = (e: MouseEvent) => {
      dragging = true; autoSpin = false; spinVel = 0
      prev = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      dragging = false
      setTimeout(() => { autoSpin = true }, 2000)
    }
    const onDrag = (e: MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      earth.rotation.y += dx * 0.005
      earth.rotation.x = Math.max(-0.55, Math.min(0.55, earth.rotation.x + dy * 0.004))
      spinVel = dx * 0.0012
      prev = { x: e.clientX, y: e.clientY }
    }
    mount.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    mount.addEventListener('mousemove', onDrag)

    // RAF
    let raf: number, t = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t  += 0.015
      if (autoSpin) earth.rotation.y += 0.0010
      else if (!dragging) earth.rotation.y += spinVel *= 0.95
      ringMeshes.forEach((ring, i) => {
        const s = 1 + 0.25 * Math.sin(t * 1.5 + i)
        ring.scale.setScalar(s)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.12 * Math.sin(t * 1.5 + i)
      })
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mouseup', onUp)
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeEventListener('mousemove', onDrag)
      mount.removeEventListener('mousedown', onDown)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [mapCanvas])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: visible ? 'auto' : 'none' }}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   2D FLAT MAP COMPONENT
═══════════════════════════════════════════════════════ */
function Map2D({
  mapCanvas,
  visible,
  onHover,
}: {
  mapCanvas: HTMLCanvasElement | null
  visible: boolean
  onHover: (comp: Comp | null, x: number, y: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [activeComp, setActiveComp] = useState<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ w: width, h: height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Draw canvas onto a canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current || !mapCanvas || dims.w === 0) return
    const ctx = canvasRef.current.getContext('2d')!
    canvasRef.current.width  = dims.w
    canvasRef.current.height = dims.h
    ctx.drawImage(mapCanvas, 0, 0, dims.w, dims.h)
  }, [mapCanvas, dims])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Flat map canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Competition markers */}
      {dims.w > 0 && COMPS.map(comp => {
        const { x, y } = markerPos2D(comp.lat, comp.lng, dims.w, dims.h)
        const color = TYPE_COLOR[comp.type]
        const isActive = activeComp === comp.id
        return (
          <div
            key={comp.id}
            className="absolute"
            style={{ left: x, top: y, transform: 'translate(-50%,-50%)', zIndex: 10, cursor: 'pointer' }}
            onMouseEnter={e => { setActiveComp(comp.id); onHover(comp, e.clientX, e.clientY) }}
            onMouseLeave={() => { setActiveComp(null); onHover(null, 0, 0) }}
          >
            {/* Pulse ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: 18, height: 18, top: -9, left: -9,
                background: color + '28',
                border: `1px solid ${color}55`,
                animation: 'mapPulse 2s ease-in-out infinite',
                animationDelay: `${comp.id * 0.18}s`,
                transform: isActive ? 'scale(1.5)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }}
            />
            {/* Core dot */}
            <div
              className="relative rounded-full"
              style={{
                width: 8, height: 8,
                background: color,
                boxShadow: `0 0 ${isActive ? 14 : 6}px ${color}`,
                transition: 'box-shadow 0.2s ease',
              }}
            />
          </div>
        )
      })}

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(8,9,14,0.9) 100%)' }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SIDE NOTCH TOGGLE
═══════════════════════════════════════════════════════ */
function SideNotch({ mode, onToggle }: { mode: '2d'|'3d'; onToggle: () => void }) {
  return (
    <div
      className="absolute right-0 top-1/2 z-30"
      style={{ transform: 'translateY(-50%) translateX(1px)' }}
    >
      <button
        onClick={onToggle}
        className="relative flex flex-col items-center justify-center gap-0 overflow-hidden"
        style={{
          width:  '32px',
          height: '80px',
          background: 'rgba(8,9,14,0.92)',
          border: '1px solid rgba(14,165,233,0.25)',
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        {/* Sliding indicator */}
        <motion.div
          animate={{ y: mode === '2d' ? -18 : 18 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="absolute w-full"
          style={{
            height: '36px',
            background: 'rgba(14,165,233,0.15)',
            borderTop: mode === '2d' ? '1px solid rgba(14,165,233,0.4)' : 'none',
            borderBottom: mode === '3d' ? '1px solid rgba(14,165,233,0.4)' : 'none',
          }}
        />

        {/* Labels */}
        <span
          className="relative z-10 font-display text-xs"
          style={{
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: mode === '2d' ? '#0EA5E9' : 'rgba(148,163,184,0.4)',
            transition: 'color 0.3s',
            marginBottom: '2px',
          }}
        >
          2D
        </span>
        <div style={{ width: '18px', height: '1px', background: 'rgba(14,165,233,0.2)' }} />
        <span
          className="relative z-10 font-display text-xs"
          style={{
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: mode === '3d' ? '#0EA5E9' : 'rgba(148,163,184,0.4)',
            transition: 'color 0.3s',
            marginTop: '2px',
          }}
        >
          3D
        </span>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════ */
export function GlobeSection() {
  const { ref: sectionRef, inView } = useInView(0.1)
  const [mode, setMode] = useState<'2d'|'3d'>('3d')
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement | null>(null)
  const [hoveredComp, setHoveredComp] = useState<Comp | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [activeId, setActiveId] = useState<number | null>(null)

  // Build the map canvas once on mount
  useEffect(() => {
    const c = buildMapCanvas()
    setMapCanvas(c)
  }, [])

  // Inject CSS animation
  useEffect(() => {
    if (document.getElementById('globe-css')) return
    const s = document.createElement('style')
    s.id = 'globe-css'
    s.textContent = `
      @keyframes mapPulse {
        0%,100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.4); opacity: 0.2; }
      }
    `
    document.head.appendChild(s)
  }, [])

  const handleHover = useCallback((comp: Comp | null, x: number, y: number) => {
    setHoveredComp(comp)
    setTooltipPos({ x, y })
  }, [])

  return (
    <section
      id="season"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: '#08090E' }}
    >
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />

      <div className="container relative z-10">

        {/* Header */}
        <div
          className="mb-14 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

          {/* ── Map / Globe container ───────────────────────── */}
          <div
            className="relative rounded-sm overflow-visible"
            style={{
              height: '480px',
              border: '1px solid rgba(14,165,233,0.12)',
              background: '#06080f',
              boxShadow: '0 0 60px rgba(14,165,233,0.04)',
            }}
          >
            {/* 2D Map */}
            <Map2D mapCanvas={mapCanvas} visible={mode === '2d'} onHover={handleHover} />

            {/* 3D Globe */}
            <Globe3D mapCanvas={mapCanvas} visible={mode === '3d'} onHover={handleHover} />

            {/* Mode label top-left */}
            <div
              className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-sm"
              style={{
                background: 'rgba(8,9,14,0.8)',
                border: '1px solid rgba(14,165,233,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0EA5E9', boxShadow: '0 0 5px #0EA5E9' }} />
              <span className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.7)', letterSpacing: '0.1em' }}>
                {mode === '3d' ? 'Drag to rotate' : 'Hover markers'}
              </span>
            </div>

            {/* Side notch toggle */}
            <SideNotch mode={mode} onToggle={() => setMode(m => m === '2d' ? '3d' : '2d')} />
          </div>

          {/* ── Competition list ────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <div className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(148,163,184,0.4)', letterSpacing: '0.2em' }}>
              10 competitions · 9 countries
            </div>
            {COMPS.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm cursor-default transition-all duration-200"
                style={{
                  background:   activeId === comp.id ? `${TYPE_COLOR[comp.type]}0d` : 'rgba(255,255,255,0.015)',
                  border:       `1px solid ${activeId === comp.id ? TYPE_COLOR[comp.type] + '30' : 'rgba(255,255,255,0.04)'}`,
                  transform:    activeId === comp.id ? 'translateX(-2px)' : 'none',
                }}
                onMouseEnter={() => setActiveId(comp.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                <span className="font-display text-xs w-8 flex-shrink-0 text-center" style={{ color: TYPE_COLOR[comp.type], fontSize: '0.75rem' }}>
                  {comp.month}
                </span>
                <span className="text-sm flex-shrink-0">{comp.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-white truncate" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.88rem', letterSpacing: '0.04em' }}>
                    {comp.name}
                  </p>
                  <p className="font-body text-xs truncate" style={{ color: 'rgba(148,163,184,0.45)', fontSize: '0.7rem' }}>
                    {comp.location} · {comp.date}
                  </p>
                </div>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TYPE_COLOR[comp.type], boxShadow: activeId === comp.id ? `0 0 8px ${TYPE_COLOR[comp.type]}` : 'none', transition: 'box-shadow 0.2s' }} />
              </motion.div>
            ))}

            {/* Legend */}
            <div className="mt-4 flex flex-col gap-1.5">
              {(Object.entries(TYPE_LABEL) as [CompType, string][]).map(([type, label]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TYPE_COLOR[type] }} />
                  <span className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.38)', letterSpacing: '0.06em', fontSize: '0.7rem' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredComp && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltipPos.x + 16, top: tooltipPos.y, transform: 'translateY(-50%)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 rounded-sm"
            style={{
              background:     'rgba(6,8,15,0.97)',
              border:         `1px solid ${TYPE_COLOR[hoveredComp.type]}40`,
              backdropFilter: 'blur(20px)',
              minWidth:       '180px',
              boxShadow:      `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${TYPE_COLOR[hoveredComp.type]}12`,
            }}
          >
            <p className="font-heading font-bold text-white" style={{ fontFamily:'Barlow Condensed, sans-serif', fontSize:'0.95rem', letterSpacing:'0.05em' }}>
              {hoveredComp.flag} {hoveredComp.name}
            </p>
            <p className="font-body text-xs mt-1" style={{ color:'rgba(148,163,184,0.65)' }}>{hoveredComp.location}</p>
            <p className="font-body text-xs mt-0.5 font-medium" style={{ color: TYPE_COLOR[hoveredComp.type] }}>{hoveredComp.date}</p>
            <p className="font-body text-xs mt-0.5" style={{ color:'rgba(148,163,184,0.35)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>{TYPE_LABEL[hoveredComp.type]}</p>
          </motion.div>
        </div>
      )}
    </section>
  )
}
