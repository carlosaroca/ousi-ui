<script setup lang="ts">
import { OImageCompare } from '@ousi-ui/vue'

const levels = ['none', 'xs', 'sm', 'md', 'lg'] as const
const beforeSrc = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80'
const afterSrc = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80'
</script>
<template>
  <div class="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
    <div v-for="level in levels" :key="level" class="flex flex-col gap-2">
      <OImageCompare
        :shadow="level"
        :before-src="beforeSrc"
        :after-src="afterSrc"
        class="aspect-[4/3] w-full"
      />
      <p class="text-center text-xs font-mono text-ousi-muted">shadow="{{ level }}"</p>
    </div>
  </div>
</template>
