<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useFocus, useRoving } from '../chart-shared'
import type { HeatmapCell, HeatmapFocus, HeatmapProps, HeatmapSlots } from './heatmap.types'

const props = withDefaults(defineProps<HeatmapProps>(), {
  color: 'accent',
  min: 0,
  levels: 0,
  emptyColor: 'var(--ousi-default)',
  square: false,
  columnLabelsPosition: 'top',
  columnLabelAlign: 'center',
  tooltip: true,
  gap: 4,
  cellHeight: 32,
  cellRadius: 8,
  showRowLabels: true,
  showColumnLabels: true,
  showLegend: false,
  legendLabels: () => ['Less', 'More'],
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [focus: HeatmapFocus | null]
  'cell-enter': [cell: HeatmapCell, event: Event]
  'cell-leave': [cell: HeatmapCell, event: Event]
  'cell-click': [cell: HeatmapCell, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.rows.length * props.columns.length, () => props.columns.length)
defineSlots<HeatmapSlots>()

const { mounted, motion } = useChartMotion(() => props.animated)

const accent = computed(() => resolveChartColor(props.color, 0))
const maxValue = computed(() => props.max ?? Math.max(...props.rows.flatMap((r) => r.values), 1))
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const cells = computed<HeatmapCell[][]>(() =>
  props.rows.map((r, row) =>
    props.columns.map((colLabel, col) => {
      const value = r.values[col] ?? 0
      const span = maxValue.value - props.min || 1
      return {
        row,
        col,
        rowLabel: r.label,
        colLabel,
        value,
        intensity: Math.min(Math.max((value - props.min) / span, 0), 1),
        formatted: fmt(value),
      }
    }),
  ),
)

const mix = (intensity: number) => {
  if (props.levels > 0) {
    if (intensity <= 0) return props.emptyColor
    const level = Math.min(props.levels, Math.max(1, Math.ceil(intensity * props.levels)))
    const pct = props.levels === 1 ? 100 : 28 + ((level - 1) / (props.levels - 1)) * 72
    return `color-mix(in srgb, ${accent.value} ${Math.round(pct)}%, var(--ousi-background))`
  }
  return `color-mix(in srgb, ${accent.value} ${Math.round(intensity * 100)}%, var(--ousi-default))`
}

const isFocused = (c: HeatmapCell) => focused.value?.row === c.row && focused.value?.col === c.col
const focusedCell = computed(() => (focused.value ? cells.value[focused.value.row]?.[focused.value.col] ?? null : null))
const labelOf = (c: HeatmapCell) => props.cellLabel?.(c) ?? `${c.rowLabel} · ${c.colLabel}: ${c.formatted}`

// Tooltip anchor: the hovered cell, relative to the root
const root = ref<HTMLElement | null>(null)
const tip = ref<{ x: number; y: number } | null>(null)
function place(e: Event) {
  const el = e.currentTarget as HTMLElement | null
  if (!el || !root.value) return
  const a = el.getBoundingClientRect()
  const b = root.value.getBoundingClientRect()
  tip.value = { x: a.left - b.left + a.width / 2, y: a.top - b.top }
}

function enter(c: HeatmapCell, e: Event) {
  if (!props.interactive) return
  place(e)
  setFocused({ row: c.row, col: c.col })
  emit('cell-enter', c, e)
}
function leave(c: HeatmapCell, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('cell-leave', c, e)
}
function click(c: HeatmapCell, e: Event) {
  if (props.interactive) emit('cell-click', c, e)
}

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `${props.showRowLabels ? 'auto ' : ''}repeat(${props.columns.length}, minmax(0, 1fr))`,
  gap: `${props.gap}px`,
}))
const labelClass = (active: boolean) =>
  cn('text-xs transition-colors duration-150', active ? 'text-ousi-foreground' : 'text-ousi-muted')
const colLabelClass = (col: number) =>
  cn('flex whitespace-nowrap', props.columnLabelAlign === 'start' ? 'justify-start' : 'justify-center', labelClass(focused.value?.col === col))
