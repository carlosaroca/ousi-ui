<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OFileUpload } from '@ousi-ui/vue'

const files = ref<File[]>([new File([new ArrayBuffer(304 * 1024)], 'Q1 forecast.xlsx')])
const downloaded = ref('')
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <!-- Texts, an extra action per row and, with CSS variables, the shape of the area. -->
    <OFileUpload
      v-model="files"
      multiple
      text="Attach files to INV-1043"
      hint="Harbor Labs · JPG, PNG or PDF up to 5 MB"
      class="[--file-upload-radius:0.5rem] [--file-upload-bg:var(--ousi-surface)]"
    >
      <template #file-actions="{ file }">
        <OButton variant="text" size="sm" :aria-label="`Download ${file.name}`" @click="downloaded = file.name">
          Download
        </OButton>
      </template>
    </OFileUpload>

    <!-- Your own icon in place of the illustration. -->
    <OFileUpload text="Drop your avatar" accept="image/*" size="sm">
      <template #icon="{ active }">
        <span class="flex size-10 items-center justify-center rounded-full bg-ousi-accent-soft text-ousi-accent transition-transform" :class="active && 'scale-110'">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>
        </span>
      </template>
    </OFileUpload>
  </div>
</template>
