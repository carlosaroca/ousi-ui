<script setup lang="ts">
import { OColorSlider } from '@ousi-ui/vue'
const hue = ref(200)
</script>
<template>
  <OColorSlider v-model="hue" channel="hue" label="Hue" />
</template>
