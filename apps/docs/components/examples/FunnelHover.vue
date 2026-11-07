<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
const focused = ref<number | null>(null)
const active = computed(() => (focused.value == null ? null : stages[focused.value]))
</script>
<template>
  <!-- The header reacts to the hovered stage through v-model:focused. -->
  <OCard class="w-full max-w-xl gap-5 p-5">
    <div>
      <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Conversion funnel' }}</div>
      <OAnimatedNumber
        :value="active ? active.value : stages[0].value"
        animation="count"
        class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground"
      />
    </div>
    <OFunnel v-model:focused="focused" :stages="stages" :height="200" />
  </OCard>
</template>
