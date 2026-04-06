<script setup lang="ts">
import { ODisclosure, ODisclosureGroup } from '@ousi-ui/vue'

const faqItems = [
  { question: 'What is Ousi UI?', answer: 'A Vue 3 component library inspired by HeroUI v3, built with Tailwind CSS v4 and CVA.' },
  { question: 'Is it free?', answer: 'Yes, Ousi UI is open source and free to use under the MIT license.' },
  { question: 'Does it support dark mode?', answer: 'Yes, all components adapt to light and dark themes via CSS custom properties.' },
]
</script>
<template>
  <ODisclosureGroup class="rounded-ousi-2xl border border-ousi-border divide-y divide-ousi-border overflow-hidden">
    <ODisclosure v-for="item in faqItems" :key="item.question" class="px-4">
      <template #title>{{ item.question }}</template>
      <p class="text-sm text-ousi-muted">{{ item.answer }}</p>
    </ODisclosure>
  </ODisclosureGroup>
</template>
