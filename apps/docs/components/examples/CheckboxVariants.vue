<script setup lang="ts">
import { ref } from 'vue'
import { OCheckbox } from '@ousi-ui/vue'
const primary = ref(false)
const secondary = ref(false)
</script>
<template>
  <div class="flex flex-col gap-4">
    <OCheckbox v-model="primary" variant="primary" label="Primary" />
    <OCheckbox v-model="secondary" variant="secondary" label="Secondary" />
  </div>
</template>
