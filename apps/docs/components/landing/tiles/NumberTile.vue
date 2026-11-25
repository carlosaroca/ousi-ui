<script setup lang="ts">
import { computed } from 'vue'
import { ONumberField } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

// Seats go up one at a time, as if someone were pressing the plus button.
const seats = computed(() => 2 + (slot(0.9).value % 8))
</script>

<template>
  <ShowcaseTile>
    <p class="mb-2 text-xs font-medium text-ousi-muted">Seats</p>
    <ONumberField :model-value="seats" :min="1" :max="20" size="sm" variant="primary" show-buttons animated />
  </ShowcaseTile>
</template>
