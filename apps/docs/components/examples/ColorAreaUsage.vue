<script setup lang="ts">
import { OColorArea } from '@ousi-ui/vue'
const value = ref({ x: 80, y: 80 })
</script>
<template>
  <OColorArea v-model="value" :hue="200" />
</template>
