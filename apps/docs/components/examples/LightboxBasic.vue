<script setup lang="ts">
import { OLightbox } from '@ousi-ui/vue'

// Pictures drawn here, so the example asks nothing of another site. Use the addresses of your own.
function scene(width: number, height: number, sky: string, hill: string, sun: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 100 100" preserveAspectRatio="none">` +
    `<rect width="100" height="100" fill="${sky}"/><circle cx="72" cy="28" r="11" fill="${sun}"/>` +
    `<path d="M0 72 28 44 50 66 68 50 100 76V100H0Z" fill="${hill}"/><path d="M0 86 36 68 62 84 82 74 100 84V100H0Z" fill="#00000030"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const images = [
  { src: scene(1600, 1000, '#9cc9ff', '#2f6f4f', '#ffd24a'), alt: 'Green hills under a blue sky', caption: 'Morning in the hills' },
  { src: scene(900, 1300, '#ffb38a', '#7a3b69', '#fff0c2'), alt: 'Purple hills at sunset', caption: 'A tall one: portrait pictures fit too' },
  { src: scene(1200, 1200, '#1f2a5c', '#0e1430', '#e8ecff'), alt: 'Dark hills under the moon', caption: 'Night' },
  { src: scene(1800, 900, '#cfeee4', '#176b87', '#ff7d5c'), alt: 'Blue hills and a red sun' },
]
</script>
<template>
  <OLightbox :images="images">
    <!-- The trigger slot draws what opens it, wherever the component is placed. -->
    <template #trigger="{ open }">
      <div class="grid w-full max-w-md grid-cols-4 gap-2">
        <button
          v-for="(image, index) in images"
          :key="image.alt"
          type="button"
          class="aspect-square overflow-hidden rounded-ousi-xl outline-none transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-ousi-focus"
          :aria-label="`Open: ${image.alt}`"
          @click="open(index)"
        >
          <img :src="image.src" alt="" class="size-full object-cover" />
        </button>
      </div>
    </template>
  </OLightbox>
</template>
