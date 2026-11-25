<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { OFileUpload, OImageEditorDialog } from '@ousi-ui/vue'

const editor = ref<InstanceType<typeof OImageEditorDialog>>()
const photo = ref<File[]>([])
const url = ref('')

watch(photo, ([file]) => {
  if (url.value) URL.revokeObjectURL(url.value)
  url.value = file ? URL.createObjectURL(file) : ''
})
onBeforeUnmount(() => url.value && URL.revokeObjectURL(url.value))
</script>

<template>
  <div class="flex items-center gap-4">
    <span class="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ousi-default text-xs text-ousi-muted">
      <img v-if="url" :src="url" alt="Your avatar" class="size-full object-cover" />
      <template v-else>No photo</template>
    </span>
    <!-- edit() opens the dialog and answers with the cropped file, or null on Cancel. -->
    <OFileUpload
      v-model="photo"
      variant="button"
      text="Choose a photo"
      accept="image/*"
      hide-file-list
      hide-hint
      class="!w-auto"
      :transform="(file, { signal }) => editor!.edit(file, { signal })"
    />
    <OImageEditorDialog
      ref="editor"
      title="Crop your photo"
      shape="circle"
      :max-dimension="512"
      :max-size="200 * 1024"
      hide-output-settings
    />
  </div>
</template>
