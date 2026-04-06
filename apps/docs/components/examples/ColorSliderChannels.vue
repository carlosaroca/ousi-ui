<script setup lang="ts">
import { OColorSlider } from '@ousi-ui/vue'
const hue = ref(200)
const saturation = ref(70)
const alpha = ref(1)
</script>
<template>
  <div class="flex flex-col gap-4">
    <OColorSlider v-model="hue" channel="hue" label="Hue" />
    <OColorSlider v-model="saturation" channel="saturation" label="Saturation" />
    <OColorSlider v-model="alpha" channel="alpha" label="Alpha" />
  </div>
</template>
