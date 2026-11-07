<script setup lang="ts">
import { ref } from 'vue'
import { OCard, OTabs } from '@ousi-ui/vue'

// Grid cells and cards in a flex row cannot be narrower than their content, so a long list of
// tabs that never wrap would stretch the whole column. `contained` makes the tabs fill the cell
// without asking it for width: they scroll (with an edge fade) instead.
const people = ['Overview', 'People', 'Links', 'Income and travel', 'Social media', 'Sources', 'Press', 'Legal documents', 'Background'].map(
  (label) => ({ key: label, label }),
)
const months = Array.from({ length: 12 }, (_, i) => ({
  key: `m${i}`,
  label: new Date(2025, i, 1).toLocaleString('en-US', { month: 'long' }),
}))
const a = ref('People')
const b = ref('m4')
</script>
<template>
  <div class="grid w-full gap-4 md:grid-cols-2">
    <OCard class="gap-3 p-4">
      <div class="text-sm font-medium text-ousi-foreground">Case file</div>
      <OTabs v-model="a" variant="secondary" contained :items="people" />
      <p class="text-sm text-ousi-muted">Showing <b class="text-ousi-foreground">{{ a }}</b>.</p>
    </OCard>
    <OCard class="gap-3 p-4">
      <div class="text-sm font-medium text-ousi-foreground">Monthly report</div>
      <OTabs v-model="b" contained :items="months" />
      <p class="text-sm text-ousi-muted">Showing <b class="text-ousi-foreground">{{ months.find((m) => m.key === b)?.label }}</b>.</p>
    </OCard>
  </div>
</template>
