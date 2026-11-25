<script setup lang="ts">
import { computed } from 'vue'
import { OSwitch } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

// Flips every 3 s, and the tile itself changes theme with the switch.
const step = slot(3)
const dark = computed(() => step.value % 2 === 0)
</script>

<template>
  <ShowcaseTile :tone="dark ? 'dark' : 'soft'">
    <svg v-if="dark" class="size-5 text-ousi-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" /></svg>
    <svg v-else class="size-5 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    <p class="mb-3 mt-3 text-sm font-semibold text-ousi-foreground">{{ dark ? 'Dark mode' : 'Light mode' }}</p>
    <OSwitch :model-value="dark" size="lg" />
  </ShowcaseTile>
</template>
