<script setup lang="ts">
import { ref, computed, watch, toRef, onBeforeUnmount } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'
import { AnimatePresence, Motion } from 'motion-v'
import { cn, useControllableState, useMounted, useEscapeKey, generateId } from '@ousi-ui/core'
import { useOusiConfig, getHour12ForLocale, useOusiMessages } from '../../config'
import {
  timePickerWrapperTheme,
  timePickerTriggerTheme,
  timePickerIndicatorTheme,
  timePickerLabelTheme,
  timePickerDescriptionTheme,
  timePickerErrorTheme,
  timePickerPopoverTheme,
  timePickerWheelRowTheme,
  timePickerSelectionBandTheme,
  timePickerSeparatorTheme,
  timePickerFooterTheme,
} from './time-picker.theme'
import {
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from '../date-field/date-field.theme'
import TimePickerWheel from './TimePickerWheel.vue'
import OButton from '../button/Button.vue'
import { useTimeSegments } from '../time-field/use-time-segments'
import type { TimePickerProps, TimePickerEmits } from './time-picker.types'
import type { TimeFieldValue, TimeSegmentType } from '../time-field/time-field.types'

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<TimePickerProps>(), {
  granularity: 'minute',
  interval: 5,
  placement: 'bottom-start',
  disabled: false,
  readonly: false,
  required: false,
  variant: 'primary',
  size: 'md',
  shadow: 'xs',
  animated: false,
  showNow: true,
})

const emit = defineEmits<TimePickerEmits>()

// ── i18n: effective locale + hour12 (prop > config > locale-derived) ──
const config = useOusiConfig()
const effectiveLocale = computed(() => props.locale ?? config.locale.value)
const effectiveHour12 = computed(() =>
  props.hour12 ?? config.hour12.value ?? getHour12ForLocale(effectiveLocale.value),
)

// Localized AM/PM labels via formatToParts. Falls back to literal AM/PM if Intl
// doesn't return a dayPeriod for this locale (rare edge case).
const periodLabels = computed(() => {
  const fmt = (hour: number): string => {
    try {
      const parts = new Intl.DateTimeFormat(effectiveLocale.value, { hour: 'numeric', hour12: true })
        .formatToParts(new Date(2026, 0, 1, hour))
      const dp = parts.find((p) => p.type === 'dayPeriod')
      return dp?.value ?? (hour < 12 ? 'AM' : 'PM')
    } catch {
      return hour < 12 ? 'AM' : 'PM'
    }
  }
  return { AM: fmt(6), PM: fmt(18) }
})

// Accessible IDs
const fieldId = `tp-${generateId()}`
const descId = `tp-desc-${generateId()}`
const errorId = `tp-err-${generateId()}`

const isMounted = useMounted()
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

// Controlled value
const value = useControllableState<TimeFieldValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Working draft inside the popover (committed on OK / Now / outside-click).
// Initialized lazily on open from current value or 12:00 default.
const draftHour = ref(0)
const draftMinute = ref(0)
const draftSecond = ref(0)
const draftPeriod = ref<'AM' | 'PM'>('AM')

// ── min/max helpers — convert to seconds for easy comparison ──
function tToSec(t: TimeFieldValue): number {
  return t.hour * 3600 + t.minute * 60 + (t.second ?? 0)
}

const minSec = computed(() => (props.min ? tToSec(props.min) : -Infinity))
const maxSec = computed(() => (props.max ? tToSec(props.max) : Infinity))

/** 12h display hour + period → 24h hour. */
function effectiveHour24(displayHour: number, period: 'AM' | 'PM'): number {
  if (!effectiveHour12.value) return displayHour
  const h12 = displayHour === 12 ? 0 : displayHour
  return period === 'PM' ? h12 + 12 : h12
}

function clampToRange(v: TimeFieldValue): TimeFieldValue {
  const s = tToSec(v)
  if (s < minSec.value && props.min) return { ...props.min }
  if (s > maxSec.value && props.max) return { ...props.max }
  return v
}

