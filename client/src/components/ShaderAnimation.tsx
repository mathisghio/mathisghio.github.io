'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const testCanvas = document.createElement('canvas')
    if (!testCanvas.getContext('webgl2') && !testCanvas.getContext('webgl')) return
    const container = containerRef.current
    const vertexShader = `void main() { gl_Position = vec4( position, 1.0 ); }`
    const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  float random(float x) {
    return fract(sin(x) * 1e4);
  }
  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time*0.12+random(uv.x)*0.4;
    float lineWidth = 0.003;
    float r = 0.0; float g = 0.0; float b = 0.0;
    for(int i=0; i < 5; i++){
      float w = lineWidth*float(i*i);
      float fi = float(i)*0.01;
      r += w / abs(fract(t + fi)*0.4 - length(uv));
      g += w / abs(fract(t - 0.01 + fi)*0.4 - length(uv));
      b += w / abs(fract(t - 0.02 + fi)*0.4 - length(uv));
    }
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`
    const camera = new THREE.Camera()
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = { time: { value: 1.0 }, resolution: { value: new THREE.Vector2() } }
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(1)
    container.appendChild(renderer.domElement)
    const onWindowResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }
    onWindowResize()
    window.addEventListener('resize', onWindowResize, false)
    let rafId = 0
    let running = false

const animate = () => {
  if (!running) return
  rafId = requestAnimationFrame(animate)
  uniforms.time.value += 0.05 
  renderer.render(scene, camera)
}

const observer = new IntersectionObserver(
  ([entry]) => {
    running = entry.isIntersecting
    if (running) animate()
  },
  { threshold: 0 }
)
observer.observe(container)    
    return () => {
      window.removeEventListener('resize', onWindowResize)
      observer.disconnect()
      cancelAnimationFrame(rafId)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" style={{ background: '#000', overflow: 'hidden' }} />
}
