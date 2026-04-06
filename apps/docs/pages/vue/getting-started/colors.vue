<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Colors — Ousi UI',
  description: 'OKLCH-based color system for consistent, accessible color across your entire UI.',
})

const semanticColors = [
  { name: 'accent', token: '--ousi-accent', purpose: 'Primary brand and action color', bg: 'bg-ousi-accent' },
  { name: 'success', token: '--ousi-success', purpose: 'Positive outcomes, confirmations', bg: 'bg-ousi-success' },
  { name: 'danger', token: '--ousi-danger', purpose: 'Errors, destructive actions', bg: 'bg-ousi-danger' },
  { name: 'warning', token: '--ousi-warning', purpose: 'Caution states, important notices', bg: 'bg-ousi-warning' },
  { name: 'foreground', token: '--ousi-foreground', purpose: 'Primary text color', bg: 'bg-ousi-foreground' },
  { name: 'muted', token: '--ousi-muted', purpose: 'Secondary text, helper text', bg: 'bg-ousi-muted' },
  { name: 'border', token: '--ousi-border', purpose: 'Borders and dividers', bg: 'bg-ousi-border' },
  { name: 'surface', token: '--ousi-surface', purpose: 'Card and panel backgrounds', bg: 'bg-ousi-surface' },
  { name: 'default', token: '--ousi-default', purpose: 'Subtle backgrounds, hover states', bg: 'bg-ousi-default' },
  { name: 'background', token: '--ousi-background', purpose: 'Page background', bg: 'bg-ousi-background' },
]

const oklchParts = [
  { letter: 'L', name: 'Lightness', range: '0 – 1', desc: 'How light or dark the color is. 0 is black, 1 is white.' },
  { letter: 'C', name: 'Chroma', range: '0 – 0.4', desc: 'Color intensity / saturation. 0 is gray, higher values are more vivid.' },
  { letter: 'H', name: 'Hue', range: '0 – 360', desc: 'The hue angle on the color wheel. 0 = pink, 145 = green, 250 = blue.' },
]

const themeExamples = [
  { name: 'Blue', hue: '250', css: '--ousi-accent: oklch(0.65 0.24 250);', color: 'oklch(0.65 0.24 250)' },
  { name: 'Green', hue: '145', css: '--ousi-accent: oklch(0.65 0.24 145);', color: 'oklch(0.65 0.24 145)' },
  { name: 'Orange', hue: '55', css: '--ousi-accent: oklch(0.7 0.2 55);', color: 'oklch(0.7 0.2 55)' },
  { name: 'Purple', hue: '270', css: '--ousi-accent: oklch(0.65 0.24 270);', color: 'oklch(0.65 0.24 270)' },
  { name: 'Pink', hue: '0', css: '--ousi-accent: oklch(0.65 0.24 0);', color: 'oklch(0.65 0.24 0)' },
  { name: 'Teal', hue: '195', css: '--ousi-accent: oklch(0.65 0.2 195);', color: 'oklch(0.65 0.2 195)' },
]

const componentColors = ['primary', 'secondary', 'success', 'danger', 'warning']

