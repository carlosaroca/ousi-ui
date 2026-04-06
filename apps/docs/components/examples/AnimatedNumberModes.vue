<script setup lang="ts">
import { ref } from 'vue'

const count = ref(42)
const modes = ['roll', 'count', 'slide', 'fade', 'flip'] as const

function randomize() {
  count.value = Math.floor(Math.random() * 999)
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-6">
      <div v-for="mode in modes" :key="mode" class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted uppercase tracking-wider">{{ mode }}</span>
        <OAnimatedNumber :value="count" :animation="mode" class="text-3xl font-bold text-ousi-foreground" />
      </div>
    </div>
    <div class="flex gap-2">
      <OButton size="sm" @click="count += 1">+1</OButton>
      <OButton size="sm" @click="count += 100">+100</OButton>
      <OButton size="sm" @click="count -= 50">-50</OButton>
      <OButton size="sm" variant="flat" @click="randomize">Random</OButton>
    </div>
  </div>
</template>
