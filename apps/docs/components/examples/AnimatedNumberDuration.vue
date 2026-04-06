<script setup lang="ts">
import { ref } from 'vue'

const count = ref(100)

function randomize() {
  count.value = Math.floor(Math.random() * 999)
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="grid grid-cols-2 gap-8">
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted">Fast (200ms)</span>
        <OAnimatedNumber :value="count" :duration="200" class="text-3xl font-bold text-ousi-foreground" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted">Slow (1200ms)</span>
        <OAnimatedNumber :value="count" :duration="1200" class="text-3xl font-bold text-ousi-foreground" />
      </div>
    </div>
    <OButton size="sm" variant="flat" @click="randomize">Randomize</OButton>
  </div>
</template>
