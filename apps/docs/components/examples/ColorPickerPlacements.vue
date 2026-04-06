<script setup lang="ts">
import { ref } from 'vue'
import { OColorPicker } from '@ousi-ui/vue'
import type { ColorPickerValue } from '@ousi-ui/vue'
const c1 = ref<ColorPickerValue>({ h: 0, s: 80, v: 80, a: 1 })
const c2 = ref<ColorPickerValue>({ h: 120, s: 80, v: 80, a: 1 })
const c3 = ref<ColorPickerValue>({ h: 260, s: 80, v: 80, a: 1 })
</script>
<template>
  <div class="flex items-center gap-6 flex-wrap">
    <OColorPicker v-model="c1" placement="bottom-start" />
    <OColorPicker v-model="c2" placement="bottom" />
    <OColorPicker v-model="c3" placement="bottom-end" />
  </div>
</template>
