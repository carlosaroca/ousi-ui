<script setup lang="ts">
import { ref } from 'vue'
import { OSlideButton } from '@ousi-ui/vue'

const sent = ref(false)
const sending = ref(false)
const problem = ref('')

// An action that fails: setting v-model back to false returns the thumb to the start.
function send() {
  problem.value = ''
  sending.value = true
  setTimeout(() => {
    sending.value = false
    sent.value = false
    problem.value = 'It could not be sent. Slide again to retry.'
  }, 1400)
}
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <OSlideButton v-model="sent" :loading="sending" label="Slide to send" loading-label="Sending…" @confirm="send" />
    <p class="h-5 text-sm text-ousi-danger" role="alert">{{ problem }}</p>
  </div>
</template>
