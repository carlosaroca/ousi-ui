<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving } from '../chart-shared'
import { squarify } from './treemap.layout'
import type { TreemapItem, TreemapNode, TreemapProps, TreemapSlots } from './treemap.types'

const props = withDefaults(defineProps<TreemapProps>(), {
  height: 320,
  gap: 3,
  radius: 12,
  showLabels: true,
  interactive: true,
  tooltip: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [key: string | null]
  'node-enter': [item: TreemapItem, event: Event]
  'node-leave': [item: TreemapItem, event: Event]
  'node-click': [item: TreemapItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => leaves.value.length)
defineSlots<TreemapSlots>()

const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const sum = (n: TreemapNode): number => (n.children?.length ? n.children.reduce((t, c) => t + sum(c), 0) : Math.max(n.value ?? 0, 0))

const HEADER = 26
const PAD = 6

const tiles = computed<TreemapItem[]>(() => {
  const grand = props.data.reduce((t, n) => t + sum(n), 0) || 1
  const out: TreemapItem[] = []
  const rects = squarify(props.data.map(sum), { x: 0, y: 0, w: width.value, h: props.height })

  props.data.forEach((node, i) => {
    const r = rects[i]
    if (r.w <= 0 || r.h <= 0) return
    const color = resolveChartColor(node.color, i)
    const value = sum(node)
    const kids = node.children?.length ? node.children : null
    out.push({
      key: String(i), name: node.name, value, percent: Math.round((value / grand) * 1000) / 10,
      depth: 0, parent: null, color, formatted: fmt(value), ...r, hasChildren: !!kids,
    })
    if (!kids) return
    const showHeader = r.h > 70 && r.w > 90
    const box = { x: r.x + PAD, y: r.y + (showHeader ? HEADER : PAD), w: r.w - PAD * 2, h: r.h - (showHeader ? HEADER : PAD) - PAD }
    const cr = squarify(kids.map(sum), box)
    kids.forEach((c, j) => {
      if (cr[j].w <= 0 || cr[j].h <= 0) return
      const v = sum(c)
      out.push({
        key: `${i}.${j}`, name: c.name, value: v, percent: Math.round((v / grand) * 1000) / 10,
        depth: 1, parent: node.name,
        color: c.color ? resolveChartColor(c.color, i) : `color-mix(in srgb, ${color} ${Math.max(100 - j * 14, 45)}%, var(--ousi-background))`,
        formatted: fmt(v), ...cr[j], hasChildren: false,
      })
    })
  })
  return out
})

// Tiles that react: leaves only (a parent is just a frame)
const leaves = computed(() => tiles.value.filter((t) => !t.hasChildren))
const frames = computed(() => tiles.value.filter((t) => t.hasChildren))
const isDimmed = (t: TreemapItem) => focused.value != null && focused.value !== t.key && !t.key.startsWith(`${focused.value}.`)

const focusedItem = computed(() => (focused.value == null ? null : tiles.value.find((t) => t.key === focused.value) ?? null))

function enter(t: TreemapItem, e: Event) {
  if (!props.interactive) return
  setFocused(t.key)
  emit('node-enter', t, e)
}
function leave(t: TreemapItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('node-leave', t, e)
}
function click(t: TreemapItem, e: Event) {
  if (props.interactive) emit('node-click', t, e)
}

const tip = computed(() => {
  const t = focusedItem.value
  if (!t) return {}
  const cx = t.x + t.w / 2
  const align = cx < 90 ? '0%' : cx > width.value - 90 ? '-100%' : '-50%'
  const above = t.y > 70
  return { left: `${cx}px`, top: `${above ? t.y - 6 : t.y + t.h + 6}px`, transform: `translate(${align}, ${above ? '-100%' : '0'})` }
})

const insetOf = (t: TreemapItem) => Math.min(props.gap / 2, t.w / 4, t.h / 4)
const ariaLabel = computed(() => props.label ?? `Treemap of ${props.data.length} groups`)
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full select-none', props.class)" :style="{ height: `${height}px` }" role="group" :aria-label="ariaLabel">
    <!-- Frames of nodes that have children -->
    <div
      v-for="t in frames"
      :key="`f-${t.key}`"
      class="absolute overflow-hidden"
      :style="{
        left: `${t.x + insetOf(t)}px`, top: `${t.y + insetOf(t)}px`,
        width: `${Math.max(t.w - insetOf(t) * 2, 0)}px`, height: `${Math.max(t.h - insetOf(t) * 2, 0)}px`,
        borderRadius: `${radius}px`,
        backgroundColor: `color-mix(in srgb, ${t.color} 16%, transparent)`,
        opacity: mounted ? (focused != null && !focused.startsWith(`${t.key}.`) && focused !== t.key ? 0.5 : 1) : 0,
        transition: motion ? 'left 500ms, top 500ms, width 500ms, height 500ms, opacity 300ms' : 'opacity 200ms',
      }"
    >
      <div v-if="showLabels && t.h > 70 && t.w > 90" class="flex items-center gap-1.5 truncate px-3 pt-2 text-xs font-medium text-ousi-foreground">
        <span class="inline-block size-2 shrink-0 rounded-full" :style="{ backgroundColor: t.color }" />
        <span class="truncate">{{ t.name }}</span>
        <span class="ml-auto shrink-0 tabular-nums text-ousi-muted">{{ t.formatted }}</span>
      </div>
    </div>

    <!-- Leaves -->
    <div
      v-for="(t, idx) in leaves"
      :key="t.key"
      class="absolute overflow-hidden outline-none"
      :class="interactive && 'cursor-pointer'"
      :tabindex="roving.tabindexFor(idx, interactive)" :data-roving="idx" @focusin="roving.activate(idx)" @keydown="roving.onKeydown($event, idx)"
      role="img"
      :aria-label="`${t.parent ? `${t.parent} / ` : ''}${t.name}: ${t.formatted}, ${t.percent}%`"
      :style="{
        left: `${t.x + insetOf(t)}px`, top: `${t.y + insetOf(t)}px`,
        width: `${Math.max(t.w - insetOf(t) * 2, 0)}px`, height: `${Math.max(t.h - insetOf(t) * 2, 0)}px`,
        borderRadius: `${t.depth ? Math.max(radius - 4, 4) : radius}px`,
        backgroundColor: t.color,
        opacity: mounted ? (isDimmed(t) ? 0.3 : 1) : 0,
        transform: `scale(${mounted ? 1 : 0.9})`,
        filter: focused === t.key ? 'brightness(0.9)' : 'none',
        transition: motion
          ? `left 500ms, top 500ms, width 500ms, height 500ms, opacity 250ms ${mounted ? 0 : idx * 25}ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${idx * 25}ms, filter 150ms`
          : 'opacity 200ms, filter 150ms',
      }"
      @mouseenter="enter(t, $event)"
      @mouseleave="leave(t, $event)"
      @focus="enter(t, $event)"
      @blur="leave(t, $event)"
      @click="click(t, $event)"
      @keydown.enter.prevent="click(t, $event)"
      @keydown.space.prevent="click(t, $event)"
    >
      <slot name="label" :item="t" :focused="focused === t.key">
        <div v-if="showLabels && t.w > 52 && t.h > 30" class="flex h-full flex-col justify-between p-2.5 text-white">
          <div class="truncate text-xs font-medium leading-tight">{{ t.name }}</div>
          <div v-if="t.h > 54 && t.w > 70" class="text-sm font-semibold tabular-nums leading-tight">
            {{ t.formatted }}
            <span v-if="t.w > 110" class="ml-1 text-[11px] font-normal opacity-80">{{ t.percent }}%</span>
          </div>
        </div>
      </slot>
    </div>

    <div
      v-if="tooltip && focusedItem"
      class="pointer-events-none absolute z-10 min-w-32 rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-2 text-xs shadow-lg"
      :style="tip"
    >
      <slot name="tooltip" :item="focusedItem">
        <div v-if="focusedItem.parent" class="text-[11px] text-ousi-muted">{{ focusedItem.parent }}</div>
        <div class="flex items-center gap-1.5 font-medium text-ousi-foreground">
          <span class="inline-block size-2 rounded-sm" :style="{ backgroundColor: focusedItem.color }" />{{ focusedItem.name }}
        </div>
        <div class="mt-1 flex justify-between gap-4 text-ousi-muted">
          <span class="font-semibold tabular-nums text-ousi-foreground">{{ focusedItem.formatted }}</span>
          <span class="tabular-nums">{{ focusedItem.percent }}%</span>
        </div>
      </slot>
    </div>
  </div>
</template>
