<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Theming — Ousi UI',
  description: 'Customize Ousi UI with OKLCH color tokens and CSS custom properties.',
})

const coreTokens = [
  { name: '--ousi-background', purpose: 'Page background', example: 'oklch(1 0 0)', tailwind: 'bg-ousi-background' },
  { name: '--ousi-foreground', purpose: 'Primary text color', example: 'oklch(0.14 0 0)', tailwind: 'text-ousi-foreground' },
  { name: '--ousi-surface', purpose: 'Card / panel backgrounds', example: 'oklch(0.97 0 0)', tailwind: 'bg-ousi-surface' },
  { name: '--ousi-border', purpose: 'Borders and dividers', example: 'oklch(0.88 0 0)', tailwind: 'border-ousi-border' },
  { name: '--ousi-accent', purpose: 'Primary brand / action color', example: 'oklch(0.65 0.24 250)', tailwind: 'bg-ousi-accent' },
  { name: '--ousi-muted', purpose: 'Secondary / helper text', example: 'oklch(0.55 0 0)', tailwind: 'text-ousi-muted' },
  { name: '--ousi-default', purpose: 'Subtle backgrounds, hover states', example: 'oklch(0.94 0 0)', tailwind: 'bg-ousi-default' },
  { name: '--ousi-success', purpose: 'Positive outcomes', example: 'oklch(0.65 0.2 145)', tailwind: 'bg-ousi-success' },
  { name: '--ousi-danger', purpose: 'Errors, destructive actions', example: 'oklch(0.6 0.22 25)', tailwind: 'bg-ousi-danger' },
  { name: '--ousi-warning', purpose: 'Caution states', example: 'oklch(0.75 0.18 70)', tailwind: 'bg-ousi-warning' },
  { name: '--ousi-focus', purpose: 'Focus ring color', example: 'oklch(0.65 0.24 250)', tailwind: 'ring-ousi-focus' },
  { name: '--ousi-radius', purpose: 'Base border radius', example: '0.625rem', tailwind: 'rounded-ousi-md' },
]

const radiusScale = [
  { token: 'rounded-ousi-sm', value: 'calc(var(--ousi-radius) * 0.5)', use: 'Small elements, chips, badges' },
  { token: 'rounded-ousi-md', value: 'var(--ousi-radius)', use: 'Buttons, inputs, default' },
  { token: 'rounded-ousi-lg', value: 'calc(var(--ousi-radius) * 1.5)', use: 'Cards, dropdowns' },
  { token: 'rounded-ousi-xl', value: 'calc(var(--ousi-radius) * 2)', use: 'Dialogs, popovers' },
  { token: 'rounded-ousi-2xl', value: 'calc(var(--ousi-radius) * 3)', use: 'Large containers' },
]

const tailwindMappings = [
  { utility: 'bg-ousi-accent', maps: 'background-color: var(--ousi-accent)' },
  { utility: 'text-ousi-foreground', maps: 'color: var(--ousi-foreground)' },
  { utility: 'border-ousi-border', maps: 'border-color: var(--ousi-border)' },
  { utility: 'bg-ousi-danger/10', maps: 'background-color: oklch(... / 0.1)' },
  { utility: 'ring-ousi-focus', maps: 'outline-color: var(--ousi-focus)' },
  { utility: 'rounded-ousi-lg', maps: 'border-radius: calc(var(--ousi-radius) * 1.5)' },
]

