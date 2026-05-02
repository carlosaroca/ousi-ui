<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton, OCheckbox } from '@ousi-ui/vue'

const open = ref(false)
const accepted = ref(false)
</script>
<template>
  <OButton variant="outline" @click="open = true">Read Terms of Service</OButton>

  <ODialog v-model="open" size="md" scroll-behavior="inside">
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Terms of Service</h2>
      <p class="text-xs text-ousi-muted mt-0.5">Last updated April 30, 2026 · 4 minute read</p>
    </ODialogHeader>

    <ODialogBody>
      <div class="prose-sm space-y-5 text-sm text-ousi-foreground leading-relaxed">
        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">1. Acceptance of Terms</h3>
          <p class="text-ousi-muted">
            By accessing or using Ousi UI ("the Service"), you agree to be bound by these Terms of Service.
            If you disagree with any part of these terms, you may not use the Service. These terms apply to all
            visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">2. Accounts</h3>
          <p class="text-ousi-muted">
            When you create an account with us, you must provide information that is accurate, complete, and
            current at all times. Failure to do so constitutes a breach of the Terms, which may result in
            immediate termination of your account.
          </p>
          <p class="text-ousi-muted mt-2">
            You are responsible for safeguarding the password you use to access the Service and for any
            activities or actions under your password. We encourage you to use a strong password (at least
            12 characters, mixing letters, numbers, and symbols).
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">3. Intellectual Property</h3>
          <p class="text-ousi-muted">
            The Service and its original content (excluding content provided by users), features, and
            functionality are and will remain the exclusive property of Ousi UI and its licensors. The Service
            is protected by copyright, trademark, and other laws of both the relevant jurisdictions and foreign
            countries.
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">4. Subscriptions and Payments</h3>
          <p class="text-ousi-muted">
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a
            recurring and periodic basis (monthly or annually), depending on the plan you select.
            At the end of each period, your subscription will automatically renew under the same conditions
            unless you cancel it.
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">5. Termination</h3>
          <p class="text-ousi-muted">
            We may terminate or suspend your account immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the Terms. Upon termination, your
            right to use the Service will cease immediately.
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">6. Limitation of Liability</h3>
          <p class="text-ousi-muted">
            In no event shall Ousi UI, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
            access to or use of (or inability to access or use) the Service.
          </p>
        </section>

        <section>
          <h3 class="font-semibold text-ousi-foreground mb-1.5">7. Changes to Terms</h3>
          <p class="text-ousi-muted">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
            revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
      </div>
    </ODialogBody>

    <ODialogFooter>
      <OCheckbox v-model="accepted" label="I have read and agree to the Terms" class="mr-auto" />
      <OButton variant="outline" @click="open = false">Cancel</OButton>
      <OButton :disabled="!accepted" @click="open = false">Continue</OButton>
    </ODialogFooter>
  </ODialog>
</template>
