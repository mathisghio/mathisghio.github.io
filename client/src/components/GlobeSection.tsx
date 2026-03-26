'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/* ═══════════════════════════════════════════════════════════════════════════
   COMPETITION DATA
═══════════════════════════════════════════════════════════════════════════ */
type CompType = 'world_cup' | 'world_champ' | 'european' | 'national'
interface Comp { id: number; name: string; location: string; flag: string; date: string; month: string; lat: number; lng: number; type: CompType }

const COMPS: Comp[] = [
  { id:0, name:'World Cup IWSA R',       location:'Hong Kong',               flag:'🇭🇰', date:'Feb 4–7',    month:'FEB', lat:22.30, lng:114.20, type:'world_cup'   },
  { id:1, name:'European Champ. IWSA F', location:'Naples, Italy',           flag:'🇮🇹', date:'Apr 8–11',   month:'APR', lat:40.85, lng:14.27,  type:'european'    },
  { id:2, name:'Défi Wing',              location:'Gruissan, France',        flag:'🇫🇷', date:'May 11–14',  month:'MAY', lat:43.11, lng:3.09,   type:'national'    },
  { id:3, name:'World Cup IWSA R',       location:'Silvaplana, Switzerland', flag:'🇨🇭', date:'Jun 17–20',  month:'JUN', lat:46.47, lng:9.80,   type:'world_cup'   },
  { id:4, name:'World Cup IWSA R',       location:'Gizzeria, Italy',         flag:'🇮🇹', date:'Jul 8–11',   month:'JUL', lat:38.97, lng:16.18,  type:'world_cup'   },
  { id:5, name:'World Champ. IWSA F',    location:'Istanbul, Türkiye',       flag:'🇹🇷', date:'Aug 11–14',  month:'AUG', lat:41.01, lng:28.98,  type:'world_champ' },
  { id:6, name:'World Cup IWSA R',       location:'Daishan, China',          flag:'🇨🇳', date:'Oct 16–20',  month:'OCT', lat:30.21, lng:122.20, type:'world_cup'   },
  { id:7, name:'French Champ. S&R',      location:'Leucate, France',         flag:'🇫🇷', date:'Oct 23–25',  month:'OCT', lat:42.92, lng:3.04,   type:'national'    },
  { id:8, name:'IWSA Racing',            location:'Cagliari, Sardinia',      flag:'🇮🇹', date:'Nov 1–3',    month:'NOV', lat:39.22, lng:9.12,   type:'world_cup'   },
  { id:9, name:'World Cup IWSA R',       location:'Jericoacoara, Brazil',    flag:'🇧🇷', date:'Dec 1–4',    month:'DEC', lat:-2.80, lng:-40.50, type:'world_cup'   },
]
const TC: Record<CompType, string> = { world_champ:'#F59E0B', world_cup:'#EC4899', european:'#0EA5E9', national:'#A78BFA' }
const TL: Record<CompType, string> = { world_champ:'World Championship', world_cup:'World Cup', european:'European Champ.', national:'National / Invitational' }

