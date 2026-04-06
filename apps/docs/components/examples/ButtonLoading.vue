<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
const isLoading = ref(false)
function simulateLoading() {
  isLoading.value = true
  setTimeout(() => (isLoading.value = false), 2000)
}
</script>
<template>
  <div class="flex gap-3">
    <OButton :loading="true">Loading</OButton>
    <OButton :loading="isLoading" @click="simulateLoading">
      {{ isLoading ? 'Saving...' : 'Click to save' }}
    </OButton>
  </div>
</template>
