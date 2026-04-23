<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex flex-wrap items-center gap-3 p-4">
    <!-- Simple: string value -->
    <OButton variant="outline" v-tooltip="'Simple tooltip'">Simple</OButton>

    <!-- Placement modifier -->
    <OButton variant="outline" v-tooltip.bottom="'Appears below'">Bottom</OButton>

    <!-- Full options object -->
    <OButton
      variant="outline"
      v-tooltip="{ content: 'Slower with big shadow', delay: 500, shadow: 'lg' }"
    >
      Object options
    </OButton>

    <!-- Dashed placement modifier -->
    <OButton variant="outline" v-tooltip.top-end="'Top-end placement'">
      Top-end
    </OButton>
  </div>
</template>
