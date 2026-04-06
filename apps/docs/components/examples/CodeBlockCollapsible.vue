<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'
const code = [
  '<script setup>',
  "import { ref } from 'vue'",
  "import { OButton, OInput, OCard } from '@ousi-ui/vue'",
  '',
  "const name = ref('')",
  'const submitted = ref(false)',
  '',
  'function handleSubmit() {',
  '  if (!name.value) return',
  '  submitted.value = true',
  '}',
  '<\/script>',
  '',
  '<template>',
  '  <OCard class="max-w-sm">',
  '    <OCard.Content>',
  '      <OInput v-model="name" label="Your name" />',
  '      <OButton @click="handleSubmit">Submit</OButton>',
  '    </OCard.Content>',
  '  </OCard>',
  '</template>',
].join('\n')
</script>
<template>
  <OCodeBlock :code="code" collapsible filename="Form.vue" />
</template>
