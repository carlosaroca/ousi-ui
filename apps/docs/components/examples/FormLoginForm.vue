<script setup lang="ts">
import { OForm, OInput, OButton } from '@ousi-ui/vue'

function handleLogin(e: SubmitEvent) {
  e.preventDefault()
  alert('Logged in!')
}
</script>
<template>
  <OForm class="space-y-4 max-w-sm" @submit="handleLogin">
    <OInput label="Email" name="email" type="email" required />
    <OInput label="Password" name="password" type="password" required />
    <OButton type="submit" full-width>Sign in</OButton>
  </OForm>
</template>
