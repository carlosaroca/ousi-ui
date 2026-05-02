<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton, OChip } from '@ousi-ui/vue'

const topOpen = ref(false)
const centerOpen = ref(false)
const bottomOpen = ref(false)
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton variant="outline" @click="topOpen = true">Top — Update available</OButton>
    <OButton variant="outline" @click="centerOpen = true">Center — Settings</OButton>
    <OButton variant="outline" @click="bottomOpen = true">Bottom — Cookie consent</OButton>
  </div>

  <!-- TOP — system notification -->
  <ODialog v-model="topOpen" placement="top" size="sm">
    <ODialogBody>
      <div class="flex items-start gap-3">
        <div class="size-9 shrink-0 flex items-center justify-center rounded-ousi-2xl bg-ousi-accent-soft text-ousi-accent">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-ousi-foreground">Update available — v0.2.1</p>
          <p class="text-xs text-ousi-muted mt-0.5">Includes new shadow tokens and a fix for the date picker.</p>
        </div>
      </div>
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="text" @click="topOpen = false">Later</OButton>
      <OButton @click="topOpen = false">Restart and update</OButton>
    </ODialogFooter>
  </ODialog>

  <!-- CENTER — typical settings -->
  <ODialog v-model="centerOpen" placement="center" size="sm">
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Notifications</h2>
      <p class="text-xs text-ousi-muted mt-0.5">Choose how you want to be reached.</p>
    </ODialogHeader>
    <ODialogBody>
      <div class="space-y-2">
        <label class="flex items-center justify-between gap-3 px-3 py-2 rounded-ousi-xl bg-ousi-surface-secondary/50">
          <div>
            <p class="text-sm text-ousi-foreground">Mentions and replies</p>
            <p class="text-xs text-ousi-muted">Pings when someone mentions you in a thread.</p>
          </div>
          <OChip variant="soft" size="sm" color="success">On</OChip>
        </label>
        <label class="flex items-center justify-between gap-3 px-3 py-2 rounded-ousi-xl bg-ousi-surface-secondary/50">
          <div>
            <p class="text-sm text-ousi-foreground">Weekly digest</p>
            <p class="text-xs text-ousi-muted">A summary of activity every Monday morning.</p>
          </div>
          <OChip variant="soft" size="sm" color="default">Off</OChip>
        </label>
      </div>
    </ODialogBody>
    <ODialogFooter>
      <OButton @click="centerOpen = false">Done</OButton>
    </ODialogFooter>
  </ODialog>

  <!-- BOTTOM — cookie / consent banner-style -->
  <ODialog v-model="bottomOpen" placement="bottom" size="md">
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">We use cookies</h2>
    </ODialogHeader>
    <ODialogBody>
      <p class="text-sm text-ousi-muted leading-relaxed">
        We use essential cookies to keep the site working and optional analytics cookies to understand how you use it.
        You can change your preferences anytime from your account settings.
      </p>
      <a href="#" class="text-xs text-ousi-accent underline mt-2 inline-block">Read our cookie policy</a>
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="text" @click="bottomOpen = false">Reject all</OButton>
      <OButton variant="outline" @click="bottomOpen = false">Customize</OButton>
      <OButton @click="bottomOpen = false">Accept all</OButton>
    </ODialogFooter>
  </ODialog>
</template>
