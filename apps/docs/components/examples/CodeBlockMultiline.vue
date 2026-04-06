<script setup lang="ts">
import { OCodeBlock } from '@ousi-ui/vue'
const cssCode = `@import "tailwindcss";
@import "@ousi-ui/theme";

/* Scan component sources */
@source "../node_modules/@ousi-ui/vue/src/**/*.{ts,vue}";`
</script>
<template>
  <div class="flex flex-col gap-4 w-full">
    <OCodeBlock
      filename="install.sh"
      code="pnpm add @ousi-ui/vue @ousi-ui/theme"
      :show-line-numbers="false"
    />
    <OCodeBlock
      filename="app.css"
      :code="cssCode"
    />
  </div>
</template>
