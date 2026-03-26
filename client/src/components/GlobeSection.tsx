'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/* ─── Competition data (rose foncé from calendar) ──────────────────────── */
type CompType = 'world_cup' | 'world_champ' | 'european' | 'national'

interface Comp {
  id: number
  name: string
  location: string
  flag: string
  date: string
  month: string
  lat: number
  lng: number
  type: CompType
}

const COMPS: Comp[] = [
  { id: 0,  name: 'World Cup IWSA R',       location: 'Hong Kong',            flag: '🇭🇰', date: 'Feb 4–7',   month: 'FEB', lat: 22.3193,  lng: 114.1694, type: 'world_cup'   },
  { id: 1,  name: 'European Champ. IWSA F', location: 'Naples, Italy',         flag: '🇮🇹', date: 'Apr 8–11',  month: 'APR', lat: 40.8518,  lng: 14.2681,  type: 'european'    },
  { id: 2,  name: 'Défi Wing',              location: 'Gruissan, France',      flag: '🇫🇷', date: 'May 11–14', month: 'MAY', lat: 43.1103,  lng: 3.0858,   type: 'national'    },
  { id: 3,  name: 'World Cup IWSA R',       location: 'Silvaplana, Switzerland', flag: '🇨🇭', date: 'Jun 17–20', month: 'JUN', lat: 46.4663, lng: 9.7960,  type: 'world_cup'   },
  { id: 4,  name: 'World Cup IWSA R',       location: 'Gizzeria, Italy',       flag: '🇮🇹', date: 'Jul 8–11',  month: 'JUL', lat: 38.9736,  lng: 16.1768,  type: 'world_cup'   },
  { id: 5,  name: 'World Champ. IWSA F',   location: 'Istanbul, Türkiye',     flag: '🇹🇷', date: 'Aug 11–14', month: 'AUG', lat: 41.0082,  lng: 28.9784,  type: 'world_champ' },
  { id: 6,  name: 'World Cup IWSA R',       location: 'Daishan, China',        flag: '🇨🇳', date: 'Oct 16–20', month: 'OCT', lat: 30.2084,  lng: 122.2099, type: 'world_cup'   },
  { id: 7,  name: 'French Champ. S&R',      location: 'Leucate, France',       flag: '🇫🇷', date: 'Oct 23–25', month: 'OCT', lat: 42.9185,  lng: 3.0379,   type: 'national'    },
  { id: 8,  name: 'IWSA Racing',            location: 'Cagliari, Sardinia',    flag: '🇮🇹', date: 'Nov 1–3',   month: 'NOV', lat: 39.2238,  lng: 9.1217,   type: 'world_cup'   },
  { id: 9,  name: 'World Cup IWSA R',       location: 'Jericoacoara, Brazil',  flag: '🇧🇷', date: 'Dec 1–4',   month: 'DEC', lat: -2.7975,  lng: -40.5137, type: 'world_cup'   },
]

const TYPE_COLOR: Record<CompType, string> = {
  world_champ: '#F59E0B',
  world_cup:   '#EC4899',
  european:    '#0EA5E9',
  national:    '#A78BFA',
}
const TYPE_LABEL: Record<CompType, string> = {
  world_champ: 'World Championship',
  world_cup:   'World Cup',
  european:    'European Championship',
  national:    'National / Invitational',
}

/* ─── Lat/lng → 3D sphere position ────────────────────────────────────── */
function latLng(lat: number, lng: number, r: number) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

