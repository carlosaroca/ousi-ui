<script setup lang="ts">
import { OColorField } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-col gap-4 p-4 max-w-sm">
    <OColorField label="Default (static)" show-swatch />
    <OColorField label="Animated" show-swatch animated />
  </div>
</template>
