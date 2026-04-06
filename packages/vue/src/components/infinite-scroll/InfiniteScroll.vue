<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { cn } from '@ousi-ui/core'
import type { InfiniteScrollProps, InfiniteScrollEmits } from './infinite-scroll.types'
import { infiniteScrollTheme, infiniteScrollLoaderTheme } from './infinite-scroll.theme'

const props = withDefaults(defineProps<InfiniteScrollProps>(), {
  loading: false,
  disabled: false,
  threshold: 100,
})

const emit = defineEmits<InfiniteScrollEmits>()

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinelRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !props.loading && !props.disabled) {
        emit('load-more')
      }
    },
    { rootMargin: `0px 0px ${props.threshold}px 0px` },
  )

  observer.observe(sentinelRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div :class="cn(infiniteScrollTheme, props.class)">
    <slot />
    <div ref="sentinelRef" class="h-px" />
    <div v-if="loading" :class="infiniteScrollLoaderTheme">
      <slot name="loader">
        <svg class="size-5 animate-spin text-ousi-muted" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
      </slot>
    </div>
  </div>
</template>
