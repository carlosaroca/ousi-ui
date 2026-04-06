<script setup lang="ts">
import { OColorField } from '@ousi-ui/vue'
const color = ref('#3b82f6')
</script>
<template>
  <OColorField v-model="color" label="Color" show-swatch />
</template>
