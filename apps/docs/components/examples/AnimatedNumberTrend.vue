<script setup lang="ts">
import { ref } from 'vue'

const count = ref(50)
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="grid grid-cols-3 gap-8">
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted">Always Up</span>
        <OAnimatedNumber :value="count" trend="up" class="text-3xl font-bold text-ousi-foreground" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted">Always Down</span>
        <OAnimatedNumber :value="count" trend="down" class="text-3xl font-bold text-ousi-foreground" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-xs text-ousi-muted">Auto</span>
        <OAnimatedNumber :value="count" trend="auto" class="text-3xl font-bold text-ousi-foreground" />
      </div>
    </div>
    <div class="flex gap-2">
      <OButton size="sm" @click="count += 7">+7</OButton>
      <OButton size="sm" @click="count -= 7">-7</OButton>
    </div>
  </div>
</template>
