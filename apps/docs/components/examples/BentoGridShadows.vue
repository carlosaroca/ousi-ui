<script setup lang="ts">
import { OBentoGrid, OBentoGridItem } from '@ousi-ui/vue'

const levels = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
</script>
<template>
  <div class="p-4">
    <OBentoGrid :cols="3" :gap="16">
      <OBentoGridItem
        v-for="level in levels"
        :key="level"
        :shadow="level"
        class="min-h-24 items-center justify-center"
      >
        <div class="flex flex-col items-center text-center">
          <p class="text-xs font-mono text-ousi-muted">shadow</p>
          <p class="text-sm font-medium text-ousi-foreground">{{ level }}</p>
        </div>
      </OBentoGridItem>
    </OBentoGrid>
  </div>
</template>
