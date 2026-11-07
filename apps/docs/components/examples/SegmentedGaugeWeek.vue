<script setup lang="ts">
import { computed, ref } from 'vue'
import { OCard, OSegmentedGauge } from '@ousi-ui/vue'

const days = [
  { day: 'Mon', d: 44, b: 24, i: 15 }, { day: 'Tue', d: 48, b: 28, i: 18 }, { day: 'Wed', d: 39, b: 20, i: 12 },
  { day: 'Thu', d: 50, b: 30, i: 20 }, { day: 'Fri', d: 46, b: 25, i: 17 }, { day: 'Sat', d: 49, b: 29, i: 19 }, { day: 'Sun', d: 49, b: 29, i: 20 },
]
const selected = ref(6)
const focused = ref<number | null>(null)

const segs = (r: (typeof days)[number]) => [
  { label: 'Duration', value: r.d, max: 50, color: 'accent' },
  { label: 'Bedtime', value: r.b, max: 30, color: 'violet' },
  { label: 'Interruptions', value: r.i, max: 20, color: 'success' },
]
const score = (r: (typeof days)[number]) => r.d + r.b + r.i
const current = computed(() => days[selected.value])
const rating = computed(() => (score(current.value) >= 95 ? 'Excellent' : score(current.value) >= 85 ? 'Good' : 'Fair'))
</script>
<template>
  <OCard class="w-full max-w-lg gap-5 p-5">
    <div class="flex items-center justify-between">
      <div class="text-sm font-medium text-ousi-muted">Sleep score · {{ rating }}</div>
      <div class="text-xs text-ousi-muted">{{ current.day }}</div>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <OSegmentedGauge v-model:focused="focused" :key="selected" :segments="segs(current)" :size="190">
        <template #default="{ total, focusedSegment }">
          <div class="text-center">
            <div class="text-4xl font-semibold tabular-nums text-ousi-foreground">{{ focusedSegment ? focusedSegment.value : total }}</div>
            <div class="text-xs text-ousi-muted">{{ focusedSegment ? focusedSegment.label : 'of 100' }}</div>
          </div>
        </template>
      </OSegmentedGauge>
      <ul class="min-w-40 flex-1 space-y-2 text-sm">
        <li
          v-for="(s, i) in segs(current)" :key="s.label"
          class="flex items-center justify-between transition-opacity"
          :class="focused != null && focused !== i && 'opacity-40'"
          @mouseenter="focused = i" @mouseleave="focused = null"
        >
          <span class="flex items-center gap-2 text-ousi-foreground"><span class="inline-block size-2 rounded-full" :style="{ backgroundColor: `var(--ousi-${s.color})` }" />{{ s.label }}</span>
          <span class="tabular-nums text-ousi-muted"><b class="text-ousi-foreground">{{ s.value }}</b>/{{ s.max }}</span>
        </li>
      </ul>
    </div>
    <!-- Seven small gauges act as the day picker -->
    <div class="grid grid-cols-7 gap-1.5">
      <button
        v-for="(r, i) in days" :key="r.day" type="button"
        class="flex flex-col items-center gap-1 rounded-xl p-1.5 transition-colors"
        :class="selected === i ? 'bg-ousi-default' : 'hover:bg-ousi-default/60'"
        @click="selected = i"
      >
        <OSegmentedGauge :segments="segs(r)" :size="38" :stroke-width="14" :gap="14" :interactive="false" :animated="false" />
        <span class="text-[11px]" :class="selected === i ? 'font-medium text-ousi-foreground' : 'text-ousi-muted'">{{ r.day }}</span>
      </button>
    </div>
  </OCard>
</template>