function syncDraftFromValue() {
  const raw = value.value
  const clamped = raw ? clampToRange(raw) : null
  if (clamped) {
    if (effectiveHour12.value) {
      draftPeriod.value = clamped.hour >= 12 ? 'PM' : 'AM'
      draftHour.value = clamped.hour % 12 === 0 ? 12 : clamped.hour % 12
    } else {
      draftHour.value = clamped.hour
    }
    draftMinute.value = clamped.minute
    draftSecond.value = clamped.second ?? 0
  } else {
    // No initial value — start at min if present, else sensible defaults.
    const start = props.min ?? { hour: 0, minute: 0, second: 0 }
    if (effectiveHour12.value) {
      draftPeriod.value = start.hour >= 12 ? 'PM' : 'AM'
      draftHour.value = start.hour % 12 === 0 ? 12 : start.hour % 12
    } else {
      draftHour.value = start.hour
    }
    draftMinute.value = start.minute
    draftSecond.value = start.second ?? 0
  }
}

// ── Per-wheel "disabled" predicates — recompute reactively as the draft changes ──
function isHourDisabled(displayHour: number): boolean {
  const h24 = effectiveHour24(displayHour, draftPeriod.value)
  // Range of times at hour h24, given current draft minute/second freedom: [h24:00:00, h24:59:59]
  const lowSec = h24 * 3600
  const highSec = h24 * 3600 + 3599
  if (highSec < minSec.value) return true
  if (lowSec > maxSec.value) return true
  return false
}

function isMinuteDisabled(m: number): boolean {
  const h24 = effectiveHour24(draftHour.value, draftPeriod.value)
  const lowSec = h24 * 3600 + m * 60
  const highSec = lowSec + 59
  if (highSec < minSec.value) return true
  if (lowSec > maxSec.value) return true
  return false
}

function isSecondDisabled(s: number): boolean {
  const h24 = effectiveHour24(draftHour.value, draftPeriod.value)
  const sec = h24 * 3600 + draftMinute.value * 60 + s
  if (sec < minSec.value) return true
  if (sec > maxSec.value) return true
  return false
}

function isPeriodDisabled(p: string): boolean {
  if (!effectiveHour12.value) return false
  const range = p === 'AM' ? [0, 11] : [12, 23]
  const lowSec = range[0] * 3600
  const highSec = range[1] * 3600 + 3599
  if (highSec < minSec.value) return true
  if (lowSec > maxSec.value) return true
  return false
}

// Cast to the wheel's predicate signature (it accepts string|number values).
const hourPredicate = (v: number | string) => isHourDisabled(v as number)
const minutePredicate = (v: number | string) => isMinuteDisabled(v as number)
const secondPredicate = (v: number | string) => isSecondDisabled(v as number)
const periodPredicate = (v: number | string) => isPeriodDisabled(v as string)

// Wheel item generators
const hourItems = computed(() => {
  const range = effectiveHour12.value
    ? Array.from({ length: 12 }, (_, i) => i + 1) // 1..12
    : Array.from({ length: 24 }, (_, i) => i)     // 0..23
  return range.map((n) => ({ value: n, label: String(n).padStart(2, '0') }))
})

const minuteItems = computed(() => {
  const step = props.interval
  const range = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
  return range.map((n) => ({ value: n, label: String(n).padStart(2, '0') }))
})

const secondItems = computed(() => {
  const range = Array.from({ length: 60 }, (_, i) => i)
  return range.map((n) => ({ value: n, label: String(n).padStart(2, '0') }))
})

const periodItems = computed(() => [
  { value: 'AM', label: periodLabels.value.AM },
  { value: 'PM', label: periodLabels.value.PM },
])

const showMinutes = computed(() => props.granularity !== 'hour')
const showSeconds = computed(() => props.granularity === 'second')

// Build a TimeFieldValue from current draft, normalizing for 12/24h.
// When granularity hides a unit, that unit is forced to 0 in the emitted value.
function draftToValue(): TimeFieldValue {
  let hour = draftHour.value
  if (effectiveHour12.value) {
    const h12 = draftHour.value === 12 ? 0 : draftHour.value
    hour = draftPeriod.value === 'PM' ? h12 + 12 : h12
  }
  const minute = showMinutes.value ? draftMinute.value : 0
  if (showSeconds.value) {
    return { hour, minute, second: draftSecond.value }
  }
  return { hour, minute }
}

