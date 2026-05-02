<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OChip, OTypewriter } from '@ousi-ui/vue'
import LandingShowcase from './LandingShowcase.vue'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap' },
  ],
})

const subtitles = [      
    '70+ accessible components.',
    'Production-ready out of the box.',       
    'Vue 3 & Nuxt, native.',              
    'SSR-ready. Zero config.',                  
    'Fully typed. Fully themeable.',                                                                                                                                                     
  ]

const colors = [
  { label: 'Blue',   value: '#1b5cff' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Pink',   value: '#ec4899' },
  { label: 'Red',    value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Green',  value: '#22c55e' },
  { label: 'Teal',   value: '#14b8a6' },
]
const activeAccent = ref('#1b5cff')
</script>

<template>
  <section
    class="relative overflow-hidden"
    :style="{ '--ousi-accent': activeAccent }"
  >
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-1/3 left-1/4 w-[700px] h-[500px] rounded-full blur-3xl opacity-30"
        :style="{ background: `radial-gradient(circle, ${activeAccent}22, transparent 70%)` }"
      />
      <div class="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-ousi-accent/5 blur-3xl" />
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 pt-16 md:pt-24 pb-16 md:pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-8 items-center">

        <!-- Left — copy + CTAs -->
        <div class="relative">
          <span
            aria-hidden="true"
            class="annotation pointer-events-none hidden md:block absolute top-[-40px] left-8 lg:left-14 z-10 text-ousi-accent"
          >
            <span class="caveat block text-2xl lg:text-3xl font-semibold leading-none whitespace-nowrap -rotate-[8deg]">
              Flutter soon
            </span>
            <svg
              class="absolute top-[2.1rem] -left-2 w-28 h-24"
              viewBox="0 0 120 100" fill="none"
            >
              <path
                d="M 100 6 C 74 26, 34 46, 8 86"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"
              />
              <path
                d="M 3 76 L 8 86 L 18 82"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"
              />
            </svg>
          </span>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-ousi-foreground">
            Build beautiful
            <br />
            <span
              class="inline-block"
              style="background: linear-gradient(to right, #A3E635, #4ADE80, #3B82F6, #60A5FA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
            >Vue apps, faster.</span>
          </h1>

          <div class="h-8 mt-6 mb-8">
            <p class="text-base sm:text-lg text-ousi-muted">
              <ClientOnly>
                <OTypewriter :text="subtitles" :speed="40" :delete-speed="25" :delay="2000" loop cursor />
              </ClientOnly>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <NuxtLink to="/vue/getting-started/introduction">
              <OButton size="lg">Get Started</OButton>
            </NuxtLink>
            <NuxtLink to="/vue/components/button">
              <OButton size="lg" variant="outline">Explore Components</OButton>
            </NuxtLink>
          </div>

          <div class="mt-10 flex items-center gap-3">
            <span class="text-xs font-medium text-ousi-muted">Theme:</span>
            <div class="flex items-center gap-2">
              <button
                v-for="color in colors"
                :key="color.value"
                :title="color.label"
                class="size-5 rounded-full border-2 transition-all hover:scale-110 cursor-pointer"
                :class="activeAccent === color.value ? 'border-ousi-foreground scale-110' : 'border-transparent'"
                :style="{ backgroundColor: color.value }"
                @click="activeAccent = color.value"
              />
            </div>
          </div>
           <div class="mt-6">
            <OChip variant="outline" color="default" size="sm">
              v0.3.0 — Now in Beta
            </OChip>
          </div>
        </div>

        <!-- Right — showcase -->
        <LandingShowcase />
      </div>
    </div>
  </section>
</template>

<style scoped>
.caveat {
  font-family: 'Caveat', cursive;
}

.annotation {
  animation: annotation-float 3.8s ease-in-out infinite;
  transform-origin: center;
}

@keyframes annotation-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-5px) rotate(-1deg); }
}

@media (prefers-reduced-motion: reduce) {
  .annotation { animation: none; }
}
</style>
