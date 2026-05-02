<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton, OInput, OAvatar, OChip } from '@ousi-ui/vue'

const xsOpen = ref(false)
const smOpen = ref(false)
const lgOpen = ref(false)

const fileName = ref('Onboarding flow.fig')
const plans = [
  { name: 'Hobby', price: '$0',  desc: 'For personal use',  features: ['1 project', 'Community support'] },
  { name: 'Pro',   price: '$12', desc: 'For freelancers',   features: ['10 projects', 'Email support', 'Custom themes'], featured: true },
  { name: 'Team',  price: '$48', desc: 'For small teams',   features: ['Unlimited projects', 'Shared workspace', 'Priority support'] },
]
</script>
<template>
  <div class="flex flex-wrap gap-3">
    <OButton variant="outline" @click="xsOpen = true">XS — Sign out</OButton>
    <OButton variant="outline" @click="smOpen = true">SM — Rename file</OButton>
    <OButton variant="outline" @click="lgOpen = true">LG — Pick a plan</OButton>
  </div>

  <!-- XS — quick confirm -->
  <ODialog v-model="xsOpen" size="xs">
    <ODialogBody>
      <p class="text-sm text-ousi-foreground text-center py-2">Sign out of your account?</p>
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="outline" full-width @click="xsOpen = false">Cancel</OButton>
      <OButton full-width @click="xsOpen = false">Sign out</OButton>
    </ODialogFooter>
  </ODialog>

  <!-- SM — single-input form -->
  <ODialog v-model="smOpen" size="sm">
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Rename file</h2>
    </ODialogHeader>
    <ODialogBody>
      <OInput v-model="fileName" label="File name" />
      <p class="text-xs text-ousi-muted mt-2">Renaming updates references in 3 dependent projects.</p>
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="outline" @click="smOpen = false">Cancel</OButton>
      <OButton @click="smOpen = false">Save</OButton>
    </ODialogFooter>
  </ODialog>

  <!-- LG — pricing comparison -->
  <ODialog v-model="lgOpen" size="lg">
    <ODialogHeader>
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-ousi-foreground">Choose a plan</h2>
          <p class="text-sm text-ousi-muted mt-1">Upgrade to unlock more projects and team features.</p>
        </div>
        <OChip variant="soft" size="sm">14-day trial</OChip>
      </div>
    </ODialogHeader>
    <ODialogBody>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="relative rounded-ousi-2xl border p-4 transition-colors"
          :class="plan.featured ? 'border-ousi-accent bg-ousi-accent-soft/40' : 'border-ousi-border bg-ousi-surface-secondary/40'"
        >
          <span v-if="plan.featured" class="absolute -top-2 right-3 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-ousi-accent text-ousi-accent-foreground px-2 py-0.5">Popular</span>
          <p class="text-sm font-semibold text-ousi-foreground">{{ plan.name }}</p>
          <p class="text-xs text-ousi-muted mt-0.5">{{ plan.desc }}</p>
          <p class="text-2xl font-bold text-ousi-foreground mt-3">
            {{ plan.price }}
            <span class="text-xs font-normal text-ousi-muted">/mo</span>
          </p>
          <ul class="mt-3 space-y-1.5">
            <li v-for="f in plan.features" :key="f" class="flex items-start gap-1.5 text-xs text-ousi-foreground">
              <svg class="size-3.5 shrink-0 mt-px text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              {{ f }}
            </li>
          </ul>
        </div>
      </div>
    </ODialogBody>
    <ODialogFooter>
      <div class="flex items-center gap-2 mr-auto">
        <OAvatar name="Lin Wei" size="sm" />
        <span class="text-xs text-ousi-muted">Billed to lin@oasiui.dev</span>
      </div>
      <OButton variant="outline" @click="lgOpen = false">Maybe later</OButton>
      <OButton @click="lgOpen = false">Continue with Pro</OButton>
    </ODialogFooter>
  </ODialog>
</template>
