<script setup lang="ts">
import { ref } from 'vue'
import { OButton, OSlideButton } from '@ousi-ui/vue'

const unlocked = ref(false)
const deleted = ref(false)
const deleting = ref(false)
const paid = ref(false)

function remove() {
  deleting.value = true
  setTimeout(() => (deleting.value = false), 1600)
}
function again() {
  unlocked.value = deleted.value = paid.value = false
}
</script>
<template>
  <div class="flex w-full max-w-xs flex-col gap-3">
    <!-- Only the icons: the texts stay as they are. -->
    <OSlideButton v-model="unlocked" label="Slide to unlock" confirmed-label="Unlocked" variant="success" full-width>
      <template #icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </template>
      <template #confirmed-icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7.5-2" />
        </svg>
      </template>
    </OSlideButton>

    <!-- An icon and a text for each state. Screen readers hear what these texts say. -->
    <OSlideButton v-model="deleted" :loading="deleting" variant="danger" full-width @confirm="remove">
      <template #icon>
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 7h14M10 7V4.5h4V7M7 7l1 12.5h8L17 7" />
        </svg>
      </template>
      <template #loading-icon>
        <span class="flex gap-0.5" aria-hidden="true">
          <span v-for="i in 3" :key="i" class="size-1.5 animate-pulse rounded-full bg-current" :style="{ animationDelay: `${i * 150}ms` }" />
        </span>
      </template>
      <template #label>
        <span class="truncate">Delete <strong>report.pdf</strong></span>
      </template>
      <template #loading-label>Deleting…</template>
      <template #confirmed-label>
        <span class="truncate text-ousi-danger-soft-strong">File deleted</span>
      </template>
    </OSlideButton>

    <!-- Every slot gets progress, from 0 to 1: this icon turns as it is dragged. -->
    <OSlideButton v-model="paid" size="lg" full-width>
      <template #icon="{ progress }">
        <svg class="size-5" :style="{ transform: `rotate(${progress * 360}deg)` }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 6l6 6-6 6M13 6l6 6-6 6" />
        </svg>
      </template>
      <template #label>
        <span class="text-ousi-muted">Pay</span>
        <span class="font-semibold tabular-nums">$48.00</span>
      </template>
    </OSlideButton>

    <OButton variant="text" size="sm" class="self-center" :disabled="deleting || !(unlocked || deleted || paid)" @click="again">Start over</OButton>
  </div>
</template>
