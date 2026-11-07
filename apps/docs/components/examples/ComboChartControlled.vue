<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OComboChart } from '@ousi-ui/vue'

const data = [
  { month: 'Jan', sessions: 8200, conversion: 2.9 }, { month: 'Feb', sessions: 9100, conversion: 3.1 },
  { month: 'Mar', sessions: 8700, conversion: 3.0 }, { month: 'Apr', sessions: 10400, conversion: 3.6 },
  { month: 'May', sessions: 11800, conversion: 3.9 }, { month: 'Jun', sessions: 12600, conversion: 4.2 },
]
const focused = ref<number | null>(null)

const best = data.reduce((b, r, i) => (r.sessions > data[b].sessions ? i : b), 0)
const worst = data.reduce((b, r, i) => (r.sessions < data[b].sessions ? i : b), 0)
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-2">
      <OButton size="sm" :variant="focused === best ? 'primary' : 'secondary'" @click="focused = focused === best ? null : best">
        Best month
      </OButton>
      <OButton size="sm" :variant="focused === worst ? 'primary' : 'secondary'" @click="focused = focused === worst ? null : worst">
        Weakest month
      </OButton>
    </div>
    <!-- v-model:focused is two-way: buttons drive the chart, hovering drives the buttons. -->
    <OComboChart
      v-model:focused="focused"
      :data="data"
      category-key="month"
      :height="220"
      :bar="{ key: 'sessions', label: 'Sessions' }"
      :line="{ key: 'conversion', label: 'Conversion', format: (v) => `${v}%` }"
    />
  </div>
</template>
