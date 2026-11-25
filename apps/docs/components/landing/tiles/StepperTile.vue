<script setup lang="ts">
import { computed } from 'vue'
import { OStepper } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const steps = [
  { key: 'cart', title: 'Cart' },
  { key: 'payment', title: 'Payment' },
  { key: 'done', title: 'Done' },
]
const advance = slot(1.5)
const current = computed(() => advance.value % steps.length)
</script>

<template>
  <ShowcaseTile>
    <OStepper :model-value="current" :steps="steps" size="sm" />
  </ShowcaseTile>
</template>
