'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Map } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { SectionHeader } from '@/components/SectionHeader'

/* ═══════════════════════════════════════════════════════════════════════════
   COMPETITION DATA
═══════════════════════════════════════════════════════════════════════════ */
type CompType = 'world_cup' | 'world_champ' | 'european' | 'national'
interface Comp { id:number; name:string; location:string; flag:string; date:string; month:string; lat:number; lng:number; type:CompType }
const COMPS: Comp[] = [
  { id:0, name:'World Cup IWSA R',       location:'Hong Kong',               flag:'🇭🇰', date:'Feb 4–7',    month:'FEB', lat:22.3,  lng:114.2, type:'world_cup'   },
  { id:1, name:'European Champ. IWSA F', location:'Naples, Italy',           flag:'🇮🇹', date:'Apr 8–11',   month:'APR', lat:40.85, lng:14.27, type:'european'    },
  { id:2, name:'Défi Wing',              location:'Gruissan, France',        flag:'🇫🇷', date:'May 11–14',  month:'MAY', lat:43.11, lng:3.09,  type:'national'    },
  { id:3, name:'World Cup IWSA R',       location:'Silvaplana, Switzerland', flag:'🇨🇭', date:'Jun 17–20',  month:'JUN', lat:46.47, lng:9.80,  type:'world_cup'   },
  { id:4, name:'World Cup IWSA R',       location:'Gizzeria, Italy',         flag:'🇮🇹', date:'Jul 8–11',   month:'JUL', lat:38.97, lng:16.18, type:'world_cup'   },
  { id:5, name:'World Champ. IWSA F',    location:'Istanbul, Türkiye',       flag:'🇹🇷', date:'Aug 11–14',  month:'AUG', lat:41.01, lng:28.98, type:'world_champ' },
  { id:6, name:'World Cup IWSA R',       location:'Daishan, China',          flag:'🇨🇳', date:'Oct 16–20',  month:'OCT', lat:30.21, lng:122.2, type:'world_cup'   },
  { id:7, name:'French Champ. S&R',      location:'Leucate, France',         flag:'🇫🇷', date:'Oct 23–25',  month:'OCT', lat:42.92, lng:3.04,  type:'national'    },
  { id:8, name:'IWSA Racing',            location:'Cagliari, Sardinia',      flag:'🇮🇹', date:'Nov 1–3',    month:'NOV', lat:39.22, lng:9.12,  type:'world_cup'   },
  { id:9, name:'World Cup IWSA R',       location:'Jericoacoara, Brazil',    flag:'🇧🇷', date:'Dec 1–4',    month:'DEC', lat:-2.80, lng:-40.5, type:'world_cup'   },
]
const TC: Record<CompType,string> = { world_champ:'#F59E0B', world_cup:'#EC4899', european:'#0EA5E9', national:'#A78BFA' }
const TL: Record<CompType,string> = { world_champ:'World Championship', world_cup:'World Cup', european:'European Champ.', national:'National / Invitational' }

