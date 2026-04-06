<script setup lang="ts">
import { ref } from 'vue'

const currentSlide = ref(0)
</script>

<template>
  <OCarousel v-model="currentSlide">
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-accent/20 text-lg font-medium">
      Slide 1
    </div>
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-success/20 text-lg font-medium">
      Slide 2
    </div>
    <div class="h-48 flex items-center justify-center rounded-lg bg-ousi-warning/20 text-lg font-medium">
      Slide 3
    </div>

    <template #dot="{ index, active }">
      <span
        :class="[
          'inline-block rounded-full transition-all duration-300',
          active ? 'w-6 h-2 bg-ousi-accent' : 'w-2 h-2 bg-ousi-border',
        ]"
      />
    </template>
  </OCarousel>
</template>
