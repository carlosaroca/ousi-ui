<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { cn } from '@ousi-ui/core'
import { resolveChartColor, useChartMotion, useElementWidth, useFocus, useRoving } from '../chart-shared'
import type { FunnelItem, FunnelProps, FunnelSlots } from './funnel.types'

const props = withDefaults(defineProps<FunnelProps>(), {
  variant: 'columns',
  shape: 'smooth',
  mono: false,
  height: 240,
  showPercent: true,
  showLegend: true,
  halo: true,
  interactive: true,
  animated: true,
})

const emit = defineEmits<{
  'update:focused': [index: number | null]
  'stage-enter': [item: FunnelItem, event: Event]
  'stage-leave': [item: FunnelItem, event: Event]
  'stage-click': [item: FunnelItem, event: Event]
}>()
const { focused, setFocused } = useFocus(() => props.focused, (v) => emit('update:focused', v as never))
const roving = useRoving(() => props.stages.length)
defineSlots<FunnelSlots>()

const uid = useId()
const root = ref<HTMLElement | null>(null)
const width = useElementWidth(root)
const { mounted, motion } = useChartMotion(() => props.animated)

const MONO_RAMP = (i: number, n: number) =>
  `color-mix(in srgb, var(--ousi-foreground) ${Math.round(46 - (i / Math.max(n - 1, 1)) * 28)}%, var(--ousi-background))`
const fmt = (n: number) => props.formatValue?.(n) ?? n.toLocaleString()

const items = computed<FunnelItem[]>(() => {
  const top = props.stages[0]?.value || 1
  const n = props.stages.length
  return props.stages.map((s, index) => {
    const prev = index === 0 ? s.value : props.stages[index - 1].value
    return {
      key: s.id ?? s.label,
      index,
      label: s.label,
      value: s.value,
      percent: Math.round((s.value / top) * 100),
      stepPercent: prev ? Math.round((s.value / prev) * 100) : 0,
      formatted: fmt(s.value),
      color: props.mono ? MONO_RAMP(index, n) : resolveChartColor(s.color, index),
    }
  })
})

const isDimmed = (i: number) => focused.value != null && focused.value !== i

function enter(item: FunnelItem, e: Event) {
  if (!props.interactive) return
  setFocused(item.index)
  emit('stage-enter', item, e)
}
function leave(item: FunnelItem, e: Event) {
  if (!props.interactive) return
  setFocused(null)
  emit('stage-leave', item, e)
}
function click(item: FunnelItem, e: Event) {
  if (props.interactive) emit('stage-click', item, e)
}

// ---- flow geometry (columns)
const SEP = 3 // separator between stages, in px
const HALO = [7, 15] // halo layers, in px
const RADIUS = 16
const FLAT = 0.45 // share of a stage that stays flat before blending into the next one

const geo = computed(() => {
  const n = Math.max(items.value.length, 1)
  const sw = width.value / n
  const top = props.stages[0]?.value || 1
  const pad = props.halo ? HALO[1] + 2 : 2
  const usable = Math.max(props.height - pad * 2, 10)
  const cy = props.height / 2
  const hs = items.value.map((it) => Math.max(it.value / top, 0.05) * usable)

  return items.value.map((it, i) => {
    const xL = i * sw
    const xR = xL + sw
    const xf = props.shape === 'sharp' ? xL : xL + sw * FLAT
    const last = i === n - 1
    const h0 = hs[i]
    const h1 = last ? h0 : hs[i + 1]
    const t0 = cy - h0 / 2, b0 = cy + h0 / 2
    const t1 = cy - h1 / 2, b1 = cy + h1 / 2
    const rl = i === 0 ? Math.min(RADIUS, h0 / 2) : 0
    const rr = last ? Math.min(RADIUS, h1 / 2) : 0
    const k = (xR - xf) * 0.55
    const curveTop = last ? `H${xR - rr}` : props.shape === 'sharp' ? `L${xR},${t1}` : `C${xf + k},${t0} ${xR - k},${t1} ${xR},${t1}`
    const curveBot = last ? `H${xf}` : props.shape === 'sharp' ? `L${xf},${b0}` : `C${xR - k},${b1} ${xf + k},${b0} ${xf},${b0}`
    const d =
      `M${xL},${t0 + rl}` +
      (rl ? `Q${xL},${t0} ${xL + rl},${t0}` : '') +
      `H${xf}` +
      curveTop +
      (rr ? `Q${xR},${t1} ${xR},${t1 + rr}V${b1 - rr}Q${xR},${b1} ${xR - rr},${b1}` : `V${b1}`) +
      curveBot +
      `H${xL + rl}` +
      (rl ? `Q${xL},${b0} ${xL},${b0 - rl}` : '') +
      'Z'
    return { d, xL, xR, cx: xL + sw * 0.42, cy }
  })
})

const ariaLabel = computed(() => props.label ?? items.value.map((i) => `${i.label} ${i.formatted}`).join(', '))
</script>