/* ═══════════════════════════════════════════════════════════════════════════
   WORLD GEOGRAPHY — used only for the 2D flat map canvas
═══════════════════════════════════════════════════════════════════════════ */
const GEO: [number, number][][] = [
  [[71,-141],[68,-141],[64,-141],[60,-141],[59,-136],[57,-135],[54,-130],[51,-128],[50,-128],[48,-124],[46,-124],[42,-124],[38,-122],[36,-122],[34,-120],[32,-117],[30,-116],[27,-110],[23,-110],[22,-106],[20,-105],[18,-96],[16,-94],[15,-92],[14,-90],[14,-87],[10,-84],[8,-77],[9,-75],[11,-74],[16,-62],[18,-68],[20,-74],[22,-80],[24,-82],[25,-81],[26,-80],[25,-80],[24,-80],[25,-79],[28,-81],[30,-81],[32,-80],[35,-76],[38,-75],[40,-74],[41,-72],[42,-70],[44,-66],[47,-53],[50,-56],[53,-58],[56,-60],[58,-62],[62,-64],[64,-68],[66,-64],[68,-68],[70,-74],[72,-80],[74,-86],[76,-92],[74,-110],[72,-124],[71,-141]],
  [[83,-21],[82,-40],[80,-54],[77,-68],[72,-68],[68,-52],[64,-51],[66,-38],[70,-26],[73,-22],[77,-18],[80,-18],[83,-20],[83,-21]],
  [[23,-82],[22,-80],[20,-75],[20,-74],[21,-74],[22,-74],[23,-82]],
  [[11,-73],[10,-65],[8,-61],[5,-52],[3,-51],[1,-50],[0,-50],[-2,-40],[-5,-35],[-8,-35],[-10,-37],[-13,-39],[-16,-39],[-18,-39],[-20,-40],[-23,-43],[-26,-48],[-28,-49],[-30,-51],[-33,-53],[-35,-57],[-38,-58],[-40,-62],[-42,-64],[-46,-66],[-50,-68],[-53,-70],[-55,-65],[-54,-70],[-50,-75],[-45,-74],[-40,-62],[-36,-57],[-30,-50],[-22,-44],[-16,-39],[-4,-40],[-2,-40],[0,-50],[0,-76],[-1,-78],[2,-78],[5,-77],[8,-77],[10,-73],[11,-73]],
  [[44,-2],[44,-8],[42,-9],[38,-9],[36,-7],[36,-5],[36,-3],[37,0],[38,2],[42,3],[43,3],[43,5],[44,8],[44,6],[46,6],[47,6],[48,2],[51,2],[51,1],[51,3],[52,5],[52,7],[50,7],[50,6],[48,7],[46,6],[44,-2]],
  [[44,-2],[44,-7],[43,-8],[43,-9],[42,-9],[39,-9],[37,-9],[36,-7],[36,-5],[36,-3],[37,0],[38,2],[40,1],[42,3],[43,3],[44,-2]],
  [[44.2,7.6],[44.0,8.6],[44.5,9.0],[44.5,10.0],[45.0,10.5],[45.4,12.3],[45.7,13.6],[46.0,14.0],[45.5,14.5],[45.0,14.5],[44.5,14.9],[44.0,15.0],[43.5,15.4],[42.5,14.4],[42.0,15.6],[41.5,15.8],[41.0,16.0],[40.5,17.0],[40.5,18.2],[40.0,18.5],[39.8,18.4],[39.4,17.0],[38.9,16.5],[38.1,15.6],[37.9,15.5],[38.0,15.0],[38.3,16.0],[38.9,16.5],[39.2,16.2],[39.5,15.7],[40.0,14.7],[40.5,14.4],[41.0,13.8],[41.5,12.6],[42.0,11.6],[42.5,10.5],[43.5,10.5],[43.8,9.5],[44.2,8.5],[44.2,7.6]],
  [[41.2,9.2],[40.5,8.1],[39.0,8.3],[38.9,9.5],[39.8,9.8],[41.2,9.2]],
  [[38.2,15.6],[37.7,15.2],[37.3,14.4],[37.0,13.5],[37.2,12.5],[37.7,12.3],[38.0,12.5],[38.2,13.5],[38.3,14.5],[38.2,15.6]],
  [[57,8],[58,8],[58,10],[60,5],[61,5],[63,8],[65,14],[66,14],[68,16],[70,22],[71,26],[71,28],[70,30],[68,28],[66,24],[65,25],[65,28],[66,28],[67,26],[68,24],[70,26],[71,28],[70,30],[68,28],[66,24],[64,20],[62,18],[60,18],[58,14],[57,12],[57,8]],
  [[58,6],[60,5],[61,5],[62,6],[63,8],[65,14],[66,14],[68,14],[70,20],[71,26],[72,26],[74,18],[74,20],[72,20],[70,26],[69,18],[68,16],[66,16],[65,14],[63,8],[62,6],[60,6],[58,6]],
  [[50,-5],[50,-3],[51,-3],[51,-5],[54,-3],[55,-2],[55,0],[58,0],[58,-3],[57,-6],[55,-6],[53,-4],[51,-3],[50,-5]],
  [[54,22],[52,14],[50,14],[48,14],[46,14],[45,14],[45,16],[44,20],[42,22],[42,26],[41,28],[42,28],[44,26],[46,22],[48,20],[50,20],[52,18],[54,18],[54,20],[54,22]],
  [[42,20],[40,20],[38,22],[38,26],[40,26],[42,22],[42,20]],
  [[42,26],[40,26],[38,26],[38,28],[36,28],[36,30],[36,36],[38,38],[40,38],[40,40],[40,42],[38,42],[36,36],[38,38],[40,38],[42,40],[42,36],[40,36],[42,34],[42,30],[42,28],[42,26]],
  [[37,10],[37,12],[36,14],[32,24],[30,32],[22,36],[16,42],[12,44],[11,44],[8,42],[4,42],[0,42],[-4,40],[-10,40],[-18,36],[-22,34],[-26,32],[-30,30],[-34,26],[-35,20],[-34,18],[-30,17],[-26,15],[-20,14],[-14,12],[-8,14],[-4,10],[0,10],[2,6],[4,2],[2,-4],[4,-8],[3,-12],[4,-8],[6,-2],[5,0],[6,2],[8,2],[8,4],[10,4],[10,8],[12,10],[14,12],[16,14],[18,14],[20,14],[22,14],[22,16],[24,18],[26,22],[28,26],[30,30],[30,32],[22,36],[16,42],[12,44],[8,44],[4,44],[0,42],[37,10]],
  [[-12,50],[-14,48],[-18,44],[-22,44],[-24,46],[-24,48],[-20,48],[-16,50],[-12,50]],
  [[30,32],[28,34],[24,36],[20,38],[16,42],[12,44],[14,50],[18,56],[22,60],[24,58],[26,56],[28,50],[28,46],[28,44],[30,42],[30,36],[30,32]],
  [[25,68],[28,72],[28,76],[27,80],[26,88],[22,91],[16,82],[12,80],[8,78],[8,77],[8,76],[10,74],[12,74],[14,74],[18,72],[20,70],[22,70],[22,68],[24,66],[25,68]],
  [[10,80],[8,80],[6,80],[6,82],[8,82],[10,80]],
  [[70,28],[68,28],[60,26],[58,24],[54,22],[54,20],[54,18],[52,14],[50,14],[52,6],[52,4],[50,14],[48,14],[46,46],[48,50],[50,52],[52,56],[54,58],[56,60],[58,60],[60,56],[62,54],[64,52],[66,58],[68,60],[70,60],[72,64],[74,68],[76,78],[78,78],[80,72],[80,62],[78,56],[76,54],[74,60],[72,56],[70,58],[68,58],[68,60],[70,60],[72,64],[74,68],[76,72],[78,76],[80,78],[80,88],[78,92],[76,96],[74,100],[72,110],[72,120],[68,130],[68,140],[66,170],[68,174],[72,180],[76,172],[78,170],[80,150],[80,140],[78,135],[76,130],[74,125],[72,120],[70,130],[68,140],[66,134],[64,130],[62,130],[60,120],[58,116],[56,114],[54,114],[52,118],[52,120],[50,122],[48,120],[46,120],[44,120],[42,130],[45,135],[48,140],[50,140],[52,140],[55,136],[56,130],[58,124],[60,120],[62,122],[64,130],[66,134],[68,140],[66,140],[64,130],[62,126],[60,116],[58,114],[56,116],[54,120],[52,120],[50,122],[48,120],[46,120],[44,118],[42,116],[40,120],[38,120],[36,120],[34,120],[32,120],[30,122],[28,120],[26,120],[24,116],[22,114],[20,110],[20,108],[16,108],[16,102],[12,102],[8,98],[4,100],[2,104],[0,104],[0,108],[2,110],[4,112],[4,116],[6,116],[6,108],[8,100],[10,100],[12,98],[14,100],[16,102],[16,108],[18,104],[20,110],[22,114],[26,120],[30,122],[36,120],[40,120],[44,120],[46,124],[50,130],[54,126],[56,124],[58,120],[60,116],[62,120],[64,130],[68,140],[65,176],[70,178],[72,180],[76,176],[78,170],[80,150],[80,140],[80,130],[78,124],[76,120],[74,118],[72,120],[70,120],[68,116],[66,112],[64,108],[62,106],[60,100],[58,98],[56,92],[56,88],[58,82],[60,80],[62,80],[64,80],[66,80],[68,72],[68,68],[70,64],[72,64],[74,68],[76,72],[78,68],[80,60],[80,54],[78,52],[76,54],[74,58],[72,56],[70,60],[68,60],[66,56],[64,52],[62,52],[60,56],[58,60],[56,60],[54,56],[52,56],[50,52],[48,50],[46,50],[44,48],[42,46],[40,46],[38,44],[36,44],[36,40],[38,38],[40,38],[42,38],[44,38],[46,40],[48,42],[50,44],[52,44],[54,44],[56,46],[56,42],[54,40],[52,42],[50,46],[48,46],[46,46],[44,44],[42,44],[40,42],[40,40],[38,40],[36,40],[36,38],[36,36],[38,38],[40,40],[40,42],[42,44],[44,44],[46,44],[46,50],[48,50],[50,54],[52,56],[54,58],[56,60],[58,56],[58,54],[56,52],[54,50],[54,46],[52,44],[50,44],[50,48],[52,48],[54,48],[56,50],[58,50],[60,52],[62,54],[64,52],[66,58],[68,60],[70,60],[70,28]],
  [[31,130],[33,131],[34,132],[34,134],[36,136],[37,138],[38,141],[40,141],[41,141],[42,141],[43,145],[43,141],[42,140],[40,141],[38,141],[36,136],[34,134],[33,131],[31,130]],
  [[43,141],[42,140],[42,144],[44,145],[44,141],[43,141]],
  [[31,130],[32,131],[33,130],[32,129],[31,130]],
  [[38,124],[38,126],[36,126],[34,128],[34,130],[36,130],[38,130],[38,126],[38,124]],
  [[26,98],[22,100],[20,100],[18,104],[16,108],[16,102],[12,102],[10,104],[8,100],[4,100],[4,108],[8,104],[10,104],[12,102],[14,102],[16,108],[14,100],[12,100],[10,100],[8,98],[4,100],[2,104],[2,108],[0,108],[2,110],[4,112],[6,116],[8,116],[10,108],[12,108],[14,100],[16,102],[18,104],[20,104],[22,104],[24,100],[26,98]],
  [[-6,106],[-6,108],[-8,112],[-8,114],[-8,116],[-6,116],[-6,112],[-6,108],[-6,106]],
  [[6,96],[4,98],[2,100],[0,104],[-2,104],[-4,104],[-4,106],[-2,106],[0,104],[2,100],[4,98],[6,96]],
  [[8,116],[6,116],[4,116],[2,112],[0,110],[-2,112],[-4,116],[0,118],[4,118],[6,118],[8,116]],
  [[18,120],[16,120],[14,120],[12,124],[10,122],[12,122],[14,122],[16,122],[18,122],[18,120]],
  [[-4,136],[-4,140],[-6,144],[-8,148],[-6,148],[-4,144],[-2,140],[-2,136],[-4,136]],
  [[-14,128],[-12,130],[-12,134],[-14,136],[-12,136],[-12,130],[-14,128],[-16,122],[-18,122],[-22,114],[-26,114],[-30,114],[-32,116],[-34,118],[-36,136],[-38,140],[-38,148],[-36,150],[-33,152],[-30,154],[-26,154],[-22,150],[-18,146],[-14,144],[-12,136],[-14,136],[-12,134],[-12,130],[-14,128],[-16,122]],
  [[-42,171],[-44,172],[-46,168],[-44,170],[-42,172],[-42,171]],
  [[-36,174],[-38,176],[-41,175],[-40,176],[-38,178],[-36,174]],
  [[64,-22],[65,-16],[66,-14],[66,-22],[65,-24],[64,-22]],
]