const tocItems = [
  { id: 'how-theming-works', label: 'How Theming Works' },
  { id: 'theme-structure', label: 'Theme Structure' },
  { id: 'dark-mode', label: 'Dark Mode' },
  { id: 'custom-theme', label: 'Custom Theme' },
  { id: 'radius-tokens', label: 'Radius Tokens' },
  { id: 'using-with-tailwind', label: 'Using with Tailwind' },
  { id: 'quick-reference', label: 'Quick Reference' },
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
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Theming</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Customize every aspect of Ousi UI with OKLCH color tokens and CSS custom properties.</p>
    </div>

    <div class="space-y-12">

      <!-- How Theming Works -->
      <section id="how-theming-works">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">How Theming Works</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI's theming system is built on <strong>CSS custom properties</strong> using the
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch" target="_blank" class="text-ousi-accent underline">OKLCH color space</a>.
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">@ousi-ui/theme</code> package
          provides all default tokens. You customize by overriding CSS variables — no build step, no config files,
          just CSS.
        </p>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          OKLCH (Oklab Lightness, Chroma, Hue) is a perceptually uniform color space. Unlike HSL, equal changes
          in lightness actually look equally different to the human eye. This means a blue and a yellow at the
          same lightness value will appear equally bright — making it ideal for design token systems.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed">
          Because the tokens are standard CSS custom properties, they integrate seamlessly with
          <strong>Tailwind CSS v4</strong>. The theme package registers each token as a Tailwind utility,
          so you can write <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">bg-ousi-accent</code>
          or <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">text-ousi-muted</code> in your templates.
        </p>
      </section>

      <OSeparator />

      <!-- Theme Structure -->
      <section id="theme-structure">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Theme Structure</h2>
        <p class="text-sm text-ousi-muted mb-4">
          The theme is defined by a small set of semantic tokens. Every component in the library references
          these variables — change them once, and the entire UI updates.
        </p>

        <!-- Live color swatches -->
        <div class="flex flex-wrap gap-3 mb-6">
          <div v-for="token in coreTokens.filter(t => t.name !== '--ousi-radius')" :key="token.name" class="flex flex-col items-center gap-1.5">
            <div
              class="size-10 rounded-ousi-lg border border-ousi-border"
              :style="{ backgroundColor: `var(${token.name})` }"
            />
            <span class="text-[10px] font-mono text-ousi-muted">{{ token.name.replace('--ousi-', '') }}</span>
          </div>
        </div>

        <!-- Token table -->
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Token</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Purpose</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Default (Light)</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Tailwind Utility</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(token, i) in coreTokens"
                :key="token.name"
                :class="i < coreTokens.length - 1 ? 'border-b border-ousi-border' : ''"
              >
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ token.name }}</td>
                <td class="px-4 py-3 text-ousi-foreground">{{ token.purpose }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ token.example }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ token.tailwind }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Dark Mode -->
      <section id="dark-mode">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Dark Mode</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Dark mode works out of the box. By default, Ousi UI respects the user's system preference via
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">prefers-color-scheme: dark</code>.
          You can also toggle it manually by adding the <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">.dark</code>
          class to the <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">&lt;html&gt;</code> element.
        </p>

        <p class="text-sm text-ousi-muted leading-relaxed mb-4">
          The theme package ships separate token values for dark mode. You can override any of them inside
          the <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">.dark</code> selector:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`/* Automatic — system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --ousi-background: oklch(0.13 0 0);
    --ousi-foreground: oklch(0.93 0 0);
    --ousi-surface: oklch(0.18 0 0);
    --ousi-border: oklch(0.28 0 0);
  }
}

/* Manual — class-based toggle */
.dark {
  --ousi-background: oklch(0.13 0 0);
  --ousi-foreground: oklch(0.93 0 0);
  --ousi-surface: oklch(0.18 0 0);
  --ousi-border: oklch(0.28 0 0);
}`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed">
          If you use Nuxt with <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">@nuxtjs/color-mode</code>,
          the <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">.dark</code> class is added
          automatically and everything just works.
        </p>
      </section>

      <OSeparator />

      <!-- Custom Theme -->
      <section id="custom-theme">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Custom Theme</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Creating a custom brand theme is as simple as overriding the CSS variables in your global stylesheet.
          You only need to override the tokens you want to change — everything else falls back to the defaults.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`:root {
  --ousi-accent: oklch(0.65 0.24 270); /* Purple accent */
  --ousi-radius: 0.75rem;
}

.dark {
  --ousi-background: oklch(0.15 0.01 270);
  --ousi-surface: oklch(0.2 0.01 270);
}`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed mb-4">
          You can also scope themes to specific sections of your app using any CSS selector:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`/* Marketing pages — warm palette */
.theme-marketing {
  --ousi-accent: oklch(0.7 0.2 55);
  --ousi-background: oklch(0.98 0.005 55);
}

