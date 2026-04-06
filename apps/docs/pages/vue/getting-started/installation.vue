<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Installation — Ousi UI',
  description: 'Install and configure Ousi UI in your Vue 3 project.',
})

const tocItems = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install Packages' },
  { id: 'styles', label: 'Import Styles' },
  { id: 'usage', label: 'Use Components' },
  { id: 'global', label: 'Global Registration' },
  { id: 'prefix', label: 'Custom Prefix' },
  { id: 'nuxt', label: 'Nuxt 3' },
]
</script>

<template>
  <div>
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Installation</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Get up and running with Ousi UI in minutes.</p>
    </div>

    <div class="space-y-12">

      <!-- Requirements -->
      <section id="requirements">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Requirements</h2>
        <div class="flex flex-wrap gap-2">
          <OChip variant="flat" size="sm">Vue 3.4+</OChip>
          <OChip variant="flat" size="sm">Tailwind CSS 4+</OChip>
          <OChip variant="flat" size="sm">Node.js 18+</OChip>
        </div>
      </section>

      <OSeparator />

      <!-- Step 1 -->
      <section id="install">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">1. Install packages</h2>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">Terminal</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>pnpm add @ousi-ui/vue @ousi-ui/theme</code></pre>
        </div>
        <p class="text-xs text-ousi-muted mt-2">Also works with npm, yarn, or bun.</p>
      </section>

      <OSeparator />

      <!-- Step 2 -->
      <section id="styles">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">2. Import styles</h2>
        <p class="text-sm text-ousi-muted mb-3">Add the theme import to your main CSS file:</p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">main.css</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>@import "tailwindcss";
@import "@ousi-ui/theme";</code></pre>
        </div>
        <p class="text-xs text-ousi-muted mt-2">The theme provides all CSS custom properties, color tokens, and base styles.</p>
      </section>

      <OSeparator />

      <!-- Step 3: Usage -->
      <section id="usage">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">3. Use components</h2>
        <p class="text-sm text-ousi-muted mb-3">Import individual components directly — fully tree-shakeable:</p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">App.vue</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>&lt;script setup&gt;
import { OButton, OInput, OCard } from '@ousi-ui/vue'
&lt;/script&gt;

&lt;template&gt;
  &lt;OCard&gt;
    &lt;OInput placeholder="Enter your email" /&gt;
    &lt;OButton&gt;Subscribe&lt;/OButton&gt;
  &lt;/OCard&gt;
&lt;/template&gt;</code></pre>
        </div>
      </section>

      <OSeparator />

      <!-- Global Registration (optional) -->
      <section id="global">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Global Registration (Optional)</h2>
        <p class="text-sm text-ousi-muted mb-3">Register all components globally if you prefer not to import individually:</p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">main.ts</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>import { createApp } from 'vue'
import { OusiUIPlugin } from '@ousi-ui/vue'
import App from './App.vue'

const app = createApp(App)
app.use(OusiUIPlugin)
app.mount('#app')</code></pre>
        </div>
      </section>

      <OSeparator />

      <!-- Custom Prefix -->
      <section id="prefix">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Custom Prefix</h2>
        <p class="text-sm text-ousi-muted mb-3">Change the default <code class="px-1.5 py-0.5 rounded bg-ousi-default text-xs font-mono">O</code> prefix to avoid conflicts:</p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">main.ts</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>app.use(OusiUIPlugin, { prefix: 'Ui' })
// Components become: UiButton, UiInput, UiCard, etc.</code></pre>
        </div>
      </section>

      <OSeparator />

      <!-- Nuxt -->
      <section id="nuxt">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Nuxt 3</h2>
        <p class="text-sm text-ousi-muted mb-3">For Nuxt projects, create a plugin to register components:</p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex border-b border-ousi-border">
            <span class="px-4 py-2 text-xs font-medium text-ousi-muted">plugins/ousi-ui.ts</span>
          </div>
          <pre class="p-4 text-sm font-mono text-ousi-foreground overflow-x-auto"><code>import { OusiUIPlugin } from '@ousi-ui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(OusiUIPlugin)
})</code></pre>
        </div>
      </section>

    </div>
  </div>
</template>
