'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background'

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
  { id:0, name:'IWSA World Cup N°1',                        location:'Hong Kong, China',        flag:'🇭🇰', date:'Feb 4–8',       month:'FEB', lat:22.30, lng:114.20, type:'world_cup'   },
  { id:1, name:'IWSA Formula Wing European Championship',   location:'Naples, Italy',           flag:'🇮🇹', date:'Apr 8–12',      month:'APR', lat:40.85, lng:14.27,  type:'european'    },
  { id:2, name:'Défi Wing',                                 location:'Gruissan, France',        flag:'🇫🇷', date:'May 11–13',     month:'MAY', lat:43.11, lng:3.09,   type:'national'    },
  { id:3, name:'IWSA World Cup N°2',                        location:'Urla, Türkiye',           flag:'🇹🇷', date:'May 19–23',     month:'MAY', lat:38.32, lng:26.76,   type:'world_cup'   },
  { id:4, name:'IWSA World Cup N°3',                        location:'Silvaplana, Switzerland', flag:'🇨🇭', date:'Jun 16–20',     month:'JUN', lat:46.47, lng:9.80,   type:'world_cup'   },
  { id:5, name:'IWSA World Cup N°4',                        location:'Gizzeria, Italy',         flag:'🇮🇹', date:'Jul 8–12',      month:'JUL', lat:38.97, lng:16.18,  type:'world_cup'   },
  { id:11, name:'2027 World Sailing Test Event',             location:'Gdynia, Poland',          flag:'🇵🇱', date:'Jul 15–18',     month:'JUL', lat:54.35, lng:18.53,  type:'world_champ' },
  { id:6, name:'IWSA Formula Wing World Championship',      location:'Istanbul, Türkiye',       flag:'🇹🇷', date:'Aug 11–15',     month:'AUG', lat:41.01, lng:28.98,  type:'world_champ' },
  { id:7, name:'IWSA World Cup N°5',                        location:'Cagliari, Sardinia',      flag:'🇮🇹', date:'Sep 30–Oct 4',  month:'OCT', lat:39.22, lng:9.12,   type:'world_cup'   },
  { id:8, name:'French Championship',                       location:'Granville, France',       flag:'🇫🇷', date:'Oct 23–25',     month:'OCT', lat:48.84, lng:-1.60,  type:'national'    },
  { id:9, name:'IWSA World Cup N°6',                        location:'Daishan, China',         flag:'🇨🇳', date:'Nov 14–18',     month:'NOV', lat:30.21, lng:122.20,   type:'world_cup'   },
  { id:10, name:'IWSA World Cup N°7',                        location:'Jericoacoara, Brazil',   flag:'🇧🇷', date:'Dec 1–5',       month:'DEC', lat:-2.80, lng:-40.50, type:'world_cup'   },
]
const TC: Record<CompType, string> = {
  world_champ:'#F59E0B', world_cup:'#EC4899', european:'#0EA5E9', national:'#A78BFA',
}
const TL: Record<CompType, string> = {
  world_champ: 'IWSA Formula Wing World Championship',
  world_cup:   'IWSA World Cup',
  european:    'IWSA Formula Wing European Champ.',
  national:    'National',
}

/* ═══════════════════════════════════════════════════════════════════════════
   GEO CACHE
═══════════════════════════════════════════════════════════════════════════ */
interface GeoBundle { features: d3.ExtendedFeatureCollection; dots: [number,number][] }
let _bundle: GeoBundle | null = null
let _bundlePromise: Promise<GeoBundle> | null = null

function _inRing(p:[number,number], ring:number[][]): boolean {
  const [x,y]=p; let inside=false
  for (let i=0,j=ring.length-1; i<ring.length; j=i++) {
    const [xi,yi]=ring[i],[xj,yj]=ring[j]
    if ((yi>y)!==(yj>y) && x<((xj-xi)*(y-yi)/(yj-yi))+xi) inside=!inside
  }
  return inside
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _inFeature(p:[number,number], f:any): boolean {
  const g=f.geometry
  if (g.type==='Polygon') {
    if (!_inRing(p,g.coordinates[0])) return false
    for (let i=1;i<g.coordinates.length;i++) if (_inRing(p,g.coordinates[i])) return false
    return true
  }
  if (g.type==='MultiPolygon') {
    for (const poly of g.coordinates) {
      if (_inRing(p,poly[0])) {
        let hole=false
        for (let i=1;i<poly.length;i++) if (_inRing(p,poly[i])){hole=true;break}
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
  ).then(r=>{if(!r.ok)throw new Error('fetch');return r.json()})
  .then(features=>{
    const dots:[number,number][]=[]
    const STEP=1.35
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const feature of (features as any).features) {
      const [[minLng,minLat],[maxLng,maxLat]]=d3.geoBounds(feature)
      for (let lng=minLng;lng<=maxLng;lng+=STEP)
        for (let lat=minLat;lat<=maxLat;lat+=STEP)
          if (_inFeature([lng,lat],feature)) dots.push([lng,lat])
    }
    _bundle={features,dots}; return _bundle
  })
  return _bundlePromise
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED CANVAS HELPERS
═══════════════════════════════════════════════════════════════════════════ */
function drawRoundRect(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  ctx.beginPath()
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y)
  ctx.quadraticCurveTo(x+w,y,x+w,y+r)
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h)
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r)
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y)
  ctx.closePath()
}

