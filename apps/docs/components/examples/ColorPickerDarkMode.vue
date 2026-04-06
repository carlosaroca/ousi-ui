<script setup lang="ts">
import { ref } from 'vue'
import { OColorPicker } from '@ousi-ui/vue'
import type { ColorPickerValue } from '@ousi-ui/vue'
const light = ref<ColorPickerValue>({ h: 220, s: 80, v: 80, a: 1 })
const dark = ref<ColorPickerValue>({ h: 150, s: 70, v: 70, a: 1 })
</script>
<template>
  <div class="flex items-start gap-6">
    <div>
      <p class="text-xs text-ousi-muted mb-2">Light mode</p>
      <OColorPicker v-model="light" label="Brand" show-swatches />
    </div>
    <div class="rounded-ousi-xl p-4" style="background-color: #0a0a0a" data-theme="dark">
      <p class="text-xs mb-2" style="color: rgba(255,255,255,0.4)">Dark mode</p>
      <OColorPicker v-model="dark" label="Brand" show-swatches />
    </div>
  </div>
</template>
