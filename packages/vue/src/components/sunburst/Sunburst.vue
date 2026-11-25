<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useFocus, useRoving } from '../chart-shared'
import { sectorLabel, sectorPath } from './sunburst.geometry'
import { buildTree, findNode, placeNodes, type TreeNode } from './sunburst.layout'
import type { SunburstItem, SunburstProps, SunburstSlots } from './sunburst.types'

const props = withDefaults(defineProps<SunburstProps>(), {
  size: 320,
  levels: 3,
  innerRadius: 0.36,
  gap: 0.7,
  cornerRadius: 1.4,
  showLabels: true,
  zoomable: true,
  // Absent and null differ: null is the whole, held by the app.
  zoom: undefined,
  rootLabel: 'Total',
  interactive: true,
  animated: true,
})
const emit = defineEmits<{
  'update:focused': [key: string | null]
  'update:zoom': [key: string | null]
  'node-enter': [item: SunburstItem, event: Event]
  'node-leave': [item: SunburstItem, event: Event]
  'node-click': [item: SunburstItem, event: Event]
}>()
defineSlots<SunburstSlots>()

const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const { mounted, motion } = useChartMotion(() => props.animated)
const zoomKey = useControllableState<string | null>({
  prop: toRef(props, 'zoom') as never,
  defaultValue: null,
  onChange: (value) => emit('update:zoom', value),
})

const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

/* ── Tree and view ─────────────────────────────────────────────── */

const tree = computed(() => buildTree(props.data))
const current = computed(() => (zoomKey.value == null ? null : findNode(tree.value, zoomKey.value)))
// Zooming into something with nothing inside would leave an empty chart.
const centre = computed(() => (current.value?.children.length ? current.value : null))
const inView = computed(() => centre.value?.children ?? tree.value)
const total = computed(() => inView.value.reduce((sum, node) => sum + node.value, 0))
const placed = computed(() => placeNodes(inView.value, Math.max(1, Math.floor(props.levels))))

/** Each branch has the colour of its top node, paler the further out. */
function colorOf(node: TreeNode): string {
  if (node.color) return resolveChartColor(node.color, node.order)
  if (!node.parent) return resolveChartColor(undefined, node.order)
  // Neighbours differ a little, so two of them do not read as one.
  const strength = node.order % 2 ? 50 : 62
  return `color-mix(in oklab, ${colorOf(node.parent)} ${strength}%, var(--ousi-background))`
}

/** What can be read on a sector: the theme's own for its tones, white on a colour of the app's. */
function inkOn(color: string): string {
  const tone = color.match(/^var\(--ousi-(accent|success|warning|danger|orange|violet)\)$/)?.[1]
  if (tone) return `var(--ousi-${tone}-foreground)`
  // The paler sectors further out sit close to the page, as its text does.
  return color.startsWith('color-mix') ? 'var(--ousi-foreground)' : '#fff'
}

function itemOf(node: TreeNode, depth: number): SunburstItem {
  return {
    key: node.key,
    name: node.name,
    value: node.value,
    percent: total.value ? Math.round((node.value / total.value) * 1000) / 10 : 0,
    depth,
    parent: node.parent?.name ?? null,
    color: colorOf(node),
    formatted: fmt(node.value),
    hasChildren: node.children.length > 0,
  }
}

/* ── Geometry (viewBox 0 0 100 100) ────────────────────────────── */

const OUTER = 49.5
const hole = computed(() => OUTER * Math.min(Math.max(props.innerRadius, 0.2), 0.8))
const rings = computed(() => Math.max(1, ...placed.value.map((p) => p.depth)))
const thickness = computed(() => (OUTER - hole.value) / rings.value)

const FONT = 3.1

const sectors = computed(() =>
  placed.value.flatMap((p) => {
    const inner = hole.value + (p.depth - 1) * thickness.value
    const sector = { from: p.from, to: p.to, inner, outer: inner + thickness.value }
    const d = sectorPath(sector, props.gap, props.cornerRadius)
    if (!d) return []
    const label = props.showLabels ? sectorLabel(p.node.name, sector, props.gap, FONT) : undefined
    return [{ item: itemOf(p.node, p.depth), d, label }]
  }),
)

const roving = useRoving(() => sectors.value.length)

/* ── Interaction ───────────────────────────────────────────────── */

const focusedNode = computed(() => (focused.value == null ? null : findNode(tree.value, String(focused.value))))
const focusedItem = computed(() =>
  focusedNode.value ? itemOf(focusedNode.value, focusedNode.value.key.split('.').length) : null,
)
const currentItem = computed(() => (centre.value ? itemOf(centre.value, 0) : null))

/** The hovered sector stays lit, with what leads to it and what is inside it. */
function isLit(key: string): boolean {
  const on = focusedNode.value?.key
  return !on || key === on || on.startsWith(`${key}.`) || key.startsWith(`${on}.`)
}

const chart = ref<SVGGElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)

function goTo(key: string | null) {
  setFocused(null)
  zoomKey.value = key
  roving.activate(0)
}
function back() {
  if (centre.value) goTo(centre.value.parent?.key ?? null)
}

