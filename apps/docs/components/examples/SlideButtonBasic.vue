<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSlideButton } from '@ousi-ui/vue'

const paid = ref(false)
const paying = ref(false)

function pay() {
  paying.value = true
  setTimeout(() => (paying.value = false), 1600) // your request goes here
}
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <OSlideButton
      v-model="paid"
      :loading="paying"
      label="Slide to pay $48.00"
      loading-label="Paying…"
      confirmed-label="Paid"
      haptic="success"
      @confirm="pay"
    />
    <OButton variant="text" size="sm" :disabled="!paid || paying" @click="paid = false">Start over</OButton>
  </div>
</template>
