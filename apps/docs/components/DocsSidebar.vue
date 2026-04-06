<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSpring, motion } from 'motion-v'

const route = useRoute()
const router = useRouter()

const sidebarSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction', path: '/docs/introduction' },
      { id: 'installation', label: 'Installation', path: '/docs/installation' },
      { id: 'theming', label: 'Theming', path: '/docs/theming' },
    ]
  },
  {
    id: 'components',
    title: 'Components',
    items: [
      { id: 'button', label: 'Button', path: '/docs/components/button' },
      { id: 'badge', label: 'Badge', path: '/docs/components/badge' },
      { id: 'avatar', label: 'Avatar', path: '/docs/components/avatar' },
      { id: 'input', label: 'Input', path: '/docs/components/input' },
      { id: 'card', label: 'Card', path: '/docs/components/card' },
      { id: 'tooltip', label: 'Tooltip', path: '/docs/components/tooltip' },
      { id: 'select', label: 'Select', path: '/docs/components/select' },
      { id: 'dialog', label: 'Dialog', path: '/docs/components/dialog' },
      { id: 'dropdown', label: 'Dropdown', path: '/docs/components/dropdown' },
      { id: 'tabs', label: 'Tabs', path: '/docs/components/tabs' },
      { id: 'toast', label: 'Toast', path: '/docs/components/toast' },
    ]
  }
]

// DOM refs
const containerRef = ref<HTMLDivElement | null>(null)
const itemRefs = ref(new Map<string, HTMLDivElement>())
const positions = ref<{ id: string; y: number; x: number; isSection: boolean }[]>([])
const mousePos = ref({ x: 0, y: 0 })

// ID activo desde la ruta
const activeId = computed(() => {
  for (const section of sidebarSections) {
    const item = section.items.find(i => i.path === route.path)
    if (item) return item.id
  }
  return sidebarSections[0]?.items[0]?.id ?? ''
})

// Springs — misma config que el original de V0
const highlightY   = useSpring(0, { stiffness: 280, damping: 22, mass: 0.9 })
const markerY      = useSpring(0, { stiffness: 180, damping: 20, mass: 0.8 })
const markerX      = useSpring(28, { stiffness: 180, damping: 20, mass: 0.8 })
const markerScaleX = useSpring(1,  { stiffness: 400, damping: 15, mass: 0.5 })
const markerScaleY = useSpring(1,  { stiffness: 400, damping: 15, mass: 0.5 })
const gradientY    = useSpring(0,  { stiffness: 200, damping: 25, mass: 1 })

// Posiciones actuales animadas (para el SVG)
const animatedGradientY = ref(0)
const totalPathHeight = computed(() =>
  positions.value[positions.value.length - 1]?.y || 1
)

// Suscribirse al spring del gradiente para actualizar el SVG reactivamente
gradientY.on('change', (v: number) => { animatedGradientY.value = v })

// Calcular posiciones de DOM
async function calculatePositions() {
  await nextTick()
  const container = containerRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const newPositions: typeof positions.value = []

  for (const section of sidebarSections) {
    const sectionEl = itemRefs.value.get(`section-${section.id}`)
    if (sectionEl) {
      const rect = sectionEl.getBoundingClientRect()
      newPositions.push({
        id: `section-${section.id}`,
        y: rect.top - containerRect.top + rect.height / 2,
        x: 12,
        isSection: true,
      })
    }
    for (const item of section.items) {
      const el = itemRefs.value.get(item.id)
      if (el) {
        const rect = el.getBoundingClientRect()
        newPositions.push({
          id: item.id,
          y: rect.top - containerRect.top + rect.height / 2,
          x: 28,
          isSection: false,
        })
      }
    }
  }

  positions.value = newPositions
}

// Actualizar springs al cambiar ítem activo
watch([activeId, positions], () => {
  const pos = positions.value.find(p => p.id === activeId.value)
  if (!pos) return

  highlightY.set(pos.y)
  gradientY.set(pos.y)
  markerY.set(pos.y)
  markerX.set(pos.x)

  // Squash/stretch
  markerScaleY.set(0.97)
  markerScaleX.set(1.01)
  setTimeout(() => { markerScaleY.set(1.02); markerScaleX.set(0.99) }, 80)
  setTimeout(() => { markerScaleY.set(1); markerScaleX.set(1) }, 180)
}, { immediate: true })

// Generar path SVG curvo con indentación
function generatePath() {
  if (positions.value.length < 2) return ''
  let path = `M ${positions.value[0].x} ${positions.value[0].y}`
  for (let i = 1; i < positions.value.length; i++) {
    const prev = positions.value[i - 1]
    const curr = positions.value[i]
    const midY = (prev.y + curr.y) / 2
    if (prev.x !== curr.x) {
      path += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
    } else {
      const offset = Math.min(15, (curr.y - prev.y) * 0.25)
      path += ` C ${curr.x} ${prev.y + offset}, ${curr.x} ${curr.y - offset}, ${curr.x} ${curr.y}`
    }
  }
  return path
}

