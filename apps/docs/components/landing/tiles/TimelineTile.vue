<script setup lang="ts">
import { computed } from 'vue'
import { OTimeline } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const steps = ['Order placed', 'Packed', 'Shipped', 'Delivered']
// The order moves along: done steps turn green, the current one is blue, the rest wait.
const stage = computed(() => slot(1.5).value % (steps.length + 1))
const items = computed(() =>
  steps.map((content, i) => ({
    key: content,
    content,
    color: (i < stage.value ? 'success' : i === stage.value ? 'accent' : 'default') as 'success' | 'accent' | 'default',
  })),
)
</script>

<template>
  <ShowcaseTile>
    <OTimeline :items="items" />
  </ShowcaseTile>
</template>
