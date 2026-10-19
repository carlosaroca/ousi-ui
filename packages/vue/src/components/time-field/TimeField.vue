<script setup lang="ts">
import { computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { useOusiConfig, getHour12ForLocale, useOusiMessages } from '../../config'
import {
  dateFieldWrapperTheme,
  dateFieldSegmentTheme,
  dateFieldLiteralTheme,
  dateFieldPlaceholderTheme,
} from '../date-field/date-field.theme'
import { useTimeSegments } from './use-time-segments'
import type { TimeFieldProps, TimeFieldEmits, TimeFieldValue, TimeSegmentType } from './time-field.types'

const ousiText = useOusiMessages()

const props = withDefaults(defineProps<TimeFieldProps>(), {
  granularity: 'minute',
  disabled: false,
  readOnly: false,
  variant: 'primary',
  size: 'md',
  shadow: 'xs',
  animated: false,
})

const config = useOusiConfig()
const effectiveLocale = computed(() => props.locale ?? config.locale.value)
const effectiveHour12 = computed(() =>
  props.hour12 ?? config.hour12.value ?? getHour12ForLocale(effectiveLocale.value),
)

const emit = defineEmits<TimeFieldEmits>()

const value = useControllableState<TimeFieldValue | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const {
  segments,
  filled,
  focusedIndex,
  period,
  range,
  segmentNumber,
  segmentText,
  handleKeydown,
  handleFocus,
  handleBlur,
  setRef,
} = useTimeSegments({
  value,
  hour12: effectiveHour12,
  showMinutes: () => true,
  showSeconds: () => props.granularity === 'second',
  editable: () => !props.readOnly && !props.disabled,
})

function segmentLabel(type: TimeSegmentType): string {
  if (type === 'hour') return ousiText.value.hour
  if (type === 'minute') return ousiText.value.minute
  if (type === 'second') return ousiText.value.second
  return ousiText.value.period
}
</script>

<template>
  <div
    :class="cn(dateFieldWrapperTheme({ variant, size, shadow, animated }), props.class)"
    :data-disabled="disabled || undefined"
    role="group"
    :aria-label="label ?? ousiText.timeField"
  >
    <template v-for="(seg, idx) in segments" :key="idx">
      <span v-if="seg.type === 'literal'" :class="dateFieldLiteralTheme">
        {{ seg.text }}
      </span>

      <span
        v-else
        :ref="(el) => setRef(el, idx)"
        :class="dateFieldSegmentTheme(focusedIndex === idx)"
        role="spinbutton"
        :tabindex="disabled ? -1 : 0"
        :aria-label="segmentLabel(seg.type)"
        :aria-valuenow="seg.type === 'dayPeriod' ? undefined : segmentNumber(seg.type)"
        :aria-valuetext="seg.type === 'dayPeriod' ? period : undefined"
        :aria-valuemin="seg.type === 'dayPeriod' ? undefined : range(seg.type)[0]"
        :aria-valuemax="seg.type === 'dayPeriod' ? undefined : range(seg.type)[1]"
        @keydown="handleKeydown($event, idx)"
        @focus="handleFocus(idx)"
        @blur="handleBlur"
      >
        <template v-if="seg.type === 'dayPeriod'">
          {{ period }}
        </template>
        <template v-else-if="filled.has(seg.type)">
          {{ segmentText(seg.type) }}
        </template>
        <span v-else :class="dateFieldPlaceholderTheme">{{ seg.placeholder }}</span>
      </span>
    </template>
  </div>
</template>
