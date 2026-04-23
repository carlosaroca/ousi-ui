<script setup lang="ts">
import { computed, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { useHaptics } from '@ousi-ui/haptics'
import { provideRadioGroup } from './radio.context'
import {
  radioGroupLabelTheme,
  radioGroupDescriptionTheme,
  radioGroupErrorTheme,
} from './radio.theme'
import type { RadioGroupProps, RadioGroupEmits } from './radio.types'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  orientation: 'vertical',
  disabled: false,
  required: false,
  shadow: 'none',
})

const emit = defineEmits<RadioGroupEmits>()

const groupId = useId()
const errorId = useId()
const descId = useId()

const selectedValue = useControllableState<string>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? '',
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const isInvalid = computed(() => !!props.errorMessage)

const { trigger: triggerHaptic } = useHaptics()

provideRadioGroup({
  selectedValue,
  disabled: computed(() => props.disabled),
  isInvalid,
  shadow: computed(() => props.shadow),
  select: (value: string) => {
    const preset = props.haptic !== undefined ? props.haptic : 'selection' as const
    triggerHaptic(preset)
    selectedValue.value = value
  },
})
</script>

<template>
  <div
    :class="cn('flex flex-col', props.class)"
    role="radiogroup"
    :aria-labelledby="label ? groupId : undefined"
    :aria-describedby="errorMessage ? errorId : description ? descId : undefined"
    :aria-required="required || undefined"
    :aria-invalid="isInvalid || undefined"
    :data-orientation="orientation"
  >
    <!-- Group label -->
    <p v-if="label" :id="groupId" :class="radioGroupLabelTheme">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-ousi-danger" aria-hidden="true">*</span>
    </p>

    <!-- Group description -->
    <p v-if="description && !errorMessage" :id="descId" :class="radioGroupDescriptionTheme">
      {{ description }}
    </p>

    <!-- Radios -->
    <div :class="orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-3'">
      <slot />
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" :id="errorId" :class="radioGroupErrorTheme" role="alert" aria-live="polite">
      {{ errorMessage }}
    </p>
  </div>
</template>
