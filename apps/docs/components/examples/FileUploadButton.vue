<script setup lang="ts">
import { OFileUpload, OInput } from '@ousi-ui/vue'
</script>

<template>
  <div class="flex w-full max-w-md flex-col items-start gap-5">
    <OFileUpload variant="button" text="Attach a file" accept=".pdf" :max-size="5 * 1024 * 1024" />
    <!-- On phones, `capture` opens the camera. -->
    <OFileUpload variant="button" size="lg" text="Take a photo of the receipt" accept="image/*" capture="environment" hide-hint />
    <div class="flex w-full flex-wrap items-start gap-2">
      <OInput placeholder="Reference" class="min-w-32 flex-1" />
      <OFileUpload variant="button" text="Attach" hide-file-list class="!w-auto" />
    </div>
  </div>
</template>
