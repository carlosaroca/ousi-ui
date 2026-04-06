<script setup lang="ts">
import { ref } from 'vue'
import { OColorField } from '@ousi-ui/vue'
const primary = ref('#3b82f6')
const secondary = ref('#22c55e')
</script>
<template>
  <div class="flex flex-col gap-4">
    <OColorField v-model="primary" label="Primary variant" variant="primary" show-swatch />
    <OColorField v-model="secondary" label="Secondary variant" variant="secondary" show-swatch />
  </div>
</template>
