<script setup lang="ts">
import { OForm, OInput, OButton } from '@ousi-ui/vue'

function onSubmit(e: SubmitEvent) {
  e.preventDefault()
  alert('Submitted!')
}
</script>
<template>
  <OForm class="space-y-4 max-w-sm" @submit="onSubmit">
    <OInput label="Name" name="name" required />
    <OButton type="submit">Submit</OButton>
  </OForm>
</template>
