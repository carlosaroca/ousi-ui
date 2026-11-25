<script setup lang="ts">
import { computed } from 'vue'
import { OButton, OSpinner } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

// Idle, then deploys from 0 to 100%, then shows "Live" before starting over.
const CYCLE = 6
const p = computed(() => t.value % CYCLE)
const progress = computed(() => Math.round(Math.min(100, Math.max(0, ((p.value - 1.2) / 2.8) * 100))))
const phase = computed<'idle' | 'deploying' | 'live'>(() => (p.value < 1.2 ? 'idle' : p.value < 4 ? 'deploying' : 'live'))
</script>

<template>
  <ShowcaseTile class="grow justify-center">
    <OButton size="lg" class="w-full" :variant="phase === 'live' ? 'soft' : 'primary'">
      <template v-if="phase === 'idle'">
        <svg class="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
        Deploy site
      </template>
      <template v-else-if="phase === 'deploying'">
        <OSpinner size="sm" class="mr-2" />
        Deploying {{ progress }}%
      </template>
      <template v-else>
        <svg class="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        Live
      </template>
    </OButton>
  </ShowcaseTile>
</template>
