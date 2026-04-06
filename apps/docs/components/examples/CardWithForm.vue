<script setup lang="ts">
import { OCard, OInput, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OCard variant="secondary" class="max-w-sm">
    <OCard.Header>
      <OCard.Title class="text-base">Login</OCard.Title>
      <OCard.Description>Enter your credentials to continue.</OCard.Description>
    </OCard.Header>
    <OCard.Content class="gap-3">
      <OInput label="Email" placeholder="you@example.com" type="email" variant="secondary" full-width />
      <OInput label="Password" placeholder="Enter password" type="password" variant="secondary" full-width />
    </OCard.Content>
    <OCard.Footer>
      <OButton variant="primary" full-width>Sign In</OButton>
    </OCard.Footer>
  </OCard>
</template>
