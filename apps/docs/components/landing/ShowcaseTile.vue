<script setup lang="ts">
import { computed } from 'vue'
import { OChip, OStatus } from '@ousi-ui/vue'

/**
 * A flat tile of the landing bento: no shadow, only a change of tone.
 *
 * - `soft`  the grey of the page one step darker (most tiles)
 * - `light` white, for charts and cards that should read as paper
 * - `dark`  near black. It re-themes everything inside with the library's own dark theme, so
 *           a switch, a ring or a slider keep their contrast on a light page.
 *
 * `title` and `isNew` add a small header: the name of what the tile shows and a "New" badge.
 * The badge comes in two styles so the grid does not repeat itself: `status` (a dot with a halo,
 * from OStatus) and `chip` (a soft pill with a verified seal, from OChip), tinted by `badgeColor`.
 */
const props = withDefaults(defineProps<{
  tone?: 'soft' | 'light' | 'dark'
  title?: string
  isNew?: boolean
  badge?: 'status' | 'chip'
  badgeColor?: 'accent' | 'success' | 'violet' | 'orange'
}>(), { tone: 'soft', badge: 'status', badgeColor: 'accent' })

const toneClass = computed(() => ({
  soft: 'bg-ousi-default',
  light: 'bg-ousi-surface',
  dark: 'dark bg-[oklch(0.16_0.004_285)] ring-1 ring-inset ring-white/[0.07]',
})[props.tone])

// The dark theme brings its own accent; keep the one the visitor picked in the hero.
const style = computed(() => props.tone === 'dark'
  ? { '--ousi-accent': 'var(--showcase-accent, #1b5cff)' }
  : undefined)
</script>

<template>
  <div
    class="tile flex min-w-0 flex-col rounded-ousi-3xl p-5 text-ousi-foreground transition-colors duration-500"
    :class="toneClass"
    :data-theme="tone === 'dark' ? 'dark' : undefined"
    :style="style"
  >
    <div v-if="title || isNew" class="mb-3 flex items-center justify-between gap-2">
      <span class="truncate text-[11px] font-medium text-ousi-muted">{{ title }}</span>
      <template v-if="isNew">
        <OChip v-if="badge === 'chip'" size="sm" variant="soft" :color="badgeColor" class="font-semibold">
          <template #start>
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg>
          </template>
          New
        </OChip>
        <OStatus v-else :color="badgeColor" variant="halo" size="sm">New</OStatus>
      </template>
    </div>
    <slot />
  </div>
</template>
