<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OSankey } from '@ousi-ui/vue'
import type { SankeyLinkItem, SankeyNodeItem } from '@ousi-ui/vue'

const nodes = [
  { name: 'Salary', color: 'accent' }, { name: 'Freelance', color: 'violet' },
  { name: 'Income' },
  { name: 'Housing' }, { name: 'Food' }, { name: 'Transport' }, { name: 'Savings', color: 'success' },
]
const periods = {
  Monthly: [
    { source: 'Salary', target: 'Income', value: 3200 }, { source: 'Freelance', target: 'Income', value: 800 },
    { source: 'Income', target: 'Housing', value: 1400 }, { source: 'Income', target: 'Food', value: 620 },
    { source: 'Income', target: 'Transport', value: 280 }, { source: 'Income', target: 'Savings', value: 1700 },
  ],
  Yearly: [
    { source: 'Salary', target: 'Income', value: 38400 }, { source: 'Freelance', target: 'Income', value: 12600 },
    { source: 'Income', target: 'Housing', value: 16800 }, { source: 'Income', target: 'Food', value: 7600 },
    { source: 'Income', target: 'Transport', value: 3900 }, { source: 'Income', target: 'Savings', value: 22700 },
  ],
} as const
type Period = keyof typeof periods

const period = ref<Period>('Monthly')
const node = ref<SankeyNodeItem | null>(null)
const link = ref<SankeyLinkItem | null>(null)
const total = computed(() => periods[period.value].filter((l) => l.target === 'Income').reduce((s, l) => s + l.value, 0))
const title = computed(() => (link.value ? `${link.value.source.name} → ${link.value.target.name}` : node.value ? node.value.name : 'Where your money goes'))
const value = computed(() => link.value?.value ?? node.value?.value ?? total.value)
const usd = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const
</script>
<template>
  <OCard class="w-full max-w-3xl gap-4 p-5">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ title }}</div>
        <OAnimatedNumber locale="en-US" :value="value" :format-options="usd" animation="count" :duration="300" class="mt-1 text-3xl font-semibold tabular-nums text-ousi-foreground" />
      </div>
      <div class="flex rounded-full bg-ousi-default p-0.5">
        <button
          v-for="(_, p) in periods" :key="p" type="button"
          class="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="period === p ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'"
          @click="period = p as Period"
        >{{ p }}</button>
      </div>
    </div>
    <OSankey
      :key="period" :nodes="nodes" :links="[...periods[period]]" :height="280"
      :format-value="(v) => `$${v.toLocaleString()}`"
      @node-enter="(n) => (node = n)" @node-leave="node = null"
      @link-enter="(l) => (link = l)" @link-leave="link = null"
    />
  </OCard>
</template>
