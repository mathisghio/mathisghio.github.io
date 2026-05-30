"use client"

import { useEffect, useRef } from "react"
import {
  Scene, OrthographicCamera, WebGLRenderer, Color,
  BufferAttribute, BufferGeometry, RawShaderMaterial, DoubleSide, Mesh, Material,
} from "three"
import type { Mesh as ThreeMesh, Scene as ThreeScene, OrthographicCamera as ThreeOrtho, WebGLRenderer as ThreeRenderer } from "three"

interface WebGLShaderProps {
  xScale?: number
  yScale?: number
  distortion?: number
  speed?: number
  opacity?: number
  yOffset?: number
}

export function WebGLShader({
  xScale = 1.0,
  yScale = 0.5,
  distortion = 0.05,
  speed = 0.01,
  opacity = 1,
  yOffset = 0.0,
}: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: ThreeScene | null
    camera: ThreeOrtho | null
    renderer: ThreeRenderer | null
    mesh: ThreeMesh | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const testCanvas = document.createElement('canvas')
    if (!testCanvas.getContext('webgl2') && !testCanvas.getContext('webgl')) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float yOffset;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        p.y -= yOffset;

        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

    const getSize = () => ({
      width: container.clientWidth,
      height: container.clientHeight,
    })

    const initScene = () => {
      refs.scene = new Scene()
      refs.renderer = new WebGLRenderer({ canvas, alpha: false })
      refs.renderer.setPixelRatio(1)
      refs.renderer.setClearColor(new Color(0x000000))

      refs.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1)

      const { width, height } = getSize()
      refs.uniforms = {
        resolution: { value: [width, height] },
        time: { value: 0.0 },
        xScale: { value: xScale },
        yScale: { value: yScale },
        distortion: { value: distortion },
        yOffset: { value: yOffset },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new BufferAttribute(new Float32Array(position), 3)
      const geometry = new BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: DoubleSide,
      })

      refs.mesh = new Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    /* ─── RAF loop — ne tourne QUE si le composant est dans le viewport ─── */
    let running = false

    const animate = () => {
      if (!running) return
      if (refs.uniforms) refs.uniforms.time.value += speed
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const { width, height } = getSize()
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    try {
      initScene()
    } catch {
      return
    }

    /* IntersectionObserver : démarre / stoppe le RAF selon la visibilité */
    const visObs = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running) animate()
      },
      { threshold: 0 }
    )
    visObs.observe(container)

    const ro = new ResizeObserver(handleResize)
    ro.observe(container)

    return () => {
      running = false
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      visObs.disconnect()
      ro.disconnect()
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  )
}