/* Admin dashboard — cool palette */
.theme-admin {
  --ousi-accent: oklch(0.6 0.2 250);
  --ousi-background: oklch(0.99 0 0);
}`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed">
          Because CSS custom properties cascade, any nested component will automatically pick up the scoped values.
          This makes multi-theme layouts trivial.
        </p>
      </section>

      <OSeparator />

      <!-- Radius Tokens -->
      <section id="radius-tokens">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Radius Tokens</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">--ousi-radius</code> token
          defines the base border radius. All other radius sizes are derived from it using
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">calc()</code>,
          so changing the base value scales the entire UI consistently.
        </p>

        <!-- Radius visual demo -->
        <div class="flex flex-wrap gap-4 mb-6">
          <div v-for="r in radiusScale" :key="r.token" class="flex flex-col items-center gap-1.5">
            <div
              class="size-14 border-2 border-ousi-accent bg-ousi-accent/10"
              :class="r.token"
            />
            <span class="text-[10px] font-mono text-ousi-muted">{{ r.token.replace('rounded-ousi-', '') }}</span>
          </div>
        </div>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Class</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Computed Value</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Typical Use</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(r, i) in radiusScale"
                :key="r.token"
                :class="i < radiusScale.length - 1 ? 'border-b border-ousi-border' : ''"
              >
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ r.token }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ r.value }}</td>
                <td class="px-4 py-3 text-ousi-foreground">{{ r.use }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mt-4">
          <CodeBlock :code="`:root {
  --ousi-radius: 0.5rem;   /* Softer, default-ish */
}

/* Fully rounded (pill shapes) */
:root {
  --ousi-radius: 9999px;
}

/* Sharp corners */
:root {
  --ousi-radius: 0;
}`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Using with Tailwind -->
      <section id="using-with-tailwind">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Using with Tailwind</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">@ousi-ui/theme</code> package
          registers all tokens as Tailwind CSS v4 theme values. This means every token is available as a
          utility class — no extra configuration needed.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Tailwind Class</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Generated CSS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(m, i) in tailwindMappings"
                :key="m.utility"
                :class="i < tailwindMappings.length - 1 ? 'border-b border-ousi-border' : ''"
              >
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ m.utility }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ m.maps }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Opacity modifiers work as expected. Append a slash and a value to control alpha:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- 10% accent background -->
<div class=&quot;bg-ousi-accent/10 text-ousi-accent p-4 rounded-ousi-lg&quot;>
  Subtle accent panel
</div>

<!-- 50% danger border -->
<div class=&quot;border border-ousi-danger/50 rounded-ousi-md p-3&quot;>
  Error boundary
</div>`" show-copy />
        </div>

        <!-- Live demo of opacity -->
        <div class="flex gap-3 flex-wrap">
          <div class="bg-ousi-accent/10 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md">accent/10</div>
          <div class="bg-ousi-accent/20 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md">accent/20</div>
          <div class="bg-ousi-accent/40 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md">accent/40</div>
          <div class="bg-ousi-accent/60 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">accent/60</div>
          <div class="bg-ousi-accent/80 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">accent/80</div>
          <div class="bg-ousi-accent text-white text-xs font-mono px-3 py-2 rounded-ousi-md">accent/100</div>
        </div>
      </section>

      <OSeparator />

      <!-- Quick Reference -->
      <section id="quick-reference">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Quick Reference</h2>
        <p class="text-sm text-ousi-muted mb-4">
          A minimal custom theme setup in your global CSS:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`@import '@ousi-ui/theme';

:root {
  /* Brand color — everything derives from this */
  --ousi-accent: oklch(0.65 0.24 270);

  /* Optional: adjust the radius scale */
  --ousi-radius: 0.75rem;
}

.dark {
  /* Tinted dark backgrounds */
  --ousi-background: oklch(0.15 0.01 270);
  --ousi-surface: oklch(0.2 0.01 270);
  --ousi-border: oklch(0.3 0.01 270);
}`" show-copy />
        </div>
      </section>

    </div>
  </div>
</template>
