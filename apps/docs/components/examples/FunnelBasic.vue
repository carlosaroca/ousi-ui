<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Visitors', value: 48200, color: '#aee637' },
  { label: 'Sign-ups', value: 18400, color: '#4f8ff7' },
  { label: 'Trials', value: 9200, color: '#b57bff' },
  { label: 'Paid', value: 3100, color: '#ec6fb5' },
]
</script>
<template>
  <OFunnel :stages="stages" />
</template>
