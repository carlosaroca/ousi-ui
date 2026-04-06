<script setup lang="ts">
import { ref } from 'vue'
import { ORadio, ORadioGroup } from '@ousi-ui/vue'
const fruit = ref('apple')
</script>
<template>
  <ORadioGroup v-model="fruit" label="Favorite fruit">
    <ORadio value="apple" label="Apple" />
    <ORadio value="banana" label="Banana" />
    <ORadio value="cherry" label="Cherry" />
  </ORadioGroup>
</template>