// The new rings open out from the centre.
watch(
  () => centre.value?.key ?? null,
  async () => {
    const refocus = !!svg.value?.contains(document.activeElement)
    await nextTick()
    if (motion.value) {
      chart.value?.animate?.(
        [{ opacity: 0, transform: 'scale(0.86) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }],
        { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    }
    // What had focus is gone from the chart: the first sector takes it.
    if (refocus && !svg.value?.contains(document.activeElement)) {
      svg.value?.querySelector<SVGElement>('[data-roving="0"]')?.focus()
    }
  },
)

function enter(item: SunburstItem, e: Event) {
  if (!props.interactive) return
  setFocused(item.key)
  emit('node-enter', item, e)
}
function leave(item: SunburstItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('node-leave', item, e)
}
function click(item: SunburstItem, e: Event) {
  if (!props.interactive) return
  emit('node-click', item, e)
  if (props.zoomable && item.hasChildren) goTo(item.key)
}
function onKeydown(event: KeyboardEvent, index: number) {
  if ((event.key === 'Escape' || event.key === 'Backspace') && centre.value && props.zoomable) {
    // Escape would otherwise reach a dialog the chart is in.
    event.preventDefault()
    event.stopPropagation()
    back()
    return
  }
  roving.onKeydown(event, index)
}

const canGoBack = computed(() => props.interactive && props.zoomable && !!centre.value)
const backName = computed(() => centre.value?.parent?.name ?? props.rootLabel)
const ariaLabel = computed(
  () => props.label ?? `${centre.value?.name ?? props.rootLabel}: ${inView.value.map((n) => `${n.name} ${itemOf(n, 1).percent}%`).join(', ')}`,
)
const holePercent = computed(() => (hole.value - props.gap) * 2)

defineExpose({ zoomTo: goTo, back })
</script>

<template>
  <div data-roving-root :class="cn('inline-block w-fit max-w-full select-none align-top', props.class)">
    <!-- The box of the drawing: what sits in the middle is placed on it, however wide the root is. -->
    <div class="relative mx-auto w-fit max-w-full">
      <svg ref="svg" :width="size" :height="size" viewBox="0 0 100 100" class="block h-auto max-w-full" role="group" :aria-label="ariaLabel">
        <circle v-if="!sectors.length" cx="50" cy="50" :r="(OUTER + hole) / 2" fill="none" stroke="var(--ousi-default)" :stroke-width="OUTER - hole" />
        <g ref="chart" style="transform-origin: 50px 50px">
          <g
            :style="{
              transformOrigin: '50px 50px',
              transform: mounted ? 'scale(1) rotate(0deg)' : 'scale(0.86) rotate(-24deg)',
              opacity: mounted ? 1 : 0,
              transition: motion ? 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease-out' : 'none',
            }"
          >
            <path
              v-for="(s, i) in sectors"
              :key="s.item.key"
              data-part="sector"
              :data-key="s.item.key"
              :d="s.d"
              :fill="s.item.color"
              fill-rule="evenodd"
              class="outline-none focus-visible:stroke-ousi-focus focus-visible:stroke-[0.8]"
              :class="interactive && 'cursor-pointer'"
              :style="{ opacity: isLit(s.item.key) ? 1 : 0.3, transition: 'opacity 200ms ease-out' }"
              :role="interactive && zoomable && s.item.hasChildren ? 'button' : 'img'"
              :tabindex="roving.tabindexFor(i, interactive)"
              :data-roving="i"
              :aria-label="`${s.item.parent ? `${s.item.parent}, ` : ''}${s.item.name}: ${s.item.formatted}, ${s.item.percent}%`"
              @focusin="roving.activate(i)"
              @keydown="onKeydown($event, i)"
              @mouseenter="enter(s.item, $event)"
              @mouseleave="leave(s.item, $event)"
              @focus="enter(s.item, $event)"
              @blur="leave(s.item, $event)"
              @click="click(s.item, $event)"
              @keydown.enter.prevent="click(s.item, $event)"
              @keydown.space.prevent="click(s.item, $event)"
            />
            <g aria-hidden="true" class="pointer-events-none">
              <template v-for="s in sectors" :key="`l-${s.item.key}`">
                <text
                  v-if="s.label"
                  data-part="label"
                  :transform="s.label.transform"
                  text-anchor="middle"
                  dominant-baseline="central"
                  :font-size="FONT"
                  class="font-medium"
                  :fill="inkOn(s.item.color)"
                  :style="{ opacity: isLit(s.item.key) ? 0.9 : 0.25, transition: 'opacity 200ms ease-out' }"
                >{{ s.label.text }}</text>
              </template>
            </g>
          </g>
        </g>
      </svg>

      <!-- The centre: what is in view, or the hovered sector. Pressing it goes back. -->
      <component
        :is="canGoBack ? 'button' : 'div'"
        :type="canGoBack ? 'button' : undefined"
        data-part="center"
        class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full text-center outline-none"
        :class="canGoBack ? 'cursor-pointer transition-colors hover:bg-ousi-default focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ousi-focus' : 'pointer-events-none'"
        :style="{ width: `${holePercent}%`, height: `${holePercent}%`, containerType: 'inline-size' }"
        :aria-label="canGoBack ? `${backName}` : undefined"
        @click="canGoBack && back()"
      >
        <slot :total="total" :formatted-total="fmt(total)" :focused-item="focusedItem" :current="currentItem">
          <span class="w-full truncate px-2 font-semibold leading-tight tabular-nums text-ousi-foreground" :style="{ fontSize: 'clamp(11px, 17cqw, 28px)' }">{{ focusedItem ? focusedItem.formatted : fmt(total) }}</span>
          <span class="w-full truncate px-2 leading-tight text-ousi-muted" :style="{ fontSize: 'clamp(9px, 10cqw, 13px)' }">{{ focusedItem ? `${focusedItem.name} · ${focusedItem.percent}%` : (centre?.name ?? rootLabel) }}</span>
          <svg v-if="canGoBack && !focusedItem" data-part="back-icon" class="mt-0.5 size-3.5 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />
          </svg>
        </slot>
      </component>
    </div>
  </div>
</template>
