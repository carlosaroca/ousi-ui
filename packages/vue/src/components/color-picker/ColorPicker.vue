<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, toRef } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useEscapeKey } from '@ousi-ui/core'
import { OColorArea } from '../color-area'
import { OColorSlider } from '../color-slider'
import { OColorSwatch } from '../color-swatch'
import { OColorField } from '../color-field'
import { colorPickerTriggerTheme } from './color-picker.theme'
import { DEFAULT_SWATCHES } from './color-picker.types'
import type { ColorPickerProps, ColorPickerEmits, ColorPickerValue } from './color-picker.types'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  showAlpha: true,
  showHexInput: true,
  showSwatches: false,
  swatches: () => DEFAULT_SWATCHES,
  placement: 'bottom-start',
  disabled: false,
})

const emit = defineEmits<ColorPickerEmits>()

const isMounted = useMounted()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const value = useControllableState<ColorPickerValue>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? { h: 220, s: 80, v: 80, a: 1 },
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Sub-component bindings
const hue = computed({
  get: () => value.value.h,
  set: (h) => { value.value = { ...value.value, h } },
})

const area = computed({
  get: () => ({ x: value.value.s, y: value.value.v }),
  set: (v) => { value.value = { ...value.value, s: v.x, v: v.y } },
})

const alpha = computed({
  get: () => value.value.a,
  set: (a) => { value.value = { ...value.value, a } },
})

function hsvToHsl(h: number, s: number, v: number) {
  const l = v * (1 - s / 200)
  const sl = l === 0 || l === 100 ? 0 : ((v - l) / Math.min(l, 100 - l)) * 100
  return { h, s: sl, l }
}

const currentColor = computed(() => {
  const { h, s, l } = hsvToHsl(value.value.h, value.value.s, value.value.v)
  return `hsla(${h}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, ${value.value.a})`
})

const hexColor = computed(() => {
  if (typeof document === 'undefined') return '#000000'
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = currentColor.value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
})

function handleHexChange(hex: string) {
  if (!hex || hex.length < 7) return
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const v = max * 100
  const s = max === 0 ? 0 : (d / max) * 100
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  value.value = { h, s: Math.round(s), v: Math.round(v), a: value.value.a }
}

function selectSwatch(hex: string) {
  const full = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex
  handleHexChange(full)
}

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: computed(() => props.placement),
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(8), flip(), shift({ padding: 8 })],
})

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

useEscapeKey({ handler: () => { isOpen.value = false }, enabled: isOpen })

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !popoverRef.value?.contains(t)) {
    isOpen.value = false
  }
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))
</script>

<template>
  <div :class="cn('inline-flex', props.class)">
    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      :class="colorPickerTriggerTheme"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-label="label ?? 'Pick a color'"
      @click="toggle"
    >
      <OColorSwatch :color="currentColor" shape="square" size="md" class="rounded-ousi-md" />
      <span v-if="label" class="text-sm font-medium text-ousi-foreground">{{ label }}</span>
      <span v-else class="text-sm text-ousi-muted font-mono">{{ hexColor }}</span>
    </button>

    <!-- Popover -->
    <Teleport to="body">
      <div
        v-if="isOpen && isMounted"
        ref="popoverRef"
        :style="floatingStyles"
        class="z-50"
      >
        <AnimatePresence>
          <Motion
            tag="div"
            class="flex flex-col gap-3 bg-ousi-overlay text-ousi-foreground shadow-ousi-xl border border-ousi-border/20 px-2 pt-2 pb-3 overflow-hidden"
            :style="{ minWidth: '248px', borderRadius: 'calc(var(--ousi-radius, 0.5rem) * 2.5)' }"
            :initial="{ opacity: 0, scale: 0.95, y: -4 }"
            :animate="{ opacity: 1, scale: 1, y: 0 }"
            :exit="{ opacity: 0, scale: 0.95 }"
            :transition="{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }"
          >
            <!-- Color Area -->
            <OColorArea
              :model-value="area"
              :hue="hue"
              class="max-w-full"
              @update:model-value="area = $event"
            />

            <!-- Sliders -->
            <div class="flex flex-col gap-2 px-1">
              <OColorSlider
                :model-value="hue"
                channel="hue"
                :context-color="{ s: area.x, l: 50 }"
                @update:model-value="hue = $event"
              />
              <OColorSlider
                v-if="showAlpha"
                :model-value="alpha"
                channel="alpha"
                :context-color="{ h: hue, s: area.x, l: area.y / 2 }"
                @update:model-value="alpha = $event"
              />
            </div>

            <!-- Hex input -->
            <div v-if="showHexInput" class="flex items-center gap-2 px-1">
              <OColorSwatch :color="currentColor" shape="circle" size="sm" />
              <OColorField
                :model-value="hexColor"
                :show-swatch="false"
                variant="secondary"
                full-width
                @change="handleHexChange"
              />
            </div>

            <!-- Swatches -->
            <div v-if="showSwatches" class="flex flex-wrap gap-1 px-1">
              <button
                v-for="sw in swatches"
                :key="sw"
                type="button"
                class="rounded-ousi-sm outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
                :class="hexColor === sw ? 'ring-2 ring-ousi-accent ring-offset-1 ring-offset-ousi-overlay' : ''"
                @click="selectSwatch(sw)"
              >
                <OColorSwatch :color="sw" size="sm" shape="square" />
              </button>
            </div>
          </Motion>
        </AnimatePresence>
      </div>
    </Teleport>
  </div>
</template>
