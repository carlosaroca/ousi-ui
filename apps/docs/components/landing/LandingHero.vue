<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OChip, OColorSwatch, OTypewriter } from '@ousi-ui/vue'
import LandingShowcase from './LandingShowcase.vue'

const { version } = useRuntimeConfig().public

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap' },
  ],
})

const subtitles = [      
    '88+ accessible components.',
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
    :style="{ '--ousi-accent': activeAccent, '--showcase-accent': activeAccent }"
  >
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div
        class="absolute top-0 left-1/4 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-30"
        :style="{ background: `radial-gradient(circle, ${activeAccent}22, transparent 70%)` }"
      />
    </div>

    <div class="mx-auto max-w-[1480px] px-4 sm:px-6 pt-16 md:pt-24 xl:pt-14 pb-6 md:pb-8">
      <!-- The copy lives inside the bento: on a wide screen it is the cell that spans the first two columns
           (left aligned, with tiles to its right and below it); anywhere narrower it sits above the grid, centered. -->
      <LandingShowcase>
        <template #intro="{ integrated }">
          <div :class="integrated ? 'pb-10 text-left' : 'mx-auto mb-12 max-w-3xl text-center md:mb-16'">
            <!-- The version is the headline's eyebrow, and a link: it is where people go to see what changed. -->
            <div class="mb-6">
              <NuxtLink to="/changelog" class="group inline-flex">
                <OChip variant="soft" color="accent" size="md" class="!rounded-full pl-2 pr-2.5">
                  <template #start>
                    <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3-6.3-2.2 6.3-2.2z" /></svg>
                  </template>
                  v{{ version }} · Now in Beta
                  <template #end>
                    <svg class="size-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </template>
                </OChip>
              </NuxtLink>
            </div>

            <div class="relative inline-block">
              <!-- Vue today, Flutter soon. Centered, it sits to the left of the second line and points at "Vue";
                   left aligned there is no room on that side, so it sits to the right of the shorter first line and points down at the second. -->
              <span
                v-if="!integrated"
                aria-hidden="true"
                class="annotation pointer-events-none hidden md:flex absolute right-full top-[34%] z-10 mr-3 items-start text-ousi-accent"
              >
                <span class="caveat block pt-1 text-2xl lg:text-3xl font-semibold leading-none whitespace-nowrap -rotate-[7deg]">
                  Flutter soon
                </span>
                <svg class="-ml-1 mt-5 h-14 w-16 shrink-0" viewBox="0 0 64 56" fill="none">
                  <path d="M 4 6 C 26 0, 48 14, 54 42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
                  <path d="M 45 36 L 54 44 L 59 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
              </span>
              <span
                v-else
                aria-hidden="true"
                class="annotation pointer-events-none absolute left-[83%] -top-3 z-10 flex flex-col items-start text-ousi-accent"
              >
                <span class="caveat block text-2xl font-semibold leading-none whitespace-nowrap -rotate-[5deg]">
                  Flutter soon
                </span>
                <svg class="ml-6 mt-1 h-12 w-10 shrink-0" viewBox="0 0 40 48" fill="none">
                  <path d="M 6 2 C 30 6, 36 26, 20 42" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
                  <path d="M 11 35 L 20 44 L 29 36" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </svg>
              </span>

              <h1
                class="font-bold tracking-tight leading-[1.05] text-ousi-foreground"
                :class="integrated ? 'text-[clamp(2.25rem,4vw,3.75rem)]' : 'text-4xl sm:text-5xl lg:text-6xl'"
              >
                Build beautiful
                <br />
                <span
                  class="inline-block"
                  style="background: linear-gradient(to right, #A3E635, #4ADE80, #3B82F6, #60A5FA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
                >Vue apps, faster.</span>
              </h1>
            </div>

            <div class="h-8 mt-6 mb-8">
              <p class="text-base sm:text-lg text-ousi-muted">
                <ClientOnly>
                  <OTypewriter :text="subtitles" :speed="40" :delete-speed="25" :delay="2000" loop cursor />
                </ClientOnly>
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-3" :class="integrated ? 'justify-start' : 'justify-center'">
              <NuxtLink to="/vue/getting-started/introduction">
                <OButton size="lg">Get Started</OButton>
              </NuxtLink>
              <NuxtLink to="/vue/components/button">
                <OButton size="lg" variant="outline">Explore Components</OButton>
              </NuxtLink>
            </div>

            <!-- The accent recolors the bento around it, so the control sits as one pill with its label. -->
            <div class="mt-10 inline-flex items-center gap-3 rounded-full bg-ousi-surface/70 py-1.5 pl-2 pr-2 backdrop-blur sm:pl-4" role="group" aria-label="Accent color">
              <span class="hidden whitespace-nowrap text-xs font-medium text-ousi-muted sm:inline">Try an accent</span>
              <div class="flex items-center gap-1">
                <button
                  v-for="color in colors"
                  :key="color.value"
                  type="button"
                  :title="color.label"
                  :aria-label="color.label"
                  :aria-pressed="activeAccent === color.value"
                  class="flex size-8 cursor-pointer items-center justify-center rounded-full transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ousi-focus"
                  :class="activeAccent === color.value ? 'ring-2 ring-inset ring-ousi-foreground' : ''"
                  @click="activeAccent = color.value"
                >
                  <!-- The ring is on the button: OColorSwatch sets its own box-shadow inline, which no ring class can beat. -->
                  <OColorSwatch :color="color.value" shape="circle" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </LandingShowcase>
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
