<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardFooter, OAvatar, OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
    <OCard variant="secondary">
      <div class="h-28 -mx-4 -mt-4 rounded-t-ousi-4xl overflow-hidden bg-ousi-accent/15 flex items-center justify-center">
        <svg class="w-12 h-12 text-ousi-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
      <OCardHeader>
        <OCardTitle>Project Alpha</OCardTitle>
        <OCardDescription>A design system built with Vue 3.</OCardDescription>
      </OCardHeader>
      <OCardFooter class="gap-2">
        <OAvatar name="Carlos Roca" size="sm" />
        <span class="text-sm text-ousi-foreground">Carlos Roca</span>
      </OCardFooter>
    </OCard>
    <OCard variant="secondary">
      <div class="h-28 -mx-4 -mt-4 rounded-t-ousi-4xl overflow-hidden bg-ousi-success/15 flex items-center justify-center">
        <svg class="w-12 h-12 text-ousi-success/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
      <OCardHeader>
        <OCardTitle>Project Beta</OCardTitle>
        <OCardDescription>An open-source component library.</OCardDescription>
      </OCardHeader>
      <OCardFooter class="gap-2">
        <OAvatar name="Ana Torres" size="sm" />
        <span class="text-sm text-ousi-foreground">Ana Torres</span>
      </OCardFooter>
    </OCard>
  </div>
</template>