/* ═══════════════════════════════════════════════════════════════════════════
   WORLD GEOGRAPHY — Natural Earth 110m simplified
═══════════════════════════════════════════════════════════════════════════ */
const GEO: [number,number][][] = [
  /* ── North America (main) ─────────────────────────────────────────────── */
  [[71,-141],[68,-141],[64,-141],[60,-141],[59,-136],[57,-135],[54,-130],[51,-128],
   [50,-128],[48,-124],[46,-124],[42,-124],[38,-122],[36,-122],[34,-120],[32,-117],
   [30,-116],[27,-110],[23,-110],[22,-106],[20,-105],[18,-96],[16,-94],[15,-92],
   [14,-90],[14,-87],[10,-84],[8,-77],[9,-75],[11,-74],[16,-62],[18,-68],[20,-74],
   [22,-80],[24,-82],[25,-81],[26,-80],[25,-80],[24,-80],[25,-79],
   [28,-81],[30,-81],[32,-80],[35,-76],[38,-75],[40,-74],[41,-72],[42,-70],
   [44,-66],[47,-53],[50,-56],[53,-58],[56,-60],[58,-62],[62,-64],[64,-68],
   [66,-64],[68,-68],[70,-74],[72,-80],[74,-86],[76,-92],[74,-110],[72,-124],
   [71,-141]],
  /* ── Greenland ────────────────────────────────────────────────────────── */
  [[83,-21],[82,-40],[80,-54],[77,-68],[72,-68],[68,-52],[64,-51],[66,-38],
   [70,-26],[73,-22],[77,-18],[80,-18],[83,-20],[83,-21]],
  /* ── Cuba ─────────────────────────────────────────────────────────────── */
  [[23,-82],[22,-80],[20,-75],[20,-74],[21,-74],[22,-74],[23,-82]],
  /* ── South America ────────────────────────────────────────────────────── */
  [[11,-73],[10,-65],[8,-61],[5,-52],[3,-51],[1,-50],[0,-50],
   [-2,-40],[-5,-35],[-8,-35],[-10,-37],[-13,-39],[-16,-39],[-18,-39],
   [-20,-40],[-23,-43],[-26,-48],[-28,-49],[-30,-51],[-33,-53],[-35,-57],
   [-38,-58],[-40,-62],[-42,-64],[-46,-66],[-50,-68],[-53,-70],[-55,-65],
   [-54,-70],[-50,-75],[-45,-74],[-40,-62],[-36,-57],[-30,-50],[-22,-44],
   [-16,-39],[-4,-40],[-2,-40],[0,-50],[0,-76],[-1,-78],[2,-78],[5,-77],
   [8,-77],[10,-73],[11,-73]],
  /* ── Western Europe ──────────────────────────────────────────────────── */
  [[44,-2],[44,-8],[42,-9],[38,-9],[36,-7],[36,-5],[36,-3],[37,0],[38,2],
   [42,3],[43,3],[43,5],[44,8],[44,6],[46,6],[47,6],[48,2],[51,2],[51,1],
   [51,3],[52,5],[52,7],[50,7],[50,6],[48,7],[46,6],[44,-2]],
  /* ── Iberian Peninsula ────────────────────────────────────────────────── */
  [[44,-2],[44,-7],[43,-8],[43,-9],[42,-9],[39,-9],[37,-9],[36,-7],[36,-5],
   [36,-3],[37,0],[38,2],[40,1],[42,3],[43,3],[44,-2]],
  /* ── Italy ────────────────────────────────────────────────────────────── */
  [[44.2,7.6],[44.0,8.6],[44.5,9.0],[44.5,10.0],[45.0,10.5],[45.4,12.3],
   [45.7,13.6],[46.0,14.0],[45.5,14.5],[45.0,14.5],[44.5,14.9],[44.0,15.0],
   [43.5,15.4],[42.5,14.4],[42.0,15.6],[41.5,15.8],[41.0,16.0],[40.5,17.0],
   [40.5,18.2],[40.0,18.5],[39.8,18.4],[39.4,17.0],[38.9,16.5],[38.1,15.6],
   [37.9,15.5],[38.0,15.0],[38.3,16.0],[38.9,16.5],[39.2,16.2],[39.5,15.7],
   [40.0,14.7],[40.5,14.4],[41.0,13.8],[41.5,12.6],[42.0,11.6],[42.5,10.5],
   [43.5,10.5],[43.8,9.5],[44.2,8.5],[44.2,7.6]],
  /* ── Sardinia ─────────────────────────────────────────────────────────── */
  [[41.2,9.2],[40.5,8.1],[39.0,8.3],[38.9,9.5],[39.8,9.8],[41.2,9.2]],
  /* ── Sicily ───────────────────────────────────────────────────────────── */
  [[38.2,15.6],[37.7,15.2],[37.3,14.4],[37.0,13.5],[37.2,12.5],[37.7,12.3],
   [38.0,12.5],[38.2,13.5],[38.3,14.5],[38.2,15.6]],
  /* ── Scandinavia ──────────────────────────────────────────────────────── */
  [[57,8],[58,8],[58,10],[60,5],[61,5],[63,8],[65,14],[66,14],[68,16],[70,22],
   [71,26],[71,28],[70,30],[68,28],[66,24],[65,25],[65,28],[66,28],[67,26],
   [68,24],[70,26],[71,28],[70,30],[68,28],[66,24],[64,20],[62,18],[60,18],
   [58,14],[57,12],[57,8]],
  /* ── Norway ───────────────────────────────────────────────────────────── */
  [[58,6],[60,5],[61,5],[62,6],[63,8],[65,14],[66,14],[68,14],[70,20],
   [71,26],[72,26],[74,18],[74,20],[72,20],[70,26],[69,18],[68,16],[66,16],
   [65,14],[63,8],[62,6],[60,6],[58,6]],
  /* ── British Isles ────────────────────────────────────────────────────── */
  [[50,-5],[50,-3],[51,-3],[51,-5],[54,-3],[55,-2],[55,0],[58,0],[58,-3],
   [57,-6],[55,-6],[53,-4],[51,-3],[50,-5]],
  /* ── Central + Eastern Europe ────────────────────────────────────────── */
  [[54,22],[52,14],[50,14],[48,14],[46,14],[45,14],[45,16],[44,20],[42,22],
   [42,26],[41,28],[42,28],[44,26],[46,22],[48,20],[50,20],[52,18],[54,18],
   [54,20],[54,22]],
  /* ── Greece ───────────────────────────────────────────────────────────── */
  [[42,20],[40,20],[38,22],[38,26],[40,26],[42,22],[42,20]],
  /* ── Turkey ───────────────────────────────────────────────────────────── */
  [[42,26],[40,26],[38,26],[38,28],[36,28],[36,30],[36,36],[38,38],[40,38],
   [40,40],[40,42],[38,42],[36,36],[38,38],[40,38],[42,40],[42,36],[40,36],
   [42,34],[42,30],[42,28],[42,26]],
  /* ── Africa ───────────────────────────────────────────────────────────── */
  [[37,10],[37,12],[36,14],[32,24],[30,32],[22,36],[16,42],[12,44],[11,44],
   [8,42],[4,42],[0,42],[-4,40],[-10,40],[-18,36],[-22,34],[-26,32],
   [-30,30],[-34,26],[-35,20],[-34,18],[-30,17],[-26,15],[-20,14],
   [-14,12],[-8,14],[-4,10],[0,10],[2,6],[4,2],[2,-4],[4,-8],[3,-12],
   [4,-8],[6,-2],[5,0],[6,2],[8,2],[8,4],[10,4],[10,8],[12,10],
   [14,12],[16,14],[18,14],[20,14],[22,14],[22,16],[24,18],[26,22],
   [28,26],[30,30],[30,32],[22,36],[16,42],[12,44],[8,44],[4,44],[0,42],[37,10]],
  /* ── Madagascar ───────────────────────────────────────────────────────── */
  [[-12,50],[-14,48],[-18,44],[-22,44],[-24,46],[-24,48],[-20,48],[-16,50],[-12,50]],
  /* ── Arabian Peninsula ────────────────────────────────────────────────── */
  [[30,32],[28,34],[24,36],[20,38],[16,42],[12,44],[14,50],[18,56],[22,60],
   [24,58],[26,56],[28,50],[28,46],[28,44],[30,42],[30,36],[30,32]],
  /* ── Indian Subcontinent ──────────────────────────────────────────────── */
  [[25,68],[28,72],[28,76],[27,80],[26,88],[22,91],[16,82],[12,80],[8,78],
   [8,77],[8,76],[10,74],[12,74],[14,74],[18,72],[20,70],[22,70],[22,68],
   [24,66],[25,68]],
  /* ── Sri Lanka ────────────────────────────────────────────────────────── */
  [[10,80],[8,80],[6,80],[6,82],[8,82],[10,80]],
  /* ── Main Asia ────────────────────────────────────────────────────────── */
  [[70,28],[68,28],[60,26],[58,24],[56,22],[54,22],[54,20],[54,18],[52,14],
   [50,14],[52,6],[52,4],[50,14],[48,14],[46,46],[48,50],[50,52],[52,56],
   [54,58],[56,60],[58,60],[60,56],[62,54],[64,52],[66,58],[68,60],[70,60],
   [72,64],[74,68],[76,78],[78,78],[80,72],[80,62],[78,56],[76,54],[74,60],
   [72,56],[70,58],[68,58],[66,58],[68,60],[70,60],[72,64],[74,68],[76,72],
   [78,76],[80,78],[80,88],[78,92],[76,96],[74,100],[72,110],[72,120],
   [68,130],[68,140],[66,170],[68,174],[72,180],[76,172],[78,170],[80,150],
   [80,140],[78,135],[76,130],[74,125],[72,120],[70,130],[68,140],[66,134],
   [64,130],[62,130],[60,120],[58,116],[56,114],[54,114],[52,118],[52,120],
   [50,122],[48,120],[46,120],[44,120],[42,130],[45,135],[48,140],[50,140],
   [52,140],[55,136],[56,130],[58,124],[60,120],[62,122],[64,130],[66,134],
   [68,140],[66,140],[64,130],[62,126],[60,116],[58,114],[56,116],[54,120],
   [52,120],[50,122],[48,120],[46,120],[44,118],[42,116],[40,120],[38,120],
   [36,120],[34,120],[32,120],[30,122],[28,120],[26,120],[24,116],[22,114],
   [20,110],[20,108],[16,108],[16,102],[12,102],[8,98],[4,100],[2,104],
   [0,104],[0,108],[2,110],[4,112],[4,116],[6,116],[6,108],[8,100],
   [10,100],[12,98],[14,100],[16,102],[16,108],[18,104],[20,110],[22,114],
   [26,120],[30,122],[32,120],[36,120],[38,120],[40,120],[42,118],[44,120],
   [46,124],[50,130],[54,126],[56,124],[58,120],[60,116],[62,120],[64,130],
   [66,134],[68,140],[65,176],[70,178],[72,180],[76,176],[78,170],[80,150],
   [80,140],[80,130],[78,124],[76,120],[74,118],[72,120],[70,120],[68,116],
   [66,112],[64,108],[62,106],[60,100],[58,98],[56,92],[56,88],[58,82],
   [60,80],[62,80],[64,80],[66,80],[68,72],[68,68],[70,64],[72,64],[74,68],
   [76,72],[78,68],[80,60],[80,54],[78,52],[76,54],[74,58],[72,56],[70,60],
   [68,60],[66,56],[64,52],[62,52],[60,56],[58,60],[56,60],[54,56],[52,56],
   [50,52],[48,50],[46,50],[44,48],[42,46],[40,46],[38,44],[36,44],[36,40],
   [38,38],[40,38],[42,38],[44,38],[46,40],[48,42],[50,44],[52,44],[54,44],
   [56,46],[56,42],[54,40],[52,42],[50,46],[48,46],[46,46],[44,44],[42,44],
   [40,42],[40,40],[38,40],[36,40],[36,38],[36,36],[38,38],[40,40],[40,42],
   [42,44],[44,44],[46,44],[46,50],[48,50],[50,54],[52,56],[54,58],[56,60],
   [58,56],[58,54],[56,52],[54,50],[54,46],[52,44],[50,44],[50,48],[52,48],
   [54,48],[56,50],[58,50],[60,52],[62,54],[64,52],[66,58],[68,60],[70,60],
   [70,28]],
  /* ── Japan ─────────────────────────────────────────────────────────────── */
  [[31,130],[33,131],[34,132],[34,134],[36,136],[37,138],[38,141],[40,141],
   [41,141],[42,141],[43,145],[43,141],[42,140],[40,141],[38,141],[36,136],
   [34,134],[33,131],[31,130]],
  [[43,141],[42,140],[42,144],[44,145],[44,141],[43,141]],
  [[31,130],[32,131],[33,130],[32,129],[31,130]],
  /* ── Korean Peninsula ────────────────────────────────────────────────── */
  [[38,124],[38,126],[36,126],[34,128],[34,130],[36,130],[38,130],[38,126],[38,124]],
  /* ── Southeast Asia ───────────────────────────────────────────────────── */
  [[26,98],[22,100],[20,100],[18,104],[16,108],[16,102],[12,102],[10,104],
   [8,100],[4,100],[4,108],[8,104],[10,104],[12,102],[14,102],[16,108],
   [16,102],[14,100],[12,100],[10,100],[8,98],[4,100],[2,104],[2,108],
   [0,108],[2,110],[4,112],[6,116],[8,116],[10,108],[12,108],[14,100],
   [16,102],[18,104],[20,104],[22,104],[24,100],[26,98]],
  /* ── Java ─────────────────────────────────────────────────────────────── */
  [[-6,106],[-6,108],[-8,112],[-8,114],[-8,116],[-6,116],[-6,112],[-6,108],[-6,106]],
  /* ── Sumatra ──────────────────────────────────────────────────────────── */
  [[6,96],[4,98],[2,100],[0,104],[-2,104],[-4,104],[-4,106],[-2,106],[0,104],[2,100],[4,98],[6,96]],
  /* ── Borneo ───────────────────────────────────────────────────────────── */
  [[8,116],[6,116],[4,116],[2,112],[0,110],[-2,112],[-4,116],[0,118],[4,118],[6,118],[8,116]],
  /* ── Philippines ──────────────────────────────────────────────────────── */
  [[18,120],[16,120],[14,120],[12,124],[10,122],[12,122],[14,122],[16,122],[18,122],[18,120]],
  /* ── New Guinea ───────────────────────────────────────────────────────── */
  [[-4,136],[-4,140],[-6,144],[-8,148],[-6,148],[-4,144],[-2,140],[-2,136],[-4,136]],
  /* ── Australia ────────────────────────────────────────────────────────── */
  [[-14,128],[-12,130],[-12,134],[-14,136],[-12,136],[-12,130],[-14,128],
   [-16,122],[-18,122],[-22,114],[-26,114],[-30,114],[-32,116],[-34,118],
   [-36,136],[-38,140],[-38,148],[-36,150],[-33,152],[-30,154],[-26,154],
   [-22,150],[-18,146],[-14,144],[-12,136],[-14,136],[-12,134],[-12,130],
   [-14,128],[-16,122]],
  /* ── New Zealand ──────────────────────────────────────────────────────── */
  [[-42,171],[-44,172],[-46,168],[-44,170],[-42,172],[-42,171]],
  [[-36,174],[-38,176],[-41,175],[-40,176],[-38,178],[-36,174]],
  /* ── Iceland ──────────────────────────────────────────────────────────── */
  [[64,-22],[65,-16],[66,-14],[66,-22],[65,-24],[64,-22]],
]

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
function toPixel(lat:number, lng:number, W:number, H:number) {
  return { x:(lng+180)/360*W, y:(90-lat)/180*H }
}
function toSphere(lat:number, lng:number, r:number) {
  const phi=(90-lat)*(Math.PI/180), theta=(lng+180)*(Math.PI/180)
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta))
}

