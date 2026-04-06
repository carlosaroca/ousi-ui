<script setup lang="ts">
import { ref } from 'vue'
import { ODisclosure, ODisclosureGroup, OCheckbox } from '@ousi-ui/vue'
const expandedKeys = ref<string[]>([])
const inStock = ref(false)
const onSale = ref(false)
const newArrivals = ref(false)
const electronics = ref(false)
const clothing = ref(false)
const books = ref(false)
</script>
<template>
  <ODisclosureGroup v-model="expandedKeys" :allow-multiple="true">
    <ODisclosure class="border-b border-ousi-border">
      <template #title>Filters</template>
      <div class="flex flex-col gap-2">
        <OCheckbox v-model="inStock" label="In stock" />
        <OCheckbox v-model="onSale" label="On sale" />
        <OCheckbox v-model="newArrivals" label="New arrivals" />
      </div>
    </ODisclosure>
    <ODisclosure class="border-b border-ousi-border">
      <template #title>Price range</template>
      <p class="text-sm text-ousi-muted">Price slider would go here.</p>
    </ODisclosure>
    <ODisclosure>
      <template #title>Categories</template>
      <div class="flex flex-col gap-2">
        <OCheckbox v-model="electronics" label="Electronics" />
        <OCheckbox v-model="clothing" label="Clothing" />
        <OCheckbox v-model="books" label="Books" />
      </div>
    </ODisclosure>
  </ODisclosureGroup>
  <p class="mt-2 text-xs text-ousi-muted">Expanded: {{ expandedKeys.length }} sections</p>
</template>
