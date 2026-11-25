<script setup lang="ts">
import type { FileUploadFileKind } from './file-upload.types'

// A sheet of paper with a small drawing of what the file holds. It fills the box it is given, which
// keeps the 4:5 proportion. Colors come from the theme tokens.
defineProps<{ kind: FileUploadFileKind; previewUrl?: string; fit?: 'contain' | 'cover' }>()
defineEmits<{ previewError: [] }>()

const EDGE = 'color-mix(in oklab, var(--ousi-foreground) 14%, var(--ousi-surface))'
const INK = 'fill-[color:color-mix(in_oklab,var(--ousi-foreground)_16%,var(--ousi-surface))]'

const HEADINGS: Partial<Record<FileUploadFileKind, string>> = {
  doc: 'text-ousi-accent',
  pdf: 'text-ousi-danger',
  file: 'text-ousi-muted',
}

const SHEET_CELLS = [0, 1, 2, 3].flatMap((row) =>
  [0, 1, 2].map((column) => ({ x: 7.5 + column * 6.1, y: 10 + row * 5.4, head: row === 0 })),
)
</script>

<template>
  <span
    v-if="previewUrl"
    class="block size-full overflow-hidden rounded-[22%/18%] border-2 bg-ousi-surface"
    :style="{ borderColor: EDGE }"
  >
    <img
      :src="previewUrl"
      alt=""
      class="size-full"
      :class="fit === 'cover' ? 'object-cover' : 'object-contain p-px'"
      @error="$emit('previewError')"
    />
  </span>

  <svg v-else viewBox="0 0 32 40" class="block size-full" aria-hidden="true" :data-kind="kind">
    <rect x="1" y="1" width="30" height="38" rx="7" class="fill-ousi-surface" :style="{ stroke: EDGE }" stroke-width="2" />

    <g v-if="kind in HEADINGS">
      <rect x="8" y="9" width="11" height="3" rx="1.5" fill="currentColor" :class="HEADINGS[kind]" />
      <g :class="INK">
        <rect x="8" y="16" width="16" height="2" rx="1" />
        <rect x="8" y="21" width="16" height="2" rx="1" />
        <rect x="8" y="26" width="16" height="2" rx="1" />
        <rect x="8" y="31" width="10" height="2" rx="1" />
      </g>
    </g>

    <g v-else-if="kind === 'sheet'" class="text-ousi-success" fill="currentColor">
      <rect
        v-for="cell in SHEET_CELLS"
        :key="`${cell.x}-${cell.y}`"
        :x="cell.x"
        :y="cell.y"
        width="4.8"
        height="3.8"
        rx="1"
        :opacity="cell.head ? 0.85 : 0.3"
      />
    </g>

    <g v-else-if="kind === 'image'" class="text-ousi-violet" fill="currentColor">
      <rect x="6.5" y="10" width="19" height="20" rx="4" opacity="0.2" />
      <circle cx="19.5" cy="16" r="2.4" />
      <path d="M6.5 26.5c2.6-4.6 5.6-6 8.4-3.4 1.7 1.6 3.1 2.1 4.8 1.1 2.1-1.2 4.2-.9 5.8.9V26a4 4 0 0 1-4 4H10.5a4 4 0 0 1-4-3.5z" opacity="0.65" />
    </g>

    <g v-else-if="kind === 'video'" class="text-ousi-orange" fill="currentColor">
      <rect x="6.5" y="10" width="19" height="14" rx="4" opacity="0.2" />
      <path d="M14 14.2v5.6a.7.7 0 0 0 1.05.6l4.6-2.8a.7.7 0 0 0 0-1.2l-4.6-2.8a.7.7 0 0 0-1.05.6z" />
      <rect x="7" y="28.5" width="18" height="2" rx="1" :class="INK" />
      <rect x="7" y="28.5" width="7" height="2" rx="1" />
      <circle cx="14" cy="29.5" r="2.4" />
    </g>

    <g v-else-if="kind === 'audio'" class="text-ousi-violet" fill="currentColor">
      <rect
        v-for="(height, index) in [6, 12, 18, 10, 14, 7]"
        :key="index"
        :x="7 + index * 3.2"
        :y="21 - height / 2"
        width="2"
        :height="height"
        rx="1"
        :opacity="index % 2 ? 0.9 : 0.5"
      />
    </g>

    <g v-else-if="kind === 'slides'" class="text-ousi-orange" fill="currentColor">
      <rect x="6.5" y="11" width="19" height="16" rx="3" opacity="0.2" />
      <rect x="10" y="19" width="3" height="5" rx="1" />
      <rect x="14.5" y="15" width="3" height="9" rx="1" />
      <rect x="19" y="17" width="3" height="7" rx="1" />
      <rect x="9" y="31" width="14" height="2" rx="1" :class="INK" />
    </g>

    <g v-else-if="kind === 'archive'" class="text-ousi-warning" fill="currentColor">
      <rect v-for="index in 5" :key="index" :x="index % 2 ? 13 : 16" :y="4.5 + index * 3.5" width="3" height="3" rx="0.8" />
      <rect x="12.5" y="25" width="7" height="8" rx="2" opacity="0.35" />
      <rect x="14.5" y="28" width="3" height="3" rx="1" />
    </g>

    <g v-else class="text-ousi-accent" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m12 16-4.5 4.5L12 25M20 16l4.5 4.5L20 25" />
      <path d="m17.5 14-3 13" opacity="0.5" />
    </g>
  </svg>
</template>