function commit() {
  // Final safety net — if min/max enforcement on wheels missed an edge, clamp.
  value.value = clampToRange(draftToValue())
  isOpen.value = false
}

function cancel() {
  isOpen.value = false
}

function setNow() {
  const now = new Date()
  let candidate: TimeFieldValue = {
    hour: now.getHours(),
    minute: Math.round(now.getMinutes() / props.interval) * props.interval % 60,
    second: now.getSeconds(),
  }
  // Now might be outside [min, max] — clamp before populating wheels.
  candidate = clampToRange(candidate)
  if (effectiveHour12.value) {
    draftPeriod.value = candidate.hour >= 12 ? 'PM' : 'AM'
    draftHour.value = candidate.hour % 12 === 0 ? 12 : candidate.hour % 12
  } else {
    draftHour.value = candidate.hour
  }
  draftMinute.value = candidate.minute
  draftSecond.value = candidate.second ?? 0
}

// Open / close
function open() {
  if (props.disabled || props.readonly) return
  syncDraftFromValue()
  isOpen.value = true
}

function close() {
  isOpen.value = false
  focusFirst()
}

function toggle() {
  isOpen.value ? close() : open()
}

useEscapeKey({ handler: () => { if (isOpen.value) cancel() }, enabled: isOpen })

function handleClickOutside(e: MouseEvent) {
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !popoverRef.value?.contains(t)) {
    cancel()
  }
}

watch(isOpen, (v) => {
  if (v) document.addEventListener('pointerdown', handleClickOutside, true)
  else document.removeEventListener('pointerdown', handleClickOutside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleClickOutside, true))

// Floating UI
const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: computed(() => props.placement),
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), flip(), shift({ padding: 8 })],
})

const isInvalid = computed(() => !!props.errorMessage)
const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)

// Typing in the field while the wheels are open moves them too.
watch(value, () => { if (isOpen.value) syncDraftFromValue() })

// ── Typed entry: the field's segments edit the value directly ──
const {
  segments,
  filled,
  focusedIndex,
  period,
  range,
  segmentNumber,
  segmentText,
  focusFirst,
  handleKeydown,
  handleFocus,
  handleBlur,
  setRef,
} = useTimeSegments({
  value,
  hour12: effectiveHour12,
  showMinutes: () => showMinutes.value,
  showSeconds: () => showSeconds.value,
  editable: () => !props.disabled && !props.readonly,
})

function segmentLabel(type: TimeSegmentType): string {
  if (type === 'hour') return ousiText.value.hour
  if (type === 'minute') return ousiText.value.minute
  if (type === 'second') return ousiText.value.second
  return ousiText.value.period
}

function onSegmentKeydown(e: KeyboardEvent, idx: number) {
  if (e.altKey && e.key === 'ArrowDown') {
    e.preventDefault()
    open()
    return
  }
  handleKeydown(e, idx)
}

function onFieldClick(e: MouseEvent) {
  if (props.disabled || props.readonly) return
  if (!(e.target as HTMLElement).closest('[role="spinbutton"]')) focusFirst()
  open()
}

// A typed time outside [min, max] is clamped once the field loses focus.
function onFieldFocusOut(e: FocusEvent) {
  if (triggerRef.value?.contains(e.relatedTarget as Node | null)) return
  if (value.value) {
    const clamped = clampToRange(value.value)
    if (tToSec(clamped) !== tToSec(value.value)) value.value = clamped
  }
}
</script>

