<script setup lang="ts">
import { ref } from 'vue'
import { OAutocomplete } from '@ousi-ui/vue'

const reviewers = ref<string[]>(['ana', 'luis'])
const people = [
  { value: 'ana', label: 'Ana Gómez' },
  { value: 'andres', label: 'Andrés Ruiz' },
  { value: 'carla', label: 'Carla Ortiz' },
  { value: 'diego', label: 'Diego Marín' },
  { value: 'luis', label: 'Luis Peña' },
  { value: 'marta', label: 'Marta Díaz', disabled: true },
  { value: 'sofia', label: 'Sofía León' },
  { value: 'tomas', label: 'Tomás Vélez' },
]
</script>
<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <OAutocomplete
      v-model="reviewers"
      multiple
      :options="people"
      label="Reviewers"
      placeholder="Search people…"
      description="Type to search. Backspace removes the last one."
    />
    <p class="break-all text-xs text-ousi-muted">Value: {{ JSON.stringify(reviewers) }}</p>
  </div>
</template>
