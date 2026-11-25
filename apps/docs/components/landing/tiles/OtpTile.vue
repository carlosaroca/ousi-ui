<script setup lang="ts">
import { computed } from 'vue'
import { OInputOtp, OSpinner } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { t } = useShowcase()

const CODE = '195827'
const CYCLE = 7.4

// Waits, types a digit every 0.42 s, holds the full code as "verified", then clears it.
const typed = computed(() => {
  const p = t.value % CYCLE
  if (p < 0.8 || p >= 6.6) return ''
  return CODE.slice(0, Math.min(CODE.length, Math.floor((p - 0.8) / 0.42) + 1))
})
const verified = computed(() => typed.value.length === CODE.length && t.value % CYCLE >= 3.5)
</script>

<template>
  <ShowcaseTile>
    <div class="mb-3.5 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="text-sm font-semibold leading-tight text-ousi-foreground">Verification code</p>
        <p class="mt-0.5 text-[11px] text-ousi-muted">{{ verified ? 'Verified, you are in' : 'Sent to your phone' }}</p>
      </div>
      <svg v-if="verified" class="mt-0.5 size-4 shrink-0 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      <OSpinner v-else size="sm" class="mt-0.5 shrink-0" />
    </div>
    <OInputOtp :model-value="typed" :length="6" variant="primary" size="sm" animated class="w-full" />
  </ShowcaseTile>
</template>
