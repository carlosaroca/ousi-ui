<script setup lang="ts">
import { ORadio, ORadioGroup } from '@ousi-ui/vue'
import { ref } from 'vue'

const selected = ref('free')
</script>
<template>
  <ORadioGroup v-model="selected" label="Plan">
    <ORadio value="free" label="Free" />
    <ORadio value="pro" label="Pro" />
    <ORadio value="enterprise" label="Enterprise" />
  </ORadioGroup>
  <p class="mt-2 text-sm">Selected: {{ selected }}</p>
</template>
