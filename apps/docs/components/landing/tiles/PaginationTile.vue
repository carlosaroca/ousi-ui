<script setup lang="ts">
import { computed } from 'vue'
import { OPagination } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const TOTAL = 4
const page = computed(() => (slot(1.2).value % TOTAL) + 1)
</script>

<template>
  <ShowcaseTile class="justify-center !p-3">
    <OPagination :model-value="page" :total="TOTAL" size="sm" class="justify-center" />
  </ShowcaseTile>
</template>
