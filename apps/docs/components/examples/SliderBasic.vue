<script setup lang="ts">
import { ref } from 'vue'
import { OSlider } from '@ousi-ui/vue'
const volume = ref(50)
</script>
<template>
  <OSlider v-model="volume" label="Volume" :show-output="true" />
</template>
