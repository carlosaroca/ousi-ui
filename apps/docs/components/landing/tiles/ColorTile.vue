<script setup lang="ts">
import { computed } from 'vue'
import { OColorArea, OColorSlider, OColorSwatch } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

// Hue glides between five colors; the point in the area drifts on its own beat.
const palette = [225, 14, 155, 268, 44]
const STEP = 2.4

const hue = computed(() => {
  const i = Math.floor(t.value / STEP)
  const phase = (t.value % STEP) / STEP
  const k = Math.min(1, Math.max(0, (phase - 0.55) / 0.35))
  const ease = k * k * (3 - 2 * k)
  const from = palette[i % palette.length]
  const to = palette[(i + 1) % palette.length]
  return Math.round(from + (to - from) * ease)
})
const point = computed(() => ({ x: Math.round(68 + 22 * Math.sin(t.value * 0.9)), y: Math.round(72 + 18 * Math.cos(t.value * 0.7)) }))

// Saturation and value of the area, as the hex the swatch shows.
const color = computed(() => {
  const s = point.value.x / 100
  const v = point.value.y / 100
  const f = (n: number) => {
    const k = (n + hue.value / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  const hex = [f(5), f(3), f(1)].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')
  return `#${hex.toUpperCase()}`
})
</script>

<template>
  <ShowcaseTile>
    <!-- OColorArea caps itself at max-w-56 (224px) and is square; here it fills the tile and is a wide strip. -->
    <OColorArea :model-value="point" :hue="hue" class="h-[116px] w-full max-w-none" />
    <OColorSlider channel="hue" :model-value="hue" class="mt-3.5" />
    <div class="mt-3.5 flex items-center gap-2.5">
      <OColorSwatch :color="color" shape="circle" size="md" />
      <span class="font-mono text-xs font-medium text-ousi-foreground">{{ color }}</span>
    </div>
  </ShowcaseTile>
</template>
