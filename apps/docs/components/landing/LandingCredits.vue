<script setup lang="ts">
import { OSeparator } from '@ousi-ui/vue'

const credits = [
  {
    name: 'Liveline',
    description: 'Charts inspiration',
    url: 'https://benji.org/liveline',
  },
]
</script>

<template>
  <section class="py-12 md:py-16">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 text-center">
      <OSeparator class="mb-10" />
      <p class="text-sm font-medium text-ousi-muted mb-6">Special thanks to</p>
      <div class="flex items-center justify-center gap-8">
        <a
          v-for="credit in credits"
          :key="credit.name"
          :href="credit.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex flex-col items-center gap-1.5"
        >
          <span class="text-base font-semibold text-ousi-foreground group-hover:text-ousi-accent transition-colors">
            {{ credit.name }}
          </span>
          <span class="text-xs text-ousi-muted">{{ credit.description }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
