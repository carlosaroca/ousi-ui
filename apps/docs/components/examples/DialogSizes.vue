<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, OButton } from '@ousi-ui/vue'
const open = ref(false)
const size = ref<'sm' | 'lg' | 'full'>('sm')
function show(s: 'sm' | 'lg' | 'full') { size.value = s; open.value = true }
</script>
<template>
  <div class="flex gap-3">
    <OButton variant="outline" @click="show('sm')">Small</OButton>
    <OButton variant="outline" @click="show('lg')">Large</OButton>
    <OButton variant="outline" @click="show('full')">Full</OButton>
  </div>
  <ODialog v-model="open" :size="size">
    <ODialog.Header>{{ size }} Dialog</ODialog.Header>
    <ODialog.Body>Content for the {{ size }} size dialog.</ODialog.Body>
    <ODialog.Footer>
      <OButton @click="open = false">Close</OButton>
    </ODialog.Footer>
  </ODialog>
</template>
