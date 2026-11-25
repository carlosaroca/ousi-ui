<script setup lang="ts">
import { ref } from 'vue'
import { OAutocomplete } from '@ousi-ui/vue'

const invited = ref<number[]>([])
const directory = [
  'Ana Gómez', 'Andrés Ruiz', 'Carla Ortiz', 'Daniela Mora', 'Diego Marín', 'Luis Peña', 'Marta Díaz', 'Mariana Soto',
].map((label, index) => ({ value: index + 1, label }))

// Your request goes here. The labels of what is picked stay, whatever later searches return.
async function search(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return directory.filter((person) => person.label.toLowerCase().includes(query.toLowerCase()))
}
const initials = (name: string) => name.split(' ').map((part) => part[0]).join('')
</script>
<template>
  <OAutocomplete
    v-model="invited"
    multiple
    :search="search"
    :options="[]"
    label="Invite people"
    placeholder="Type a name…"
    class="max-w-sm"
  >
    <!-- What each chip says. The button that removes it stays. -->
    <template #chip="{ option }">
      <span class="inline-flex items-center gap-1 align-middle">
        <span class="flex size-4 items-center justify-center rounded-full bg-ousi-accent text-[9px] font-semibold text-ousi-accent-foreground" aria-hidden="true">{{ initials(option.label) }}</span>
        {{ option.label }}
      </span>
    </template>
  </OAutocomplete>
</template>
