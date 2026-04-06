<script setup lang="ts">
import { computed } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  stepperTheme,
  stepperStepTheme,
  stepperCircleTheme,
  stepperConnectorTheme,
  stepperLabelTheme,
  stepperDescriptionTheme,
} from './stepper.theme'
import type { StepperProps, StepperEmits, StepState } from './stepper.types'

const props = withDefaults(defineProps<StepperProps>(), {
  orientation: 'horizontal',
  size: 'md',
  clickable: false,
  color: 'primary',
})

const emit = defineEmits<StepperEmits>()

const currentStep = useControllableState<number>({
  prop: computed(() => props.modelValue),
  defaultValue: props.defaultValue ?? 0,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const isHorizontal = computed(() => props.orientation === 'horizontal')

const sizeMap: Record<string, string> = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-11 text-base',
}

const connectorSizeMap: Record<string, string> = {
  horizontal: 'h-0.5 min-w-8',
  vertical: 'w-0.5 min-h-8',
}

const colorMap: Record<string, { bg: string; ring: string }> = {
  primary: { bg: 'bg-ousi-accent', ring: 'ring-ousi-accent/20' },
  secondary: { bg: 'bg-ousi-muted', ring: 'ring-ousi-muted/20' },
  success: { bg: 'bg-ousi-success', ring: 'ring-ousi-success/20' },
  danger: { bg: 'bg-ousi-danger', ring: 'ring-ousi-danger/20' },
  warning: { bg: 'bg-ousi-warning', ring: 'ring-ousi-warning/20' },
}

const colorCssMap: Record<string, string> = {
  primary: 'var(--ousi-accent)',
  secondary: 'var(--ousi-muted)',
  success: 'var(--ousi-success)',
  danger: 'var(--ousi-danger)',
  warning: 'var(--ousi-warning)',
}

function getStepState(index: number): StepState {
  if (index < currentStep.value) return 'completed'
  if (index === currentStep.value) return 'active'
  return 'upcoming'
}

function handleStepClick(index: number) {
  if (!props.clickable) return
  if (props.steps[index]?.disabled) return
  currentStep.value = index
}

function connectorStyle(index: number) {
  const state = getStepState(index)
  const nextState = getStepState(index + 1)
  const activeColor = colorCssMap[props.color] || colorCssMap.primary
  const inactiveColor = 'var(--ousi-border)'

  if (state === 'completed' && nextState !== 'upcoming') {
    return { background: activeColor }
  }
  if (state === 'completed' && nextState === 'upcoming') {
    const dir = isHorizontal.value ? 'to right' : 'to bottom'
    return { background: `linear-gradient(${dir}, ${activeColor}, ${inactiveColor})` }
  }
  return { background: inactiveColor }
}
</script>

<template>
  <div
    :class="cn(
      stepperTheme,
      isHorizontal ? 'flex-row items-start' : 'flex-col',
      props.class,
    )"
  >
    <template v-for="(step, index) in steps" :key="step.key">
      <!-- Step -->
      <div
        :class="cn(
          stepperStepTheme,
          isHorizontal ? 'flex-col items-center' : 'flex-row items-start',
          clickable && !step.disabled ? 'cursor-pointer' : '',
          step.disabled ? 'opacity-50 pointer-events-none' : '',
        )"
        @click="handleStepClick(index)"
      >
        <!-- Custom step indicator slot (replaces circle + labels) -->
        <slot name="indicator" :step="step" :index="index" :state="getStepState(index)">
          <!-- Circle -->
          <div
            :class="cn(
              stepperCircleTheme,
              sizeMap[size],
              getStepState(index) === 'completed' && [colorMap[color].bg, 'text-white'],
              getStepState(index) === 'active' && [colorMap[color].bg, 'text-white', 'ring-4', colorMap[color].ring],
              getStepState(index) === 'upcoming' && 'bg-ousi-default text-ousi-muted',
            )"
          >
            <svg
              v-if="getStepState(index) === 'completed'"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4"
            >
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <!-- Label and description -->
          <div :class="isHorizontal ? 'text-center mt-2' : 'ml-2'">
            <div :class="stepperLabelTheme">{{ step.title }}</div>
            <div v-if="step.description" :class="stepperDescriptionTheme">{{ step.description }}</div>
          </div>
        </slot>
      </div>

      <!-- Connector (not after last step) -->
      <slot v-if="index < steps.length - 1" name="connector" :index="index" :completed="getStepState(index) === 'completed'">
        <div
          :class="cn(
            stepperConnectorTheme,
            connectorSizeMap[orientation],
            isHorizontal ? 'mt-4' : 'ml-4',
          )"
          :style="connectorStyle(index)"
        />
      </slot>
    </template>
  </div>
</template>
