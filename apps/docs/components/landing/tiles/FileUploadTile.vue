<script setup lang="ts">
import { computed } from 'vue'
import { OFileUpload } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

// Real File objects, so the component draws its own name, size and progress. They are created
// once, with only the sizes they should report.
const make = (name: string, mb: number) => new File([new ArrayBuffer(Math.round(mb * 1e6))], name)
const pool = [
  make('brand-kit.zip', 2.4),
  make('hero-v3.fig', 5.1),
  make('reel-cut.mp4', 11.4),
  make('invoice-nov.pdf', 0.8),
  make('icons.svg', 1.2),
  make('moodboard.png', 3.7),
]

// Three rows that never leave: each one uploads at its own beat and, once it is done and has been
// shown for a moment, is replaced by the next file. The list is always full, so the tile never
// changes height and never shows an empty box.
const PERIOD = 6.4
const rows = computed(() =>
  [0, 1, 2].map((i) => {
    const time = t.value + i * 2.1 + 1.2
    const round = Math.floor(time / PERIOD)
    const into = time % PERIOD
    return {
      file: pool[(round * 3 + i) % pool.length],
      progress: Math.round(Math.min(100, Math.max(0, ((into - 0.3) / 3.2) * 100))),
    }
  }),
)
const files = computed(() => rows.value.map((r) => r.file))
const statusOf = (file: File) => ({ progress: rows.value.find((r) => r.file === file)?.progress ?? 0 })
</script>

<template>
  <ShowcaseTile tone="light" title="File upload" class="grow">
    <OFileUpload :model-value="files" :file-status="statusOf" multiple size="sm" hide-hint class="w-full" />
  </ShowcaseTile>
</template>
