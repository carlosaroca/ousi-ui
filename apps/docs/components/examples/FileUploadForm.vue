<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OFileUpload } from '@ousi-ui/vue'

const contract = ref<File[]>([])
const error = ref('')

function submit() {
  error.value = contract.value.length ? '' : 'The order cannot be approved without it.'
}
</script>

<template>
  <form class="flex w-full max-w-md flex-col items-start gap-4" novalidate @submit.prevent="submit">
    <OFileUpload
      v-model="contract"
      name="contract"
      label="Signed contract"
      description="One PDF up to 10 MB."
      :error-message="error"
      accept=".pdf"
      :max-size="10 * 1024 * 1024"
      required
      @change="error = ''"
    />
    <OButton type="submit" size="sm">Approve order</OButton>
    <OFileUpload disabled label="Invoices" text="Uploads are closed" hide-hint />
  </form>
</template>