<template>
  <div data-roving-root ref="root" :class="cn('w-full', props.class)" role="group" :aria-label="ariaLabel">
    <!-- Flow -->
    <template v-if="variant === 'columns'">
      <div class="relative" :style="{ height: `${height}px` }">
        <svg :width="width" :height="height" class="block overflow-visible">
          <defs>
            <clipPath v-for="(g, i) in geo" :id="`${uid}-s${i}`" :key="i">
              <rect :x="g.xL + (i === 0 ? 0 : SEP / 2)" y="0" :width="g.xR - g.xL - (i === 0 ? SEP / 2 : i === geo.length - 1 ? SEP / 2 : SEP)" :height="height" />
            </clipPath>
            <clipPath :id="`${uid}-reveal`">
              <rect
                x="-20" y="-20" :height="height + 40" :width="mounted ? width + 40 : 0"
                :style="{ transition: motion ? 'width 1100ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none' }"
              />
            </clipPath>
          </defs>

          <g :clip-path="`url(#${uid}-reveal)`">
            <g
              v-for="(g, i) in geo"
              :key="items[i].key"
              :class="interactive && 'cursor-pointer outline-none'"
              :style="{ opacity: isDimmed(i) ? 0.3 : 1, transition: 'opacity 200ms ease-out' }"
              :tabindex="roving.tabindexFor(i, interactive)" :data-roving="i" @focusin="roving.activate(i)" @keydown="roving.onKeydown($event, i)"
              role="img"
              :aria-label="`${items[i].label}: ${items[i].formatted}, ${items[i].percent}%`"
              @mouseenter="enter(items[i], $event)"
              @mouseleave="leave(items[i], $event)"
              @focus="enter(items[i], $event)"
              @blur="leave(items[i], $event)"
              @click="click(items[i], $event)"
              @keydown.enter.prevent="click(items[i], $event)"
              @keydown.space.prevent="click(items[i], $event)"
            >
              <g :clip-path="`url(#${uid}-s${i})`">
                <template v-if="halo">
                  <path
                    v-for="(h, hi) in HALO" :key="h"
                    :d="g.d" fill="none" :stroke="items[i].color" :stroke-width="h * 2" stroke-linejoin="round"
                    :style="{ opacity: (hi === 0 ? 0.2 : 0.1) * (focused === i ? 1.7 : 1), transition: 'opacity 200ms' }"
                  />
                </template>
                <path :d="g.d" :fill="items[i].color" />
              </g>
            </g>
          </g>
        </svg>

        <template v-if="showPercent">
          <div
            v-for="(g, i) in geo"
            :key="`p-${items[i].key}`"
            class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-ousi-background/90 px-2.5 py-0.5 text-xs font-medium tabular-nums text-ousi-foreground shadow-sm transition-opacity duration-200"
            :style="{ left: `${g.cx}px`, top: `${g.cy}px`, opacity: mounted ? (isDimmed(i) ? 0.4 : 1) : 0 }"
          >
            {{ items[i].percent }}%
          </div>
        </template>
      </div>

      <!-- Legend tiles -->
      <div v-if="showLegend" class="mt-3 grid gap-2" :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(120px, 1fr))` }">
        <div
          v-for="it in items"
          :key="`t-${it.key}`"
          class="rounded-2xl bg-ousi-default px-3.5 py-3 transition-opacity duration-200"
          :class="[interactive && 'cursor-pointer', isDimmed(it.index) && 'opacity-40']"
          @mouseenter="enter(it, $event)"
          @mouseleave="leave(it, $event)"
          @click="click(it, $event)"
        >
          <slot name="stage" :item="it" :focused="focused === it.index" :dimmed="isDimmed(it.index)">
            <div class="flex items-center gap-2 text-sm text-ousi-muted">
              <span class="inline-block size-3.5 shrink-0 rounded-md" :style="{ backgroundColor: it.color }" />
              <span class="truncate">{{ it.label }}</span>
            </div>
            <div class="mt-1 text-base font-medium tabular-nums text-ousi-foreground">{{ it.formatted }}</div>
          </slot>
        </div>
      </div>
    </template>

    <!-- Bars -->
    <ul v-else class="flex flex-col gap-2">
      <li
        v-for="it in items"
        :key="it.key"
        class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 outline-none"
        :class="interactive && 'cursor-pointer'"
        :tabindex="roving.tabindexFor(it.index, interactive)" :data-roving="it.index" @focusin="roving.activate(it.index)" @keydown="roving.onKeydown($event, it.index)"
        @mouseenter="enter(it, $event)"
        @mouseleave="leave(it, $event)"
        @focus="enter(it, $event)"
        @blur="leave(it, $event)"
        @click="click(it, $event)"
        @keydown.enter.prevent="click(it, $event)"
        @keydown.space.prevent="click(it, $event)"
      >
        <span class="min-w-16 text-sm text-ousi-muted transition-opacity duration-200" :class="isDimmed(it.index) && 'opacity-40'">
          {{ it.label }}
        </span>
        <div class="h-9 overflow-hidden rounded-full bg-ousi-default">
          <div
            class="flex h-full items-center rounded-full pl-2.5 transition-[filter,opacity] duration-200"
            :style="{
              width: mounted ? `${Math.max(it.percent, 8)}%` : '0%',
              backgroundColor: it.color,
              opacity: isDimmed(it.index) ? 0.3 : 1,
              filter: focused === it.index ? 'brightness(0.88)' : 'none',
              transition: motion
                ? `width 800ms cubic-bezier(0.22, 1, 0.36, 1) ${it.index * 80}ms, opacity 200ms, filter 200ms`
                : 'opacity 200ms, filter 200ms',
            }"
          >
            <span class="text-white"><slot name="icon" :item="it" /></span>
          </div>
        </div>
        <div class="min-w-20 text-right transition-opacity duration-200" :class="isDimmed(it.index) && 'opacity-40'">
          <slot name="stage" :item="it" :focused="focused === it.index" :dimmed="isDimmed(it.index)">
            <span class="text-sm font-semibold tabular-nums text-ousi-foreground">{{ it.formatted }}</span>
            <span v-if="showPercent" class="ml-1.5 text-xs tabular-nums text-ousi-muted">{{ it.percent }}%</span>
          </slot>
        </div>
      </li>
    </ul>
  </div>
</template>
