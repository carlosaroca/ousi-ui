<script setup lang="ts">
import { ref } from 'vue'

const count = ref(1234)

function randomize() {
  count.value = Math.floor(Math.random() * 9999)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OAnimatedNumber :value="count" class="text-4xl font-bold text-ousi-foreground" />
    <div class="flex gap-2">
      <OButton size="sm" @click="count += 1">+1</OButton>
      <OButton size="sm" @click="count += 10">+10</OButton>
      <OButton size="sm" @click="count -= 10">-10</OButton>
      <OButton size="sm" variant="flat" @click="randomize">Random</OButton>
    </div>
  </div>
</template>