/* ═══════════════════════════════════════════════════════════════════════════
   IMPROVED MAP CANVAS — richer ocean, 3-pass land rendering, tropic lines
═══════════════════════════════════════════════════════════════════════════ */
function buildMapCanvas(): HTMLCanvasElement {
  const W=4096, H=2048
  const c=document.createElement('canvas'); c.width=W; c.height=H
  const ctx=c.getContext('2d')!

  /* ── Ocean background ── */
  const oceanGrad = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.5, W*0.65)
  oceanGrad.addColorStop(0,   '#021428')
  oceanGrad.addColorStop(0.5, '#010D1C')
  oceanGrad.addColorStop(1,   '#010609')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0,0,W,H)

  /* ── Subtle horizontal scan-line texture on ocean ── */
  ctx.strokeStyle = 'rgba(14,165,233,0.025)'
  ctx.lineWidth = 1
  for (let y=0; y<H; y+=20) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
  }

  /* ── Lat/lng grid ── */
  ctx.strokeStyle = 'rgba(56,189,248,0.06)'
  ctx.lineWidth = 1.5
  for (let lat=-90; lat<=90; lat+=30) {
    const y=(90-lat)/180*H
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
  }
  for (let lng=-180; lng<=180; lng+=30) {
    const x=(lng+180)/360*W
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke()
  }

  /* ── Equator — brighter ── */
  const eqY = H/2
  ctx.strokeStyle = 'rgba(56,189,248,0.18)'
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(0,eqY); ctx.lineTo(W,eqY); ctx.stroke()

  /* ── Tropic/polar lines — dashed ── */
  ctx.setLineDash([30, 20])
  ctx.strokeStyle = 'rgba(56,189,248,0.10)'
  ctx.lineWidth = 1.2
  for (const lat of [-66.5, -23.5, 23.5, 66.5]) {
    const y=(90-lat)/180*H
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
  }
  ctx.setLineDash([])

  /* ── Dot texture on ocean ── */
  ctx.fillStyle = 'rgba(14,165,233,0.04)'
  for (let x=0; x<W; x+=40) {
    for (let y=0; y<H; y+=40) {
      ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill()
    }
  }

  /* ── PASS 1: Deep shadow glow under land ── */
  GEO.forEach(poly => {
    if (poly.length < 3) return
    ctx.beginPath()
    poly.forEach(([lat,lng],i) => {
      const p=toPixel(lat,lng,W,H)
      i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y)
    })
    ctx.closePath()
    ctx.shadowColor = 'rgba(14,165,233,0.5)'
    ctx.shadowBlur  = 28
    ctx.fillStyle   = 'rgba(14,165,233,0.22)'
    ctx.fill()
    ctx.shadowBlur = 0
  })

  /* ── PASS 2: Land fill — dark blue-navy ── */
  GEO.forEach(poly => {
    if (poly.length < 3) return
    ctx.beginPath()
    poly.forEach(([lat,lng],i) => {
      const p=toPixel(lat,lng,W,H)
      i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y)
    })
    ctx.closePath()
    ctx.fillStyle = 'rgba(8,20,50,0.88)'
    ctx.fill()
  })

  /* ── PASS 3: Crisp glowing outline ── */
  GEO.forEach(poly => {
    if (poly.length < 3) return
    ctx.beginPath()
    poly.forEach(([lat,lng],i) => {
      const p=toPixel(lat,lng,W,H)
      i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y)
    })
    ctx.closePath()
    ctx.strokeStyle = 'rgba(56,189,248,0.82)'
    ctx.lineWidth   = 2.8
    ctx.lineJoin    = 'round'
    ctx.stroke()
  })

  /* ── Edge vignette ── */
  const vign = ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,W*0.6)
  vign.addColorStop(0, 'transparent')
  vign.addColorStop(1, 'rgba(1,6,9,0.7)')
  ctx.fillStyle = vign
  ctx.fillRect(0,0,W,H)

  return c
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBE 3D — with hoveredId reactivity via ref
═══════════════════════════════════════════════════════════════════════════ */
function Globe3D({ mapCanvas, visible, hoveredId, onHover }: {
  mapCanvas: HTMLCanvasElement|null
  visible: boolean
  hoveredId: number|null
  onHover: (comp: Comp|null, x: number, y: number) => void
}) {
  const mountRef    = useRef<HTMLDivElement>(null)
  // Bridge React state → RAF loop without causing re-renders
  const hoveredIdRef = useRef<number|null>(hoveredId)
  useEffect(() => { hoveredIdRef.current = hoveredId }, [hoveredId])

  useEffect(()=>{
    const mount=mountRef.current
    if(!mount||!mapCanvas) return
    const W=mount.clientWidth, H=mount.clientHeight

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setSize(W,H)
    renderer.setClearColor(0x000000,0)
    mount.appendChild(renderer.domElement)

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(40,W/H,0.1,1000)
    camera.position.z=5.2

    // Stars
    const starGeo=new THREE.BufferGeometry()
    const starPos:number[]=[]
    for(let i=0;i<3000;i++){
      const theta=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1)
      const r=40+Math.random()*60
      starPos.push(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta))
    }
    starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xffffff,size:0.12,transparent:true,opacity:0.5})))

    // Lights
    scene.add(new THREE.AmbientLight(0x1a2a4a,0.8))
    const sun=new THREE.DirectionalLight(0x4fc3f7,2.4)
    sun.position.set(5,3,5); scene.add(sun)
    const rim=new THREE.DirectionalLight(0x0ea5e9,0.6)
    rim.position.set(-6,-4,-4); scene.add(rim)

    const earth=new THREE.Group()
    scene.add(earth)
    const R=2

    // Globe texture
    const tex=new THREE.CanvasTexture(mapCanvas)
    tex.anisotropy=renderer.capabilities.getMaxAnisotropy()
    earth.add(new THREE.Mesh(
      new THREE.SphereGeometry(R,128,128),
      new THREE.MeshPhongMaterial({map:tex,shininess:30,specular:new THREE.Color(0x0a2040)})
    ))

    // Atmosphere layers
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R+0.08,64,64),
      new THREE.MeshPhongMaterial({color:0x0284c7,transparent:true,opacity:0.06,side:THREE.BackSide})))
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(R+0.22,64,64),
      new THREE.MeshPhongMaterial({color:0x38bdf8,transparent:true,opacity:0.03,side:THREE.BackSide})))

    // Competition dots + rings — store alongside their comp data
    interface DotData { dot: THREE.Mesh; ring: THREE.Mesh; outerRing: THREE.Mesh; comp: Comp }
    const dotData: DotData[] = []

    COMPS.forEach(comp=>{
      const pos=toSphere(comp.lat,comp.lng,R+0.05)
      const col=new THREE.Color(TC[comp.type])

      // Outer pulse ring
      const outerRing=new THREE.Mesh(
        new THREE.SphereGeometry(0.09,10,10),
        new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.12})
      )
      outerRing.position.copy(pos); earth.add(outerRing)

      // Inner ring
      const ring=new THREE.Mesh(
        new THREE.SphereGeometry(0.055,10,10),
        new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.25})
      )
      ring.position.copy(pos); earth.add(ring)

      // Core dot
      const dot=new THREE.Mesh(
        new THREE.SphereGeometry(0.028,10,10),
        new THREE.MeshBasicMaterial({color:col})
      )
      dot.position.copy(pos); dot.userData={comp}; earth.add(dot)
      dotData.push({dot, ring, outerRing, comp})
    })

    // Invisible sphere for grab detection
    const hitSphere=new THREE.Mesh(
      new THREE.SphereGeometry(R+0.1,32,32),
      new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false})
    )
    scene.add(hitSphere)

    // Raycaster
    const ray=new THREE.Raycaster()
    const mouse=new THREE.Vector2(-999,-999)
    let overGlobe=false

    const onMouseMove=(e:MouseEvent)=>{
      const rect=mount.getBoundingClientRect()
      mouse.x=((e.clientX-rect.left)/rect.width)*2-1
      mouse.y=-((e.clientY-rect.top)/rect.height)*2+1
      ray.setFromCamera(mouse,camera)
      overGlobe=ray.intersectObject(hitSphere).length>0
      if(!dragging) mount.style.cursor=overGlobe?'grab':'default'
      const dotMeshes=dotData.map(d=>d.dot)
      const hits=ray.intersectObjects(dotMeshes)
      if(hits.length>0){
        const comp=hits[0].object.userData.comp as Comp
        onHover(comp,e.clientX,e.clientY)
        mount.style.cursor='pointer'
      } else {
        onHover(null,0,0)
        if(!dragging) mount.style.cursor=overGlobe?'grab':'default'
      }
    }
    mount.addEventListener('mousemove',onMouseMove)

    // Inertia drag
    let dragging=false
    let velX=0,velY=0,prevX=0,prevY=0,autoSpin=true
    const FRICTION=0.94, AUTO_SPIN=0.0008

    const onDown=(e:MouseEvent)=>{
      ray.setFromCamera(mouse,camera)
      if(!ray.intersectObject(hitSphere).length) return
      dragging=true; autoSpin=false
      velX=0; velY=0
      prevX=e.clientX; prevY=e.clientY
      mount.style.cursor='grabbing'
    }
    const onUp=()=>{
      dragging=false
      if(overGlobe) mount.style.cursor='grab'
      else mount.style.cursor='default'
      setTimeout(()=>{ autoSpin=true },3000)
    }
    const onDrag=(e:MouseEvent)=>{
      if(!dragging) return
      const dx=e.clientX-prevX, dy=e.clientY-prevY
      velX=dy*0.004; velY=dx*0.004
      earth.rotation.y+=velY
      earth.rotation.x=Math.max(-0.6,Math.min(0.6,earth.rotation.x+velX))
      prevX=e.clientX; prevY=e.clientY
    }
    mount.addEventListener('mousedown',onDown)
    window.addEventListener('mouseup',onUp)
    mount.addEventListener('mousemove',onDrag)

    let raf:number, t=0
    const animate=()=>{
      raf=requestAnimationFrame(animate); t+=0.014
      if(autoSpin){ earth.rotation.y+=AUTO_SPIN }
      else if(!dragging){
        earth.rotation.y+=velY; velY*=FRICTION
        earth.rotation.x=Math.max(-0.6,Math.min(0.6,earth.rotation.x+velX))
        velX*=FRICTION
      }

      // ── Reactive marker animation based on hoveredIdRef ──
      dotData.forEach(({dot, ring, outerRing, comp}, i)=>{
        const isHovered = comp.id === hoveredIdRef.current
        const baseColor = new THREE.Color(TC[comp.type])
        const t2 = t*1.4+i*0.8

        if (isHovered) {
          // Highlighted state: expand rings, glow
          ring.scale.lerp(new THREE.Vector3(2.8,2.8,2.8), 0.12)
          outerRing.scale.lerp(new THREE.Vector3(5,5,5), 0.08)
          ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.55
          ;(outerRing.material as THREE.MeshBasicMaterial).opacity = 0.22
          // Brighten dot
          const brightColor = new THREE.Color('#ffffff').lerp(baseColor, 0.2)
          ;(dot.material as THREE.MeshBasicMaterial).color.lerp(brightColor, 0.12)
          dot.scale.lerp(new THREE.Vector3(2,2,2), 0.12)
        } else {
          // Normal pulsing
          const s=1+0.25*Math.sin(t2)
          ring.scale.lerp(new THREE.Vector3(s,s,s), 0.1)
          outerRing.scale.lerp(new THREE.Vector3(1,1,1), 0.1)
          ;(ring.material as THREE.MeshBasicMaterial).opacity = 0.12+0.12*Math.sin(t2)
          ;(outerRing.material as THREE.MeshBasicMaterial).opacity = 0.06
          ;(dot.material as THREE.MeshBasicMaterial).color.lerp(baseColor, 0.1)
          dot.scale.lerp(new THREE.Vector3(1,1,1), 0.1)
        }
      })

      renderer.render(scene,camera)
    }
    animate()

    const onResize=()=>{
      const w=mount.clientWidth,h=mount.clientHeight
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h)
    }
    window.addEventListener('resize',onResize)

    return ()=>{
      cancelAnimationFrame(raf)
      window.removeEventListener('resize',onResize)
      window.removeEventListener('mouseup',onUp)
      mount.removeEventListener('mousemove',onMouseMove)
      mount.removeEventListener('mousemove',onDrag)
      mount.removeEventListener('mousedown',onDown)
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  },[mapCanvas])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.04)',
        filter: visible ? 'blur(0px)' : 'blur(12px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAP 2D — with hoveredId reactivity
