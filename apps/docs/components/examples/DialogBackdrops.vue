<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton } from '@ousi-ui/vue'
import type { OverlayBackdrop } from '@ousi-ui/vue'

const backdrops: OverlayBackdrop[] = ['opaque', 'subtle', 'blur', 'glass', 'transparent']
const open = ref(false)
const current = ref<OverlayBackdrop>('opaque')

function show(backdrop: OverlayBackdrop) {
  current.value = backdrop
  open.value = true
}
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton v-for="b in backdrops" :key="b" variant="outline" @click="show(b)">{{ b }}</OButton>
  </div>

  <ODialog v-model="open" :backdrop="current" size="sm">
    <ODialogHeader :title="`Backdrop: ${current}`" />
    <ODialogBody>The page behind stays visible to a different degree with each backdrop.</ODialogBody>
    <ODialogFooter>
      <OButton @click="open = false">Close</OButton>
    </ODialogFooter>
  </ODialog>
</template>
