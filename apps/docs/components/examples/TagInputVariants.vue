<script setup lang="ts">
import { ref } from 'vue'
import { OTagInput } from '@ousi-ui/vue'
const primary = ref(['Vue', 'Nuxt'])
const secondary = ref(['React', 'Next'])
</script>
<template>
  <div class="flex flex-col gap-4">
    <OTagInput v-model="primary" variant="primary" placeholder="Primary variant..." />
    <OTagInput v-model="secondary" variant="secondary" placeholder="Secondary variant..." />
  </div>
</template>
