<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
import { cn, useControllableState, generateId } from '@ousi-ui/core'
import { useDisclosureGroupContext } from './disclosure.context'
import {
  disclosureTheme,
  disclosureHeadingTheme,
  disclosureTriggerTheme,
  disclosureIndicatorTheme,
  disclosureContentTheme,
  disclosureBodyTheme,
} from './disclosure.theme'
import type { DisclosureProps, DisclosureEmits } from './disclosure.types'

const props = withDefaults(defineProps<DisclosureProps>(), {
  defaultOpen: false,
  disabled: false,
})

const emit = defineEmits<DisclosureEmits>()

const id = `disclosure-${generateId()}`

// Group context (if nested inside DisclosureGroup)
const group = useDisclosureGroupContext()

// Local controlled state (used when standalone, no group)
const isOpenLocal = useControllableState<boolean>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultOpen,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

// Final open state: group has priority
const isOpen = computed(() =>
  group ? group.isExpanded(id) : isOpenLocal.value,
)

function toggle() {
  if (props.disabled) return
  if (group) {
    group.toggle(id)
  } else {
    isOpenLocal.value = !isOpenLocal.value
  }
}

// ── Height animation ──
// We measure the INNER body div, not the outer clipped container,
// because the container has height:0 when collapsed.
const bodyRef = ref<HTMLElement | null>(null)
const panelHeight = ref(0)

function measureHeight() {
  if (!bodyRef.value) return
  panelHeight.value = bodyRef.value.scrollHeight
}

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    measureHeight()
  }
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (isOpen.value) {
    measureHeight()
  }
  if (bodyRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (isOpen.value) measureHeight()
    })
    resizeObserver.observe(bodyRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

const contentStyle = computed(() => ({
  height: isOpen.value ? `${panelHeight.value}px` : '0px',
  opacity: isOpen.value ? '1' : '0',
  transition: 'height 200ms cubic-bezier(0.33, 0, 0.2, 1), opacity 200ms ease-out',
}))
</script>

<template>
  <div
    :class="cn(disclosureTheme, props.class)"
    :data-expanded="isOpen || undefined"
    :data-disabled="disabled || undefined"
  >
    <!-- Heading -->
    <div :class="disclosureHeadingTheme" role="heading" aria-level="3">
      <button
        :id="`${id}-trigger`"
        type="button"
        :class="disclosureTriggerTheme"
        :aria-expanded="isOpen"
        :aria-controls="`${id}-content`"
        :disabled="disabled || undefined"
        @click="toggle"
      >
        <!-- Trigger slot — content goes INSIDE the button -->
        <slot name="trigger" :is-open="isOpen" :toggle="toggle">
          <span class="flex-1 text-left text-sm font-medium text-ousi-foreground">
            <slot name="title" />
          </span>
        </slot>

        <!-- Indicator (chevron) — can be overridden via #indicator slot -->
        <slot name="indicator" :is-open="isOpen">
          <svg
            :class="disclosureIndicatorTheme(isOpen)"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </slot>
      </button>
    </div>

    <!-- Content panel — height + opacity animated -->
    <div
      :id="`${id}-content`"
      :class="disclosureContentTheme"
      :style="contentStyle"
      role="region"
      :aria-labelledby="`${id}-trigger`"
    >
      <div ref="bodyRef" :class="disclosureBodyTheme">
        <slot />
      </div>
    </div>
  </div>
</template>
