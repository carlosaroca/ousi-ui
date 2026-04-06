<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface TocItem {
  id: string
  label: string
}

const props = defineProps<{
  items: TocItem[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemEls = ref<Map<string, HTMLElement>>(new Map())

// Active section tracked via IntersectionObserver
const activeId = ref(props.items[0]?.id ?? '')

// Positions for SVG line + indicators
interface ItemPos {
  id: string
  x: number
  y: number
}

const positions = ref<ItemPos[]>([])
const highlightStyle = ref({ top: '0px', height: '0px', opacity: 0 })
const markerStyle = ref({ top: '0px', opacity: 0 })

function recalcPositions() {
  const container = containerRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const newPositions: ItemPos[] = []

  for (const item of props.items) {
    const el = itemEls.value.get(item.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const y = rect.top - containerRect.top + rect.height / 2
    newPositions.push({ id: item.id, x: 8, y })
  }

  positions.value = newPositions
  updateIndicators()
}

function updateIndicators() {
  const pos = positions.value.find(p => p.id === activeId.value)
  const el = itemEls.value.get(activeId.value)
  if (!pos || !el || !containerRef.value) {
    highlightStyle.value = { ...highlightStyle.value, opacity: 0 }
    markerStyle.value = { ...markerStyle.value, opacity: 0 }
    return
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const rect = el.getBoundingClientRect()

  highlightStyle.value = {
    top: `${rect.top - containerRect.top}px`,
    height: `${rect.height}px`,
    opacity: 1,
  }

  markerStyle.value = {
    top: `${pos.y - 4}px`,
    opacity: 1,
  }
}

// SVG path — simple vertical line with slight curves
const svgPath = computed(() => {
  const pts = positions.value
  if (pts.length < 2) return ''

  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const offset = Math.min(10, (curr.y - prev.y) * 0.15)
    d += ` C ${curr.x} ${prev.y + offset}, ${curr.x} ${curr.y - offset}, ${curr.x} ${curr.y}`
  }
  return d
})

// Gradient stop for the accent color on the line
const gradientStopY = computed(() => {
  const pos = positions.value.find(p => p.id === activeId.value)
  if (!pos || positions.value.length < 2) return 50
  const first = positions.value[0].y
  const last = positions.value[positions.value.length - 1].y
  const totalH = last - first
  if (totalH <= 0) return 50
  return ((pos.y - first) / totalH) * 100
})

function setItemRef(el: Element | null, id: string) {
  if (el instanceof HTMLElement) {
    itemEls.value.set(id, el)
  }
}

// IntersectionObserver to track which section is visible
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (typeof IntersectionObserver === 'undefined') return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
  )

  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
}

watch(activeId, async () => {
  await nextTick()
  recalcPositions()
})

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    recalcPositions()
    setupObserver()
  }, 150)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="relative select-none">

    <!-- Layer 1: Highlight — gradient from accent to transparent -->
    <div
      class="absolute left-0 right-0 rounded-ousi-lg pointer-events-none"
      :style="{
        top: highlightStyle.top,
        height: highlightStyle.height,
        opacity: highlightStyle.opacity,
        background: 'linear-gradient(to right, color-mix(in oklab, var(--ousi-accent) 10%, transparent) 0%, transparent 100%)',
        transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }"
    />

    <!-- Layer 2: SVG line -->
    <svg class="absolute top-0 left-0 w-4 h-full pointer-events-none overflow-visible" style="z-index: 1">
      <defs>
        <linearGradient id="toc-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ousi-border)" />
          <stop
            :offset="`${Math.max(0, gradientStopY - 10)}%`"
            stop-color="var(--ousi-border)"
          />
          <stop
            :offset="`${Math.max(0, gradientStopY - 3)}%`"
            stop-color="var(--ousi-accent)"
            stop-opacity="0.5"
          />
          <stop
            :offset="`${gradientStopY}%`"
            stop-color="var(--ousi-accent)"
          />
          <stop
            :offset="`${Math.min(100, gradientStopY + 3)}%`"
            stop-color="var(--ousi-accent)"
            stop-opacity="0.5"
          />
          <stop
            :offset="`${Math.min(100, gradientStopY + 10)}%`"
            stop-color="var(--ousi-border)"
          />
          <stop offset="100%" stop-color="var(--ousi-border)" />
        </linearGradient>
      </defs>
      <path
        :d="svgPath"
        fill="none"
        stroke="url(#toc-line-gradient)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>

    <!-- Layer 3: Active marker dot -->
    <div
      class="absolute pointer-events-none"
      :style="{
        top: markerStyle.top,
        left: '4px',
        opacity: markerStyle.opacity,
        transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 4,
      }"
    >
      <div class="relative size-2">
        <div class="absolute -inset-1 rounded-full bg-ousi-accent/20" style="filter: blur(2px)" />
        <div class="relative size-full rounded-full bg-ousi-accent" />
      </div>
    </div>

    <!-- Layer 4: Items -->
    <div class="relative" style="z-index: 3">
      <a
        v-for="item in items"
        :key="item.id"
        :ref="(el) => setItemRef(el as Element, item.id)"
        :href="`#${item.id}`"
        :class="[
          'flex items-center py-1.5 pl-5 pr-2 text-[13px] transition-colors duration-150',
          activeId === item.id
            ? 'text-ousi-accent font-medium'
            : 'text-ousi-muted hover:text-ousi-foreground',
        ]"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>
