<script setup lang="ts">
import { computed } from 'vue'
import { OSegmentedGauge } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const parts = [
  { label: 'Photos', max: 50, color: 'accent' },
  { label: 'Docs', max: 30, color: 'violet' },
  { label: 'Other', max: 20, color: 'orange' },
]
const presets = [[34, 22, 12], [46, 15, 18], [22, 29, 7], [41, 26, 15]]

const preset = slot(3)
const sweep = slot(1)

const segments = computed(() => {
  const values = presets[preset.value % presets.length]
  return parts.map((p, i) => ({ ...p, value: values[i] }))
})
const focused = computed(() => sweep.value % parts.length)
</script>

<template>
  <ShowcaseTile title="Storage" is-new badge="chip" badge-color="orange">
    <OSegmentedGauge :segments="segments" :size="144" :focused="focused" animated class="mx-auto">
      <template #default="{ total, max, focusedSegment }">
        <div class="text-center">
          <div class="text-xl font-semibold tabular-nums text-ousi-foreground">{{ total }}</div>
          <div class="text-[10px] text-ousi-muted">{{ focusedSegment ? focusedSegment.label : `of ${max} GB` }}</div>
        </div>
      </template>
    </OSegmentedGauge>
  </ShowcaseTile>
</template>
