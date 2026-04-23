<script setup lang="ts">
import { computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import {
  switchLabelTheme,
  switchDescriptionTheme,
  switchContentTheme,
  switchSizes,
  switchTrackShadowTheme,
} from './switch.theme'
import type { SwitchProps, SwitchEmits } from './switch.types'

const props = withDefaults(defineProps<SwitchProps>(), {
  size: 'md',
  disabled: false,
  readonly: false,
  shadow: 'none',
})

const emit = defineEmits<SwitchEmits>()

const checked = useControllableState<boolean>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? false,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const resolvedHaptic = computed(() => {
  if (props.disabled) return 'none'
  return props.haptic ?? 'light'
})

function toggle() {
  if (props.disabled || props.readonly) return
  checked.value = !checked.value
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}

const dims = computed(() => switchSizes[props.size])

const trackStyle = computed(() => ({
  width: `${dims.value.track.w}px`,
  height: `${dims.value.track.h}px`,
  borderRadius: '9999px',
  backgroundColor: checked.value
    ? 'var(--ousi-accent)'
    : 'var(--ousi-default)',
  transition: 'background-color 250ms ease',
}))

const thumbStyle = computed(() => {
  const travel = dims.value.track.w - dims.value.thumb.w - dims.value.pad * 2
  return {
    width: `${dims.value.thumb.w}px`,
    height: `${dims.value.thumb.h}px`,
    transform: `translateX(${checked.value ? travel : 0}px)`,
    transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
    marginLeft: `${dims.value.pad}px`,
  }
})
</script>

<template>
  <div
    v-haptic="resolvedHaptic"
    :class="cn(
      'group inline-flex items-center gap-3 select-none outline-none',
      disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
      props.class,
    )"
    :data-selected="checked || undefined"
    :data-disabled="disabled || undefined"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    tabindex="0"
    @click="toggle"
    @keydown="handleKeydown"
  >
    <!-- Track -->
    <div
      :class="cn(
        'relative flex shrink-0 items-center rounded-full group-focus-visible:ring-2 group-focus-visible:ring-ousi-focus group-focus-visible:ring-offset-2',
        switchTrackShadowTheme[shadow],
      )"
      :style="trackStyle"
    >
      <!-- Thumb — pill shape -->
      <div
        class="bg-white shadow-sm rounded-full"
        :style="thumbStyle"
      >
        <slot name="thumb" />
      </div>
    </div>

    <!-- Label + Description -->
    <div v-if="label || description || $slots.default" :class="switchContentTheme">
      <span v-if="label" :class="switchLabelTheme">{{ label }}</span>
      <slot v-else />
      <span v-if="description" :class="switchDescriptionTheme">{{ description }}</span>
    </div>
  </div>
</template>
