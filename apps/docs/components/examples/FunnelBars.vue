<script setup lang="ts">
import { OFunnel } from '@ousi-ui/vue'

const stages = [
  { label: 'Leads', value: 1240, color: 'accent' },
  { label: 'Qualified', value: 860, color: 'violet' },
  { label: 'Proposal', value: 410, color: 'orange' },
  { label: 'Negotiation', value: 190, color: 'warning' },
  { label: 'Won', value: 96, color: 'success' },
]
</script>
<template>
  <OFunnel :stages="stages" variant="bars" />
</template>
