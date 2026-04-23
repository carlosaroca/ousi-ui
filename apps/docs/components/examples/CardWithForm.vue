<script setup lang="ts">
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent, OCardFooter, OInput, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OCard variant="secondary" class="max-w-sm">
    <OCardHeader>
      <OCardTitle class="text-base">Login</OCardTitle>
      <OCardDescription>Enter your credentials to continue.</OCardDescription>
    </OCardHeader>
    <OCardContent class="gap-3">
      <OInput label="Email" placeholder="you@example.com" type="email" variant="secondary" />
      <OInput label="Password" placeholder="Enter password" type="password" variant="secondary" />
    </OCardContent>
    <OCardFooter>
      <OButton variant="primary" full-width>Sign In</OButton>
    </OCardFooter>
  </OCard>
</template>
