<script setup lang="ts">
import { ref } from 'vue'
import { OSlider } from '@ousi-ui/vue'
const range = ref<[number, number]>([20, 80])
</script>
<template>
  <OSlider v-model="range" label="Price range" :show-output="true" />
</template>
