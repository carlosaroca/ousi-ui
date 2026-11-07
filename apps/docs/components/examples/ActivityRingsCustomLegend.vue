<script setup lang="ts">
import { OActivityRings } from '@ousi-ui/vue'

const rings = [
  { label: 'Move', value: 1592, max: 2000, color: '#ff5d73', valueLabel: '1,592 / 2,000 kcal' },
  { label: 'Exercise', value: 105, max: 120, color: '#34d399', valueLabel: '105 / 120 min' },
  { label: 'Running', value: 5.2, max: 8, color: '#60a5fa', valueLabel: '5.2 / 8 km' },
]
</script>
<template>
  <!-- `stats` replaces the whole legend: you get the rings and a setFocus helper. -->
  <div class="flex flex-wrap items-center gap-8">
    <OActivityRings :rings="rings" :size="150" :stroke-width="10">
      <template #stats="{ rings: items, focusedKey, setFocus }">
        <table class="text-sm">
          <tbody>
            <tr
              v-for="r in items"
              :key="r.key"
              class="cursor-default transition-opacity"
              :class="focusedKey && focusedKey !== r.key && 'opacity-40'"
              @mouseenter="setFocus(r.key)"
              @mouseleave="setFocus(null)"
            >
              <td class="py-1 pr-4">
                <span class="mr-2 inline-block size-2 rounded-full" :style="{ backgroundColor: r.color }" />
                <span class="text-ousi-muted">{{ r.label }}</span>
              </td>
              <td class="py-1 pr-4 font-medium tabular-nums text-ousi-foreground">{{ r.valueLabel }}</td>
              <td class="py-1 text-right tabular-nums text-ousi-muted">{{ r.percent }}%</td>
            </tr>
          </tbody>
        </table>
      </template>
    </OActivityRings>
  </div>
</template>
