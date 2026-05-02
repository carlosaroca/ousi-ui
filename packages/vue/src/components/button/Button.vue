<script setup lang="ts">
import { computed, ref, useId, useSlots } from 'vue'
import { cn } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import { buttonTheme } from './button.theme'
import type { ButtonProps } from './button.types'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  isIconOnly: false,
  fullWidth: false,
  shadow: 'none',
  type: 'button',
  as: 'button',
  ripple: true,
  animationType: 'vertical',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()
const id = useId()

const isDisabled = computed(() => props.disabled || props.loading)
const hasAnimateSlot = computed(() => !!slots.animate)

const classes = computed(() =>
  cn(
    buttonTheme({
      variant: props.variant,
      size: props.size,
      isIconOnly: props.isIconOnly || undefined,
      fullWidth: props.fullWidth || undefined,
      shadow: props.shadow,
    }),
    // Tailwind `group` lets the layer spans observe `:hover` on the button.
    hasAnimateSlot.value && 'group',
    props.class,
  ),
)

// Per animation-type, hardcode at-rest + hovered classes so Tailwind's JIT picks
// them up. We animate only `transform` (not opacity) so the swap reads as a
// single continuous motion clipped by the button's overflow-hidden — no fading
// crossover. The default layer takes h-full so translateY(-100%) clears the
// button completely; without it the span only moves by its own line-height.
const animLayers = computed(() => {
  if (!hasAnimateSlot.value) return null
  const base = 'transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)]'
  switch (props.animationType) {
    case 'scale':
      return {
        default: `${base} group-hover:scale-0`,
        animate: `${base} scale-0 group-hover:scale-100`,
      }
    case 'rotate':
      return {
        default: `${base} group-hover:rotate-180`,
        animate: `${base} -rotate-180 group-hover:rotate-0`,
      }
    case 'vertical':
    default:
      return {
        default: `${base} group-hover:-translate-y-full`,
        animate: `${base} translate-y-full group-hover:translate-y-0`,
      }
  }
})

const resolvedHaptic = computed(() => {
  if (isDisabled.value) return 'none'
  if (props.haptic !== undefined) return props.haptic
  return 'none'
})

// ── Ripple effect ──
interface Ripple {
  id: number
  x: number
  y: number
  size: number
}
const ripples = ref<Ripple[]>([])
let rippleId = 0

function spawnRipple(event: PointerEvent) {
  if (!props.ripple || isDisabled.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  const id = ++rippleId
  ripples.value.push({ id, x, y, size })
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 700)
}

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="as"
    v-haptic="resolvedHaptic"
    :id="id"
    :type="as === 'button' ? type : undefined"
    :class="classes"
    :disabled="as === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
    :data-loading="loading || undefined"
    :tabindex="isDisabled ? -1 : undefined"
    :role="as !== 'button' ? 'button' : undefined"
    @pointerdown="spawnRipple"
    @click="handleClick"
  >
    <!-- Loading spinner overlay -->
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <slot name="loading">
        <svg
          class="animate-spin"
          :class="{
            'h-4 w-4': size === 'sm',
            'h-5 w-5': size === 'md',
            'h-6 w-6': size === 'lg',
          }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </slot>
    </span>

    <!-- Default content — sizes the button. When the animate slot is present we
         force h-full so the layer fills the button height and translateY(-100%)
         clears it completely (otherwise it'd only move by its own line height). -->
    <span
      :class="[
        'inline-flex items-center gap-2',
        hasAnimateSlot && 'h-full',
        loading && 'opacity-0',
        animLayers?.default,
      ]"
    >
      <slot name="start" />
      <slot />
      <slot name="end" />
    </span>

    <!-- Animate slot — absolute overlay that swaps in on hover -->
    <span
      v-if="hasAnimateSlot"
      :class="['absolute inset-0 inline-flex items-center justify-center gap-2', animLayers?.animate]"
      aria-hidden="true"
    >
      <slot name="animate" />
    </span>

    <!-- Ripples — last so they sit above content visually -->
    <span
      v-for="r in ripples"
      :key="r.id"
      class="ousi-btn-ripple absolute rounded-full pointer-events-none"
      :style="{
        left: `${r.x}px`,
        top: `${r.y}px`,
        width: `${r.size}px`,
        height: `${r.size}px`,
      }"
      aria-hidden="true"
    />
  </component>
</template>
