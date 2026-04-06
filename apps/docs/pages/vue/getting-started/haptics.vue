<script setup lang="ts">
import { OButton, OSwitch, OCheckbox, OTabs, OChip, OSeparator, OKbd } from '@ousi-ui/vue'
import type { TabItem } from '@ousi-ui/vue'
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Haptic Feedback — Ousi UI',
  description: 'Built-in haptic feedback for mobile interactions.',
})

const demoSwitch = ref(false)
const demoCheck = ref(false)

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'presets', label: 'Presets' },
  { id: 'usage-in-components', label: 'Usage in Components' },
  { id: 'supported-components', label: 'Supported Components' },
  { id: 'custom-usage', label: 'Custom Usage' },
  { id: 'how-it-works', label: 'How It Works' },
]
</script>

<template>
  <div>
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <OChip color="accent" variant="soft" size="sm">Handbook</OChip>
      </div>
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Haptic Feedback</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Built-in vibration feedback that makes mobile interfaces feel physical.</p>
    </div>

    <div class="space-y-12">

      <!-- Overview -->
      <section id="overview">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Overview</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI includes a haptic feedback layer powered by the
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API" target="_blank" class="text-ousi-accent underline">Web Vibration API</a>.
          When users interact with components on supported mobile devices, they feel a subtle physical response
          that reinforces the visual feedback.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed">
          Haptics are completely optional, zero-dependency, and silently no-op on desktop, SSR,
          and unsupported browsers. They add no bundle weight on platforms that don't use them.
        </p>
      </section>

      <OSeparator />

      <!-- Presets -->
      <section id="presets">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Presets</h2>
        <p class="text-sm text-ousi-muted mb-4">
          There are 7 presets organized into two categories: physical (how it feels) and semantic (what it means).
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Preset</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Type</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Pattern</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Use case</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'selection'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Semantic</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">20ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Tabs, radio, picker, checkbox</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'light'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Physical</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">30ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Toggle, switch, dropdown item</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'medium'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Physical</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">50ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Button click, dialog open</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'heavy'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Physical</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">420ms</td>
                <td class="px-4 py-3 text-ousi-foreground">High-impact actions</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'success'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Semantic</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">[30, 80, 40]ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Success toast, form submitted</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'warning'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Semantic</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">[50, 60, 50]ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Danger button, warning toast</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">'error'</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Semantic</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">[80, 50, 80]ms</td>
                <td class="px-4 py-3 text-ousi-foreground">Error toast, failed action</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Usage in components -->
      <section id="usage-in-components">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Usage in Components</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Haptics are built into 10 components. Each has a sensible default — you don't need to configure anything.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Uses default 'medium' haptic -->\n<OButton>Save</OButton>\n\n<!-- Override with a specific preset -->\n<OButton haptic=&quot;heavy&quot;>Delete Account</OButton>\n\n<!-- Disable haptics for this instance -->\n<OButton :haptic=&quot;false&quot;>Cancel</OButton>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Components with haptics -->
      <section id="supported-components">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Supported Components</h2>
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Component</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Default</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Triggers when</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in [
                { comp: 'OButton', default: 'medium / warning', when: 'Click (skipped if disabled)' },
                { comp: 'OSwitch', default: 'light', when: 'Toggle on/off' },
                { comp: 'OCheckbox', default: 'selection', when: 'Check/uncheck' },
                { comp: 'ORadioGroup', default: 'selection', when: 'Radio selection' },
                { comp: 'OSelect', default: 'selection', when: 'Option chosen' },
                { comp: 'OTabs', default: 'selection', when: 'Tab switch' },
                { comp: 'OPagination', default: 'selection', when: 'Page change' },
                { comp: 'ODialog', default: 'medium', when: 'Open (not close)' },
                { comp: 'ODropdownItem', default: 'light / warning', when: 'Item click' },
                { comp: 'Toast', default: 'auto-mapped', when: 'Toast created' },
              ]" :key="row.comp" :class="i < 9 ? 'border-b border-ousi-border' : ''">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ row.comp }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ row.default }}</td>
                <td class="px-4 py-3 text-ousi-foreground">{{ row.when }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Custom usage -->
      <section id="custom-usage">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Custom Usage</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Use the <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">useHaptics()</code> composable
          to trigger haptics from your own components:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<script setup>\nimport { useHaptics } from '@ousi-ui/haptics'\n\nconst { trigger, isSupported } = useHaptics()\n\nfunction handleImportantAction() {\n  trigger('heavy')\n  // ... your logic\n}\n</script>\n\n<template>\n  <button @click=&quot;handleImportantAction&quot;>\n    Delete everything\n  </button>\n</template>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- How it works -->
      <section id="how-it-works">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">How It Works</h2>
        <ul class="space-y-2.5 text-sm text-ousi-foreground">
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <strong>Android</strong>: Uses the native Web Vibration API with configurable pulse durations.
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <strong>iOS</strong>: Uses a hidden checkbox click trick to activate the Taptic Engine — works on Safari, Chrome, and all iOS browsers.
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Called <strong>synchronously</strong> inside user event handlers (required by browsers).
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <strong>Silently no-ops</strong> on desktop and SSR — zero errors, zero warnings.
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Fires at the <strong>exact same instant</strong> as the visual state change.
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <strong>No external dependencies</strong> — pure internal implementation, zero npm packages.
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
