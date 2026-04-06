<script setup lang="ts">
import { OColorArea, OColorSlider } from '@ousi-ui/vue'
const value = ref({ x: 80, y: 80 })
const hue = ref(200)
</script>
<template>
  <div class="flex flex-col gap-4">
    <OColorArea v-model="value" :hue="hue" />
    <OColorSlider v-model="hue" channel="hue" label="Hue" />
  </div>
</template>