// Puntos del gradiente calculados dinámicamente
const gradientStops = computed(() => {
  const h = totalPathHeight.value
  const y = animatedGradientY.value
  return {
    fadeStart: `${Math.max(0, ((y - 60) / h) * 100)}%`,
    accentStart: `${Math.max(0, ((y - 20) / h) * 100)}%`,
    accentPeak: `${Math.max(0, ((y + 2) / h) * 100)}%`,
    fadeEnd: `${Math.min(100, ((y + 12) / h) * 100)}%`,
  }
})

function handleMouseMove(e: MouseEvent) {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

onMounted(() => {
  calculatePositions()
  window.addEventListener('resize', calculatePositions)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePositions)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="relative py-6 pr-4" ref="containerRef">

    <!-- Layer 1: Highlight de fondo -->
    <motion.div
      class="absolute rounded-xl bg-ousi-surface-secondary pointer-events-none"
      :style="{
        top: highlightY,
        left: '-8px',
        right: 0,
        height: '38px',
        translateY: '-50%',
        zIndex: 1,
      }"
    />

    <!-- Layer 2: SVG línea con gradiente dinámico -->
    <svg
      class="absolute top-0 left-0 w-10 h-full pointer-events-none"
      style="overflow: visible; z-index: 2"
    >
      <defs>
        <linearGradient id="ousi-sidebar-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ousi-border)" />
          <stop :offset="gradientStops.fadeStart" stop-color="var(--ousi-border)" />
          <stop :offset="gradientStops.accentStart" stop-color="var(--ousi-accent)" stop-opacity="0.6" />
          <stop :offset="gradientStops.accentPeak" stop-color="var(--ousi-accent)" />
          <stop :offset="gradientStops.fadeEnd" stop-color="var(--ousi-border)" />
          <stop offset="100%" stop-color="var(--ousi-border)" />
        </linearGradient>
      </defs>
      <path
        :d="generatePath()"
        fill="none"
        stroke="url(#ousi-sidebar-gradient)"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>

    <!-- Layer 3: Ítems de navegación -->
    <div class="space-y-0 relative" style="z-index: 3">
      <template v-for="section in sidebarSections" :key="section.id">

        <!-- Header de sección -->
        <div
          :ref="(el) => { if (el) itemRefs.set(`section-${section.id}`, el as HTMLDivElement) }"
          class="flex items-center py-3"
        >
          <div class="w-6 flex justify-center shrink-0">
            <div class="w-2 h-2 rounded-full bg-ousi-border" />
          </div>
          <span class="text-xs font-semibold text-ousi-foreground uppercase tracking-wider ml-4">
            {{ section.title }}
          </span>
        </div>

        <!-- Ítems -->
        <div
          v-for="item in section.items"
          :key="item.id"
          :ref="(el) => { if (el) itemRefs.set(item.id, el as HTMLDivElement) }"
          class="flex items-center py-2 cursor-pointer ml-4"
          @click="router.push(item.path)"
        >
          <div class="w-6 flex justify-center shrink-0">
            <div
              class="w-1.5 h-1.5 rounded-full transition-opacity duration-150"
              :class="activeId === item.id ? 'opacity-0' : 'bg-ousi-border'"
            />
          </div>
          <div class="flex-1 px-3 py-1">
            <span
              class="text-sm transition-colors duration-150 select-none"
              :class="activeId === item.id
                ? 'text-ousi-foreground font-medium'
                : 'text-ousi-muted hover:text-ousi-foreground'"
            >
              {{ item.label }}
            </span>
          </div>
        </div>

      </template>
    </div>

    <!-- Layer 4: Marcador activo flotante glossy con accent color -->
    <motion.div
      class="absolute pointer-events-none"
      :style="{
        left: markerX,
        top: markerY,
        translateX: '-50%',
        translateY: '-50%',
        scaleX: markerScaleX,
        scaleY: markerScaleY,
        zIndex: 4,
      }"
    >
      <div class="relative w-3 h-3">
        <!-- Glow exterior -->
        <div
          class="absolute rounded-full"
          style="inset: -4px; opacity: 0.35; filter: blur(8px); background: var(--ousi-accent); transform: translateY(3px)"
        />
        <!-- Ring halo -->
        <div
          class="absolute rounded-full opacity-50"
          style="inset: -3px; background: radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--ousi-accent) 40%, white) 0%, var(--ousi-accent) 60%, transparent 100%)"
        />
        <!-- Dot principal glossy -->
        <div
          class="absolute inset-0 rounded-full"
          style="
            background: linear-gradient(155deg,
              color-mix(in oklab, var(--ousi-accent) 50%, white) 0%,
              var(--ousi-accent) 40%,
              color-mix(in oklab, var(--ousi-accent) 80%, black) 100%
            );
            box-shadow: inset 0 1.5px 2px rgba(255,255,255,0.45), inset 0 -1px 2px rgba(0,0,0,0.2)
          "
        >
          <!-- Specular highlight -->
          <div
            class="absolute rounded-full"
            style="top: 2px; left: 2px; width: 4px; height: 2px; background: rgba(255,255,255,0.7)"
          />
        </div>
      </div>
    </motion.div>

  </div>
</template>