/* ── helpers ──────────────────────────────────────────────────────────────── */
function toPixel(lat: number, lng: number, W: number, H: number) {
  return { x: (lng + 180) / 360 * W, y: (90 - lat) / 180 * H }
}

/* ── 2D flat map canvas builder ─────────────────────────────────────────── */
function buildMapCanvas(): HTMLCanvasElement {
  const W = 4096, H = 2048
  const c = document.createElement('canvas'); c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  const og = ctx.createRadialGradient(W*.5,H*.4,0,W*.5,H*.5,W*.65)
  og.addColorStop(0,'#021428'); og.addColorStop(.5,'#010D1C'); og.addColorStop(1,'#010609')
  ctx.fillStyle=og; ctx.fillRect(0,0,W,H)
  ctx.strokeStyle='rgba(14,165,233,0.025)'; ctx.lineWidth=1
  for(let y=0;y<H;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  ctx.strokeStyle='rgba(56,189,248,0.06)'; ctx.lineWidth=1.5
  for(let lat=-90;lat<=90;lat+=30){const y=(90-lat)/180*H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  for(let lng=-180;lng<=180;lng+=30){const x=(lng+180)/360*W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
  ctx.strokeStyle='rgba(56,189,248,0.18)'; ctx.lineWidth=1.5
  ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke()
  ctx.setLineDash([30,20]); ctx.strokeStyle='rgba(56,189,248,0.10)'; ctx.lineWidth=1.2
  for(const lat of[-66.5,-23.5,23.5,66.5]){const y=(90-lat)/180*H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  ctx.setLineDash([])
  ctx.fillStyle='rgba(14,165,233,0.04)'
  for(let x=0;x<W;x+=40)for(let y=0;y<H;y+=40){ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill()}
  GEO.forEach(poly=>{
    if(poly.length<3)return; ctx.beginPath()
    poly.forEach(([lat,lng],i)=>{const p=toPixel(lat,lng,W,H);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)})
    ctx.closePath(); ctx.shadowColor='rgba(14,165,233,0.5)'; ctx.shadowBlur=28
    ctx.fillStyle='rgba(14,165,233,0.22)'; ctx.fill(); ctx.shadowBlur=0
  })
  GEO.forEach(poly=>{
    if(poly.length<3)return; ctx.beginPath()
    poly.forEach(([lat,lng],i)=>{const p=toPixel(lat,lng,W,H);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)})
    ctx.closePath(); ctx.fillStyle='rgba(8,20,50,0.88)'; ctx.fill()
  })
  GEO.forEach(poly=>{
    if(poly.length<3)return; ctx.beginPath()
    poly.forEach(([lat,lng],i)=>{const p=toPixel(lat,lng,W,H);i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y)})
    ctx.closePath(); ctx.strokeStyle='rgba(56,189,248,0.82)'; ctx.lineWidth=2.8; ctx.lineJoin='round'; ctx.stroke()
  })
  const vign=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.6)
  vign.addColorStop(0,'transparent'); vign.addColorStop(1,'rgba(1,6,9,0.7)')
  ctx.fillStyle=vign; ctx.fillRect(0,0,W,H)
  return c
}

