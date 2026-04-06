<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { NavSection } from '~/composables/useNavigation'

const props = defineProps<{
  sections: NavSection[]
}>()

const emit = defineEmits<{
  navigate: [path: string]
}>()

const route = useRoute()
const containerRef = ref<HTMLElement | null>(null)
const itemEls = ref<Map<string, HTMLElement>>(new Map())

// Flatten sections into a single list with headers
interface FlatItem {
  id: string
  title: string
  path?: string
  badge?: string
  isHeader: boolean
}

const flatItems = computed((): FlatItem[] => {
  const items: FlatItem[] = []
  for (const section of props.sections) {
    items.push({ id: `h-${section.title}`, title: section.title, isHeader: true })
    for (const item of section.items) {
      items.push({ id: item.path, title: item.title, path: item.path, badge: item.badge, isHeader: false })
    }
  }
  return items
})

const selectedPath = computed(() => route.path)

// Position tracking for the SVG line and markers
interface ItemPosition {
  id: string
  x: number
  y: number
  isHeader: boolean
}

const positions = ref<ItemPosition[]>([])
const highlightStyle = ref({ top: '0px', height: '0px', left: '0px', opacity: 0 })
const markerStyle = ref({ top: '0px', left: '0px', opacity: 0 })

function recalcPositions() {
  const container = containerRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const newPositions: ItemPosition[] = []

  for (const item of flatItems.value) {
    const el = itemEls.value.get(item.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const y = rect.top - containerRect.top + rect.height / 2
    const x = item.isHeader ? 10 : 22
    newPositions.push({ id: item.id, x, y, isHeader: item.isHeader })
  }

  positions.value = newPositions
  updateActiveIndicators()
}

function updateActiveIndicators() {
  const activeItem = flatItems.value.find(i => i.path === selectedPath.value)
  if (!activeItem) {
    highlightStyle.value = { ...highlightStyle.value, opacity: 0 }
    markerStyle.value = { ...markerStyle.value, opacity: 0 }
    return
  }

  const el = itemEls.value.get(activeItem.id)
  const pos = positions.value.find(p => p.id === activeItem.id)
  if (!el || !pos) return

  const container = containerRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const rect = el.getBoundingClientRect()

  // Highlight background
  highlightStyle.value = {
    top: `${rect.top - containerRect.top}px`,
    height: `${rect.height}px`,
    left: `${pos.x - 8}px`,
    opacity: 1,
  }

  // Active marker
  markerStyle.value = {
    top: `${pos.y - 5}px`,
    left: `${pos.x - 5}px`,
    opacity: 1,
  }
}

// Generate SVG path
const svgPath = computed(() => {
  const pts = positions.value
  if (pts.length < 2) return ''

  let d = `M ${pts[0].x} ${pts[0].y}`

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const midY = (prev.y + curr.y) / 2

    if (prev.x !== curr.x) {
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
    } else {
      const offset = Math.min(12, (curr.y - prev.y) * 0.2)
      d += ` C ${curr.x} ${prev.y + offset}, ${curr.x} ${curr.y - offset}, ${curr.x} ${curr.y}`
    }
  }

  return d
})

// Gradient stop position based on active marker Y
const gradientStopY = computed(() => {
  const pos = positions.value.find(p => p.id === selectedPath.value)
  if (!pos || positions.value.length < 2) return 50
  const totalH = positions.value[positions.value.length - 1].y - positions.value[0].y
  if (totalH <= 0) return 50
  return ((pos.y - positions.value[0].y) / totalH) * 100
})

function setItemRef(el: Element | null, id: string) {
  if (el instanceof HTMLElement) {
    itemEls.value.set(id, el)
  }
}

function handleClick(item: FlatItem) {
  if (item.badge || !item.path) return
  emit('navigate', item.path)
}

watch(selectedPath, async () => {
  await nextTick()
  recalcPositions()
})

onMounted(async () => {
  await nextTick()
  // Small delay to ensure all elements are rendered
  setTimeout(recalcPositions, 100)

  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    const ro = new ResizeObserver(recalcPositions)
    ro.observe(containerRef.value)
  }
})
</script>

