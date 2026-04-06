<script setup lang="ts">
import { OColorPicker } from '@ousi-ui/vue'
const color = ref({ h: 200, s: 80, v: 80, a: 1 })
</script>
<template>
  <OColorPicker v-model="color" label="Color" />
</template>
