<script setup lang="ts">
import { ref } from 'vue'
import { OActivityRings, OButton } from '@ousi-ui/vue'

const focused = ref<string | null>('Move')
const rings = [
  { label: 'Move', value: 520, max: 600, color: 'danger' },
  { label: 'Exercise', value: 24, max: 30, color: 'success' },
  { label: 'Stand', value: 7, max: 12, color: 'accent' },
]
</script>
<template>
  <div class="flex flex-col items-center gap-5">
    <OActivityRings v-model:focused="focused" :rings="rings" :size="170" />
    <!-- Any control can drive the focus through v-model:focused. -->
    <div class="flex gap-2">
      <OButton
        v-for="r in rings"
        :key="r.label"
        size="sm"
        :variant="focused === r.label ? 'primary' : 'secondary'"
        @click="focused = focused === r.label ? null : r.label"
      >
        {{ r.label }}
      </OButton>
    </div>
  </div>
</template>
