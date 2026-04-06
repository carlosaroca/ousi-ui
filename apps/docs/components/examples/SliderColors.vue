<script setup lang="ts">
import { OSlider } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-6">
    <OSlider color="primary" :default-value="50" label="Primary" />
    <OSlider color="secondary" :default-value="50" label="Secondary" />
    <OSlider color="success" :default-value="50" label="Success" />
    <OSlider color="warning" :default-value="50" label="Warning" />
    <OSlider color="danger" :default-value="50" label="Danger" />
  </div>
</template>
