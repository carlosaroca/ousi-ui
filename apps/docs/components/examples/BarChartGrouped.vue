<script setup lang="ts">
import { OBarChart } from '@ousi-ui/vue'

const data = [
  { q: 'Q1', web: 42, mobile: 28, api: 12 }, { q: 'Q2', web: 51, mobile: 34, api: 18 },
  { q: 'Q3', web: 47, mobile: 41, api: 24 }, { q: 'Q4', web: 63, mobile: 52, api: 31 },
]
</script>
<template>
  <OBarChart
    :data="data"
    category-key="q"
    :bar-radius="8"
    :bar-gap="0.3"
    grid
    :series="[
      { key: 'web', label: 'Web', color: 'accent' },
      { key: 'mobile', label: 'Mobile', color: 'violet' },
      { key: 'api', label: 'API', color: 'orange' },
    ]"
    :format-value="(v) => `${v}k`"
  />
</template>
