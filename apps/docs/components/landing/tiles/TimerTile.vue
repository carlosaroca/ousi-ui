<script setup lang="ts">
import { computed } from 'vue'
import { OProgressCircle } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

// A one-minute countdown that runs four times faster than real time, then restarts.
const TOTAL = 60
const remaining = computed(() => TOTAL - (Math.floor(t.value * 4) % TOTAL))
const label = computed(() => `0:${String(remaining.value).padStart(2, '0')}`)
</script>

<template>
  <ShowcaseTile tone="light">
    <!-- The ring is a 36px component; scaling its svg is all it takes to make it the tile's centerpiece. -->
    <OProgressCircle :value="(remaining / TOTAL) * 100" size="lg" :stroke-width="3" class="mx-auto [&>svg]:size-[124px]">
      <div class="text-center">
        <p class="text-[10px] text-ousi-muted">Focus</p>
        <p class="text-xl font-medium tabular-nums text-ousi-foreground">{{ label }}</p>
      </div>
    </OProgressCircle>
  </ShowcaseTile>
</template>
