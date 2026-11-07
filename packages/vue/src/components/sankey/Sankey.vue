<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving } from '../chart-shared'
import { useScrollFade } from '../scroll-shadow/useScrollFade'
import type { SankeyLinkItem, SankeyNodeItem, SankeyProps } from './sankey.types'

const props = withDefaults(defineProps<SankeyProps>(), {
  height: 320,
  nodeWidth: 14,
  nodePadding: 14,
  minWidth: 400,
  showLabels: true,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [key: string | null]
  'node-enter': [node: SankeyNodeItem, event: Event]
  'node-leave': [node: SankeyNodeItem, event: Event]
  'node-click': [node: SankeyNodeItem, event: Event]
  'link-enter': [link: SankeyLinkItem, event: Event]
  'link-leave': [link: SankeyLinkItem, event: Event]
  'link-click': [link: SankeyLinkItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.nodes.length + ribbons.value.length)

const uid = useId()
// The diagram is drawn at least `minWidth` wide; a narrower container scrolls (edge fade, no scrollbar)
const scroller = ref<HTMLElement | null>(null)
const outerWidth = useElementWidth(scroller)
const scrolling = computed(() => props.minWidth > 0 && outerWidth.value < props.minWidth - 1)
const { maskStyle: fadeStyle } = useScrollFade(scroller, {
  orientation: () => 'horizontal',
  size: () => 28,
  enabled: () => scrolling.value,
})
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const NEUTRAL = 'color-mix(in srgb, var(--ousi-foreground) 30%, var(--ousi-background))'
const MARGIN_Y = 8

const model = computed(() => {
  const nameToIndex = new Map(props.nodes.map((n, i) => [n.name, i]))
  const ref2i = (r: string | number) => (typeof r === 'number' ? r : nameToIndex.get(r) ?? -1)
  const links = props.links
    .map((l, index) => ({ index, source: ref2i(l.source), target: ref2i(l.target), value: Math.max(l.value, 0) }))
    .filter((l) => l.source >= 0 && l.target >= 0 && l.source !== l.target && l.value > 0)

  const n = props.nodes.length
  const hasOut = new Array<boolean>(n).fill(false)
  const hasIn = new Array<boolean>(n).fill(false)
  links.forEach((l) => { hasOut[l.source] = true; hasIn[l.target] = true })

  // Depth = longest path from a source (guards against cycles by bounding the passes)
  const depth = new Array<number>(n).fill(0)
  for (let pass = 0; pass < n; pass++) {
    let changed = false
    for (const l of links) {
      if (depth[l.target] < depth[l.source] + 1) { depth[l.target] = depth[l.source] + 1; changed = true }
    }
    if (!changed) break
  }
  const maxDepth = Math.max(...depth, 0)
  for (let i = 0; i < n; i++) if (!hasOut[i] && hasIn[i]) depth[i] = maxDepth

  const inSum = new Array<number>(n).fill(0)
  const outSum = new Array<number>(n).fill(0)
  links.forEach((l) => { outSum[l.source] += l.value; inSum[l.target] += l.value })
  const value = props.nodes.map((_, i) => Math.max(inSum[i], outSum[i]))
  const total = links.filter((l) => !hasIn[l.source]).reduce((t, l) => t + l.value, 0) || Math.max(...value, 1)

  const cols: number[][] = Array.from({ length: maxDepth + 1 }, () => [])
  depth.forEach((d, i) => { if (hasIn[i] || hasOut[i]) cols[d].push(i) })
  return { links, hasIn, hasOut, depth, value, inSum, outSum, cols, maxDepth, total }
})

const compact = computed(() => width.value < 480)
const sides = computed(() => ({
  left: props.padding?.left ?? (props.showLabels ? (compact.value ? 86 : 110) : 8),
  right: props.padding?.right ?? (props.showLabels ? (compact.value ? 70 : 96) : 8),
}))

const layout = computed(() => {
  const m = model.value
  const innerH = props.height - MARGIN_Y * 2
  let k = Infinity
  m.cols.forEach((col) => {
    if (!col.length) return
    const sum = col.reduce((t, i) => t + m.value[i], 0)
    k = Math.min(k, (innerH - props.nodePadding * (col.length - 1)) / (sum || 1))
  })
  if (!isFinite(k)) k = 1

  const span = Math.max(width.value - sides.value.left - sides.value.right - props.nodeWidth, 1)
  const stepX = m.maxDepth > 0 ? span / m.maxDepth : 0
  const nodes = props.nodes.map(() => ({ x: 0, y: 0, h: 0 }))
  m.cols.forEach((col, ci) => {
    const colH = col.reduce((t, i) => t + m.value[i] * k, 0) + props.nodePadding * Math.max(col.length - 1, 0)
    let y = MARGIN_Y + (innerH - colH) / 2
    col.forEach((i) => {
      const h = Math.max(m.value[i] * k, 2)
      nodes[i] = { x: sides.value.left + ci * stepX, y, h }
      y += h + props.nodePadding
    })
  })

  // Ribbon offsets inside each node, ordered by the vertical position of the other end
  const outOffset = new Array<number>(props.nodes.length).fill(0)
  const inOffset = new Array<number>(props.nodes.length).fill(0)
  const placed = new Map<number, { sy: number; ty: number; t: number }>()
  const bySource = [...m.links].sort((a, b) => nodes[a.target].y - nodes[b.target].y)
  bySource.forEach((l) => {
    const t = l.value * k
    placed.set(l.index, { sy: nodes[l.source].y + outOffset[l.source] + t / 2, ty: 0, t })
    outOffset[l.source] += t
  })
  const byTarget = [...m.links].sort((a, b) => nodes[a.source].y - nodes[b.source].y)
  byTarget.forEach((l) => {
    const p = placed.get(l.index)!
    p.ty = nodes[l.target].y + inOffset[l.target] + p.t / 2
    inOffset[l.target] += p.t
  })
  return { nodes, placed }
})

const nodeItems = computed<SankeyNodeItem[]>(() =>
  props.nodes.map((n, index) => ({
    index,
    name: n.name,
    value: model.value.value[index],
    percent: Math.round((model.value.value[index] / (model.value.total || 1)) * 100),
    column: model.value.depth[index],
    color: n.color ? resolveChartColor(n.color, index) : !model.value.hasOut[index] ? NEUTRAL : resolveChartColor(undefined, index),
    formatted: fmt(model.value.value[index]),
  })),
)

const linkItems = computed<SankeyLinkItem[]>(() =>
  model.value.links.map((l) => ({
    index: l.index,
    source: nodeItems.value[l.source],
    target: nodeItems.value[l.target],
    value: l.value,
    percent: Math.round((l.value / (model.value.total || 1)) * 100),
    formatted: fmt(l.value),
  })),
)

const ribbons = computed(() =>
  model.value.links.map((l) => {
    const p = layout.value.placed.get(l.index)!
    const x0 = layout.value.nodes[l.source].x + props.nodeWidth
    const x1 = layout.value.nodes[l.target].x
    const xm = (x0 + x1) / 2
    return {
      index: l.index,
      source: l.source,
      target: l.target,
      d: `M${x0},${p.sy}C${xm},${p.sy} ${xm},${p.ty} ${x1},${p.ty}`,
      t: Math.max(p.t, 1),
      mid: [xm, (p.sy + p.ty) / 2] as [number, number],
      color: nodeItems.value[l.source].color,
    }
  }),
)

// Focus
const focusKind = computed(() => (focused.value?.startsWith('node:') ? 'node' : focused.value?.startsWith('link:') ? 'link' : null))
const focusIndex = computed(() => (focused.value ? Number(focused.value.split(':')[1]) : -1))

const linkActive = (l: { index: number; source: number; target: number }) =>
  focusKind.value === 'link' ? l.index === focusIndex.value : focusKind.value === 'node' ? l.source === focusIndex.value || l.target === focusIndex.value : false
const nodeActive = (i: number) => {
  if (focusKind.value === 'node') {
    return i === focusIndex.value || ribbons.value.some((l) => linkActive(l) && (l.source === i || l.target === i))
  }
  if (focusKind.value === 'link') return ribbons.value.some((l) => l.index === focusIndex.value && (l.source === i || l.target === i))
  return false
}
const hasFocus = computed(() => focusKind.value != null)

function setFocus(key: string | null) {
  if (props.interactive) setFocused(key)
}
const focusedLink = computed(() => (focusKind.value === 'link' ? ribbons.value.find((r) => r.index === focusIndex.value) ?? null : null))
const focusedLinkItem = computed(() => (focusedLink.value ? linkItems.value.find((l) => l.index === focusedLink.value!.index) ?? null : null))

const isSource = (i: number) => !model.value.hasIn[i]
const isSink = (i: number) => model.value.hasIn[i] && !model.value.hasOut[i]
const ariaLabel = computed(() => props.label ?? `Flow diagram with ${props.nodes.length} nodes and ${props.links.length} links`)
</script>

<template>
  <div
    ref="scroller"
    data-roving-root
    :class="cn('relative w-full min-w-0 max-w-full select-none', scrolling && 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', minWidth > 0 && '[contain:inline-size]', props.class)"
    :style="fadeStyle"
  >
  <div ref="root" class="relative" :style="{ height: `${height}px`, minWidth: minWidth > 0 ? `${minWidth}px` : undefined }">
    <svg width="100%" :height="height" class="block overflow-visible" role="group" :aria-label="ariaLabel">
      <defs>
        <clipPath :id="`${uid}-clip`">
          <rect
            :x="0" :y="-8" :height="height + 16" :width="mounted ? width : 0"
            :style="{ transition: motion ? 'width 1200ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }"
          />
        </clipPath>
      </defs>

      <!-- Links -->
      <g :clip-path="`url(#${uid}-clip)`">
        <path
          v-for="(r, i) in ribbons" :key="r.index"
          :d="r.d" fill="none" :stroke="r.color" :stroke-width="r.t"
          :class="interactive && 'cursor-pointer outline-none'"
          :tabindex="roving.tabindexFor(nodes.length + i, interactive)" :data-roving="nodes.length + i" @focusin="roving.activate(nodes.length + i)" @keydown="roving.onKeydown($event, nodes.length + i)"
          role="img"
          :aria-label="`${nodeItems[r.source].name} to ${nodeItems[r.target].name}: ${linkItems[i].formatted}`"
          :style="{
            opacity: hasFocus ? (linkActive(r) ? 0.6 : 0.07) : 0.28,
            transition: 'opacity 200ms ease-out',
          }"
          @mouseenter="setFocus(`link:${r.index}`); $emit('link-enter', linkItems[i], $event)"
          @mouseleave="setFocus(null); $emit('link-leave', linkItems[i], $event)"
          @focus="setFocus(`link:${r.index}`); $emit('link-enter', linkItems[i], $event)"
          @blur="setFocus(null); $emit('link-leave', linkItems[i], $event)"
          @click="interactive && $emit('link-click', linkItems[i], $event)"
        />
      </g>

      <!-- Nodes + labels -->
      <g v-for="n in nodeItems" :key="n.index">
        <template v-if="model.cols[n.column]?.includes(n.index)">
          <rect
            :x="layout.nodes[n.index].x" :y="layout.nodes[n.index].y"
            :width="nodeWidth" :height="layout.nodes[n.index].h" :rx="nodeWidth / 2"
            :fill="n.color"
            :class="interactive && 'cursor-pointer outline-none'"
            :tabindex="roving.tabindexFor(n.index, interactive)" :data-roving="n.index" @focusin="roving.activate(n.index)" @keydown="roving.onKeydown($event, n.index)"
            role="img"
            :aria-label="`${n.name}: ${n.formatted}`"
            :style="{
              opacity: (hasFocus ? (nodeActive(n.index) ? 1 : 0.25) : 1) * (mounted ? 1 : 0),
              transition: motion ? 'opacity 250ms ease-out' : 'none',
            }"
            @mouseenter="setFocus(`node:${n.index}`); $emit('node-enter', n, $event)"
            @mouseleave="setFocus(null); $emit('node-leave', n, $event)"
            @focus="setFocus(`node:${n.index}`); $emit('node-enter', n, $event)"
            @blur="setFocus(null); $emit('node-leave', n, $event)"
            @click="interactive && $emit('node-click', n, $event)"
          />
          <g
            v-if="showLabels"
            class="pointer-events-none text-[11px] transition-opacity duration-200"
            :style="{ opacity: hasFocus && !nodeActive(n.index) ? 0.35 : 1 }"
          >
            <template v-if="isSource(n.index)">
              <text :x="layout.nodes[n.index].x - 10" :y="layout.nodes[n.index].y + layout.nodes[n.index].h / 2 - 3" text-anchor="end" class="fill-ousi-muted">{{ n.name }}</text>
              <text :x="layout.nodes[n.index].x - 10" :y="layout.nodes[n.index].y + layout.nodes[n.index].h / 2 + 11" text-anchor="end" class="fill-ousi-foreground text-xs font-semibold tabular-nums">{{ n.formatted }}</text>
            </template>
            <template v-else-if="isSink(n.index)">
              <text :x="layout.nodes[n.index].x + nodeWidth + 10" :y="layout.nodes[n.index].y + layout.nodes[n.index].h / 2 - 3" text-anchor="start" class="fill-ousi-foreground text-xs font-semibold tabular-nums">{{ n.percent }}%</text>
              <text :x="layout.nodes[n.index].x + nodeWidth + 10" :y="layout.nodes[n.index].y + layout.nodes[n.index].h / 2 + 11" text-anchor="start" class="fill-ousi-muted">{{ n.name }}</text>
            </template>
            <text
              v-else
              :x="layout.nodes[n.index].x + nodeWidth + 8" :y="layout.nodes[n.index].y + layout.nodes[n.index].h / 2 + 4"
              text-anchor="start" class="fill-ousi-foreground"
            >{{ n.name }}</text>
          </g>
        </template>
      </g>

      <!-- Value of the hovered link -->
      <g v-if="focusedLink && focusedLinkItem" class="pointer-events-none">
        <rect :x="focusedLink.mid[0] - 28" :y="focusedLink.mid[1] - 11" width="56" height="22" rx="11" fill="var(--ousi-overlay)" stroke="var(--ousi-border)" />
        <text :x="focusedLink.mid[0]" :y="focusedLink.mid[1]" text-anchor="middle" dominant-baseline="central" class="fill-ousi-foreground text-[11px] font-semibold tabular-nums">
          {{ focusedLinkItem.formatted }}
        </text>
      </g>
    </svg>
  </div>
  </div>
</template>
