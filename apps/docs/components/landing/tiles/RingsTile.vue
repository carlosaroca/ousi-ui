<script setup lang="ts">
import { computed } from 'vue'
import { OActivityRings, OAnimatedNumber } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const goals = [
  { label: 'Move', max: 600, unit: 'kcal', color: 'accent' },
  { label: 'Exercise', max: 30, unit: 'min', color: 'violet' },
  { label: 'Stand', max: 12, unit: 'h', color: 'success' },
]
const presets = [[600, 30, 12], [430, 24, 9], [560, 18, 12], [260, 12, 6]]

const preset = slot(3.4)
const sweep = slot(1.1)

const rings = computed(() => {
  const values = presets[preset.value % presets.length]
  return goals.map((g, i) => ({ ...g, value: values[i], valueLabel: `${values[i]} ${g.unit}` }))
})
const focusedKey = computed(() => goals[sweep.value % goals.length].label)
const percent = computed(() => {
  const r = rings.value.find((x) => x.label === focusedKey.value)!
  return Math.round((r.value / r.max) * 100)
})
</script>

<template>
  <ShowcaseTile tone="dark" title="Activity rings" is-new badge="chip">
    <OActivityRings :rings="rings" :size="144" :focused="focusedKey" animated class="mx-auto" />
    <p class="mt-3 text-center text-xs text-ousi-muted">
      {{ focusedKey }}
      <OAnimatedNumber :value="percent" animation="count" :duration="300" suffix="%" class="ml-0.5 tabular-nums text-ousi-foreground" />
    </p>
  </ShowcaseTile>
</template>