═══════════════════════════════════════════════════════════════════════════ */
function Map2D({ mapCanvas, visible, hoveredId, onHover }: {
  mapCanvas: HTMLCanvasElement|null
  visible: boolean
  hoveredId: number|null
  onHover: (comp: Comp|null, x: number, y: number) => void
}) {
  const containerRef=useRef<HTMLDivElement>(null)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const [dims,setDims]=useState({w:0,h:0})

  useEffect(()=>{
    if(!containerRef.current) return
    const ro=new ResizeObserver(e=>{ const {width,height}=e[0].contentRect; setDims({w:width,h:height}) })
    ro.observe(containerRef.current); return()=>ro.disconnect()
  },[])

  useEffect(()=>{
    if(!canvasRef.current||!mapCanvas||dims.w===0) return
    const ctx=canvasRef.current.getContext('2d')!
    canvasRef.current.width=dims.w; canvasRef.current.height=dims.h
    ctx.drawImage(mapCanvas,0,0,dims.w,dims.h)
  },[mapCanvas,dims])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        filter: visible ? 'blur(0px)' : 'blur(12px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease, filter 0.55s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {dims.w>0 && COMPS.map(comp=>{
        const {x,y}=toPixel(comp.lat,comp.lng,dims.w,dims.h)
        const color=TC[comp.type]
        const isA=hoveredId===comp.id

        return (
          <div
            key={comp.id}
            className="absolute"
            style={{left:x,top:y,transform:'translate(-50%,-50%)',zIndex:10,cursor:'pointer'}}
            onMouseEnter={e=>onHover(comp,e.clientX,e.clientY)}
            onMouseLeave={()=>onHover(null,0,0)}
          >
            {/* Outer animated ring — only when active */}
            <div
              className="absolute rounded-full"
              style={{
                width:  isA ? '44px' : '22px',
                height: isA ? '44px' : '22px',
                top:    isA ? '-22px' : '-11px',
                left:   isA ? '-22px' : '-11px',
                background: `${color}${isA ? '18' : '10'}`,
                border: `1.5px solid ${color}${isA ? '70' : '40'}`,
                animation: 'mapPulse 2s ease-in-out infinite',
                animationDelay: `${comp.id*0.2}s`,
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: isA ? `0 0 20px ${color}40` : 'none',
              }}
            />

            {/* Middle ring */}
            <div
              className="absolute rounded-full"
              style={{
                width:  isA ? '20px' : '12px',
                height: isA ? '20px' : '12px',
                top:    isA ? '-10px' : '-6px',
                left:   isA ? '-10px' : '-6px',
                background: `${color}${isA ? '28' : '18'}`,
                border: `1.5px solid ${color}${isA ? '80' : '50'}`,
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />

            {/* Core dot */}
            <div
              className="relative rounded-full"
              style={{
                width:  isA ? '10px' : '7px',
                height: isA ? '10px' : '7px',
                background: color,
                boxShadow: `0 0 ${isA ? '18px' : '6px'} ${color}`,
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />

            {/* Location label when active */}
            <AnimatePresence>
              {isA && (
                <motion.div
                  initial={{opacity:0,y:6,scale:0.9}}
                  animate={{opacity:1,y:0,scale:1}}
                  exit={{opacity:0,y:4,scale:0.9}}
                  transition={{duration:0.2}}
                  className="absolute whitespace-nowrap px-2 py-1 rounded-sm pointer-events-none"
                  style={{
                    bottom:'calc(100% + 10px)',
                    left:'50%',
                    transform:'translateX(-50%)',
                    background:'rgba(4,6,14,0.95)',
                    border:`1px solid ${color}50`,
                    backdropFilter:'blur(12px)',
                    boxShadow:`0 4px 16px rgba(0,0,0,0.7), 0 0 12px ${color}15`,
                  }}
                >
                  <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:'0.8rem',color:'rgba(241,245,249,0.95)',letterSpacing:'0.04em'}}>
                    {comp.flag} {comp.name}
                  </p>
                  <p style={{fontSize:'0.62rem',color:'rgba(148,163,184,0.6)',marginTop:'1px'}}>{comp.location}</p>
                  {/* Arrow */}
                  <div style={{
                    position:'absolute',bottom:'-5px',left:'50%',transform:'translateX(-50%) rotate(45deg)',
                    width:'8px',height:'8px',
                    background:'rgba(4,6,14,0.95)',
                    borderRight:`1px solid ${color}50`,
                    borderBottom:`1px solid ${color}50`,
                  }}/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse at center, transparent 50%, rgba(2,5,16,0.9) 100%)'}}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW TOGGLE — clean pill in the map corner
═══════════════════════════════════════════════════════════════════════════ */
function ViewToggle({ mode, onToggle }: { mode:'2d'|'3d'; onToggle:()=>void }) {
  return (
    <div
      className="absolute top-3 right-3 z-30 flex items-center p-0.5 rounded-full"
      style={{
        background:'rgba(6,8,15,0.85)',
        border:'1px solid rgba(14,165,233,0.20)',
        backdropFilter:'blur(16px)',
        boxShadow:'0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      {(['2d','3d'] as const).map(m=>{
        const active = mode === m
        return (
          <button
            key={m}
            onClick={()=>{ if (!active) onToggle() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              background: active ? 'rgba(14,165,233,0.20)' : 'transparent',
              border: `1px solid ${active ? 'rgba(14,165,233,0.50)' : 'transparent'}`,
              boxShadow: active ? '0 0 12px rgba(14,165,233,0.20)' : 'none',
              cursor: active ? 'default' : 'pointer',
            }}
          >
            {m==='2d' ? <Map size={13} style={{color: active ? '#38bdf8' : 'rgba(148,163,184,0.45)'}} />
                      : <Globe size={13} style={{color: active ? '#38bdf8' : 'rgba(148,163,184,0.45)'}} />}
            <span style={{
              fontFamily:"'Barlow Condensed',sans-serif",
              fontWeight:700,
              fontSize:'0.7rem',
              letterSpacing:'0.1em',
              textTransform:'uppercase',
              color: active ? 'rgba(241,245,249,0.95)' : 'rgba(148,163,184,0.45)',
              transition:'color 0.2s',
            }}>{m==='2d' ? 'Flat' : '3D'}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPETITION CARD — visual card with bidirectional hover
═══════════════════════════════════════════════════════════════════════════ */
function CompCard({
  comp, isActive, onEnter, onLeave
}: {
  comp: Comp
  isActive: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const color = TC[comp.type]
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display:'flex',
        alignItems:'stretch',
        borderRadius:'6px',
        overflow:'hidden',
        background: isActive ? `${color}10` : 'rgba(255,255,255,0.02)',
        border:`1px solid ${isActive ? color+'45' : 'rgba(255,255,255,0.05)'}`,
        boxShadow: isActive ? `0 0 28px ${color}18, inset 0 0 16px ${color}06` : 'none',
        transform: isActive ? 'translateX(-4px)' : 'translateX(0)',
        transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        cursor:'default',
        flexShrink: 0,
      }}
    >
      {/* Left color bar */}
      <div style={{
        width:'3px',
        background: isActive
          ? `linear-gradient(to bottom, ${color}, ${color}60)`
          : `${color}30`,
        flexShrink:0,
        transition:'background 0.25s',
      }}/>

      {/* Month column */}
      <div style={{
        padding:'10px 11px',
        borderRight:'1px solid rgba(255,255,255,0.04)',
        minWidth:'52px',
        flexShrink:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
      }}>
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:'1.05rem',
          color: isActive ? color : 'rgba(148,163,184,0.45)',
          letterSpacing:'0.06em',
          lineHeight:1.1,
          transition:'color 0.25s',
        }}>{comp.month}</div>
        <div style={{
          fontSize:'0.55rem',
          color:'rgba(148,163,184,0.25)',
          marginTop:'2px',
          letterSpacing:'0.1em',
          fontFamily:"'DM Sans',sans-serif",
        }}>2026</div>
      </div>

      {/* Main info */}
      <div style={{flex:1,padding:'9px 11px',minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'4px'}}>
          <span style={{fontSize:'0.82rem',lineHeight:1}}>{comp.flag}</span>
          <span style={{
            fontFamily:"'Barlow Condensed',sans-serif",
            fontWeight:700,
            fontSize:'0.84rem',
            color: isActive ? 'rgba(241,245,249,1)' : 'rgba(241,245,249,0.72)',
            letterSpacing:'0.04em',
            overflow:'hidden',
            textOverflow:'ellipsis',
            whiteSpace:'nowrap',
            transition:'color 0.25s',
          }}>{comp.name}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'6px'}}>
          <span style={{
            color:'rgba(148,163,184,0.42)',
            fontSize:'0.62rem',
            overflow:'hidden',
            textOverflow:'ellipsis',
            whiteSpace:'nowrap',
            fontFamily:"'DM Sans',sans-serif",
          }}>{comp.location}</span>
          <span style={{
            color: isActive ? color : 'rgba(148,163,184,0.35)',
            fontSize:'0.6rem',
            flexShrink:0,
            fontFamily:"'DM Sans',sans-serif",
            fontWeight:500,
            transition:'color 0.25s',
          }}>{comp.date}</span>
        </div>
      </div>

      {/* Type dot */}
      <div style={{padding:'10px 11px',display:'flex',alignItems:'center'}}>
        <div style={{
          width:'8px',height:'8px',borderRadius:'50%',
          background:color,
          boxShadow: isActive ? `0 0 10px ${color}, 0 0 20px ${color}50` : 'none',
          transition:'box-shadow 0.25s',
          flexShrink:0,
        }}/>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════════════════════ */
export function GlobeSection() {
  const { ref:sectionRef, inView } = useInView(0.1)
  const [mode, setMode]           = useState<'2d'|'3d'>('3d')
  const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement|null>(null)

  // ── Shared hover state — bidirectional list ↔ map ──
  const [hoveredId, setHoveredId] = useState<number|null>(null)
  const [tipPos,    setTipPos]    = useState({x:0,y:0})
  const [showTip,   setShowTip]   = useState(false)

  useEffect(()=>{ setMapCanvas(buildMapCanvas()) },[])

  // Inject CSS for map pulse animation
  useEffect(()=>{
    if(document.getElementById('globe-css')) return
    const s=document.createElement('style'); s.id='globe-css'
    s.textContent=`@keyframes mapPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.6);opacity:.12}}`
    document.head.appendChild(s)
  },[])

  // Hover from map/globe (with tooltip)
  const handleMapHover = useCallback((comp:Comp|null, x:number, y:number)=>{
    setHoveredId(comp?.id ?? null)
    setShowTip(comp !== null)
    if(comp) setTipPos({x,y})
  },[])

  // Hover from list (no tooltip — user knows where they are)
  const handleListEnter = useCallback((id:number)=>{
    setHoveredId(id)
    setShowTip(false)
  },[])
  const handleListLeave = useCallback(()=>{
    setHoveredId(null)
    setShowTip(false)
  },[])

  const hoveredComp = COMPS.find(c=>c.id===hoveredId)

  return (
    <section id="season" ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden" style={{background:'#08090E'}}>
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(14,165,233,0.03) 0%, transparent 70%)'}} />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-14 transition-all duration-700" style={{opacity:inView?1:0,transform:inView?'translateY(0)':'translateY(20px)'}}>
          <SectionHeader label="2026 Season" line1="RACE" line2="CALENDAR" />
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* ── Map / Globe container ── */}
          <div
            className="relative rounded-sm overflow-hidden"
            style={{
              height:520,
              border:'1px solid rgba(14,165,233,0.12)',
              background:'#020510',
              boxShadow:'0 0 80px rgba(14,165,233,0.05), inset 0 0 80px rgba(14,165,233,0.03)',
            }}
          >
            <Map2D    mapCanvas={mapCanvas} visible={mode==='2d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <Globe3D  mapCanvas={mapCanvas} visible={mode==='3d'} hoveredId={hoveredId} onHover={handleMapHover} />
            <ViewToggle mode={mode} onToggle={()=>setMode(m=>m==='2d'?'3d':'2d')} />

            {/* Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none" style={{color:'rgba(148,163,184,0.22)',fontSize:'10px',fontFamily:"'DM Sans',sans-serif",textTransform:'uppercase',letterSpacing:'0.15em',whiteSpace:'nowrap'}}>
              {mode==='3d' ? 'drag to rotate · hover markers' : 'hover markers for details'}
            </div>
          </div>

          {/* ── Competition schedule ── */}
          <div className="flex flex-col gap-0">

            {/* Summary bar */}
            <motion.div
              initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
              transition={{duration:0.4,delay:0.1}}
              className="flex items-center justify-between mb-4"
            >
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.65rem',color:'rgba(148,163,184,0.35)',letterSpacing:'0.2em',textTransform:'uppercase'}}>
                10 events · 9 countries
              </p>
              {/* Legend pills */}
              <div className="flex items-center gap-3">
                {(Object.entries(TC) as [CompType,string][]).map(([type,color])=>(
                  <div key={type} className="flex items-center gap-1.5">
                    <div style={{width:'6px',height:'6px',borderRadius:'50%',background:color,flexShrink:0}}/>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Cards */}
            <div className="flex flex-col gap-1.5">
              {COMPS.map((comp,i)=>(
                <motion.div
                  key={comp.id}
                  initial={{opacity:0,x:20}} animate={inView?{opacity:1,x:0}:{}}
                  transition={{duration:0.4,delay:0.1+i*0.05}}
                >
                  <CompCard
                    comp={comp}
                    isActive={hoveredId===comp.id}
                    onEnter={()=>handleListEnter(comp.id)}
                    onLeave={handleListLeave}
                  />
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <motion.div
              initial={{opacity:0}} animate={inView?{opacity:1}:{}}
              transition={{duration:0.4,delay:0.7}}
              className="mt-5 pt-4 flex flex-wrap gap-x-4 gap-y-1.5"
              style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}
            >
              {(Object.entries(TL) as [CompType,string][]).map(([type,label])=>(
                <div key={type} className="flex items-center gap-1.5">
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:TC[type],flexShrink:0}}/>
                  <span style={{color:'rgba(148,163,184,0.38)',fontSize:'0.62rem',fontFamily:"'DM Sans',sans-serif",letterSpacing:'0.06em'}}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Tooltip — only from map hover ── */}
      <AnimatePresence>
        {showTip && hoveredComp && (
          <div className="fixed z-50 pointer-events-none" style={{left:tipPos.x+16,top:tipPos.y,transform:'translateY(-50%)'}}>
            <motion.div
              initial={{opacity:0,y:4,scale:0.97}}
              animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:4,scale:0.97}}
              transition={{duration:0.15}}
              className="px-4 py-3 rounded-sm"
              style={{
                background:'rgba(4,6,14,0.98)',
                border:`1px solid ${TC[hoveredComp.type]}45`,
                backdropFilter:'blur(20px)',
                minWidth:185,
                boxShadow:`0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${TC[hoveredComp.type]}12`,
              }}
            >
              <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:'0.95rem',color:'rgba(241,245,249,0.95)',letterSpacing:'0.05em'}}>
                {hoveredComp.flag} {hoveredComp.name}
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',color:'rgba(148,163,184,0.62)',marginTop:'3px'}}>
                {hoveredComp.location}
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.7rem',fontWeight:500,color:TC[hoveredComp.type],marginTop:'2px'}}>
                {hoveredComp.date}
              </p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:'0.58rem',color:'rgba(148,163,184,0.3)',marginTop:'3px',textTransform:'uppercase',letterSpacing:'0.1em'}}>
                {TL[hoveredComp.type]}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
