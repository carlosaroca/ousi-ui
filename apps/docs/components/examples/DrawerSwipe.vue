<script setup lang="ts">
import { ref } from 'vue'
import { ODrawer, OButton } from '@ousi-ui/vue'

const sheet = ref(false)
const panel = ref(false)
const cities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira',
  'Santa Marta', 'Ibagué', 'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia', 'Montería',
]
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton variant="outline" @click="sheet = true">Bottom sheet</OButton>
    <OButton variant="outline" @click="panel = true">Side panel with handle</OButton>
  </div>

  <!-- The list scrolls first: pulling down closes the sheet once the list is at its top. -->
  <ODrawer v-model="sheet" placement="bottom" title="Choose a city" description="Drag it down to close.">
    <ul class="divide-y divide-ousi-border">
      <li v-for="city in cities" :key="city" class="py-3 text-ousi-foreground">{{ city }}</li>
    </ul>
  </ODrawer>

  <!-- A finger can swipe a side panel from anywhere; showHandle gives a mouse something to pull. -->
  <ODrawer v-model="panel" show-handle title="Details">
    <p>Swipe to the right, or drag the handle on the left edge.</p>
  </ODrawer>
</template>