const tocItems = [
  { id: 'oklch-color-space', label: 'OKLCH Color Space' },
  { id: 'semantic-colors', label: 'Semantic Colors' },
  { id: 'color-palette-generation', label: 'Color Palette Generation' },
  { id: 'using-colors', label: 'Using Colors' },
  { id: 'color-with-components', label: 'Color with Components' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'quick-reference', label: 'Quick Reference' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <OChip color="accent" variant="soft" size="sm">Handbook</OChip>
      </div>
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Colors</h1>
      <p class="mt-1.5 text-base text-ousi-muted">An OKLCH-based color system for perceptually consistent, accessible color across your entire UI.</p>
    </div>

    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>

    <div class="space-y-12">

      <!-- OKLCH Color Space -->
      <section id="oklch-color-space">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">OKLCH Color Space</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI uses the
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch" target="_blank" class="text-ousi-accent underline">OKLCH</a>
          color space for all design tokens. Unlike HSL or RGB, OKLCH is <strong>perceptually uniform</strong> —
          meaning equal numeric changes produce equal visual changes. A blue and a yellow at the same
          lightness value will actually look equally bright to the human eye.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed mb-4">
          This makes it possible to swap accent hues while maintaining consistent contrast ratios
          and visual weight, which is critical for accessibility and cohesive design.
        </p>

        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          An OKLCH color is defined by three values:
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">oklch(L C H)</code>
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted w-16">Axis</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Name</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Range</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(part, i) in oklchParts"
                :key="part.letter"
                :class="i < oklchParts.length - 1 ? 'border-b border-ousi-border' : ''"
              >
                <td class="px-4 py-3 font-mono text-sm font-bold text-ousi-accent">{{ part.letter }}</td>
                <td class="px-4 py-3 font-semibold text-ousi-foreground">{{ part.name }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ part.range }}</td>
                <td class="px-4 py-3 text-ousi-foreground">{{ part.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`/* Reading an OKLCH value */
oklch(0.65 0.24 250)
       │    │    └─ Hue: 250° (blue)
       │    └────── Chroma: 0.24 (vivid)
       └─────────── Lightness: 0.65 (medium)`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Semantic Colors -->
      <section id="semantic-colors">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Semantic Colors</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Ousi UI defines colors by their <strong>purpose</strong>, not their hue. This keeps the system
          flexible — change the accent hue and every component updates automatically.
        </p>

        <!-- Live swatches -->
        <div class="flex flex-wrap gap-3 mb-6">
          <div v-for="color in semanticColors" :key="color.name" class="flex flex-col items-center gap-1.5">
            <div
              class="size-10 rounded-ousi-lg border border-ousi-border"
              :style="{ backgroundColor: `var(${color.token})` }"
            />
            <span class="text-[10px] font-mono text-ousi-muted">{{ color.name }}</span>
          </div>
        </div>

        <!-- Full table -->
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Token</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Purpose</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Tailwind Class</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(color, i) in semanticColors"
                :key="color.token"
                :class="i < semanticColors.length - 1 ? 'border-b border-ousi-border' : ''"
              >
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ color.token }}</td>
                <td class="px-4 py-3 text-ousi-foreground">{{ color.purpose }}</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{{ color.bg }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Color Palette Generation -->
      <section id="color-palette-generation">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Color Palette Generation</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Because OKLCH separates lightness, chroma, and hue into independent axes, you can generate
          an entirely new brand palette by changing just the hue value. The lightness and chroma stay
          the same, so visual weight and contrast remain consistent.
        </p>

        <!-- Theme hue swatches -->
        <div class="flex flex-wrap gap-4 mb-6">
          <div v-for="theme in themeExamples" :key="theme.name" class="flex flex-col items-center gap-1.5">
            <div
              class="size-12 rounded-ousi-xl border border-ousi-border"
              :style="{ backgroundColor: theme.color }"
            />
            <span class="text-xs font-semibold text-ousi-foreground">{{ theme.name }}</span>
            <span class="text-[10px] font-mono text-ousi-muted">H: {{ theme.hue }}</span>
          </div>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`/* Blue theme */
--ousi-accent: oklch(0.65 0.24 250);

/* Green theme */
--ousi-accent: oklch(0.65 0.24 145);

/* Orange theme */
--ousi-accent: oklch(0.7 0.2 55);

/* Purple theme */
--ousi-accent: oklch(0.65 0.24 270);`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed">
          The semantic colors (<code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">--ousi-success</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">--ousi-danger</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">--ousi-warning</code>)
          keep their own hue values since their meaning is fixed. You typically only change the accent hue
          for brand customization.
        </p>
      </section>

      <OSeparator />

      <!-- Using Colors -->
      <section id="using-colors">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Using Colors</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Every color token maps to a Tailwind CSS utility. Use them anywhere you would use a Tailwind color class.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Text colors -->
<p class=&quot;text-ousi-foreground&quot;>Primary text</p>
<p class=&quot;text-ousi-muted&quot;>Secondary text</p>
<p class=&quot;text-ousi-accent&quot;>Accent text</p>

<!-- Background colors -->
<div class=&quot;bg-ousi-surface&quot;>Card</div>
<div class=&quot;bg-ousi-default&quot;>Subtle panel</div>

<!-- Borders -->
<div class=&quot;border border-ousi-border&quot;>Bordered element</div>

<!-- With opacity modifiers -->
<div class=&quot;bg-ousi-accent/10&quot;>10% accent overlay</div>
<div class=&quot;bg-ousi-danger/15 text-ousi-danger&quot;>Error banner</div>
<div class=&quot;border-ousi-warning/50&quot;>Faded warning border</div>`" show-copy />
        </div>

        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Opacity modifiers append an alpha channel to the OKLCH value. This is useful for creating
          subtle tinted backgrounds or faded borders without defining new tokens.
        </p>

        <!-- Live opacity demo -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wide">Accent opacity scale</p>
          <div class="flex gap-2 flex-wrap">
            <div class="bg-ousi-accent/5 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-accent/10">5%</div>
            <div class="bg-ousi-accent/10 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-accent/15">10%</div>
            <div class="bg-ousi-accent/20 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-accent/25">20%</div>
            <div class="bg-ousi-accent/30 text-ousi-accent text-xs font-mono px-3 py-2 rounded-ousi-md">30%</div>
            <div class="bg-ousi-accent/50 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">50%</div>
            <div class="bg-ousi-accent/75 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">75%</div>
            <div class="bg-ousi-accent text-white text-xs font-mono px-3 py-2 rounded-ousi-md">100%</div>
          </div>
        </div>

        <div class="space-y-2 mt-4">
          <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wide">Danger opacity scale</p>
          <div class="flex gap-2 flex-wrap">
            <div class="bg-ousi-danger/5 text-ousi-danger text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-danger/10">5%</div>
            <div class="bg-ousi-danger/10 text-ousi-danger text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-danger/15">10%</div>
            <div class="bg-ousi-danger/20 text-ousi-danger text-xs font-mono px-3 py-2 rounded-ousi-md border border-ousi-danger/25">20%</div>
            <div class="bg-ousi-danger/30 text-ousi-danger text-xs font-mono px-3 py-2 rounded-ousi-md">30%</div>
            <div class="bg-ousi-danger/50 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">50%</div>
            <div class="bg-ousi-danger/75 text-white text-xs font-mono px-3 py-2 rounded-ousi-md">75%</div>
            <div class="bg-ousi-danger text-white text-xs font-mono px-3 py-2 rounded-ousi-md">100%</div>
          </div>
        </div>
      </section>

      <OSeparator />

      <!-- Color with Components -->
      <section id="color-with-components">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Color with Components</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Many Ousi UI components accept a <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">color</code>
          prop that maps to the semantic color tokens. This provides a consistent, type-safe way to
          apply color intent across your interface.
        </p>

        <!-- OButton color demos -->
        <div class="space-y-4 mb-6">
          <div>
            <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wide mb-2">OButton</p>
            <div class="flex flex-wrap gap-2">
              <OButton v-for="c in componentColors" :key="c" :color="c" size="sm">{{ c }}</OButton>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wide mb-2">OChip</p>
            <div class="flex flex-wrap gap-2">
              <OChip v-for="c in componentColors" :key="c" :color="c" variant="soft" size="sm">{{ c }}</OChip>
            </div>
          </div>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Button colors -->
<OButton color=&quot;primary&quot;>Save Changes</OButton>
<OButton color=&quot;danger&quot;>Delete</OButton>
<OButton color=&quot;success&quot;>Confirm</OButton>
<OButton color=&quot;warning&quot;>Caution</OButton>
<OButton color=&quot;secondary&quot;>Cancel</OButton>

<!-- Chip colors -->
<OChip color=&quot;success&quot; variant=&quot;soft&quot;>Active</OChip>
<OChip color=&quot;danger&quot; variant=&quot;soft&quot;>Expired</OChip>
<OChip color=&quot;warning&quot; variant=&quot;soft&quot;>Pending</OChip>`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted leading-relaxed">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">color</code> prop
          accepts <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">primary</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">secondary</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">success</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">danger</code>, and
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">warning</code>.
          Components automatically derive hover, active, and focus styles from the chosen color.
        </p>
      </section>

      <OSeparator />

      <!-- Accessibility -->
      <section id="accessibility">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Accessibility</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          The default token values are chosen to meet <strong>WCAG 2.1 AA</strong> contrast requirements.
          When customizing colors, keep these guidelines in mind:
        </p>
        <ul class="space-y-2.5 text-sm text-ousi-foreground">
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Text on backgrounds</strong>: Ensure at least 4.5:1 contrast ratio for normal text, 3:1 for large text.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Accent lightness</strong>: Keep the L value between 0.45 and 0.75 for the accent color to ensure it works as both text and a button background.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Don't rely on color alone</strong>: Always pair color with icons, text, or patterns to convey meaning for color-blind users.</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span><strong>Test both modes</strong>: Custom dark mode overrides should be tested separately — OKLCH lightness behaves differently on dark backgrounds.</span>
          </li>
        </ul>
      </section>

      <OSeparator />

      <!-- Quick Reference -->
      <section id="quick-reference">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Quick Reference</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Common color patterns you will use frequently:
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`/* Brand customization — change just the hue */
:root {
  --ousi-accent: oklch(0.65 0.24 270);
}

/* Semantic colors — usually left as defaults */
:root {
  --ousi-success: oklch(0.65 0.2 145);
  --ousi-danger: oklch(0.6 0.22 25);
  --ousi-warning: oklch(0.75 0.18 70);
}

/* Dark mode overrides */
.dark {
  --ousi-background: oklch(0.13 0 0);
  --ousi-foreground: oklch(0.93 0 0);
  --ousi-surface: oklch(0.18 0 0);
  --ousi-border: oklch(0.28 0 0);
  --ousi-muted: oklch(0.6 0 0);
  --ousi-default: oklch(0.22 0 0);
}`" show-copy />
        </div>
      </section>

    </div>
  </div>
</template>