</script>

<template>
  <div data-roving-root ref="root" :class="cn('relative w-full', props.class)" role="grid" :aria-label="label ?? 'Heatmap'">
    <div :style="gridStyle">
      <!-- Column labels (top) -->
      <template v-if="showColumnLabels && columnLabelsPosition === 'top'">
        <div v-if="showRowLabels" />
        <div v-for="(c, col) in columns" :key="`h-${col}`" :class="colLabelClass(col)">{{ c }}</div>
      </template>

      <!-- Rows -->
      <template v-for="(r, row) in rows" :key="`r-${row}`">
        <div v-if="showRowLabels" class="flex items-center pr-2" :class="labelClass(focused?.row === row)">
          {{ r.label }}
        </div>
        <div
          v-for="cell in cells[row]"
          :key="`${row}-${cell.col}`"
          role="gridcell"
          :aria-label="labelOf(cell)"
          class="flex items-center justify-center text-xs font-medium tabular-nums outline-none"
          :class="[interactive && 'cursor-pointer', square && 'aspect-square']"
          :tabindex="roving.tabindexFor(cell.row * columns.length + cell.col, interactive)" :data-roving="cell.row * columns.length + cell.col" @focusin="roving.activate(cell.row * columns.length + cell.col)" @keydown="roving.onKeydown($event, cell.row * columns.length + cell.col)"
          :style="{
            height: square ? undefined : `${cellHeight}px`,
            borderRadius: `${cellRadius}px`,
            backgroundColor: mix(cell.intensity),
            color: cell.intensity > 0.55 ? 'white' : 'var(--ousi-foreground)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.6)',
            boxShadow: isFocused(cell) ? `0 0 0 2px var(--ousi-background), 0 0 0 4px ${accent}` : 'none',
            transition: motion
              ? `opacity 400ms ease-out ${(cell.row + cell.col) * 12}ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${(cell.row + cell.col) * 12}ms, box-shadow 150ms`
              : 'box-shadow 150ms',
          }"
          @mouseenter="enter(cell, $event)"
          @mouseleave="leave(cell, $event)"
          @focus="enter(cell, $event)"
          @blur="leave(cell, $event)"
          @click="click(cell, $event)"
          @keydown.enter.prevent="click(cell, $event)"
          @keydown.space.prevent="click(cell, $event)"
        >
          <slot name="cell" :cell="cell" :focused="isFocused(cell)" />
        </div>
      </template>

      <!-- Column labels (bottom) -->
      <template v-if="showColumnLabels && columnLabelsPosition === 'bottom'">
        <div v-if="showRowLabels" />
        <div v-for="(c, col) in columns" :key="`f-${col}`" :class="colLabelClass(col)">{{ c }}</div>
      </template>
    </div>

    <slot name="legend">
      <div v-if="showLegend" class="mt-3 flex items-center justify-end gap-2 text-xs text-ousi-muted">
        <span>{{ legendLabels[0] }}</span>
        <span
          v-for="n in (levels > 0 ? levels + 1 : 5)"
          :key="n"
          class="size-3 rounded-[4px]"
          :style="{ backgroundColor: mix((n - 1) / (levels > 0 ? levels : 4)) }"
        />
        <span>{{ legendLabels[1] }}</span>
      </div>
    </slot>

    <!-- Tooltip -->
    <div
      v-if="tooltip && focusedCell && tip"
      class="pointer-events-none absolute z-10 w-max max-w-64 rounded-xl border border-ousi-border bg-ousi-overlay px-3 py-1.5 text-xs text-ousi-foreground shadow-lg"
      :style="{ left: `${tip.x}px`, top: `${tip.y - 8}px`, transform: 'translate(-50%, -100%)' }"
    >
      <slot name="tooltip" :cell="focusedCell">{{ labelOf(focusedCell) }}</slot>
    </div>
  </div>
</template>
