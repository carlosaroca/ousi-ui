<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, OButton } from '@ousi-ui/vue'
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
    <ODialog.Header>{{ placement }} placement</ODialog.Header>
    <ODialog.Body>Dialog placed at {{ placement }}.</ODialog.Body>
    <ODialog.Footer>
      <OButton @click="open = false">Close</OButton>
    </ODialog.Footer>
  </ODialog>
</template>
