<script setup lang="ts">
/**
 * Ambient gold "luxury dust" for the hero. A self-contained Canvas 2D particle
 * field: slow-drifting gold dots that respond subtly to the cursor (via px/py)
 * for a soft parallax/depth feel. Pure client-side — safe under `nuxt generate`
 * because all canvas work happens in onMounted. Respects prefers-reduced-motion
 * and pauses when the tab is hidden or the hero scrolls out of view.
 */
interface Props {
  /** Normalised pointer position (-1..1), used only to offset particle drift. */
  px?: number
  py?: number
}
const props = withDefaults(defineProps<Props>(), { px: 0, py: 0 })

const GOLD = { r: 175, g: 143, b: 111 } // #af8f6f — the luxury-gold token

const canvas = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number
  y: number
  r: number
  alpha: number
  vx: number
  vy: number
  phase: number
  wobble: number
  depth: number // 0..1, drives parallax strength (nearer = moves more)
}

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let rafId = 0
let running = false
let width = 0
let height = 0
let dpr = 1
let t = 0

let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let reduceMotion = false
let visible = true
let onScreen = true

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const buildParticles = () => {
  // Density scaled by area and capped so it never feels busy.
  const count = Math.min(64, Math.max(18, Math.round((width * height) / 28000)))
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: rand(1.2, 3.6),
    alpha: rand(0.18, 0.6),
    vx: rand(-0.08, 0.08),
    vy: rand(-0.35, -0.12), // gentle upward drift
    phase: rand(0, Math.PI * 2),
    wobble: rand(0.2, 0.7),
    depth: rand(0.3, 1)
  }))
}

const resize = () => {
  const el = canvas.value
  if (!el || !ctx) return
  const rect = el.getBoundingClientRect()
  width = rect.width
  height = rect.height
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.max(1, Math.round(width * dpr))
  el.height = Math.max(1, Math.round(height * dpr))
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildParticles()
}

const draw = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    // Parallax offset — nearer particles shift more with the cursor.
    const ox = props.px * 14 * p.depth
    const oy = props.py * 14 * p.depth
    const wob = Math.sin(t * p.wobble + p.phase) * 6 * p.depth
    ctx.beginPath()
    ctx.arc(p.x + ox + wob, p.y + oy, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${p.alpha})`
    ctx.fill()
  }
}

const step = () => {
  if (!running) return
  t += 0.016
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    // Wrap around edges for a seamless, endless field.
    if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width }
    if (p.x < -4) p.x = width + 4
    else if (p.x > width + 4) p.x = -4
  }
  draw()
  rafId = requestAnimationFrame(step)
}

const shouldRun = () => visible && onScreen && !reduceMotion

const start = () => {
  if (running || !shouldRun()) return
  running = true
  rafId = requestAnimationFrame(step)
}

const stop = () => {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

const onVisibility = () => {
  visible = !document.hidden
  if (shouldRun()) start()
  else stop()
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  ctx = el.getContext('2d')
  if (!ctx) return

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(el)
  } else {
    window.addEventListener('resize', resize)
  }

  document.addEventListener('visibilitychange', onVisibility)

  if ('IntersectionObserver' in window) {
    intersectionObserver = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true
      if (shouldRun()) start()
      else stop()
    })
    intersectionObserver.observe(el)
  }

  if (reduceMotion) {
    // Static frame only — no animation loop.
    draw()
  } else {
    start()
  }
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvas" class="absolute inset-0 w-full h-full" aria-hidden="true" />
</template>
