<script setup lang="ts">
import { computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import {
  paginationTheme,
  paginationSummaryTheme,
  paginationContentTheme,
  paginationLinkTheme,
  paginationEllipsisTheme,
} from './pagination.theme'
import type { PaginationProps, PaginationEmits } from './pagination.types'

const props = withDefaults(defineProps<PaginationProps>(), {
  defaultPage: 1,
  siblings: 1,
  boundaries: 1,
  showControls: true,
  showSummary: false,
  loop: false,
  size: 'md',
  disabled: false,
})

const emit = defineEmits<PaginationEmits>()

const currentPage = useControllableState<number>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultPage,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const resolvedHaptic = computed(() => {
  if (props.disabled) return 'none'
  return props.haptic ?? 'selection'
})

function goTo(page: number) {
  if (props.disabled) return
  let next = page
  if (props.loop) {
    if (next < 1) next = props.total
    if (next > props.total) next = 1
  } else {
    next = Math.min(Math.max(1, next), props.total)
  }
  if (next !== currentPage.value) {
    currentPage.value = next
  }
}

function prev() { goTo(currentPage.value - 1) }
function next() { goTo(currentPage.value + 1) }

const canPrev = computed(() => props.loop || currentPage.value > 1)
const canNext = computed(() => props.loop || currentPage.value < props.total)

// Generate page list with ellipsis
type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

const pages = computed((): PageItem[] => {
  const { total, siblings, boundaries } = props
  const current = currentPage.value

  if (total <= 0) return []

  // Show all pages if total is small enough
  const maxVisible = boundaries * 2 + siblings * 2 + 3
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // Boundary pages
  const startPages = Array.from({ length: Math.min(boundaries, total) }, (_, i) => i + 1)
  const endPages = Array.from(
    { length: Math.min(boundaries, total) },
    (_, i) => total - boundaries + i + 1,
  )

  // Sibling pages around current
  const siblingStart = Math.max(boundaries + 1, current - siblings)
  const siblingEnd = Math.min(total - boundaries, current + siblings)
  const middlePages = Array.from(
    { length: Math.max(0, siblingEnd - siblingStart + 1) },
    (_, i) => siblingStart + i,
  )

  // Merge, deduplicate, sort
  const allPages = new Set([...startPages, ...middlePages, ...endPages])
  const sorted = Array.from(allPages).sort((a, b) => a - b)

  const result: PageItem[] = []
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i])
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      result.push(sorted[i] < current ? 'ellipsis-start' : 'ellipsis-end')
    }
  }

  return result
})
</script>

<template>
  <nav
    :class="cn(paginationTheme, props.class)"
    role="navigation"
    aria-label="Pagination"
  >
    <!-- Summary -->
    <p v-if="showSummary" :class="paginationSummaryTheme({ size })">
      Page {{ currentPage }} of {{ total }}
    </p>

    <!-- Content -->
    <ul :class="paginationContentTheme" role="list">
      <!-- Prev -->
      <li v-if="showControls" class="inline-flex">
        <button
          v-haptic="resolvedHaptic"
          type="button"
          :class="paginationLinkTheme({ size, nav: true })"
          :disabled="(!canPrev || disabled) || undefined"
          aria-label="Go to previous page"
          @click="prev"
        >
          <slot name="prev-icon">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </slot>
          <span v-if="prevLabel">{{ prevLabel }}</span>
        </button>
      </li>

      <!-- Pages + ellipsis -->
      <li
        v-for="(page, idx) in pages"
        :key="`${page}-${idx}`"
        class="inline-flex"
      >
        <span
          v-if="page === 'ellipsis-start' || page === 'ellipsis-end'"
          :class="paginationEllipsisTheme({ size })"
          aria-hidden="true"
        >···</span>

        <button
          v-else
          v-haptic="resolvedHaptic"
          type="button"
          :class="paginationLinkTheme({ size, active: page === currentPage })"
          :disabled="disabled || undefined"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goTo(page as number)"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next -->
      <li v-if="showControls" class="inline-flex">
        <button
          v-haptic="resolvedHaptic"
          type="button"
          :class="paginationLinkTheme({ size, nav: true })"
          :disabled="(!canNext || disabled) || undefined"
          aria-label="Go to next page"
          @click="next"
        >
          <span v-if="nextLabel">{{ nextLabel }}</span>
          <slot name="next-icon">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </slot>
        </button>
      </li>
    </ul>
  </nav>
</template>
