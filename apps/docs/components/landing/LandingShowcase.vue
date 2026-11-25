<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { Component } from 'vue'
import { provideShowcase, useElementWidth } from '~/composables/useShowcase'
import CalendarTile from './tiles/CalendarTile.vue'
import TabsTile from './tiles/TabsTile.vue'
import OtpTile from './tiles/OtpTile.vue'
import StepperTile from './tiles/StepperTile.vue'
import TimelineTile from './tiles/TimelineTile.vue'
import TagsTile from './tiles/TagsTile.vue'
import ChipsTile from './tiles/ChipsTile.vue'
import NumberTile from './tiles/NumberTile.vue'
import TodoTile from './tiles/TodoTile.vue'
import RatingTile from './tiles/RatingTile.vue'
import DeploysTile from './tiles/DeploysTile.vue'
import TreeTile from './tiles/TreeTile.vue'
import ThemeTile from './tiles/ThemeTile.vue'
import PeopleTile from './tiles/PeopleTile.vue'
import BarTile from './tiles/BarTile.vue'
import RadarTile from './tiles/RadarTile.vue'
import HeatmapTile from './tiles/HeatmapTile.vue'
import FileUploadTile from './tiles/FileUploadTile.vue'
import RingsTile from './tiles/RingsTile.vue'
import GaugeTile from './tiles/GaugeTile.vue'
import TimerTile from './tiles/TimerTile.vue'
import PaginationTile from './tiles/PaginationTile.vue'
import PortfolioTile from './tiles/PortfolioTile.vue'
import ColorTile from './tiles/ColorTile.vue'
import DonutTile from './tiles/DonutTile.vue'
import PricingTile from './tiles/PricingTile.vue'
import DeployTile from './tiles/DeployTile.vue'

/**
 * Landing-page bento: a flat grid of tiles that appear one after another, and then every tile
 * loops its own demo (typing, toggling, filling, hovering). The new components (charts, status)
 * share the grid with the ones people reach for first.
 *
 * The tiles are a picture, not controls: they are inert and hidden from assistive tech.
 * Everything they show comes from one shared clock (see useShowcase).
 *
 * An optional `intro` slot holds the page's own copy. On the 5 column layout it becomes a cell that
 * spans the first two columns, so the headline sits inside the bento instead of above it; anywhere
 * narrower it is rendered above the grid. The slot receives `integrated` to style itself for each case.
 * The copy is real content, so unlike the tiles it is never hidden from assistive tech.
 *
 * Inherits the accent from the parent through CSS variables (--ousi-accent).
 */
const wall = ref<HTMLElement | null>(null)
const { entered } = provideShowcase(wall)

interface Entry {
  c: Component
  /** Rough height in px, only used to balance the columns on narrower screens. */
  h: number
  /** Kept in the single column on phones. */
  phone?: boolean
}

// The wide screen layout, column by column. The last tile of each column stretches so every
// column ends on the same line. Narrow columns (2 and 4) hold the compact tiles.
const designed: Entry[][] = [
  // Columns 1 and 2 start below the intro cell, so they hold less than the others.
  // Order matters as much as the choice: the first screen shows the top of every column, so each one
  // opens with at most a chart and goes on with inputs and controls. A page of mostly charts would
  // read as a charting library.
  [
    { c: TabsTile, h: 62 },
    { c: OtpTile, h: 150, phone: true },
    { c: StepperTile, h: 110 },
    { c: CalendarTile, h: 340, phone: true },
    { c: TagsTile, h: 110 },
  ],
  [
    { c: ThemeTile, h: 140, phone: true },
    { c: RatingTile, h: 170, phone: true },
    { c: ChipsTile, h: 110 },
    { c: DeploysTile, h: 200 },
    { c: PeopleTile, h: 190 },
  ],
  [
    { c: BarTile, h: 240, phone: true },
    { c: TodoTile, h: 300, phone: true },
    { c: RadarTile, h: 270 },
    { c: FileUploadTile, h: 300, phone: true },
  ],
  [
    { c: RingsTile, h: 260, phone: true },
    { c: TreeTile, h: 280 },
    { c: TimelineTile, h: 190 },
    { c: GaugeTile, h: 220 },
    { c: TimerTile, h: 170 },
    { c: PaginationTile, h: 70 },
  ],
  [
    { c: PortfolioTile, h: 250, phone: true },
    { c: PricingTile, h: 150 },
    { c: ColorTile, h: 240 },
    { c: NumberTile, h: 110 },
    { c: DonutTile, h: 200, phone: true },
    { c: HeatmapTile, h: 200 },
    { c: DeployTile, h: 100 },
  ],
]

