<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton, OProgressBar } from '@ousi-ui/vue'

// Variant 1: prevent-close while async work runs (X is still available)
const savingOpen = ref(false)
const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startSaving() {
  progress.value = 0
  savingOpen.value = true
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 8)
    if (progress.value >= 100) {
      if (timer) clearInterval(timer)
      setTimeout(() => (savingOpen.value = false), 400)
    }
  }, 250)
}

// Variant 2: prevent-close + hide-close-button → forces a choice from the footer
const choiceOpen = ref(false)
const lastChoice = ref<'confirmed' | 'cancelled' | null>(null)

function choose(value: 'confirmed' | 'cancelled') {
  lastChoice.value = value
  choiceOpen.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <OButton variant="outline" @click="startSaving">Open saving dialog</OButton>
      <OButton variant="outline" @click="choiceOpen = true">Open choice dialog</OButton>
      <span v-if="lastChoice" class="text-xs text-ousi-muted">
        Last choice: <span class="font-mono text-ousi-foreground">{{ lastChoice }}</span>
      </span>
    </div>

    <p class="text-xs text-ousi-muted">
      Try clicking the backdrop or pressing Esc — the dialog stays open. The first one still has its X button;
      the second hides it, so you have to choose Cancel or Confirm.
    </p>
  </div>

  <!-- Variant 1: prevent-close, X visible -->
  <ODialog v-model="savingOpen" size="sm" prevent-close>
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Uploading assets…</h2>
      <p class="text-xs text-ousi-muted mt-0.5">Don&rsquo;t close this window — we&rsquo;ll dismiss it automatically.</p>
    </ODialogHeader>
    <ODialogBody>
      <OProgressBar :value="progress" />
      <p class="text-xs text-ousi-muted text-center mt-2 font-mono">{{ progress }}%</p>
    </ODialogBody>
  </ODialog>

  <!-- Variant 2: prevent-close + hide-close-button -->
  <ODialog v-model="choiceOpen" size="sm" prevent-close hide-close-button>
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Confirm payment</h2>
      <p class="text-xs text-ousi-muted mt-0.5">$48.00 will be charged to your card ending in 4242.</p>
    </ODialogHeader>
    <ODialogBody>
      <div class="rounded-ousi-2xl border border-ousi-border bg-ousi-surface-secondary/50 px-4 py-3 space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-ousi-muted">Plan</span><span class="font-medium">Team — Monthly</span></div>
        <div class="flex justify-between"><span class="text-ousi-muted">Renewal</span><span class="font-medium">Jun 1, 2026</span></div>
        <div class="flex justify-between text-base pt-1 border-t border-ousi-border"><span class="font-semibold">Total</span><span class="font-semibold">$48.00</span></div>
      </div>
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="outline" @click="choose('cancelled')">Cancel</OButton>
      <OButton @click="choose('confirmed')">Confirm payment</OButton>
    </ODialogFooter>
  </ODialog>
</template>
