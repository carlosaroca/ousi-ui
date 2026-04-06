<script setup lang="ts">
import { ref } from 'vue'

const confettiRef = ref()
</script>

<template>
  <OButton @click="confettiRef?.fire()">Celebrate!</OButton>
  <OConfetti ref="confettiRef" />
</template>