const GAP = 16

// Columns follow the width of the bento's own box, not the window: on the home page it spans the
// page, in the playground it sits beside the controls. Widths are the narrowest each layout was
// checked at (the 5 column design needs 1232px, the calendar 275px per tile).
const width = useElementWidth(wall)
const count = computed(() => (width.value <= 0 ? 0 : width.value >= 1230 ? 5 : width.value >= 900 ? 3 : width.value >= 560 ? 2 : 1))

const columns = computed<Entry[][]>(() => {
  if (count.value === 0) return []
  if (count.value === 5) return designed

  // Fewer columns: read the designed layout row by row and give each tile to the shortest column.
  const rows = Math.max(...designed.map((c) => c.length))
  const ordered: Entry[] = []
  for (let r = 0; r < rows; r++) for (const col of designed) if (col[r]) ordered.push(col[r])
  const pool = count.value === 1 ? ordered.filter((e) => e.phone) : ordered

  const lanes = Array.from({ length: count.value }, () => ({ h: 0, items: [] as Entry[] }))
  for (const entry of pool) {
    const shortest = lanes.reduce((a, b) => (b.h < a.h ? b : a))
    shortest.items.push(entry)
    shortest.h += entry.h + GAP
  }
  return lanes.map((l) => l.items)
})

// Wide columns at the edges and in the middle, narrow ones in between, like the design.
const template = computed(() =>
  count.value === 5
    ? 'minmax(0,1.3fr) minmax(0,1fr) minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.3fr)'
    : `repeat(${count.value}, minmax(0,1fr))`,
)

const slots = useSlots()
const hasIntro = !!slots.intro
const integrated = computed(() => count.value === 5 && hasIntro)

// With the intro in the first two columns, those two stacks start on the second row and the other
// three run the whole height. Each stack stretches, so every column still ends on the same line.
const gridStyle = computed(() => ({
  gridTemplateColumns: template.value,
  gridTemplateRows: integrated.value ? 'auto 1fr' : undefined,
}))
const columnStyle = (c: number) =>
  integrated.value ? { gridColumn: c + 1, gridRow: c < 2 ? '2' : '1 / span 2' } : undefined

// Tiles appear in reading order: left to right, then the next row.
const delay = (row: number, col: number) => `${(row * count.value + col) * 55}ms`
</script>

<template>
  <div ref="wall">
    <!-- Narrower than 5 columns the intro goes above the grid. -->
    <slot v-if="count && !integrated" name="intro" :integrated="false" />

    <div class="bento grid items-stretch gap-4" :class="{ 'bento--in': entered }" :style="gridStyle">
      <div v-if="integrated" class="min-w-0" :style="{ gridColumn: '1 / span 2', gridRow: 1 }">
        <slot name="intro" :integrated="true" />
      </div>

      <!-- Nothing is rendered until the width is known, so tiles are not built for a layout that is dropped. -->
      <div
        v-for="(column, c) in columns"
        :key="`${count}-${c}`"
        aria-hidden="true"
        class="flex min-w-0 flex-col gap-4"
        :style="columnStyle(c)"
      >
        <component
          :is="entry.c"
          v-for="(entry, r) in column"
          :key="r"
          :class="{ grow: r === column.length - 1 }"
          :style="{ '--d': delay(r, c) }"
          inert
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Before the bento scrolls into view the tiles wait invisible, then each one pops in on its turn. */
.bento :deep(.tile) {
  opacity: 0;
  transform: translateY(14px) scale(0.94);
}
.bento--in :deep(.tile) {
  animation: tile-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) forwards;
}
@keyframes tile-in {
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .bento :deep(.tile) { opacity: 1; transform: none; }
  .bento--in :deep(.tile) { animation: none; }
}
</style>
