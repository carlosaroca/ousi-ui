<script setup lang="ts">
import { ref } from 'vue'
import { OFileUpload, type FileUploadUploadedFile } from '@ousi-ui/vue'

// A thumbnail your server made of the floor plan. Without a previewUrl a file shows its icon.
const plan = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="#eef2ff"/><g fill="none" stroke="#4f46e5" stroke-width="5"><path d="M20 20h120v80H20zM80 20v45M20 65h38M100 65h40"/></g></svg>',
)

// What your API returns for the record being edited.
const saved = ref<FileUploadUploadedFile[]>([
  { id: 1, name: 'Signed contract.pdf', size: 312_000 },
  { id: 2, name: 'Floor plan.png', size: 1_840_000, previewUrl: plan },
])
const added = ref<File[]>([])
const last = ref('')
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-2">
    <OFileUpload
      v-model="added"
      v-model:uploaded-files="saved"
      multiple
      label="Attachments"
      :max-files="5"
      @open="(file) => (last = `Opened ${file.name}`)"
      @remove-uploaded="(file) => (last = `Delete ${file.name} on the server`)"
    />
    <p class="text-xs text-ousi-muted" aria-live="polite">{{ last }}</p>
  </div>
</template>
