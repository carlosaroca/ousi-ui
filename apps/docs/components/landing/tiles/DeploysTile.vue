<script setup lang="ts">
import { computed } from 'vue'
import { OStatus } from '@ousi-ui/vue'
import type { StatusColor, StatusVariant } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

interface Phase { label: string; color: StatusColor; variant: StatusVariant }
const phases: Phase[] = [
  { label: 'Queued', color: 'default', variant: 'dot' },
  { label: 'Building', color: 'orange', variant: 'halo' },
  { label: 'Deployed', color: 'success', variant: 'halo' },
  { label: 'Failed', color: 'danger', variant: 'halo' },
]
// Each service walks this script from its own starting point, so the rows never change together.
const script = [2, 2, 2, 0, 1, 1, 2, 2, 2, 2, 3, 3, 0, 1, 1, 2]

const services = [
  { name: 'api', from: 0 },
  { name: 'web', from: 5.6 },
  { name: 'docs', from: 11.2 },
]

const rows = computed(() =>
  services.map((s) => ({
    ...s,
    phase: phases[script[Math.floor((t.value + s.from) / 1.4) % script.length]],
  })),
)
</script>

<template>
  <ShowcaseTile title="Deploys" is-new>
    <ul class="divide-y divide-ousi-border/70 rounded-2xl bg-ousi-surface px-3.5">
      <li v-for="row in rows" :key="row.name" class="flex items-center justify-between gap-2 py-3">
        <span class="text-xs font-medium text-ousi-foreground">{{ row.name }}</span>
        <OStatus :color="row.phase.color" :variant="row.phase.variant" size="sm">{{ row.phase.label }}</OStatus>
      </li>
    </ul>
  </ShowcaseTile>
</template>
