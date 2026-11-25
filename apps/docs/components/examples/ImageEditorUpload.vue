<script setup lang="ts">
import { ref } from 'vue'
import { OFileUpload, OImageEditorDialog } from '@ousi-ui/vue'

const LIMIT = 500 * 1024
const editor = ref<InstanceType<typeof OImageEditorDialog>>()
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Each image opens in the editor, one after another. PDFs go straight to the list. -->
    <OFileUpload
      multiple
      accept="image/*,.pdf"
      :max-size="LIMIT"
      text="Drop receipts here"
      hint="Crop each photo; it is saved under 500 KB"
      :transform="(file, { signal }) => editor!.edit(file, { signal })"
    />
    <OImageEditorDialog ref="editor" title="Frame the receipt" :max-size="LIMIT" />
  </div>
</template>
