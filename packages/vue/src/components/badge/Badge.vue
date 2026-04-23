<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@ousi-ui/core'
import { badgeTheme, badgePlacementTheme } from './badge.theme'
import type { BadgeProps } from './badge.types'

const props = withDefaults(defineProps<BadgeProps>(), {
  color: 'danger',
  variant: 'primary',
  size: 'md',
  placement: 'top-right',
  showZero: false,
  dot: false,
  invisible: false,
  shadow: 'none',
})

const slots = useSlots()
const isAnchored = computed(() => !!slots.default)

const displayContent = computed(() => {
  if (props.dot) return ''
  if (props.content === undefined || props.content === null) return ''
  const num = typeof props.content === 'number' ? props.content : parseInt(String(props.content), 10)
  if (!isNaN(num) && props.max && num > props.max) return `${props.max}+`
  return String(props.content)
})

const isHidden = computed(() => {
  if (props.invisible) return true
  if (props.dot) return false
  if (props.content === 0 && !props.showZero) return true
  if (props.content === '0' && !props.showZero) return true
  return false
})

const badgeClasses = computed(() => cn(
  badgeTheme({
    size: props.size,
    dot: props.dot || undefined,
    color: props.color,
    variant: props.variant,
    invisible: isHidden.value || undefined,
    shadow: props.shadow,
  }),
  isAnchored.value && badgePlacementTheme[props.placement],
  props.class,
))
</script>

<template>
  <!-- Anchor mode -->
  <span v-if="isAnchored" class="relative inline-flex shrink-0">
    <slot />
    <span :class="badgeClasses">
      <span v-if="!dot && displayContent" class="px-0.5">{{ displayContent }}</span>
    </span>
  </span>

  <!-- Standalone mode -->
  <span v-else :class="badgeClasses">
    <span v-if="!dot && displayContent" class="px-0.5">{{ displayContent }}</span>
  </span>
</template>