<template>
  <div :class="cn(timePickerWrapperTheme, props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      :class="timePickerLabelTheme({ required, disabled, invalid: isInvalid })"
    >
      {{ label }}
    </label>

    <!-- Field: typed segments + clock button that opens the wheels, one border -->
    <div
      ref="triggerRef"
      :id="fieldId"
      :class="timePickerTriggerTheme({ variant, size, shadow, animated })"
      :data-disabled="disabled || undefined"
      :data-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      role="group"
      :aria-label="label ?? ousiText.timePicker"
      tabindex="-1"
      @click="onFieldClick"
      @focusout="onFieldFocusOut"
    >
      <template v-for="(seg, idx) in segments" :key="idx">
        <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">{{ seg.text }}</span>
        <span
          v-else
          :ref="(el) => setRef(el, idx)"
          :class="dateFieldSegmentTheme(focusedIndex === idx)"
          role="spinbutton"
          :tabindex="disabled ? -1 : 0"
          :aria-label="segmentLabel(seg.type)"
          :aria-valuenow="seg.type === 'dayPeriod' ? undefined : segmentNumber(seg.type)"
          :aria-valuetext="seg.type === 'dayPeriod' ? periodLabels[period] : undefined"
          :aria-valuemin="seg.type === 'dayPeriod' ? undefined : range(seg.type)[0]"
          :aria-valuemax="seg.type === 'dayPeriod' ? undefined : range(seg.type)[1]"
          @keydown="onSegmentKeydown($event, idx)"
          @focus="handleFocus(idx)"
          @blur="handleBlur"
        >
          <template v-if="seg.type === 'dayPeriod'">
            <template v-if="filled.has('hour')">{{ periodLabels[period] }}</template>
            <span v-else :class="dateFieldPlaceholderTheme">--</span>
          </template>
          <template v-else-if="filled.has(seg.type)">{{ segmentText(seg.type) }}</template>
          <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
        </span>
      </template>

      <span class="flex-1" />

      <button
        type="button"
        :class="timePickerIndicatorTheme"
        :aria-label="ousiText.openTimePicker"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        :disabled="disabled || readonly"
        tabindex="-1"
        @click.stop="toggle"
      >
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>
    </div>

    <!-- Description -->
    <p v-if="description && !errorMessage" :id="descId" :class="timePickerDescriptionTheme">{{ description }}</p>
    <p v-if="errorMessage" :id="errorId" :class="timePickerErrorTheme" role="alert" aria-live="polite">{{ errorMessage }}</p>
  </div>

  <!-- Popover with wheels -->
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
          :class="timePickerPopoverTheme"
          :initial="{ opacity: 0, scale: 0.96, y: -4 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.96 }"
          :transition="{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }"
          role="dialog"
          aria-modal="false"
          :aria-label="ousiText.pickTime"
        >
          <!-- Wheel row -->
          <div :class="timePickerWheelRowTheme">
            <!-- Selected band -->
            <div :class="timePickerSelectionBandTheme" aria-hidden="true" />

            <!-- Hour wheel -->
            <TimePickerWheel
              v-model="draftHour"
              :items="hourItems"
              :label="ousiText.hour"
              infinite
              :is-disabled="hourPredicate"
            />

            <!-- Minute wheel — hidden when granularity = 'hour' -->
            <template v-if="showMinutes">
              <span :class="timePickerSeparatorTheme">:</span>
              <TimePickerWheel
                v-model="draftMinute"
                :items="minuteItems"
                :label="ousiText.minute"
                infinite
                :is-disabled="minutePredicate"
              />
            </template>

            <!-- Second wheel (only when granularity = second) -->
            <template v-if="showSeconds">
              <span :class="timePickerSeparatorTheme">:</span>
              <TimePickerWheel
                v-model="draftSecond"
                :items="secondItems"
                :label="ousiText.second"
                infinite
                :is-disabled="secondPredicate"
              />
            </template>

            <!-- AM/PM wheel (only when hour12) — NOT infinite, only 2 items -->
            <TimePickerWheel
              v-if="effectiveHour12"
              v-model="draftPeriod"
              :items="periodItems"
              :label="ousiText.period"
              :is-disabled="periodPredicate"
            />
          </div>

          <!-- Footer -->
          <div :class="timePickerFooterTheme">
            <OButton v-if="showNow" variant="text" size="sm" @click="setNow">{{ ousiText.now }}</OButton>
            <span v-else />
            <div class="flex gap-2">
              <OButton variant="outline" size="sm" @click="cancel">{{ ousiText.cancel }}</OButton>
              <OButton size="sm" @click="commit">{{ ousiText.ok }}</OButton>
            </div>
          </div>
        </Motion>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