function drawInfoPanel(
  ctx: CanvasRenderingContext2D,
  comp: Comp,
  markerX: number, markerY: number,
  canvasW: number, canvasH: number,
  visible: boolean
) {
  const color  = TC[comp.type]
  const mobile = canvasW < 500

  if (mobile) {
    if (!visible || markerX < 0) return
    const PW = 124, PH = 50, PAD = 9, R = 5
    const DX = 16, DY = 16, HLEN = 16
    const kneeX = markerX + DX
    const kneeY = markerY - DY
    const endX  = kneeX + HLEN
    let rx = endX
    let ry = kneeY - PH / 2
    rx = Math.max(8, Math.min(canvasW - PW - 8, rx))
    ry = Math.max(8, Math.min(canvasH - PH - 8, ry))
    const textW = PW - PAD - 12

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(markerX, markerY)
    ctx.lineTo(kneeX, kneeY)
    ctx.lineTo(endX, kneeY)
    ctx.strokeStyle = color + '75'; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.beginPath(); ctx.arc(markerX, markerY, 2.5, 0, 2 * Math.PI)
    ctx.fillStyle = color + '90'; ctx.fill()

    ctx.shadowColor = color; ctx.shadowBlur = 14
    drawRoundRect(ctx, rx, ry, PW, PH, R)
    ctx.fillStyle = 'rgba(4,6,14,0.0)'; ctx.fill()
    ctx.shadowBlur = 0

    drawRoundRect(ctx, rx, ry, PW, PH, R)
    ctx.fillStyle = 'rgba(4,6,14,0.95)'; ctx.fill()
    ctx.strokeStyle = color + '60'; ctx.lineWidth = 1.2
    drawRoundRect(ctx, rx, ry, PW, PH, R); ctx.stroke()

    drawRoundRect(ctx, rx, ry + 8, 3, PH - 16, 2)
    ctx.fillStyle = color; ctx.fill()

    ctx.save()
    drawRoundRect(ctx, rx + 4, ry, PW - 4, PH, 0); ctx.clip()

    ctx.fillStyle = 'rgba(241,245,249,0.95)'
    ctx.font = `bold 11px "Barlow Condensed", "Arial Narrow", sans-serif`
    ctx.letterSpacing = '0.03em'
    let nameText = `${comp.flag} ${comp.name}`
    while (ctx.measureText(nameText).width > textW && nameText.length > 4)
      nameText = nameText.slice(0, -2) + '…'
    ctx.fillText(nameText, rx + PAD, ry + 16)

    ctx.fillStyle = 'rgba(148,163,184,0.62)'
    ctx.font = `9.5px "DM Sans", system-ui, sans-serif`
    ctx.letterSpacing = '0'
    let locText = comp.location
    while (ctx.measureText(locText).width > textW && locText.length > 4)
      locText = locText.slice(0, -2) + '…'
    ctx.fillText(locText, rx + PAD, ry + 29)

    ctx.fillStyle = color
    ctx.font = `500 9.5px "DM Sans", system-ui, sans-serif`
    ctx.fillText(comp.date, rx + PAD, ry + 42)

    ctx.restore()
    ctx.restore()

  } else {
    // Desktop: auto-width panel sized to longest text line
    const PAD = 14, R = 6, CONN = 10, PH = 88

    // Measure all text lines to compute the required width
    ctx.font = `bold 12.5px "Barlow Condensed", "Arial Narrow", sans-serif`
    ctx.letterSpacing = '0.03em'
    const nameRaw = `${comp.flag} ${comp.name}`
    const w1 = ctx.measureText(nameRaw).width

    ctx.font = `11px "DM Sans", system-ui, sans-serif`
    ctx.letterSpacing = '0'
    const w2 = ctx.measureText(comp.location).width

    ctx.font = `500 11px "DM Sans", system-ui, sans-serif`
    const w3 = ctx.measureText(comp.date).width

    ctx.font = `9.5px "DM Sans", system-ui, sans-serif`
    const w4 = ctx.measureText(TL[comp.type].toUpperCase()).width

    const PW = Math.max(110, Math.min(260, Math.ceil(Math.max(w1, w2, w3, w4)) + PAD + 18))
    const textW = PW - PAD - 12

    let rx = markerX + CONN + 6
    let ry = markerY - PH / 2
    if (!visible || rx + PW > canvasW - 8) rx = markerX - CONN - PW - 6
    if (rx < 8) rx = 8
    ry = Math.max(8, Math.min(canvasH - PH - 8, ry))

    ctx.save()

    ctx.shadowColor = color; ctx.shadowBlur = 18
    drawRoundRect(ctx, rx, ry, PW, PH, R)
    ctx.fillStyle = 'rgba(4,6,14,0.0)'; ctx.fill()
    ctx.shadowBlur = 0

    drawRoundRect(ctx, rx, ry, PW, PH, R)
    ctx.fillStyle = 'rgba(4,6,14,0.95)'; ctx.fill()

    ctx.strokeStyle = color + '60'; ctx.lineWidth = 1.2
    drawRoundRect(ctx, rx, ry, PW, PH, R); ctx.stroke()

    drawRoundRect(ctx, rx, ry + 10, 3, PH - 20, 2)
    ctx.fillStyle = color; ctx.fill()

    if (visible && markerX >= 0) {
      const lineX1 = markerX + (rx > markerX ? 4 : -4)
      const lineX2 = rx > markerX ? rx : rx + PW
      ctx.beginPath(); ctx.moveTo(lineX1, markerY); ctx.lineTo(lineX2, markerY)
      ctx.strokeStyle = color + '45'; ctx.lineWidth = 1; ctx.stroke()
      ctx.beginPath(); ctx.arc(lineX1, markerY, 2, 0, 2*Math.PI)
      ctx.fillStyle = color + '80'; ctx.fill()
    }

    ctx.save()
    drawRoundRect(ctx, rx + 5, ry, PW - 5, PH, 0); ctx.clip()

    ctx.fillStyle = 'rgba(241,245,249,0.95)'
    ctx.font = `bold 12.5px "Barlow Condensed", "Arial Narrow", sans-serif`
    ctx.letterSpacing = '0.03em'
    let nameText = nameRaw
    while (ctx.measureText(nameText).width > textW && nameText.length > 4)
      nameText = nameText.slice(0, -2) + '…'
    ctx.fillText(nameText, rx + PAD, ry + 23)

    ctx.fillStyle = 'rgba(148,163,184,0.62)'
    ctx.font = `11px "DM Sans", system-ui, sans-serif`
    ctx.letterSpacing = '0'
    let locText = comp.location
    while (ctx.measureText(locText).width > textW && locText.length > 4)
      locText = locText.slice(0, -2) + '…'
    ctx.fillText(locText, rx + PAD, ry + 42)

    ctx.fillStyle = color
    ctx.font = `500 11px "DM Sans", system-ui, sans-serif`
    ctx.fillText(comp.date, rx + PAD, ry + 59)

    ctx.fillStyle = 'rgba(148,163,184,0.30)'
    ctx.font = `9.5px "DM Sans", system-ui, sans-serif`
    let typeText = TL[comp.type].toUpperCase()
    while (ctx.measureText(typeText).width > textW && typeText.length > 4)
      typeText = typeText.slice(0, -2) + '…'
    ctx.fillText(typeText, rx + PAD, ry + 75)

    ctx.restore()
    ctx.restore()
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBE 3D
═══════════════════════════════════════════════════════════════════════════ */
function Globe3DD3({ visible, hoveredId, onHover, onTap, zoomResetSignal=0 }: {
  visible:boolean; hoveredId:number|null
  onHover:(comp:Comp|null,x:number,y:number)=>void
  onTap?:(comp:Comp|null)=>void
  zoomResetSignal?:number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const onHoverRef   = useRef(onHover)
  const onTapRef     = useRef(onTap)
  const hoveredIdRef = useRef<number|null>(null)
  const rotRef       = useRef<[number,number]>([0,-18])
  const targetRotRef = useRef<[number,number]|null>(null)
  const scaleRef       = useRef(1)
  const targetScaleRef = useRef(1)
  const isDragging     = useRef(false)
  const lockedIdRef3D       = useRef<number|null>(null)
  const lockTimerRef3D      = useRef<ReturnType<typeof setTimeout>|null>(null)
  const releasePending3DRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError,  setLoadError]  = useState(false)

  useEffect(()=>{ onHoverRef.current=onHover },[onHover])
  useEffect(()=>{ onTapRef.current=onTap },[onTap])
  useEffect(()=>{ hoveredIdRef.current=hoveredId },[hoveredId])

  useEffect(()=>{
    if (hoveredId===null) {
      if (lockTimerRef3D.current) { clearTimeout(lockTimerRef3D.current); lockTimerRef3D.current=null }
      releasePending3DRef.current=false
      lockedIdRef3D.current=null
      // Keep zoom; finish rotating to marker for 1s then resume auto-rotation
      lockTimerRef3D.current=setTimeout(()=>{
        lockTimerRef3D.current=null
        targetRotRef.current=null
      }, 1000)
      return
    }
    if (lockedIdRef3D.current===hoveredId) return
    if (lockTimerRef3D.current) { clearTimeout(lockTimerRef3D.current); lockTimerRef3D.current=null }
    releasePending3DRef.current=false
    const comp=COMPS.find(c=>c.id===hoveredId)
    if (!comp) return
    lockedIdRef3D.current=hoveredId
    targetRotRef.current=[-comp.lng, Math.max(-70,Math.min(70,-comp.lat))]
    targetScaleRef.current=1.7
  },[hoveredId])

  useEffect(()=>()=>{ if (lockTimerRef3D.current) clearTimeout(lockTimerRef3D.current) },[])

  const fastReset3DRef=useRef(false)
  const isPausedRef3D=useRef(false)
  useEffect(()=>{ if (zoomResetSignal===0) return; targetScaleRef.current=1; targetRotRef.current=null; fastReset3DRef.current=true },[zoomResetSignal])

  useEffect(()=>{
    const container=containerRef.current, canvas=canvasRef.current
    if (!container||!canvas) return
    const ctx=canvas.getContext('2d')
    if (!ctx) return

    const W=container.clientWidth, H=container.clientHeight
    const dpr=window.devicePixelRatio||1
    canvas.width=W*dpr; canvas.height=H*dpr
    canvas.style.width=`${W}px`; canvas.style.height=`${H}px`
    ctx.scale(dpr,dpr)

    const cx=W/2, cy=H/2
    const BASE_R=Math.min(W,H)*0.43

    const projection=d3.geoOrthographic()
      .scale(BASE_R).translate([cx,cy]).clipAngle(90).rotate(rotRef.current)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geoPath=d3.geoPath().projection(projection).context(ctx as any)

    let bundle:GeoBundle|null=null

    function isGlobePointVisible(lng:number, lat:number): boolean {
      const [r0,r1]=rotRef.current
      const λ=lng*Math.PI/180, φ=lat*Math.PI/180
      const λ0=-r0*Math.PI/180, φ0=-r1*Math.PI/180
      const dot=Math.sin(φ)*Math.sin(φ0)+Math.cos(φ)*Math.cos(φ0)*Math.cos(λ-λ0)
      return dot>=0
    }

    const render=(elapsed:number)=>{
      ctx.clearRect(0,0,W,H)
      const r=BASE_R*scaleRef.current

      const atm=ctx.createRadialGradient(cx,cy,r*.82,cx,cy,r*1.22)
      atm.addColorStop(0,'transparent')
      atm.addColorStop(.55,'rgba(14,165,233,0.07)')
      atm.addColorStop(1,'rgba(14,165,233,0.01)')
      ctx.beginPath(); ctx.arc(cx,cy,r*1.22,0,2*Math.PI)
      ctx.fillStyle=atm; ctx.fill()

      projection.scale(r)
      ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI)
      const ocean=ctx.createRadialGradient(cx-r*.28,cy-r*.28,0,cx,cy,r)
      ocean.addColorStop(0,'#031830'); ocean.addColorStop(.65,'#020D1C'); ocean.addColorStop(1,'#010608')
      ctx.fillStyle=ocean; ctx.fill()
      ctx.strokeStyle='rgba(56,189,248,0.30)'; ctx.lineWidth=1.5; ctx.stroke()

      if (bundle) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ctx.beginPath(); geoPath(d3.geoGraticule()() as any)
        ctx.strokeStyle='rgba(56,189,248,0.07)'; ctx.lineWidth=0.7; ctx.stroke()

        ctx.fillStyle='rgba(14,165,233,0.44)'
        for (const [lng,lat] of bundle.dots) {
          const pt=projection([lng,lat])
          if (!pt) continue
          const [px,py]=pt
          if ((px-cx)**2+(py-cy)**2>r*r*1.01) continue
          ctx.beginPath(); ctx.arc(px,py,1.05,0,2*Math.PI); ctx.fill()
        }

        ctx.beginPath()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bundle.features.features.forEach(f=>geoPath(f as any))
        ctx.strokeStyle='rgba(56,189,248,0.52)'; ctx.lineWidth=0.75; ctx.stroke()

        const hov=lockedIdRef3D.current??hoveredIdRef.current
        COMPS.forEach((comp,i)=>{
          const pt=projection([comp.lng,comp.lat])
          if (!pt) return
          const [px,py]=pt
          if ((px-cx)**2+(py-cy)**2>r*r*1.01) return
          const isHov=hov===comp.id
          const color=TC[comp.type]
          const pulse=1+0.28*Math.sin(elapsed*0.0018+i*0.85)
          ctx.save()
          if (isHov) {
            ctx.beginPath(); ctx.arc(px,py,20,0,2*Math.PI); ctx.fillStyle=color+'0e'; ctx.fill()
            ctx.beginPath(); ctx.arc(px,py,12,0,2*Math.PI); ctx.fillStyle=color+'22'; ctx.fill()
            ctx.beginPath(); ctx.arc(px,py, 7,0,2*Math.PI); ctx.fillStyle=color+'48'; ctx.fill()
            ctx.shadowColor=color; ctx.shadowBlur=20
            ctx.beginPath(); ctx.arc(px,py,3.8,0,2*Math.PI); ctx.fillStyle='#fff'; ctx.fill()
            ctx.shadowBlur=0
          } else {
            ctx.beginPath(); ctx.arc(px,py,6*pulse,0,2*Math.PI); ctx.fillStyle=color+'14'; ctx.fill()
            ctx.beginPath(); ctx.arc(px,py,4*pulse,0,2*Math.PI); ctx.fillStyle=color+'28'; ctx.fill()
            ctx.shadowColor=color; ctx.shadowBlur=5
            ctx.beginPath(); ctx.arc(px,py,2.4,0,2*Math.PI); ctx.fillStyle=color; ctx.fill()
            ctx.shadowBlur=0
          }
          ctx.restore()
        })

        if (hov!==null) {
          const comp=COMPS.find(c=>c.id===hov)
          if (comp) {
            const pt=projection([comp.lng,comp.lat])
            const vis=isGlobePointVisible(comp.lng,comp.lat)
            const mx = vis && pt ? pt[0] : cx
            const my = vis && pt ? pt[1] : cy
            drawInfoPanel(ctx,comp,mx,my,W,H,vis)
          }
        }
      }
    }

    loadGeoBundle().then(b=>{ bundle=b; setIsLoading(false) }).catch(()=>{ setLoadError(true); setIsLoading(false) })

    const visObs3D=new IntersectionObserver(([e])=>{ isPausedRef3D.current=!e.isIntersecting },{threshold:0.01})
    if (container) visObs3D.observe(container)

    const isTouchDevice=('ontouchstart' in window)||navigator.maxTouchPoints>0
    const AUTO_SPEED=isTouchDevice?0.13:0.18, LERP_K=0.048
    const timer=d3.timer((elapsed:number)=>{
      if (isPausedRef3D.current) return
      const lerpScale=fastReset3DRef.current?0.16:0.028
      const ds=targetScaleRef.current-scaleRef.current
      if (Math.abs(ds)>0.001) scaleRef.current+=ds*lerpScale
      else fastReset3DRef.current=false
      if (targetRotRef.current!==null && !isDragging.current && !tDragging3D) {
        const [tLng,tLat]=targetRotRef.current
        let [cLng,cLat]=rotRef.current
        let dLng=tLng-cLng
        while(dLng>180)dLng-=360; while(dLng<-180)dLng+=360
        rotRef.current=[cLng+dLng*LERP_K, cLat+(tLat-cLat)*LERP_K]
      } else if (!isDragging.current && !tDragging3D) {
        rotRef.current=[rotRef.current[0]+AUTO_SPEED, rotRef.current[1]]
      }
      projection.rotate(rotRef.current)
      render(elapsed)
    })

    let dragStart={x:0,y:0}, dragStartRot=[0,0], lastTouchTime=0
    const getPos=(e:MouseEvent)=>{ const rect=canvas.getBoundingClientRect(); return {x:e.clientX-rect.left,y:e.clientY-rect.top} }

    const onMouseDown=(e:MouseEvent)=>{
      if (Date.now()-lastTouchTime<500) return
      const {x,y}=getPos(e)
      const r=BASE_R*scaleRef.current
      if ((x-cx)**2+(y-cy)**2>r*r) return
      isDragging.current=true; dragStart={x,y}; dragStartRot=[...rotRef.current]
      canvas.style.cursor='grabbing'
    }
    const onMouseMove=(e:MouseEvent)=>{
      const {x,y}=getPos(e)
      const r=BASE_R*scaleRef.current
      if (isDragging.current) {
        rotRef.current=[
          dragStartRot[0]+(x-dragStart.x)*0.4,
          Math.max(-80,Math.min(80,dragStartRot[1]-(y-dragStart.y)*0.4)),
        ]; return
      }
      const onGlobe=(x-cx)**2+(y-cy)**2<=r*r
      canvas.style.cursor=onGlobe?'grab':'default'
      let closest:Comp|null=null, closestD=22
      for (const comp of COMPS) {
        if (!isGlobePointVisible(comp.lng,comp.lat)) continue
        const pt=projection([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-x,pt[1]-y)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      if (closest) { onHoverRef.current(closest,e.clientX,e.clientY); canvas.style.cursor='pointer' }
      else if (onGlobe) onHoverRef.current(null,0,0)
    }

    const onMouseUp=()=>{ isDragging.current=false; canvas.style.cursor='grab' }
    const onMouseLeave=()=>{ isDragging.current=false; onHoverRef.current(null,0,0) }
    const onWheel=(e:WheelEvent)=>{
      if (!e.ctrlKey) return
      e.preventDefault()
      const factor=e.deltaY>0?0.88:1.14
      const newScale=Math.max(0.6,Math.min(4,targetScaleRef.current*factor))
      scaleRef.current=newScale; targetScaleRef.current=newScale
    }
    const onCanvasMouseUp=(e:MouseEvent)=>{
      if (Date.now()-lastTouchTime<500) return
      const {x,y}=getPos(e)
      if (Math.hypot(x-dragStart.x,y-dragStart.y)>8) return
      let closest:Comp|null=null, closestD=28
      for (const comp of COMPS) {
        if (!isGlobePointVisible(comp.lng,comp.lat)) continue
        const pt=projection([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-x,pt[1]-y)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      onTapRef.current?.(closest)
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave',onMouseLeave)
    canvas.addEventListener('mouseup',   onCanvasMouseUp)
    canvas.addEventListener('wheel',     onWheel,{passive:false})
    window.addEventListener('mouseup',   onMouseUp)

    let t1Start3D={x:0,y:0}, t1DragRot=[0,0], tDragging3D=false, hadMultiTouch3D=false
    let pinchDist3D=0, pinchScale3D=1

    const onTouchStart3D=(e:TouchEvent)=>{
      if (e.touches.length===1) {
        hadMultiTouch3D=false
        const t=e.touches[0]
        t1Start3D={x:t.clientX,y:t.clientY}
        t1DragRot=[...rotRef.current]
        tDragging3D=false
      } else if (e.touches.length===2) {
        hadMultiTouch3D=true
        tDragging3D=true
        targetRotRef.current=null
        pinchDist3D=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)
        pinchScale3D=scaleRef.current
      }
    }
    const onTouchMove3D=(e:TouchEvent)=>{
      if (e.touches.length===1) {
        const dx=e.touches[0].clientX-t1Start3D.x, dy=e.touches[0].clientY-t1Start3D.y
        if (!tDragging3D && Math.hypot(dx,dy)>5) tDragging3D=true
        if (tDragging3D) {
          e.preventDefault()
          rotRef.current=[t1DragRot[0]+dx*0.4, Math.max(-80,Math.min(80,t1DragRot[1]-dy*0.4))]
          targetRotRef.current=null
        }
      } else if (e.touches.length===2) {
        e.preventDefault()
        const nd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)
        scaleRef.current=Math.max(0.6,Math.min(4,pinchScale3D*nd/pinchDist3D))
        targetScaleRef.current=scaleRef.current
      }
    }
    const onTouchEnd3D=(e:TouchEvent)=>{
      lastTouchTime=Date.now()
      if (tDragging3D) {
        if (e.touches.length===0) tDragging3D=false
        else if (e.touches.length===1) {
          const t=e.touches[0]
          t1Start3D={x:t.clientX,y:t.clientY}
          t1DragRot=[...rotRef.current]
          tDragging3D=false
        }
        return
      }
      if (hadMultiTouch3D) { hadMultiTouch3D=false; return }
      const t=e.changedTouches[0]
      if (Math.hypot(t.clientX-t1Start3D.x,t.clientY-t1Start3D.y)>14) return
      const rect=canvas.getBoundingClientRect()
      const x=t.clientX-rect.left, y=t.clientY-rect.top
      let closest:Comp|null=null, closestD=48
      for (const comp of COMPS) {
        if (!isGlobePointVisible(comp.lng,comp.lat)) continue  // face avant uniquement
        const pt=projection([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-x,pt[1]-y)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      if (closest) onHoverRef.current(closest,t.clientX,t.clientY)
      onTapRef.current?.(closest)
    }
    canvas.addEventListener('touchstart',onTouchStart3D,{passive:true})
    canvas.addEventListener('touchmove', onTouchMove3D, {passive:false})
    canvas.addEventListener('touchend',  onTouchEnd3D,  {passive:true})

    return ()=>{
      timer.stop()
      visObs3D.disconnect()
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave',onMouseLeave)
      canvas.removeEventListener('mouseup',   onCanvasMouseUp)
      canvas.removeEventListener('wheel',     onWheel)
      window.removeEventListener('mouseup',   onMouseUp)
      canvas.removeEventListener('touchstart',onTouchStart3D)
      canvas.removeEventListener('touchmove', onTouchMove3D)
      canvas.removeEventListener('touchend',  onTouchEnd3D)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div ref={containerRef} className="absolute inset-0" style={{
      opacity:visible?1:0, transform:visible?'scale(1)':'scale(1.04)',
      filter:visible?'blur(0px)':'blur(14px)',
      transition:'opacity 0.55s ease,transform 0.55s ease,filter 0.55s ease',
      pointerEvents:visible?'auto':'none',
    }}>
      <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block'}}/>
      <AnimatePresence>
        {isLoading&&!loadError&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex items-center justify-center">
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'14px'}}>
              <div style={{width:'32px',height:'32px',borderRadius:'50%',border:'2px solid rgba(14,165,233,0.15)',borderTop:'2px solid #0EA5E9',animation:'gsSpin 0.9s linear infinite'}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.65rem',color:'rgba(148,163,184,0.4)',letterSpacing:'0.15em',textTransform:'uppercase'}}>Loading globe</span>
            </div>
          </motion.div>
        )}
        {loadError&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex items-center justify-center">
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.72rem',color:'rgba(148,163,184,0.4)'}}>Unable to load globe data</p>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes gsSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAP 2D FLAT
═══════════════════════════════════════════════════════════════════════════ */
interface ViewTransform { k:number; tx:number; ty:number }

function Map2DFlat({ visible, hoveredId, onHover, onTap, zoomResetSignal=0 }: {
  visible:boolean; hoveredId:number|null
  onHover:(comp:Comp|null,x:number,y:number)=>void
  onTap?:(comp:Comp|null)=>void
  zoomResetSignal?:number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const onHoverRef   = useRef(onHover)
  const onTapRef2D   = useRef(onTap)
  const hoveredIdRef = useRef<number|null>(null)
  const viewRef           = useRef<ViewTransform>({k:1,tx:0,ty:0})
  const targetViewRef     = useRef<ViewTransform|null>(null)
  const lockedIdRef       = useRef<number|null>(null)
  const lockTimerRef      = useRef<ReturnType<typeof setTimeout>|null>(null)
  const releasePendingRef = useRef(false)
  const [bundle, setBundle] = useState<GeoBundle|null>(null)
  const [dims, setDims]     = useState({w:0,h:0})
  const dimsRef    = useRef({w:0,h:0})

  useEffect(()=>{ onHoverRef.current=onHover },[onHover])
  useEffect(()=>{ onTapRef2D.current=onTap },[onTap])
  useEffect(()=>{ hoveredIdRef.current=hoveredId },[hoveredId])

  const fastReset2DRef=useRef(false)
  const isPausedRef2D=useRef(false)
  useEffect(()=>{ if (zoomResetSignal===0) return; lockedIdRef.current=null; targetViewRef.current={k:1,tx:0,ty:0}; fastReset2DRef.current=true },[zoomResetSignal])

  useEffect(()=>{
    const {w,h}=dimsRef.current
    if (w===0) return
    if (hoveredId===null) {
      if (lockTimerRef.current) { clearTimeout(lockTimerRef.current); lockTimerRef.current=null }
      releasePendingRef.current=false
      // Keep zoom and position — reset only when user manually pans/zooms or hovers a new marker
      return
    }
    if (lockedIdRef.current===hoveredId) return
    if (lockTimerRef.current) { clearTimeout(lockTimerRef.current); lockTimerRef.current=null }
    releasePendingRef.current=false
    const comp=COMPS.find(c=>c.id===hoveredId)
    if (!comp) return
    const baseScale=w/(2*Math.PI)
    const baseProj=d3.geoEquirectangular().scale(baseScale).translate([w/2,h/2])
    const pt=baseProj([comp.lng,comp.lat])
    if (!pt) return
    lockedIdRef.current=hoveredId
    const K=3.5
    targetViewRef.current={k:K, tx:w/2-pt[0]*K, ty:h/2-pt[1]*K}
  },[hoveredId])

  // Cleanup lock timer on unmount
  useEffect(()=>()=>{ if (lockTimerRef.current) clearTimeout(lockTimerRef.current) },[])

  useEffect(()=>{
    if (!containerRef.current) return
    const ro=new ResizeObserver(e=>{
      const {width,height}=e[0].contentRect
      const d={w:Math.round(width),h:Math.round(height)}
      setDims(d); dimsRef.current=d
    })
    ro.observe(containerRef.current); return ()=>ro.disconnect()
  },[])

  useEffect(()=>{ loadGeoBundle().then(setBundle).catch(()=>{}) },[])

  useEffect(()=>{
    const canvas=canvasRef.current
    if (!canvas||!bundle||dims.w===0) return
    const ctx=canvas.getContext('2d'); if (!ctx) return

    const {w,h}=dims
    const dpr=window.devicePixelRatio||1
    canvas.width=w*dpr; canvas.height=h*dpr
    canvas.style.width=`${w}px`; canvas.style.height=`${h}px`
    ctx.scale(dpr,dpr)

    const baseScale=w/(2*Math.PI)
    const baseProj=d3.geoEquirectangular().scale(baseScale).translate([w/2,h/2])

    const render=()=>{
      const {k,tx,ty}=viewRef.current
      ctx.clearRect(0,0,w,h)

      const ocean=ctx.createRadialGradient(w*.5,h*.38,0,w*.5,h*.5,Math.max(w,h)*.9)
      ocean.addColorStop(0,'#031830'); ocean.addColorStop(.65,'#020D1C'); ocean.addColorStop(1,'#010608')
      ctx.fillStyle=ocean; ctx.fillRect(0,0,w,h)

      ctx.save()
      ctx.setTransform(k*dpr, 0, 0, k*dpr, tx*dpr, ty*dpr)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gp=d3.geoPath().projection(baseProj).context(ctx as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx.beginPath(); gp(d3.geoGraticule()() as any)
      ctx.strokeStyle='rgba(56,189,248,0.07)'; ctx.lineWidth=0.7/k; ctx.stroke()

      const eq0=baseProj([-180,0]), eq1=baseProj([180,0])
      if (eq0&&eq1) {
        ctx.beginPath(); ctx.moveTo(eq0[0],eq0[1]); ctx.lineTo(eq1[0],eq1[1])
        ctx.strokeStyle='rgba(56,189,248,0.18)'; ctx.lineWidth=1.0/k; ctx.stroke()
      }
      ctx.setLineDash([18/k,14/k])
      for (const lat of[-66.5,-23.5,23.5,66.5]) {
        const p0=baseProj([-180,lat]),p1=baseProj([180,lat])
        if (!p0||!p1) continue
        ctx.beginPath(); ctx.moveTo(p0[0],p0[1]); ctx.lineTo(p1[0],p1[1])
        ctx.strokeStyle='rgba(56,189,248,0.09)'; ctx.lineWidth=0.8/k; ctx.stroke()
      }
      ctx.setLineDash([])

      const dotR=1.05/k
      ctx.fillStyle='rgba(14,165,233,0.44)'
      for (const [lng,lat] of bundle.dots) {
        const pt=baseProj([lng,lat]); if (!pt) continue
        ctx.beginPath(); ctx.arc(pt[0],pt[1],dotR,0,2*Math.PI); ctx.fill()
      }

      ctx.beginPath()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bundle.features.features.forEach(f=>gp(f as any))
      ctx.strokeStyle='rgba(56,189,248,0.52)'; ctx.lineWidth=0.75/k; ctx.stroke()

      const hov=lockedIdRef.current??hoveredIdRef.current
      COMPS.forEach((comp,i)=>{
        const pt=baseProj([comp.lng,comp.lat]); if (!pt) return
        const [px,py]=pt
        const isHov=hov===comp.id
        const color=TC[comp.type]
        const t=Date.now()*0.0018+i*0.85
        const pulse=1+0.28*Math.sin(t)
        const mr=1/k

        ctx.save()
        if (isHov) {
          ctx.beginPath(); ctx.arc(px,py,20*mr,0,2*Math.PI); ctx.fillStyle=color+'0e'; ctx.fill()
          ctx.beginPath(); ctx.arc(px,py,12*mr,0,2*Math.PI); ctx.fillStyle=color+'22'; ctx.fill()
          ctx.beginPath(); ctx.arc(px,py, 7*mr,0,2*Math.PI); ctx.fillStyle=color+'48'; ctx.fill()
          ctx.shadowColor=color; ctx.shadowBlur=16*mr
          ctx.beginPath(); ctx.arc(px,py,3.5*mr,0,2*Math.PI); ctx.fillStyle='#fff'; ctx.fill()
          ctx.shadowBlur=0
        } else {
          ctx.beginPath(); ctx.arc(px,py,6*pulse*mr,0,2*Math.PI); ctx.fillStyle=color+'14'; ctx.fill()
          ctx.beginPath(); ctx.arc(px,py,4*pulse*mr,0,2*Math.PI); ctx.fillStyle=color+'28'; ctx.fill()
          ctx.shadowColor=color; ctx.shadowBlur=5*mr
          ctx.beginPath(); ctx.arc(px,py,2.4*mr,0,2*Math.PI); ctx.fillStyle=color; ctx.fill()
          ctx.shadowBlur=0
        }
        ctx.restore()
      })

      ctx.restore()

      const vign=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.28,w/2,h/2,Math.max(w,h)*.72)
      vign.addColorStop(0,'transparent'); vign.addColorStop(1,'rgba(1,6,9,0.72)')
      ctx.fillStyle=vign; ctx.fillRect(0,0,w,h)

      if (hov!==null) {
        const comp=COMPS.find(c=>c.id===hov)
        if (comp) {
          const basePt=baseProj([comp.lng,comp.lat])
          if (basePt) {
            const sx=basePt[0]*k+tx
            const sy=basePt[1]*k+ty
            const onScreen=sx>-20&&sx<w+20&&sy>-20&&sy<h+20
            drawInfoPanel(ctx,comp,sx,sy,w,h,onScreen)
          }
        }
      }
    }

    const containerEl=containerRef.current
    const visObs2D=new IntersectionObserver(([e])=>{ isPausedRef2D.current=!e.isIntersecting },{threshold:0.01})
    if (containerEl) visObs2D.observe(containerEl)

    const LERP=0.04
    let raf:number
    const loop=()=>{
      if (isPausedRef2D.current) { raf=requestAnimationFrame(loop); return }
      const cur=viewRef.current
      const tgt=targetViewRef.current
      if (tgt) {
        const lerpF=fastReset2DRef.current?0.18:LERP
        const dk=tgt.k-cur.k, dtx=tgt.tx-cur.tx, dty=tgt.ty-cur.ty
        if (Math.abs(dk)>0.001||Math.abs(dtx)>0.5||Math.abs(dty)>0.5) {
          viewRef.current={k:cur.k+dk*lerpF, tx:cur.tx+dtx*lerpF, ty:cur.ty+dty*lerpF}
        } else {
          viewRef.current=tgt
          fastReset2DRef.current=false
        }
      }
      render()
      raf=requestAnimationFrame(loop)
    }
    raf=requestAnimationFrame(loop)

    const getPos=(e:MouseEvent)=>{ const r=canvas.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top} }

    const onMouseMove=(e:MouseEvent)=>{
      const {x,y}=getPos(e)
      const {k,tx,ty}=viewRef.current
      const bx=(x-tx)/k, by=(y-ty)/k

      let closest:Comp|null=null, closestD=18/k
      for (const comp of COMPS) {
        const pt=baseProj([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-bx,pt[1]-by)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      if (closest) { onHoverRef.current(closest,e.clientX,e.clientY); canvas.style.cursor='pointer' }
      else { onHoverRef.current(null,0,0); canvas.style.cursor='grab' }
    }
    const onMouseLeave=()=>{ onHoverRef.current(null,0,0); canvas.style.cursor='default' }

    let dragging=false, dragStart2={x:0,y:0}, dragStartView={k:1,tx:0,ty:0}, lastTouchTime2D=0
    const onMouseDown=(e:MouseEvent)=>{
      if (Date.now()-lastTouchTime2D<500) return
      dragging=true
      dragStart2=getPos(e)
      dragStartView={...viewRef.current}
      canvas.style.cursor='grabbing'
    }
    const onMouseUp2=()=>{ dragging=false; canvas.style.cursor='grab' }
    const onMouseDrag=(e:MouseEvent)=>{
      if (!dragging) return
      const {x,y}=getPos(e)
      viewRef.current={
        k:dragStartView.k,
        tx:dragStartView.tx+(x-dragStart2.x),
        ty:dragStartView.ty+(y-dragStart2.y),
      }
      lockedIdRef.current=null
      targetViewRef.current=null
    }
    const onWheel2D=(e:WheelEvent)=>{
      if (!e.ctrlKey) return
      e.preventDefault()
      const {x,y}=getPos(e)
      const cur=viewRef.current
      const factor=e.deltaY>0?0.85:1.18
      const newK=Math.max(0.8,Math.min(10,cur.k*factor))
      const f=newK/cur.k
      viewRef.current={k:newK,tx:x-f*(x-cur.tx),ty:y-f*(y-cur.ty)}
      lockedIdRef.current=null
      targetViewRef.current=null
    }
    const onCanvasMouseUp2D=(e:MouseEvent)=>{
      if (Date.now()-lastTouchTime2D<500) return
      const {x,y}=getPos(e)
      if (Math.hypot(x-dragStart2.x,y-dragStart2.y)>8) return
      const {k,tx,ty}=viewRef.current
      const bx=(x-tx)/k, by=(y-ty)/k
      let closest:Comp|null=null, closestD=18/k
      for (const comp of COMPS) {
        const pt=baseProj([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-bx,pt[1]-by)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      onTapRef2D.current?.(closest)
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave',onMouseLeave)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseDrag)
    canvas.addEventListener('mouseup',   onCanvasMouseUp2D)
    canvas.addEventListener('wheel',     onWheel2D,{passive:false})
    window.addEventListener('mouseup',   onMouseUp2)

    let t1Start2D={x:0,y:0}, tDragStart2D={x:0,y:0}, tDragStartView2D={k:1,tx:0,ty:0}
    let tDragging2D=false, hadMultiTouch2D=false
    let pinchDist2D=0, pinchScale2D=1, pinchCX2D=0, pinchCY2D=0, pinchStartTx2D=0, pinchStartTy2D=0

    const onTouchStart2D=(e:TouchEvent)=>{
      if (e.touches.length===2) e.preventDefault()
      if (e.touches.length===1) {
        hadMultiTouch2D=false
        const t=e.touches[0]
        t1Start2D={x:t.clientX,y:t.clientY}
        tDragStart2D={x:t.clientX,y:t.clientY}
        tDragStartView2D={...viewRef.current}
        tDragging2D=false
      } else if (e.touches.length===2) {
        hadMultiTouch2D=true
        tDragging2D=true
        targetViewRef.current=null
        pinchDist2D=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)
        pinchScale2D=viewRef.current.k
        const rect=canvas.getBoundingClientRect()
        pinchCX2D=((e.touches[0].clientX+e.touches[1].clientX)/2)-rect.left
        pinchCY2D=((e.touches[0].clientY+e.touches[1].clientY)/2)-rect.top
        pinchStartTx2D=viewRef.current.tx
        pinchStartTy2D=viewRef.current.ty
      }
    }
    const onTouchMove2D=(e:TouchEvent)=>{
      if (e.touches.length===1) {
        const dx=e.touches[0].clientX-tDragStart2D.x, dy=e.touches[0].clientY-tDragStart2D.y
        if (!tDragging2D && Math.hypot(dx,dy)>5) tDragging2D=true
        if (tDragging2D) {
          e.preventDefault()
          viewRef.current={k:tDragStartView2D.k,tx:tDragStartView2D.tx+dx,ty:tDragStartView2D.ty+dy}
          targetViewRef.current=null
        }
      } else if (e.touches.length===2) {
        e.preventDefault()
        const nd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)
        const nk=Math.max(0.8,Math.min(10,pinchScale2D*nd/pinchDist2D))
        const f=nk/pinchScale2D
        viewRef.current={k:nk,tx:pinchCX2D-f*(pinchCX2D-pinchStartTx2D),ty:pinchCY2D-f*(pinchCY2D-pinchStartTy2D)}
        targetViewRef.current=null
      }
    }
    const onTouchEnd2D=(e:TouchEvent)=>{
      lastTouchTime2D=Date.now()
      if (tDragging2D) {
        if (e.touches.length===0) tDragging2D=false
        else if (e.touches.length===1) {
          const t=e.touches[0]
          tDragStart2D={x:t.clientX,y:t.clientY}
          tDragStartView2D={...viewRef.current}
          tDragging2D=false
        }
        return
      }
      if (hadMultiTouch2D) { hadMultiTouch2D=false; return }
      const t=e.changedTouches[0]
      if (Math.hypot(t.clientX-t1Start2D.x,t.clientY-t1Start2D.y)>14) return
      const rect=canvas.getBoundingClientRect()
      const x=t.clientX-rect.left, y=t.clientY-rect.top
      const {k,tx,ty}=viewRef.current
      const bx=(x-tx)/k, by=(y-ty)/k
      let closest:Comp|null=null, closestD=48/k
      for (const comp of COMPS) {
        const pt=baseProj([comp.lng,comp.lat]); if (!pt) continue
        const dist=Math.hypot(pt[0]-bx,pt[1]-by)
        if (dist<closestD){closestD=dist;closest=comp}
      }
      if (closest) onHoverRef.current(closest,t.clientX,t.clientY)
      onTapRef2D.current?.(closest)
    }
    canvas.addEventListener('touchstart',onTouchStart2D,{passive:false})
    canvas.addEventListener('touchmove', onTouchMove2D, {passive:false})
    canvas.addEventListener('touchend',  onTouchEnd2D,  {passive:true})

    return ()=>{
      cancelAnimationFrame(raf)
      visObs2D.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave',onMouseLeave)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseDrag)
      canvas.removeEventListener('mouseup',   onCanvasMouseUp2D)
      canvas.removeEventListener('wheel',     onWheel2D)
      window.removeEventListener('mouseup',   onMouseUp2)
      canvas.removeEventListener('touchstart',onTouchStart2D)
      canvas.removeEventListener('touchmove', onTouchMove2D)
      canvas.removeEventListener('touchend',  onTouchEnd2D)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[bundle,dims])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" style={{
      opacity:visible?1:0, transform:visible?'scale(1)':'scale(0.96)',
      filter:visible?'blur(0px)':'blur(14px)',
      transition:'opacity 0.55s ease,transform 0.55s ease,filter 0.55s ease',
      pointerEvents:visible?'auto':'none',
    }}>
      <canvas ref={canvasRef} style={{width:'100%',height:'100%',display:'block',cursor:'grab'}}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW TOGGLE
═══════════════════════════════════════════════════════════════════════════ */
function ViewToggle({mode,onToggle}:{mode:'2d'|'3d';onToggle:()=>void}) {
  return (
    <div className="absolute top-3 right-3 z-30 flex items-center p-0.5 rounded-full"
      style={{background:'rgba(6,8,15,0.88)',border:'1px solid rgba(14,165,233,0.22)',backdropFilter:'blur(16px)',boxShadow:'0 4px 24px rgba(0,0,0,0.5)'}}>
      {(['2d','3d'] as const).map(m=>{
        const active=mode===m
        return (
          <button key={m} onClick={()=>{if(!active)onToggle()}}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{background:active?'rgba(14,165,233,0.22)':'transparent',border:`1px solid ${active?'rgba(14,165,233,0.52)':'transparent'}`,boxShadow:active?'0 0 12px rgba(14,165,233,0.22)':'none',cursor:active?'default':'pointer'}}>
            {m==='2d'?<Map size={13} style={{color:active?'#38bdf8':'rgba(148,163,184,0.4)'}}/>:<Globe size={13} style={{color:active?'#38bdf8':'rgba(148,163,184,0.4)'}}/>}
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',color:active?'rgba(241,245,249,0.95)':'rgba(148,163,184,0.4)',transition:'color 0.2s'}}>
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
function CompCard({comp,isActive,onEnter,onLeave,onClick,domRef,isDesktop}:{comp:Comp;isActive:boolean;onEnter:()=>void;onLeave:()=>void;onClick?:()=>void;domRef?:(el:HTMLDivElement|null)=>void;isDesktop?:boolean}) {
  const color=TC[comp.type]
  return (
    <div ref={domRef} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} style={{
      display:'flex',alignItems:'stretch',borderRadius:'6px',overflow:'hidden',
      background:isActive?`${color}0e`:'rgba(255,255,255,0.02)',
      border:`1px solid ${isActive?color+'48':'rgba(255,255,255,0.05)'}`,
      boxShadow:isActive?`0 0 28px ${color}14,inset 0 0 16px ${color}06`:'none',
      transform:isActive&&(isDesktop??true)?'translateX(-5px)':'none',
      transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',cursor:'pointer',flexShrink:0,
    }}>
      <div style={{width:'3px',background:isActive?`linear-gradient(to bottom,${color},${color}55)`:`${color}28`,flexShrink:0,transition:'background 0.25s'}}/>
      <div style={{padding:'9px 11px',borderRight:'1px solid rgba(255,255,255,0.04)',minWidth:'52px',flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'1.05rem',color:isActive?color:'rgba(148,163,184,0.42)',letterSpacing:'0.06em',lineHeight:1.1,transition:'color 0.25s'}}>{comp.month}</div>
        <div style={{fontSize:'0.52rem',color:'rgba(148,163,184,0.22)',marginTop:'2px',letterSpacing:'0.1em',fontFamily:"'DM Sans',sans-serif"}}>2026</div>
      </div>
      <div style={{flex:1,padding:'9px 11px',minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'4px'}}>
          <span style={{fontSize:'0.82rem',lineHeight:1}}>{comp.flag}</span>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:'0.84rem',color:isActive?'rgba(241,245,249,1)':'rgba(241,245,249,0.7)',letterSpacing:'0.04em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',transition:'color 0.25s'}}>{comp.name}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'6px'}}>
          <span style={{color:'rgba(148,163,184,0.38)',fontSize:'0.6rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:"'DM Sans',sans-serif"}}>{comp.location}</span>
          <span style={{color:isActive?color:'rgba(148,163,184,0.32)',fontSize:'0.58rem',flexShrink:0,fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:'color 0.25s'}}>{comp.date}</span>
        </div>
      </div>
      <div style={{padding:'9px 10px',display:'flex',alignItems:'center'}}>
        <div style={{width:'7px',height:'7px',borderRadius:'50%',background:color,boxShadow:isActive?`0 0 10px ${color},0 0 22px ${color}50`:'none',transition:'box-shadow 0.25s',flexShrink:0}}/>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════════════════════ */
export function GlobeSection() {
  const {ref:sectionRef,inView}=useInView(0.1)
  const [mode,setMode]=useState<'2d'|'3d'>('3d')
  const [hoveredId,setHoveredId]=useState<number|null>(null)
  const [pinnedId,setPinnedId]=useState<number|null>(null)
  const [zoomResetSignal,setZoomResetSignal]=useState(0)
  const [isDesktop,setIsDesktop]=useState(()=>typeof window!=='undefined'&&window.innerWidth>=1024)
  const globeContainerRef=useRef<HTMLDivElement>(null)
  const cardRefs=useRef<Record<number,HTMLDivElement|null>>({})
  const listRef=useRef<HTMLDivElement>(null)
  const pinnedTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null)
  const pinnedIdRef=useRef<number|null>(null)
  const canvasHoverRef=useRef(false)
  const hoverPinTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null)
  const effectiveId=pinnedId??hoveredId

  useEffect(()=>{ pinnedIdRef.current=pinnedId },[pinnedId])

  useEffect(()=>{
    const check=()=>setIsDesktop(window.innerWidth>=1024)
    window.addEventListener('resize',check,{passive:true})
    return ()=>window.removeEventListener('resize',check)
  },[])

  // Desktop: hovering a canvas marker auto-pins it after 200ms debounce (canvas only, not list)
  useEffect(()=>{
    if (hoveredId===null||!canvasHoverRef.current) {
      if (hoverPinTimerRef.current) { clearTimeout(hoverPinTimerRef.current); hoverPinTimerRef.current=null }
      return
    }
    if (window.innerWidth<1024) return
    if (hoverPinTimerRef.current) clearTimeout(hoverPinTimerRef.current)
    const id=hoveredId
    hoverPinTimerRef.current=setTimeout(()=>{ hoverPinTimerRef.current=null; setPinnedId(id) },200)
    return ()=>{ if (hoverPinTimerRef.current) { clearTimeout(hoverPinTimerRef.current); hoverPinTimerRef.current=null } }
  },[hoveredId])

  // Scroll the event list internally to the selected card on mobile (no page scroll)
  useEffect(()=>{
    if (pinnedId===null||window.innerWidth>=1024) return
    const card=cardRefs.current[pinnedId]
    const list=listRef.current
    if (!card||!list) return
    list.scrollTo({top:card.offsetTop,behavior:'smooth'})
  },[pinnedId])

  const releasePin=useCallback(()=>{
    setPinnedId(null)
    setHoveredId(null)
    setZoomResetSignal(s=>s+1)
    if (pinnedTimerRef.current) { clearTimeout(pinnedTimerRef.current); pinnedTimerRef.current=null }
  },[])

  // Auto-resume globe rotation 4s after any pin (click/tap on marker or card)
  useEffect(()=>{
    if (pinnedId===null) return
    if (pinnedTimerRef.current) clearTimeout(pinnedTimerRef.current)
    pinnedTimerRef.current=setTimeout(()=>{ setPinnedId(null); setHoveredId(null); setZoomResetSignal(s=>s+1); pinnedTimerRef.current=null },4000)
    return ()=>{ if (pinnedTimerRef.current) clearTimeout(pinnedTimerRef.current) }
  },[pinnedId])

  const handleListEnter=useCallback((id:number)=>{ canvasHoverRef.current=false; setHoveredId(id) },[])
  const handleListLeave=useCallback(()=>{ canvasHoverRef.current=false; setHoveredId(null) },[])

  const handleCanvasHover=useCallback((comp:Comp|null, _x:number, _y:number)=>{
    canvasHoverRef.current=true
    setHoveredId(comp?.id??null)
  },[])

  const handleGlobeTap=useCallback((comp:Comp|null)=>{
    if (!comp || pinnedIdRef.current===comp.id) { releasePin(); return }
    setPinnedId(comp.id)
  },[releasePin])

  const handleCardClick=useCallback((id:number)=>{
    setPinnedId(id)
  },[])

  return (
    <section id="season" ref={sectionRef} className="section-edge-fade relative py-10 lg:py-20 overflow-hidden">

      {/* ── Animated gradient background — dark cinematic palette ── */}
      <AnimatedGradientBackground
        Breathing
        animationSpeed={0.008}
        breathingRange={6}
        startingGap={120}
        topOffset={10}
        gradientColors={[
          '#08090E',   // deep dark base (35%)
          '#070C18',   // near-black navy (50%)
          '#061220',   // dark ocean blue (60%)
          '#051828',   // deep sea (70%)
          '#071424',   // abyss (80%)
          '#060E1A',   // dark fade (90%)
          '#08090E',   // back to base (100%)
        ]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
      />

      {/* Cyan radial accent — subtle glow from top-center */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(14,165,233,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Left edge glow accent */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 30% 60% at 0% 50%, rgba(14,165,233,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="container relative z-10">

        <div className="mb-14 transition-all duration-700" style={{opacity:inView?1:0,transform:inView?'translateY(0)':'translateY(20px)'}}>
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR"/>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* Globe / Map container */}
          <div ref={globeContainerRef} className="relative rounded-sm overflow-hidden h-[300px] sm:h-[420px] lg:h-[520px]" style={{border:'1px solid rgba(14,165,233,0.12)',background:'#020510',boxShadow:'0 0 80px rgba(14,165,233,0.05),inset 0 0 80px rgba(14,165,233,0.03)'}}>
            <Map2DFlat  visible={mode==='2d'} hoveredId={effectiveId} onHover={handleCanvasHover} onTap={handleGlobeTap} zoomResetSignal={zoomResetSignal}/>
            <Globe3DD3  visible={mode==='3d'} hoveredId={effectiveId} onHover={handleCanvasHover} onTap={handleGlobeTap} zoomResetSignal={zoomResetSignal}/>
            <ViewToggle mode={mode} onToggle={()=>setMode(m=>m==='2d'?'3d':'2d')}/>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none" style={{color:'rgba(148,163,184,0.22)',fontSize:'10px',fontFamily:"'DM Sans',sans-serif",textTransform:'uppercase',letterSpacing:'0.15em',whiteSpace:'nowrap'}}>
              <span className="hidden lg:inline">{mode==='3d'?'drag to rotate · pinch to zoom · hover markers':'drag to move · pinch to zoom · hover markers'}</span>
              <span className="lg:hidden">{mode==='3d'?'pinch to zoom · drag to rotate · tap markers':'pinch to zoom · drag to move · tap markers'}</span>
            </div>
          </div>

          {/* Competition schedule */}
          <div className="flex flex-col">
            <motion.div initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.4,delay:.1}}
              className="flex items-center justify-between mb-4">
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.65rem',color:'rgba(148,163,184,0.32)',letterSpacing:'0.2em',textTransform:'uppercase'}}>12 events · 7 countries</p>
              <div className="flex items-center gap-2.5">
                {(Object.entries(TC) as [CompType,string][]).map(([type,color])=>(
                  <div key={type} style={{width:'6px',height:'6px',borderRadius:'50%',background:color}}/>
                ))}
              </div>
            </motion.div>

            <style>{`
              .gs-list{max-height:clamp(260px,52vw,340px);overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:rgba(14,165,233,0.25) transparent}
              .gs-list::-webkit-scrollbar{width:3px}
              .gs-list::-webkit-scrollbar-track{background:transparent}
              .gs-list::-webkit-scrollbar-thumb{background:rgba(14,165,233,0.25);border-radius:2px}
              @media(min-width:1024px){.gs-list{max-height:none;overflow:visible}}
            `}</style>
            <div className="relative">
              <div ref={listRef} className="gs-list flex flex-col gap-1.5">
                {COMPS.map((comp,i)=>(
                  <motion.div key={comp.id} initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.4,delay:.1+i*.05}}>
                    <CompCard comp={comp} isActive={effectiveId===comp.id}
                      onEnter={()=>handleListEnter(comp.id)} onLeave={handleListLeave}
                      onClick={()=>handleCardClick(comp.id)}
                      domRef={el=>{cardRefs.current[comp.id]=el}}
                      isDesktop={isDesktop}/>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:hidden mt-2 flex justify-center">
              <span style={{fontSize:'9px',color:'rgba(14,165,233,0.6)',fontFamily:"'DM Sans',sans-serif",textTransform:'uppercase',letterSpacing:'0.2em'}}>↓ scroll for more</span>
            </div>

            <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{duration:.4,delay:.75}}
              className="mt-5 pt-4 flex flex-wrap gap-x-4 gap-y-1.5" style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
              {(Object.entries(TL) as [CompType,string][]).map(([type,label])=>(
                <div key={type} className="flex items-center gap-1.5">
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:TC[type],flexShrink:0}}/>
                  <span style={{color:'rgba(148,163,184,0.36)',fontSize:'0.62rem',fontFamily:"'DM Sans',sans-serif",letterSpacing:'0.06em'}}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
