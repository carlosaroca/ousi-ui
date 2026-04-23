<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent } from '@ousi-ui/vue'
</script>
<template>
  <OCard class="flex-row items-stretch max-w-lg" variant="secondary">
    <div class="w-32 shrink-0 rounded-ousi-xl overflow-hidden bg-ousi-accent/20 flex items-center justify-center">
      <svg class="w-10 h-10 text-ousi-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    </div>
    <div class="flex flex-col gap-2 py-1">
      <OCardHeader>
        <OCardTitle>Horizontal Card</OCardTitle>
        <OCardDescription>Image on the left, content on the right.</OCardDescription>
      </OCardHeader>
      <OCardContent>
        <p class="text-sm text-ousi-muted">Use <code class="text-ousi-accent text-xs">class="flex-row"</code> on the Card.</p>
      </OCardContent>
    </div>
  </OCard>
</template>
