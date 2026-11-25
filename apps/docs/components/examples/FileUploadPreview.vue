<script setup lang="ts">
import { ref } from 'vue'
import { OFileUpload, type FileUploadPreview, type FileUploadUploadedFile } from '@ousi-ui/vue'

// A wide image, so that cropping shows. In your app this is the thumbnail URL of your server.
const banner = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><rect width="240" height="80" rx="10" fill="#1b5cff"/><text x="120" y="56" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#fff" text-anchor="middle">Acme Co</text></svg>',
)
const sample = (): FileUploadUploadedFile[] => [{ id: 1, name: 'acme-banner.png', size: 18_400, previewUrl: banner }]

const options: { value: FileUploadPreview; title: string }[] = [
  { value: 'contain', title: 'preview="contain" (default): the whole image' },
  { value: 'cover', title: 'preview="cover": fills the box, cropping' },
  { value: 'none', title: 'preview="none": always the icon, no thumbnails' },
]
const uploaded = ref(options.map(sample))
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <!-- Add an image of your own to see that new files follow the same setting. -->
    <OFileUpload
      v-for="(option, index) in options"
      :key="option.value"
      v-model:uploaded-files="uploaded[index]"
      :label="option.title"
      :preview="option.value"
      variant="button"
      text="Add images"
      accept="image/*"
      multiple
      hide-hint
    />
  </div>
</template>
