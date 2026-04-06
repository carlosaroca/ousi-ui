<script setup lang="ts">
import { OForm, OInput, OButton } from '@ousi-ui/vue'

function onSubmit(e: SubmitEvent) {
  e.preventDefault()
}
</script>
<template>
  <OForm class="space-y-4 max-w-sm" :validation-errors="{ email: 'Email already taken' }" @submit="onSubmit">
    <OInput label="Email" name="email" />
    <OButton type="submit">Register</OButton>
  </OForm>
</template>
