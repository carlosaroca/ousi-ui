<script setup lang="ts">
import { ref } from 'vue'
import { ODatePicker } from '@ousi-ui/vue'

// v-model is a string in 'YYYY-MM-DD'. Display follows the locale.
const iso = ref<string | null>(null)

// Display custom (DD/MM/YYYY) but emit as ISO string.
const both = ref<string | null>(null)
</script>
<template>
  <div class="flex flex-col gap-6">
    <div>
      <ODatePicker v-model="iso" format="YYYY-MM-DD" label="API date (format only)" />
      <p class="mt-2 text-xs text-ousi-muted">v-model: <code>{{ iso ?? 'null' }}</code></p>
    </div>
    <div>
      <ODatePicker v-model="both" format="YYYY-MM-DD" display-format="DD/MM/YYYY" label="API date + custom display" />
      <p class="mt-2 text-xs text-ousi-muted">v-model: <code>{{ both ?? 'null' }}</code></p>
    </div>
  </div>
</template>
