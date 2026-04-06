<script setup lang="ts">
import { OButton, OChip, OGradientText, OTypewriter } from '@ousi-ui/vue'
import ComponentPreview from '../../../shared/ComponentPreview.vue'

const subtitles = [
  '70+ accessible components.',
  'OKLCH color system.',
  'Dark mode built-in.',
  'Tree-shakeable & type-safe.',
]

// ── Color swatches for preview customization ──
const colors = [
  { label: 'Blue', value: '#006FEE' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Teal', value: '#14b8a6' },
]

const activeAccent = ref('#006FEE')
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Subtle gradient background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-ousi-accent/5 blur-3xl" />
      <div class="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-ousi-success/5 blur-3xl" />
    </div>

    <!-- Hero text -->
    <div class="mx-auto max-w-3xl px-4 sm:px-6 pt-20 md:pt-28 pb-12 md:pb-16 text-center">
      <!-- Version badge -->
      <div class="mb-6">
        <OChip variant="outline" color="default" size="sm">
          v0.1.0 — Now in Beta
        </OChip>
      </div>

      <!-- Main heading -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
        Build beautiful
        <br />
        <span
          class="inline-block"
          style="background: linear-gradient(to right, #A3E635, #4ADE80, #3B82F6, #60A5FA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
        >Vue apps, faster.</span>
      </h1>

      <!-- Typewriter subtitle -->
      <div class="h-8 mb-8">
        <p class="text-lg text-ousi-muted">
          <ClientOnly>
            <OTypewriter
              :text="subtitles"
              :speed="40"
              :delete-speed="25"
              :delay="2000"
              loop
              cursor
            />
          </ClientOnly>
        </p>
      </div>

      <!-- CTAs -->
      <div class="flex items-center justify-center gap-3">
        <NuxtLink to="/vue/getting-started/introduction">
          <OButton size="lg">
            Get Started
          </OButton>
        </NuxtLink>
        <NuxtLink to="/vue/components/button">
          <OButton size="lg" variant="outline">
            Explore Components
          </OButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Color swatches -->
    <div class="mx-auto max-w-[1400px] px-4 sm:px-6 pb-4">
      <div class="flex items-center justify-center gap-2">
        <button
          v-for="color in colors"
          :key="color.value"
          :title="color.label"
          class="size-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
          :class="activeAccent === color.value ? 'border-ousi-foreground scale-110' : 'border-transparent'"
          :style="{ backgroundColor: color.value }"
          @click="activeAccent = color.value"
        />
      </div>
    </div>

    <!-- Preview window -->
    <div class="mx-auto px-4 sm:px-6 pb-8 md:pb-16 max-w-[1400px]">
      <ClientOnly>
        <ComponentPreview
          :accent-color="activeAccent"
          height="600px"
          class="md:h-[700px]"
        />
      </ClientOnly>
    </div>
  </section>
</template>
