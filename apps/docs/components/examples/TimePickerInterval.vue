<script setup lang="ts">
import { ref } from 'vue'
import { OTimePicker } from '@ousi-ui/vue'
import type { TimeFieldValue } from '@ousi-ui/vue'

const t1 = ref<TimeFieldValue | null>(null)
const t2 = ref<TimeFieldValue | null>(null)
</script>
<template>
  <div class="flex flex-col gap-4">
    <OTimePicker v-model="t1" :interval="15" label="15-minute slots" />
    <OTimePicker v-model="t2" :interval="30" label="30-minute slots" />
  </div>
</template>
