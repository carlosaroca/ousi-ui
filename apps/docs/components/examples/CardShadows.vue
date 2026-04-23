<script setup lang="ts">
import { OCard, OCardContent } from '@ousi-ui/vue'
import type { CardShadow } from '@ousi-ui/vue'

const levels: CardShadow[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
</script>
<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 p-4">
    <OCard v-for="level in levels" :key="level" :shadow="level" class="min-h-24 items-center justify-center">
      <OCardContent class="items-center text-center">
        <p class="text-xs font-mono text-ousi-muted">shadow</p>
        <p class="text-sm font-medium text-ousi-foreground">{{ level }}</p>
      </OCardContent>
    </OCard>
  </div>
</template>
