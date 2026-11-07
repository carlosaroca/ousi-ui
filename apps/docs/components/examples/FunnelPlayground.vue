<script setup lang="ts">
import { computed, ref } from 'vue'
import { OAnimatedNumber, OCard, OFunnel } from '@ousi-ui/vue'

const ranges = {
  '7d': [
    { label: 'Visitors', value: 12400 }, { label: 'Sign-ups', value: 4200 },
    { label: 'Trials', value: 2100 }, { label: 'Paid', value: 640 },
  ],
  '30d': [
    { label: 'Visitors', value: 48200 }, { label: 'Sign-ups', value: 18400 },
    { label: 'Trials', value: 9200 }, { label: 'Paid', value: 3100 },
  ],
  '90d': [
    { label: 'Visitors', value: 141000 }, { label: 'Sign-ups', value: 52000 },
    { label: 'Trials', value: 24800 }, { label: 'Paid', value: 8700 },
  ],
} as const
const colors = ['#aee637', '#4f8ff7', '#b57bff', '#ec6fb5']
type Range = keyof typeof ranges

const range = ref<Range>('30d')
const variant = ref<'columns' | 'bars'>('columns')
const mono = ref(false)
const focused = ref<number | null>(null)

const stages = computed(() => ranges[range.value].map((s, i) => ({ ...s, color: colors[i] })))
const active = computed(() => (focused.value == null ? null : stages.value[focused.value]))
const conversion = computed(() => (stages.value[3].value / stages.value[0].value) * 100)

const pill = (on: boolean) => on ? 'bg-ousi-background text-ousi-foreground shadow-sm' : 'text-ousi-muted hover:text-ousi-foreground'
</script>
<template>
  <OCard class="w-full max-w-2xl gap-5 p-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-medium text-ousi-muted">{{ active ? active.label : 'Conversion' }}</div>
        <div class="mt-1 flex items-baseline gap-3">
          <OAnimatedNumber :value="active ? active.value : stages[0].value" animation="count" class="text-3xl font-semibold tabular-nums text-ousi-foreground" />
          <span v-if="!active" class="rounded-full bg-ousi-success/15 px-2 py-0.5 text-xs font-medium tabular-nums text-ousi-success-soft-strong">
            {{ conversion.toFixed(1) }}% convert
          </span>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div class="flex rounded-full bg-ousi-default p-0.5">
          <button v-for="(_, r) in ranges" :key="r" type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(range === r)" @click="range = r as Range">{{ r }}</button>
        </div>
        <div class="flex rounded-full bg-ousi-default p-0.5">
          <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(variant === 'columns')" @click="variant = 'columns'">Columns</button>
          <button type="button" class="rounded-full px-2.5 py-1 text-xs font-medium" :class="pill(variant === 'bars')" @click="variant = 'bars'">Bars</button>
        </div>
        <button type="button" class="rounded-full bg-ousi-default px-3 py-1 text-xs font-medium" :class="mono ? 'text-ousi-foreground' : 'text-ousi-muted'" @click="mono = !mono">Mono</button>
      </div>
    </div>
    <OFunnel v-model:focused="focused" :key="variant" :stages="stages" :variant="variant" :mono="mono" :height="190" />
  </OCard>
</template>
