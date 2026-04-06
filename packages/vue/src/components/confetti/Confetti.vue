<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { cn } from '@ousi-ui/core'
import type { ConfettiProps } from './confetti.types'
import { confettiTheme } from './confetti.theme'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  opacity: number
  shape: 'rect' | 'circle'
}

const props = withDefaults(defineProps<ConfettiProps>(), {
  particleCount: 80,
  spread: 70,
  duration: 3000,
  colors: () => ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#ec4899', '#a855f7'],
})

const emit = defineEmits<{
  complete: []
}>()

const particles = ref<Particle[]>([])
const isActive = ref(false)

let rafId: number | null = null
let startTime = 0

function fire() {
  // Reset
  cleanup()

  const spreadRad = (props.spread * Math.PI) / 180
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight * 0.5

  const newParticles: Particle[] = []

  for (let i = 0; i < props.particleCount; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * spreadRad
    const velocity = 8 + Math.random() * 8
    const color = props.colors[Math.floor(Math.random() * props.colors.length)]

    newParticles.push({
      x: centerX + (Math.random() - 0.5) * 20,
      y: centerY,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      color,
      size: 4 + Math.random() * 6,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    })
  }

  particles.value = newParticles
  isActive.value = true
  startTime = performance.now()
  rafId = requestAnimationFrame(tick)
}

function tick(now: number) {
  const elapsed = now - startTime
  const progress = elapsed / props.duration

  if (progress >= 1) {
    cleanup()
    emit('complete')
    return
  }

  const updated = particles.value.map((p) => {
    const np = { ...p }
    np.x += np.vx
    np.y += np.vy
    np.vy += 0.15 // gravity
    np.vx *= 0.99 // air resistance
    np.rotation += np.rotationSpeed

    // Fade out in the last 30% of the duration
    if (progress > 0.7) {
      np.opacity = Math.max(0, 1 - (progress - 0.7) / 0.3)
    }

    return np
  })

  particles.value = updated
  rafId = requestAnimationFrame(tick)
}

function cleanup() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  particles.value = []
  isActive.value = false
}

function particleStyle(p: Particle) {
  const style: Record<string, string> = {
    position: 'absolute',
    left: `${p.x}px`,
    top: `${p.y}px`,
    width: p.shape === 'rect' ? '6px' : `${p.size}px`,
    height: p.shape === 'rect' ? '10px' : `${p.size}px`,
    backgroundColor: p.color,
    opacity: String(p.opacity),
    transform: `rotate(${p.rotation}deg)`,
    borderRadius: p.shape === 'circle' ? '50%' : '2px',
    pointerEvents: 'none',
  }
  return style
}

defineExpose({ fire })

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isActive" :class="cn(confettiTheme, props.class)">
      <div
        v-for="(p, i) in particles"
        :key="i"
        :style="particleStyle(p)"
      />
    </div>
  </Teleport>
</template>
