<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OLightbox } from '@ousi-ui/vue'

function swatch(color: string, text: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="${color}"/>` +
    `<text x="600" y="440" font-family="sans-serif" font-size="120" font-weight="600" text-anchor="middle" fill="#fff">${text}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
const all = () => [
  { id: 1, src: swatch('#1b5cff', 'Receipt 1'), alt: 'Receipt 1', downloadName: 'receipt-1.svg', amount: '$48.00' },
  { id: 2, src: swatch('#7c5cff', 'Receipt 2'), alt: 'Receipt 2', downloadName: 'receipt-2.svg', amount: '$112.50' },
  { id: 3, src: swatch('#f6623a', 'Receipt 3'), alt: 'Receipt 3', downloadName: 'receipt-3.svg', amount: '$9.90' },
]

const receipts = ref(all())
const open = ref(false)
const index = ref(0)
// Removing the picture on show shows the next one; removing the last closes the viewer.
const remove = (position: number) => receipts.value.splice(position, 1)
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <OButton variant="outline" :disabled="!receipts.length" @click="open = true">
      View {{ receipts.length }} receipts
    </OButton>
    <OButton v-if="receipts.length < 3" variant="text" size="sm" @click="receipts = all()">Bring them back</OButton>

    <OLightbox v-model="open" v-model:index="index" :images="receipts" downloadable loop>
      <template #actions="{ index: position }">
        <button type="button" class="h-10 rounded-ousi-4xl bg-white/10 px-4 text-sm font-medium transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-ousi-focus" @click="remove(position)">
          Delete
        </button>
      </template>
      <template #caption="{ image }">
        <span class="font-semibold">{{ (image as { amount?: string }).amount }}</span>
        <span class="text-white/70"> · {{ image.downloadName }}</span>
      </template>
    </OLightbox>
  </div>
</template>
