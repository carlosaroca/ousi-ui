<script setup lang="ts">
import { ref } from 'vue'
import { OAutocomplete, type AutocompleteOption } from '@ousi-ui/vue'

const value = ref('')

// Stands in for an API call: a large catalog that never reaches the browser whole.
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Neiva', 'Pasto', 'Manizales', 'Villavicencio']
async function search(query: string): Promise<AutocompleteOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const q = query.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  return CITIES.filter((c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q))
    .map((c) => ({ value: c, label: c }))
}
</script>
<template>
  <OAutocomplete v-model="value" :options="[]" :search="search" label="City" placeholder="Search a city" class="max-w-sm" />
</template>
