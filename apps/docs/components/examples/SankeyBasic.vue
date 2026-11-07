<script setup lang="ts">
import { OSankey } from '@ousi-ui/vue'

const nodes = [
  { name: 'Search' }, { name: 'Social' }, { name: 'Email' },
  { name: 'Landing' }, { name: 'Signup' }, { name: 'Bounce' },
]
const links = [
  { source: 'Search', target: 'Landing', value: 520 },
  { source: 'Social', target: 'Landing', value: 310 },
  { source: 'Email', target: 'Landing', value: 170 },
  { source: 'Landing', target: 'Signup', value: 380 },
  { source: 'Landing', target: 'Bounce', value: 620 },
]
</script>
<template>
  <OSankey :nodes="nodes" :links="links" />
</template>
