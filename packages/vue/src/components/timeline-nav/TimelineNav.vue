<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import type { TimelineNavProps, TimelineNavEmits } from './timeline-nav.types'

const props = withDefaults(defineProps<TimelineNavProps>(), {})
const emit = defineEmits<TimelineNavEmits>()

const gradientId = `tl-grad-${useId()}`

const activeKey = useControllableState<string>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? props.sections[0]?.items[0]?.key ?? '',
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('select', val)
  },
})

// Flatten sections
interface FlatItem {
  id: string
  label: string
  key?: string
  badge?: string
  isHeader: boolean
}

const flatItems = computed((): FlatItem[] => {
  const items: FlatItem[] = []
  for (const section of props.sections) {
    items.push({ id: `h-${section.title}`, label: section.title, isHeader: true })
    for (const item of section.items) {
      items.push({ id: item.key, label: item.label, key: item.key, badge: item.badge, isHeader: false })
    }
  }
  return items
})

// DOM refs
const containerRef = ref<HTMLElement | null>(null)
const itemEls = ref<Map<string, HTMLElement>>(new Map())

// Position tracking
interface ItemPosition { id: string; x: number; y: number; isHeader: boolean }
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
    newPositions.push({
      id: item.id,
      x: item.isHeader ? 10 : 22,
      y: rect.top - containerRect.top + rect.height / 2,
      isHeader: item.isHeader,
    })
  }
  positions.value = newPositions
  updateIndicators()
}

function updateIndicators() {
  const activeItem = flatItems.value.find(i => i.key === activeKey.value)
  if (!activeItem) {
    highlightStyle.value = { ...highlightStyle.value, opacity: 0 }
    markerStyle.value = { ...markerStyle.value, opacity: 0 }
    return
  }
  const el = itemEls.value.get(activeItem.id)
  const pos = positions.value.find(p => p.id === activeItem.id)
  const container = containerRef.value
  if (!el || !pos || !container) return
  const containerRect = container.getBoundingClientRect()
  const rect = el.getBoundingClientRect()

  highlightStyle.value = {
    top: `${rect.top - containerRect.top}px`,
    height: `${rect.height}px`,
    left: `${pos.x - 8}px`,
    opacity: 1,
  }
  markerStyle.value = {
    top: `${pos.y - 5}px`,
    left: `${pos.x - 5}px`,
    opacity: 1,
  }
}

// SVG path
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

const gradientStopY = computed(() => {
  const pos = positions.value.find(p => p.id === activeKey.value)
  if (!pos || positions.value.length < 2) return 50
  const totalH = positions.value[positions.value.length - 1].y - positions.value[0].y
  if (totalH <= 0) return 50
  return ((pos.y - positions.value[0].y) / totalH) * 100
})

function setItemRef(el: Element | null, id: string) {
  if (el instanceof HTMLElement) itemEls.value.set(id, el)
}

function handleClick(item: FlatItem) {
  if (item.badge || !item.key) return
  activeKey.value = item.key
}

function handleKeydown(e: KeyboardEvent, item: FlatItem) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick(item)
  }
}

watch(activeKey, async () => {
  await nextTick()
  recalcPositions()
})

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  setTimeout(recalcPositions, 100)
  if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
    resizeObserver = new ResizeObserver(recalcPositions)
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div ref="containerRef" :class="cn('relative select-none', props.class)" role="navigation">

    <!-- Highlight background -->
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

    <!-- SVG line -->
    <svg class="absolute top-0 left-0 w-8 h-full pointer-events-none overflow-visible" style="z-index: 1">
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--ousi-border)" />
          <stop :offset="`${Math.max(0, gradientStopY - 8)}%`" stop-color="var(--ousi-border)" />
          <stop :offset="`${Math.max(0, gradientStopY - 3)}%`" stop-color="var(--ousi-accent)" stop-opacity="0.6" />
          <stop :offset="`${gradientStopY}%`" stop-color="var(--ousi-accent)" />
          <stop :offset="`${Math.min(100, gradientStopY + 3)}%`" stop-color="var(--ousi-accent)" stop-opacity="0.6" />
          <stop :offset="`${Math.min(100, gradientStopY + 8)}%`" stop-color="var(--ousi-border)" />
          <stop offset="100%" stop-color="var(--ousi-border)" />
        </linearGradient>
      </defs>
      <path :d="svgPath" fill="none" :stroke="`url(#${gradientId})`" stroke-width="1.5" stroke-linecap="round" />
    </svg>

    <!-- Active marker -->
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
        <div class="absolute -inset-1 rounded-full bg-ousi-accent/20" style="filter: blur(3px)" />
        <div class="absolute -inset-0.5 rounded-full bg-ousi-accent/30" />
        <div class="relative size-full rounded-full bg-ousi-accent shadow-sm" />
      </div>
    </div>

    <!-- Items -->
    <div class="relative" style="z-index: 3">
      <template v-for="item in flatItems" :key="item.id">

        <!-- Section header -->
        <div v-if="item.isHeader" :ref="(el) => setItemRef(el as Element, item.id)" class="flex items-center py-2.5">
          <div class="w-5 flex justify-center shrink-0">
            <div class="size-[6px] rounded-full bg-ousi-border" />
          </div>
          <span class="ml-2 text-xs font-semibold uppercase tracking-wider text-ousi-foreground">
            <slot name="header" :title="item.label">{{ item.label }}</slot>
          </span>
        </div>

        <!-- Nav item -->
        <div
          v-else
          :ref="(el) => setItemRef(el as Element, item.id)"
          :class="[
            'flex items-center py-1.5 ml-3 group',
            item.badge ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
          ]"
          :tabindex="item.badge ? -1 : 0"
          role="button"
          :aria-current="activeKey === item.key ? 'page' : undefined"
          @click="handleClick(item)"
          @keydown="handleKeydown($event, item)"
        >
          <div class="w-5 flex justify-center shrink-0">
            <div :class="[
              'size-[5px] rounded-full transition-colors duration-200',
              activeKey === item.key ? 'bg-ousi-accent' : 'bg-ousi-border group-hover:bg-ousi-muted',
            ]" />
          </div>
          <span :class="[
            'ml-2 text-[13px] transition-colors duration-150',
            activeKey === item.key
              ? 'text-ousi-accent font-medium'
              : 'text-ousi-muted group-hover:text-ousi-foreground',
          ]">
            <slot name="item" :item="{ key: item.key!, label: item.label, badge: item.badge }" :active="activeKey === item.key">
              {{ item.label }}
            </slot>
          </span>
          <span v-if="item.badge" class="ml-auto text-[9px] rounded-full bg-ousi-default px-1.5 py-0.5 text-ousi-muted">
            {{ item.badge }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