/* ═══════════════════════════════════════════════════════════════════════════
   D3 WIREFRAME DOTTED GLOBE
   - Real GeoJSON land from Natural Earth (fetched at runtime)
   - Halftone dot grid inside land polygons
   - Slow auto-rotation (0.10°/frame)
   - Hover a competition card → globe flies to that location & freezes
   - Mouse leaves card → auto-rotation resumes
   - Competition markers with pulse animation + highlight on hover
═══════════════════════════════════════════════════════════════════════════ */
function Globe3DD3({ visible, hoveredId, onHover }: {
  visible:   boolean
  hoveredId: number | null
  onHover:   (comp: Comp | null, x: number, y: number) => void
}) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  // Ref bridges: avoid re-running the main effect when these change
  const onHoverRef    = useRef(onHover)
  const hoveredIdRef  = useRef<number | null>(null)
  // Rotation state – shared between React effects and the d3.timer RAF loop
  const rotRef        = useRef<[number, number]>([0, -18])
  const targetRotRef  = useRef<[number, number] | null>(null)
  const isDragging    = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  // Keep ref mirrors fresh
  useEffect(() => { onHoverRef.current = onHover },    [onHover])
  useEffect(() => { hoveredIdRef.current = hoveredId }, [hoveredId])

  // When a competition is hovered from the list or the globe,
  // set the fly-to target so the globe rotates to center it
  useEffect(() => {
    if (hoveredId !== null) {
      const comp = COMPS.find(c => c.id === hoveredId)
      if (comp) {
        targetRotRef.current = [
          -comp.lng,
          Math.max(-70, Math.min(70, -comp.lat)),
        ]
      }
    } else {
      // Clear target → auto-rotation resumes
      targetRotRef.current = null
    }
  }, [hoveredId])

  useEffect(() => {
    const container = containerRef.current
    const canvas    = canvasRef.current
    if (!container || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W  = container.clientWidth
    const H  = container.clientHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width  = W * dpr
    canvas.height = H * dpr
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    const cx = W / 2, cy = H / 2
    const r  = Math.min(W, H) * 0.43

    const projection = d3.geoOrthographic()
      .scale(r)
      .translate([cx, cy])
      .clipAngle(90)
      .rotate(rotRef.current)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geoPath = d3.geoPath().projection(projection).context(ctx as any)

    const dots: [number, number][] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any = null

    /* ── canvas render ──────────────────────────────────────────────── */
    const render = (elapsed: number) => {
      ctx.clearRect(0, 0, W, H)

      // Outer atmosphere
      const atm = ctx.createRadialGradient(cx, cy, r*.82, cx, cy, r*1.22)
      atm.addColorStop(0,   'transparent')
      atm.addColorStop(.55, 'rgba(14,165,233,0.07)')
      atm.addColorStop(1,   'rgba(14,165,233,0.01)')
      ctx.beginPath(); ctx.arc(cx, cy, r*1.22, 0, 2*Math.PI)
      ctx.fillStyle = atm; ctx.fill()

      // Ocean
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI)
      const ocean = ctx.createRadialGradient(cx-r*.28, cy-r*.28, 0, cx, cy, r)
      ocean.addColorStop(0,   '#031830')
      ocean.addColorStop(.65, '#020D1C')
      ocean.addColorStop(1,   '#010608')
      ctx.fillStyle = ocean; ctx.fill()

      // Globe rim
      ctx.strokeStyle = 'rgba(56,189,248,0.30)'; ctx.lineWidth = 1.5; ctx.stroke()

      if (landFeatures) {
        // Graticule grid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grat = d3.geoGraticule()
        ctx.beginPath(); geoPath(grat() as any)
        ctx.strokeStyle = 'rgba(56,189,248,0.07)'; ctx.lineWidth = 0.7; ctx.stroke()

        // Land dot grid
        ctx.fillStyle = 'rgba(14,165,233,0.42)'
        for (const [lng, lat] of dots) {
          const pt = projection([lng, lat])
          if (!pt) continue
          const [px, py] = pt
          if ((px-cx)**2 + (py-cy)**2 > r*r*1.02) continue
          ctx.beginPath(); ctx.arc(px, py, 1.05, 0, 2*Math.PI); ctx.fill()
        }

        // Land outlines
        ctx.beginPath()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((f: any) => geoPath(f))
        ctx.strokeStyle = 'rgba(56,189,248,0.52)'; ctx.lineWidth = 0.75; ctx.stroke()

        // Competition markers
        COMPS.forEach((comp, i) => {
          const pt = projection([comp.lng, comp.lat])
          if (!pt) return
          const [px, py] = pt
          if ((px-cx)**2 + (py-cy)**2 > r*r*1.02) return

          const isHov  = hoveredIdRef.current === comp.id
          const color  = TC[comp.type]
          const pulse  = 1 + 0.28 * Math.sin(elapsed * 0.0018 + i * 0.85)

          ctx.save()
          if (isHov) {
            ctx.beginPath(); ctx.arc(px, py, 19, 0, 2*Math.PI); ctx.fillStyle = color+'0e'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py, 12, 0, 2*Math.PI); ctx.fillStyle = color+'20'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py,  7, 0, 2*Math.PI); ctx.fillStyle = color+'48'; ctx.fill()
            ctx.shadowColor = color; ctx.shadowBlur = 18
            ctx.beginPath(); ctx.arc(px, py, 3.8, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill()
            ctx.shadowBlur = 0
          } else {
            ctx.beginPath(); ctx.arc(px, py, 6*pulse, 0, 2*Math.PI); ctx.fillStyle = color+'14'; ctx.fill()
            ctx.beginPath(); ctx.arc(px, py, 4*pulse, 0, 2*Math.PI); ctx.fillStyle = color+'28'; ctx.fill()
            ctx.shadowColor = color; ctx.shadowBlur = 5
            ctx.beginPath(); ctx.arc(px, py, 2.4, 0, 2*Math.PI); ctx.fillStyle = color; ctx.fill()
            ctx.shadowBlur = 0
          }
          ctx.restore()
        })
      }
    }

    /* ── load GeoJSON from Natural Earth CDN ────────────────────────── */
    const loadData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
        )
        if (!res.ok) throw new Error('fetch failed')
        landFeatures = await res.json()

        // Point-in-polygon helpers
        const inRing = (p: [number,number], ring: number[][]): boolean => {
          const [x, y] = p; let inside = false
          for (let i=0,j=ring.length-1; i<ring.length; j=i++) {
            const [xi,yi]=ring[i],[xj,yj]=ring[j]
            if ((yi>y)!==(yj>y) && x<((xj-xi)*(y-yi)/(yj-yi))+xi) inside=!inside
          }
          return inside
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inFeature = (p: [number,number], f: any): boolean => {
          const g = f.geometry
          if (g.type==='Polygon') {
            if (!inRing(p,g.coordinates[0])) return false
            for (let i=1;i<g.coordinates.length;i++) if (inRing(p,g.coordinates[i])) return false
            return true
          }
          if (g.type==='MultiPolygon') {
            for (const poly of g.coordinates) {
              if (inRing(p,poly[0])) {
                let hole=false
                for (let i=1;i<poly.length;i++) if (inRing(p,poly[i])){hole=true;break}
                if (!hole) return true
              }
            }
          }
          return false
        }

        // Generate dot grid — 1.35° step (~27k dots for all land)
        const STEP = 1.35
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const feature of landFeatures.features) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [[minLng,minLat],[maxLng,maxLat]] = d3.geoBounds(feature as any)
          for (let lng=minLng; lng<=maxLng; lng+=STEP)
            for (let lat=minLat; lat<=maxLat; lat+=STEP)
              if (inFeature([lng,lat], feature)) dots.push([lng,lat])
        }

        setIsLoading(false)
      } catch {
        setLoadError(true)
        setIsLoading(false)
      }
    }

    loadData()

    /* ── animation loop ─────────────────────────────────────────────── */
    const AUTO_SPEED = 0.10   // degrees/frame — slow, elegant rotation
    const LERP_K     = 0.048  // fly-to smoothing factor

    const timer = d3.timer((elapsed: number) => {
      if (targetRotRef.current !== null && !isDragging.current) {
        // Fly to target: smooth lerp on shortest arc
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

    /* ── mouse drag interaction ─────────────────────────────────────── */
    let dragStart    = { x: 0, y: 0 }
    let dragStartRot = [0, 0]

    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onMouseDown = (e: MouseEvent) => {
      const { x, y } = getPos(e)
      if ((x-cx)**2 + (y-cy)**2 > r*r) return
      isDragging.current = true
      dragStart    = { x, y }
      dragStartRot = [...rotRef.current]
      canvas.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = getPos(e)

      if (isDragging.current) {
        rotRef.current = [
          dragStartRot[0] + (x - dragStart.x) * 0.4,
          Math.max(-80, Math.min(80, dragStartRot[1] - (y - dragStart.y) * 0.4)),
        ]
        return
      }

      const onGlobe = (x-cx)**2 + (y-cy)**2 <= r*r
      if (!onGlobe) {
        onHoverRef.current(null, 0, 0); canvas.style.cursor = 'default'; return
      }
      canvas.style.cursor = 'grab'

      // proximity check against competition marker positions
      let closest: Comp | null = null
      let closestD = 22
      for (const comp of COMPS) {
        const pt = projection([comp.lng, comp.lat])
        if (!pt) continue
        const dist = Math.hypot(pt[0]-x, pt[1]-y)
        if (dist < closestD) { closestD = dist; closest = comp }
      }

      if (closest) {
        onHoverRef.current(closest, e.clientX, e.clientY)
        canvas.style.cursor = 'pointer'
      } else {
        onHoverRef.current(null, 0, 0)
      }
    }

    const onMouseUp    = () => { isDragging.current = false; canvas.style.cursor = 'grab' }
    const onMouseLeave = () => { isDragging.current = false; onHoverRef.current(null, 0, 0) }

    canvas.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseup',    onMouseUp)
    canvas.addEventListener('mouseleave', onMouseLeave)

    return () => {
      timer.stop()
      canvas.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once; ref bridges handle all live state

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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'14px' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'50%', border:'2px solid rgba(14,165,233,0.15)', borderTop:'2px solid #0EA5E9', animation:'gsSpin 0.9s linear infinite' }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', color:'rgba(148,163,184,0.45)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Loading globe</span>
            </div>
          </motion.div>
        )}
        {loadError && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', color:'rgba(148,163,184,0.4)' }}>
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
   MAP 2D — flat map with reactive markers
═══════════════════════════════════════════════════════════════════════════ */
function Map2D({ mapCanvas, visible, hoveredId, onHover }: {
  mapCanvas: HTMLCanvasElement | null
  visible:   boolean
  hoveredId: number | null
  onHover:   (comp: Comp | null, x: number, y: number) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(e => { const { width, height } = e[0].contentRect; setDims({ w: width, h: height }) })
    ro.observe(containerRef.current); return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !mapCanvas || dims.w === 0) return
    const ctx = canvasRef.current.getContext('2d')!
    canvasRef.current.width = dims.w; canvasRef.current.height = dims.h
    ctx.drawImage(mapCanvas, 0, 0, dims.w, dims.h)
  }, [mapCanvas, dims])

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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {dims.w > 0 && COMPS.map(comp => {
        const { x, y } = toPixel(comp.lat, comp.lng, dims.w, dims.h)
        const color    = TC[comp.type]
        const isA      = hoveredId === comp.id
        return (
          <div key={comp.id} className="absolute" style={{ left:x, top:y, transform:'translate(-50%,-50%)', zIndex:10, cursor:'pointer' }}
            onMouseEnter={e => onHover(comp, e.clientX, e.clientY)}
            onMouseLeave={() => onHover(null, 0, 0)}
          >
            <div className="absolute rounded-full" style={{ width:isA?'46px':'22px', height:isA?'46px':'22px', top:isA?'-23px':'-11px', left:isA?'-23px':'-11px', background:`${color}${isA?'16':'0e'}`, border:`1.5px solid ${color}${isA?'70':'40'}`, boxShadow:isA?`0 0 22px ${color}45`:'none', animation:'gsMapPulse 2.2s ease-in-out infinite', animationDelay:`${comp.id*0.18}s`, transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} />
            <div className="absolute rounded-full" style={{ width:isA?'22px':'12px', height:isA?'22px':'12px', top:isA?'-11px':'-6px', left:isA?'-11px':'-6px', background:`${color}${isA?'28':'18'}`, border:`1.5px solid ${color}${isA?'85':'55'}`, transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} />
            <div className="relative rounded-full" style={{ width:isA?'10px':'7px', height:isA?'10px':'7px', background:color, boxShadow:`0 0 ${isA?'18px':'6px'} ${color}`, transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} />
            <AnimatePresence>
              {isA && (
                <motion.div initial={{opacity:0,y:6,scale:.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:4,scale:.9}} transition={{duration:.2}}
                  className="absolute whitespace-nowrap px-2 py-1.5 rounded-sm pointer-events-none"
                  style={{ bottom:'calc(100% + 10px)', left:'50%', transform:'translateX(-50%)', background:'rgba(4,6,14,0.96)', border:`1px solid ${color}55`, backdropFilter:'blur(12px)', boxShadow:`0 4px 16px rgba(0,0,0,0.7), 0 0 14px ${color}15` }}
                >
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.82rem', color:'rgba(241,245,249,0.95)', letterSpacing:'0.04em' }}>{comp.flag} {comp.name}</p>
                  <p style={{ fontSize:'0.62rem', color:'rgba(148,163,184,0.55)', marginTop:'1px', fontFamily:"'DM Sans',sans-serif" }}>{comp.location} · {comp.date}</p>
                  <div style={{ position:'absolute', bottom:'-5px', left:'50%', transform:'translateX(-50%) rotate(45deg)', width:'8px', height:'8px', background:'rgba(4,6,14,0.96)', borderRight:`1px solid ${color}55`, borderBottom:`1px solid ${color}55` }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at center, transparent 50%, rgba(2,5,16,0.92) 100%)' }} />
      <style>{`@keyframes gsMapPulse{0%,100%{transform:scale(1);opacity:.65}50%{transform:scale(1.65);opacity:.12}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW TOGGLE
═══════════════════════════════════════════════════════════════════════════ */
function ViewToggle({ mode, onToggle }: { mode:'2d'|'3d'; onToggle:()=>void }) {
  return (
    <div className="absolute top-3 right-3 z-30 flex items-center p-0.5 rounded-full"
      style={{ background:'rgba(6,8,15,0.88)', border:'1px solid rgba(14,165,233,0.22)', backdropFilter:'blur(16px)', boxShadow:'0 4px 24px rgba(0,0,0,0.5)' }}>
      {(['2d','3d'] as const).map(m => {
        const active = mode === m
        return (
          <button key={m} onClick={() => { if (!active) onToggle() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{ background:active?'rgba(14,165,233,0.22)':'transparent', border:`1px solid ${active?'rgba(14,165,233,0.52)':'transparent'}`, boxShadow:active?'0 0 12px rgba(14,165,233,0.22)':'none', cursor:active?'default':'pointer' }}
          >
            {m==='2d' ? <Map size={13} style={{color:active?'#38bdf8':'rgba(148,163,184,0.4)'}} /> : <Globe size={13} style={{color:active?'#38bdf8':'rgba(148,163,184,0.4)'}} />}
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:active?'rgba(241,245,249,0.95)':'rgba(148,163,184,0.4)', transition:'color 0.2s' }}>
              {m==='2d'?'Flat':'3D'}
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
  comp: Comp; isActive: boolean; onEnter: ()=>void; onLeave: ()=>void
}) {
  const color = TC[comp.type]
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} style={{
      display:'flex', alignItems:'stretch', borderRadius:'6px', overflow:'hidden',
      background:  isActive ? `${color}0e` : 'rgba(255,255,255,0.02)',
      border:      `1px solid ${isActive ? color+'48' : 'rgba(255,255,255,0.05)'}`,
      boxShadow:   isActive ? `0 0 30px ${color}14, inset 0 0 18px ${color}05` : 'none',
      transform:   isActive ? 'translateX(-5px)' : 'none',
      transition:  'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      cursor: 'default', flexShrink: 0,
    }}>
      {/* Left color bar */}
      <div style={{ width:'3px', background:isActive?`linear-gradient(to bottom,${color},${color}55)`:`${color}28`, flexShrink:0, transition:'background 0.25s' }} />
      {/* Month */}
      <div style={{ padding:'9px 11px', borderRight:'1px solid rgba(255,255,255,0.04)', minWidth:'52px', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.05rem', color:isActive?color:'rgba(148,163,184,0.42)', letterSpacing:'0.06em', lineHeight:1.1, transition:'color 0.25s' }}>{comp.month}</div>
        <div style={{ fontSize:'0.52rem', color:'rgba(148,163,184,0.22)', marginTop:'2px', letterSpacing:'0.1em', fontFamily:"'DM Sans',sans-serif" }}>2026</div>
      </div>
      {/* Info */}
      <div style={{ flex:1, padding:'9px 11px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', marginBottom:'4px' }}>
          <span style={{ fontSize:'0.82rem', lineHeight:1 }}>{comp.flag}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.84rem', color:isActive?'rgba(241,245,249,1)':'rgba(241,245,249,0.7)', letterSpacing:'0.04em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color 0.25s' }}>{comp.name}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'6px' }}>
          <span style={{ color:'rgba(148,163,184,0.38)', fontSize:'0.6rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'DM Sans',sans-serif" }}>{comp.location}</span>
          <span style={{ color:isActive?color:'rgba(148,163,184,0.32)', fontSize:'0.58rem', flexShrink:0, fontFamily:"'DM Sans',sans-serif", fontWeight:500, transition:'color 0.25s' }}>{comp.date}</span>
        </div>
      </div>
      {/* Status dot */}
      <div style={{ padding:'9px 10px', display:'flex', alignItems:'center' }}>
        <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:color, boxShadow:isActive?`0 0 10px ${color}, 0 0 22px ${color}50`:'none', transition:'box-shadow 0.25s', flexShrink:0 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════════════════════ */
export function GlobeSection() {
  const { ref: sectionRef, inView } = useInView(0.1)
  const [mode,      setMode]      = useState<'2d'|'3d'>('3d')
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement|null>(null)

  // Single shared hover state — drives both map markers and competition cards
  const [hoveredId, setHoveredId] = useState<number|null>(null)
  const [tipPos,    setTipPos]    = useState({ x:0, y:0 })
  const [showTip,   setShowTip]   = useState(false)

  useEffect(() => { setMapCanvas(buildMapCanvas()) }, [])

  // Called from globe / 2D map markers — shows floating tooltip
  const handleMapHover = useCallback((comp: Comp|null, x: number, y: number) => {
    setHoveredId(comp?.id ?? null)
    setShowTip(comp !== null)
    if (comp) setTipPos({ x, y })
  }, [])

  // Called from competition list cards — no tooltip (user can already see the card)
  const handleListEnter = useCallback((id: number) => { setHoveredId(id); setShowTip(false) }, [])
  const handleListLeave = useCallback(() => { setHoveredId(null); setShowTip(false) }, [])

  const hoveredComp = COMPS.find(c => c.id === hoveredId)

  return (
    <section id="season" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden" style={{ background:'#08090E' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(14,165,233,0.03) 0%, transparent 70%)' }} />

      <div className="container relative z-10">

        {/* Header */}
        <div className="mb-14 transition-all duration-700" style={{ opacity:inView?1:0, transform:inView?'translateY(0)':'translateY(20px)' }}>
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* ── Globe / Map ───────────────────────────────────────────── */}
          <div className="relative rounded-sm overflow-hidden" style={{ height:520, border:'1px solid rgba(14,165,233,0.12)', background:'#020510', boxShadow:'0 0 80px rgba(14,165,233,0.05), inset 0 0 80px rgba(14,165,233,0.03)' }}>
            <Map2D    mapCanvas={mapCanvas} visible={mode==='2d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <Globe3DD3                      visible={mode==='3d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <ViewToggle mode={mode} onToggle={() => setMode(m => m==='2d'?'3d':'2d')} />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none" style={{ color:'rgba(148,163,184,0.22)', fontSize:'10px', fontFamily:"'DM Sans',sans-serif", textTransform:'uppercase', letterSpacing:'0.15em', whiteSpace:'nowrap' }}>
              {mode==='3d' ? 'drag to rotate · hover markers' : 'hover markers for details'}
            </div>
          </div>

          {/* ── Competition schedule ────────────────────────────────── */}
          <div className="flex flex-col">
            <motion.div initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.4,delay:.1}}
              className="flex items-center justify-between mb-4">
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(148,163,184,0.32)', letterSpacing:'0.2em', textTransform:'uppercase' }}>
                10 events · 9 countries
              </p>
              <div className="flex items-center gap-2.5">
                {(Object.entries(TC) as [CompType,string][]).map(([type,color]) => (
                  <div key={type} style={{ width:'6px', height:'6px', borderRadius:'50%', background:color }} />
                ))}
              </div>
            </motion.div>

            <div className="flex flex-col gap-1.5">
              {COMPS.map((comp, i) => (
                <motion.div key={comp.id} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.4,delay:.1+i*.05}}>
                  <CompCard comp={comp} isActive={hoveredId===comp.id} onEnter={() => handleListEnter(comp.id)} onLeave={handleListLeave} />
                </motion.div>
              ))}
            </div>

            <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:.4,delay:.75}}
              className="mt-5 pt-4 flex flex-wrap gap-x-4 gap-y-1.5" style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
              {(Object.entries(TL) as [CompType,string][]).map(([type,label]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:TC[type], flexShrink:0 }} />
                  <span style={{ color:'rgba(148,163,184,0.36)', fontSize:'0.62rem', fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.06em' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Floating tooltip — only from globe / 2D map marker hover ── */}
      <AnimatePresence>
        {showTip && hoveredComp && (
          <div className="fixed z-50 pointer-events-none" style={{ left:tipPos.x+16, top:tipPos.y, transform:'translateY(-50%)' }}>
            <motion.div
              initial={{ opacity:0, y:4, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:.97 }}
              transition={{ duration:.15 }}
              className="px-4 py-3 rounded-sm"
              style={{ background:'rgba(4,6,14,0.98)', border:`1px solid ${TC[hoveredComp.type]}48`, backdropFilter:'blur(20px)', minWidth:'188px', boxShadow:`0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${TC[hoveredComp.type]}12` }}
            >
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'rgba(241,245,249,0.95)', letterSpacing:'0.05em' }}>{hoveredComp.flag} {hoveredComp.name}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'rgba(148,163,184,0.6)', marginTop:'3px' }}>{hoveredComp.location}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', fontWeight:500, color:TC[hoveredComp.type], marginTop:'2px' }}>{hoveredComp.date}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.58rem', color:'rgba(148,163,184,0.28)', marginTop:'3px', textTransform:'uppercase', letterSpacing:'0.1em' }}>{TL[hoveredComp.type]}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