/* ─── Component ────────────────────────────────────────────────────────── */
export function GlobeSection() {
  const mountRef    = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, inView } = useInView(0.1)
  const [hovered, setHovered]       = useState<Comp | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [active, setActive]         = useState<number | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    /* ── Renderer ── */
    const W = mount.clientWidth
    const H = mount.clientHeight
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    /* ── Scene / camera ── */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000)
    camera.position.set(0, 0, 5.2)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const sun = new THREE.DirectionalLight(0x0EA5E9, 2)
    sun.position.set(4, 2, 4)
    scene.add(sun)
    const rim = new THREE.DirectionalLight(0x0284C7, 0.6)
    rim.position.set(-5, -3, -3)
    scene.add(rim)

    /* ── Globe group (everything that rotates) ── */
    const R     = 2
    const earth = new THREE.Group()
    scene.add(earth)

    // Core sphere
    const coreMat = new THREE.MeshPhongMaterial({
      color:       0x080c16,
      emissive:    0x020408,
      shininess:   18,
      transparent: true,
      opacity:     0.96,
    })
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), coreMat))

    // Latitude/longitude wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color:       0x0EA5E9,
      wireframe:   true,
      transparent: true,
      opacity:     0.038,
    })
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.01, 28, 28), wireMat))

    // Outer atmosphere glow
    const atmMat = new THREE.MeshPhongMaterial({
      color:       0x0EA5E9,
      transparent: true,
      opacity:     0.055,
      side:        THREE.BackSide,
    })
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R + 0.22, 64, 64), atmMat))

    /* ── Competition dots ── */
    const dotMeshes: THREE.Mesh[]  = []
    const ringMeshes: THREE.Mesh[] = []

    COMPS.forEach((comp) => {
      const pos   = latLng(comp.lat, comp.lng, R + 0.055)
      const color = new THREE.Color(TYPE_COLOR[comp.type])

      // Pulse ring
      const ring = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 }),
      )
      ring.position.copy(pos)
      earth.add(ring)
      ringMeshes.push(ring)

      // Core dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.033, 12, 12),
        new THREE.MeshBasicMaterial({ color }),
      )
      dot.position.copy(pos)
      dot.userData = { comp }
      earth.add(dot)
      dotMeshes.push(dot)
    })

    /* ── Raycaster / tooltip ── */
    const ray   = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-999, -999)

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1

      ray.setFromCamera(mouse, camera)
      const hits = ray.intersectObjects(dotMeshes)

      if (hits.length > 0) {
        const dot  = hits[0].object as THREE.Mesh
        const comp = dot.userData.comp as Comp

        // Project world pos → screen
        const world = dot.getWorldPosition(new THREE.Vector3())
        const proj  = world.project(camera)
        setTooltipPos({
          x: ( proj.x * 0.5 + 0.5) * rect.width  + rect.left,
          y: (-proj.y * 0.5 + 0.5) * rect.height + rect.top,
        })
        setHovered(comp)
        mount.style.cursor = 'pointer'
      } else {
        setHovered(null)
        mount.style.cursor = 'default'
      }
    }
    mount.addEventListener('mousemove', onMouseMove)

    /* ── Drag to rotate ── */
    let dragging = false
    let prev = { x: 0, y: 0 }
    let autoSpin = true
    let spinVel  = 0.0012

    const onDown = (e: MouseEvent) => {
      dragging  = true
      autoSpin  = false
      spinVel   = 0
      prev      = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      dragging = false
      setTimeout(() => { autoSpin = true }, 1800)
    }
    const onDrag = (e: MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      earth.rotation.y += dx * 0.006
      earth.rotation.x  = Math.max(-0.6, Math.min(0.6, earth.rotation.x + dy * 0.004))
      spinVel = dx * 0.001
      prev    = { x: e.clientX, y: e.clientY }
    }
    mount.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',  onUp)
    mount.addEventListener('mousemove', onDrag)

    /* ── Animation loop ── */
    let raf: number
    let t = 0

    const animate = () => {
      raf = requestAnimationFrame(animate)
      t  += 0.012

      if (autoSpin) earth.rotation.y += 0.0012
      else if (!dragging) earth.rotation.y += spinVel *= 0.96

      // Pulse rings
      ringMeshes.forEach((ring, i) => {
        const scale = 1 + 0.22 * Math.sin(t * 1.6 + i * 0.9)
        ring.scale.setScalar(scale)
        ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.18 + 0.14 * Math.sin(t * 1.6 + i * 0.9)
      })

      renderer.render(scene, camera)
    }
    animate()

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
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
  }, [])

  return (
    <section
      id="season"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: '#08090E' }}
    >
      {/* Subtle radial glow behind globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)' }}
      />

      <div className="container relative z-10">

        {/* Header */}
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── Globe canvas ── */}
          <div
            ref={mountRef}
            className="relative w-full rounded-sm overflow-hidden"
            style={{
              height:     '480px',
              background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.05) 0%, transparent 70%)',
              border:     '1px solid rgba(14,165,233,0.08)',
            }}
          >
            {/* Drag hint */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-xs uppercase tracking-widest pointer-events-none"
              style={{ color: 'rgba(148,163,184,0.35)', letterSpacing: '0.15em' }}
            >
              drag to rotate
            </div>
          </div>

          {/* ── Competition list ── */}
          <div className="flex flex-col gap-2">
            {COMPS.map((comp, i) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.055 }}
                className="flex items-center gap-4 px-4 py-3 rounded-sm cursor-default transition-all duration-200"
                style={{
                  background:   active === comp.id ? `${TYPE_COLOR[comp.type]}10` : 'rgba(255,255,255,0.02)',
                  border:       `1px solid ${active === comp.id ? TYPE_COLOR[comp.type] + '35' : 'rgba(255,255,255,0.04)'}`,
                }}
                onMouseEnter={() => setActive(comp.id)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Month */}
                <span
                  className="font-display text-base w-10 flex-shrink-0 text-center"
                  style={{ color: TYPE_COLOR[comp.type], fontSize: '0.85rem', letterSpacing: '0.05em' }}
                >
                  {comp.month}
                </span>

                {/* Flag */}
                <span className="text-base flex-shrink-0">{comp.flag}</span>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-heading font-bold text-white truncate"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.95rem', letterSpacing: '0.04em' }}
                  >
                    {comp.name}
                  </p>
                  <p className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.55)' }}>
                    {comp.location} · {comp.date}
                  </p>
                </div>

                {/* Dot indicator */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: TYPE_COLOR[comp.type], boxShadow: `0 0 7px ${TYPE_COLOR[comp.type]}` }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
        <motion.div
          className="mt-10 flex flex-wrap gap-5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {(Object.entries(TYPE_LABEL) as [CompType, string][]).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLOR[type], boxShadow: `0 0 5px ${TYPE_COLOR[type]}` }} />
              <span className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.5)', letterSpacing: '0.08em' }}>{label}</span>
            </div>
          ))}
          <div className="ml-auto font-body text-xs" style={{ color: 'rgba(148,163,184,0.3)' }}>
            10 competitions · 9 countries
          </div>
        </motion.div>
      </div>

      {/* ── Tooltip ── */}
      {hovered && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left:      tooltipPos.x + 14,
            top:       tooltipPos.y,
            transform: 'translateY(-50%)',
          }}
        >
          <div
            className="px-4 py-3 rounded-sm"
            style={{
              background:    'rgba(8,9,14,0.96)',
              border:        `1px solid ${TYPE_COLOR[hovered.type]}45`,
              backdropFilter:'blur(16px)',
              minWidth:      '190px',
              boxShadow:     `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${TYPE_COLOR[hovered.type]}15`,
            }}
          >
            <p className="font-heading font-bold text-white" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem', letterSpacing: '0.06em' }}>
              {hovered.flag} {hovered.name}
            </p>
            <p className="font-body text-xs mt-1" style={{ color: 'rgba(148,163,184,0.7)' }}>
              {hovered.location}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: TYPE_COLOR[hovered.type] }}>
              {hovered.date}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
