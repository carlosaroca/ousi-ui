<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'
const code = [
  '<script setup>',
  "import { OButton } from '@ousi-ui/vue'",
  '<\/script>',
  '',
  '<template>',
  '  <OButton>Hello</OButton>',
  '</template>',
].join('\n')
</script>
<template>
  <OCodeBlock filename="App.vue" :code="code" />
</template>
