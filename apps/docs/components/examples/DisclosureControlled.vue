<script setup lang="ts">
import { ref } from 'vue'
import { ODisclosure, OButton } from '@ousi-ui/vue'
const isOpen = ref(false)
</script>
<template>
  <div class="flex flex-col gap-3">
    <OButton variant="outline" size="sm" @click="isOpen = !isOpen">
      {{ isOpen ? 'Close' : 'Open' }} externally
    </OButton>
    <ODisclosure v-model="isOpen" class="border-b border-ousi-border">
      <template #title>Controlled disclosure</template>
      <p class="text-sm text-ousi-muted">Toggle me with the button above or click the title.</p>
    </ODisclosure>
  </div>
</template>