<template>
  <div ref="containerRef" class="relative select-none">

    <!-- Layer 1: Animated background highlight — gradient from accent to transparent -->
    <div
      class="absolute right-0 rounded-ousi-lg pointer-events-none"
      :style="{
        top: highlightStyle.top,
        height: highlightStyle.height,
        left: highlightStyle.left,
        opacity: highlightStyle.opacity,
        background: 'linear-gradient(to right, color-mix(in oklab, var(--ousi-accent) 10%, transparent) 0%, transparent 100%)',
        transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }"
    />

    <!-- Layer 2: SVG curved line -->
    <svg class="absolute top-0 left-0 w-8 h-full pointer-events-none overflow-visible" style="z-index: 1">
      <defs>
        <linearGradient id="timeline-line-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ousi-border)" />
          <stop
            :offset="`${Math.max(0, gradientStopY - 8)}%`"
            stop-color="var(--ousi-border)"
          />
          <stop
            :offset="`${Math.max(0, gradientStopY - 3)}%`"
            stop-color="var(--ousi-accent)"
            stop-opacity="0.6"
          />
          <stop
            :offset="`${gradientStopY}%`"
            stop-color="var(--ousi-accent)"
          />
          <stop
            :offset="`${Math.min(100, gradientStopY + 3)}%`"
            stop-color="var(--ousi-accent)"
            stop-opacity="0.6"
          />
          <stop
            :offset="`${Math.min(100, gradientStopY + 8)}%`"
            stop-color="var(--ousi-border)"
          />
          <stop offset="100%" stop-color="var(--ousi-border)" />
        </linearGradient>
      </defs>
      <path
        :d="svgPath"
        fill="none"
        stroke="url(#timeline-line-gradient)"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>

    <!-- Layer 3: Active glossy marker -->
    <div
      class="absolute pointer-events-none"
      :style="{
        top: markerStyle.top,
        left: markerStyle.left,
        opacity: markerStyle.opacity,
        transition: 'all 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: 4,
      }"
    >
      <div class="relative size-[10px]">
        <!-- Glow ring -->
        <div
          class="absolute -inset-1 rounded-full bg-ousi-accent/20"
          style="filter: blur(3px)"
        />
        <!-- Outer ring -->
        <div class="absolute -inset-0.5 rounded-full bg-ousi-accent/30" />
        <!-- Main dot -->
        <div class="relative size-full rounded-full bg-ousi-accent shadow-sm" />
      </div>
    </div>

    <!-- Layer 4: Items -->
    <div class="relative" style="z-index: 3">
      <template v-for="item in flatItems" :key="item.id">

        <!-- Section header -->
        <div
          v-if="item.isHeader"
          :ref="(el) => setItemRef(el as Element, item.id)"
          class="flex items-center py-2.5"
        >
          <div class="w-5 flex justify-center shrink-0">
            <div class="size-[6px] rounded-full bg-ousi-border" />
          </div>
          <span class="ml-2 text-xs font-semibold uppercase tracking-wider text-ousi-foreground">
            {{ item.title }}
          </span>
        </div>

        <!-- Navigation item -->
        <div
          v-else
          :ref="(el) => setItemRef(el as Element, item.id)"
          :class="[
            'flex items-center py-1.5 ml-3 cursor-pointer group',
            item.badge ? 'opacity-40 cursor-not-allowed' : '',
          ]"
          @click="handleClick(item)"
        >
          <div class="w-5 flex justify-center shrink-0">
            <div
              :class="[
                'size-[5px] rounded-full transition-colors duration-200',
                selectedPath === item.path ? 'bg-ousi-accent' : 'bg-ousi-border group-hover:bg-ousi-muted',
              ]"
            />
          </div>
          <span
            :class="[
              'ml-2 text-[13px] transition-colors duration-150',
              selectedPath === item.path
                ? 'text-ousi-accent font-medium'
                : 'text-ousi-muted group-hover:text-ousi-foreground',
            ]"
          >
            {{ item.title }}
          </span>
          <span
            v-if="item.badge"
            class="ml-auto text-[9px] rounded-full bg-ousi-default px-1.5 py-0.5 text-ousi-muted"
          >
            {{ item.badge }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
