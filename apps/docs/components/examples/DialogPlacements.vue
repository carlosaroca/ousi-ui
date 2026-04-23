<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton } from '@ousi-ui/vue'
const open = ref(false)
const placement = ref<'top' | 'center' | 'bottom'>('center')
function show(p: 'top' | 'center' | 'bottom') { placement.value = p; open.value = true }
</script>
<template>
  <div class="flex gap-3">
    <OButton variant="outline" @click="show('top')">Top</OButton>
    <OButton variant="outline" @click="show('center')">Center</OButton>
    <OButton variant="outline" @click="show('bottom')">Bottom</OButton>
  </div>
  <ODialog v-model="open" :placement="placement">
    <ODialogHeader>{{ placement }} placement</ODialogHeader>
    <ODialogBody>Dialog placed at {{ placement }}.</ODialogBody>
    <ODialogFooter>
      <OButton @click="open = false">Close</OButton>
    </ODialogFooter>
  </ODialog>
</template>
