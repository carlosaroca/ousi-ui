<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, ODotMatrix } from '@ousi-ui/vue'

const rand = (s: number) => { const x = Math.sin(s * 45.164) * 43758.5453; return x - Math.floor(x) }
const data = Array.from({ length: 30 }, (_, i) => ({ label: `Jun ${i + 1}`, value: Math.round(1200 + rand(i + 5) * 3800) }))
const focused = ref<number | null>(null)
const active = computed(() => (focused.value == null ? null : data[focused.value]))
const total = data.reduce((s, d) => s + d.value, 0)
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Daily active users · June' }}</div>
      <OAnimatedNumber :value="active ? active.value : total" animation="count" :duration="250" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
    </div>
    <!-- v-model:focused keeps the header in sync; the built-in tooltip is turned off -->
    <ODotMatrix v-model:focused="focused" :data="data" :max="5000" color="violet" :dot-size="16" :tooltip="false" />
  </OCard>
</template>
