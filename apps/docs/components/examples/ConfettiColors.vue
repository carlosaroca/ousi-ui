<script setup lang="ts">
import { ref } from 'vue'

const confettiRef = ref()
const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff']
</script>

<template>
  <OButton @click="confettiRef?.fire()">Rainbow Burst</OButton>
  <OConfetti ref="confettiRef" :colors="colors" :particle-count="120" />
</template>
