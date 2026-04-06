<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Styling — Ousi UI',
  description: 'How to style, customize, and theme Ousi UI components.',
})

const tocItems = [
  { id: 'styling-approach', label: 'Styling Approach' },
  { id: 'class-prop', label: 'The class Prop' },
  { id: 'variant-system', label: 'Variant System' },
  { id: 'overriding-styles', label: 'Overriding Styles' },
  { id: 'custom-components', label: 'Custom Components' },
  { id: 'responsive-design', label: 'Responsive Design' },
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
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Styling</h1>
      <p class="mt-1.5 text-base text-ousi-muted">How to style, customize, and theme Ousi UI components with Tailwind CSS and the variant system.</p>
    </div>

    <div class="space-y-12">

      <!-- Styling Approach -->
      <section id="styling-approach">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Styling Approach</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI is built on <strong>Tailwind CSS v4</strong> and
          <a href="https://cva.style/docs" target="_blank" class="text-ousi-accent underline">CVA (class-variance-authority)</a>.
          Every component has a dedicated theme file that defines its variant classes using CVA.
          This means styling is fully utility-driven, tree-shakeable, and easy to override.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed mb-4">
          Instead of scoped CSS or deeply nested selectors, each component resolves its final class list
          by merging the theme defaults with any user-provided overrides. The result is predictable,
          composable styling with zero specificity wars.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Layer</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Technology</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Utilities</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Tailwind CSS v4</td>
                <td class="px-4 py-3 text-ousi-foreground">Atomic utility classes for layout, spacing, colors</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Variants</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">CVA</td>
                <td class="px-4 py-3 text-ousi-foreground">Type-safe variant definitions with default values</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Tokens</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">CSS custom properties</td>
                <td class="px-4 py-3 text-ousi-foreground">Design tokens like <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">--ousi-foreground</code></td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Merging</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">cn() / tailwind-merge</td>
                <td class="px-4 py-3 text-ousi-foreground">Conflict-free class merging at runtime</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- The class Prop -->
      <section id="class-prop">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">class</code> Prop</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Every Ousi UI component accepts a <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">class</code> prop.
          Classes you pass are merged with the component's internal classes using <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">cn()</code>,
          so conflicting utilities are resolved automatically — your overrides always win.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Add width and shadow to a button -->\n<OButton class=&quot;w-full shadow-lg&quot;>Full Width</OButton>\n\n<!-- Custom gradient background on a card -->\n<OCard class=&quot;bg-gradient-to-r from-purple-500 to-pink-500 text-white&quot;>\n  Custom Background\n</OCard>\n\n<!-- Override padding and border radius -->\n<OInput class=&quot;px-6 py-4 rounded-full&quot; placeholder=&quot;Search...&quot; />\n\n<!-- Multiple overrides compose cleanly -->\n<OBadge class=&quot;text-lg px-4 py-2 font-bold uppercase tracking-wider&quot;>\n  Featured\n</OBadge>`" show-copy />
        </div>

        <p class="text-sm text-ousi-muted mt-4">
          Because <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">cn()</code> is powered by
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">tailwind-merge</code>, conflicting
          classes are resolved intelligently. For example, passing <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">px-6</code>
          will override the component's default horizontal padding without affecting vertical padding.
        </p>
      </section>

      <OSeparator />

      <!-- Variant System -->
      <section id="variant-system">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Variant System</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Components expose styling variations through props like
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">variant</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">size</code>, and
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">color</code>.
          These are defined in each component's theme file using CVA, ensuring full type-safety and autocompletion.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Button variants -->\n<OButton variant=&quot;solid&quot;>Solid</OButton>\n<OButton variant=&quot;flat&quot;>Flat</OButton>\n<OButton variant=&quot;outline&quot;>Outline</OButton>\n<OButton variant=&quot;ghost&quot;>Ghost</OButton>\n<OButton variant=&quot;soft&quot;>Soft</OButton>\n\n<!-- Combine variant + size + color -->\n<OButton variant=&quot;solid&quot; size=&quot;lg&quot; color=&quot;accent&quot;>\n  Large Accent Button\n</OButton>\n\n<OButton variant=&quot;outline&quot; size=&quot;sm&quot; color=&quot;danger&quot;>\n  Small Danger Outline\n</OButton>`" show-copy />
        </div>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Variant</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Appearance</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Best used for</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">solid</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Filled background, contrasting text</td>
                <td class="px-4 py-3 text-ousi-foreground">Primary actions, CTAs</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">flat</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Flat background, no border</td>
                <td class="px-4 py-3 text-ousi-foreground">Subtle actions in toolbars</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">outline</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Transparent with border</td>
                <td class="px-4 py-3 text-ousi-foreground">Secondary actions, form controls</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ghost</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Transparent, no border, hover fill</td>
                <td class="px-4 py-3 text-ousi-foreground">Tertiary actions, icon buttons</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">soft</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">Tinted background, matching text</td>
                <td class="px-4 py-3 text-ousi-foreground">Tags, badges, low-emphasis buttons</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="text-base font-semibold text-ousi-foreground mt-6 mb-3">Size Scale</h3>
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Size</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Height</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Font size</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Use case</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">xs</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">24px</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">11px</td>
                <td class="px-4 py-3 text-ousi-foreground">Inline actions, compact UIs</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">sm</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">32px</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">13px</td>
                <td class="px-4 py-3 text-ousi-foreground">Dense layouts, secondary actions</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">md</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">40px</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">14px</td>
                <td class="px-4 py-3 text-ousi-foreground">Default — most common size</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">lg</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">48px</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">16px</td>
                <td class="px-4 py-3 text-ousi-foreground">Hero sections, prominent CTAs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Overriding Styles -->
      <section id="overriding-styles">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Overriding Styles</h2>
        <p class="text-sm text-ousi-muted mb-4">
          When you need to override default component styles, Tailwind classes passed via the
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">class</code> prop take precedence.
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">cn()</code> utility handles
          merging so you never fight specificity.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- cn() resolves conflicts — your 'rounded-full' replaces the default radius -->\n<OButton class=&quot;rounded-full&quot;>Pill Button</OButton>\n\n<!-- Override colors entirely -->\n<OButton class=&quot;bg-emerald-600 hover:bg-emerald-700 text-white&quot;>\n  Custom Color\n</OButton>\n\n<!-- Using cn() in your own components -->\n<script setup>\nimport { cn } from '@ousi-ui/core'\n\nconst props = defineProps<{ class?: string }>()\n</script>\n\n<template>\n  <div :class=&quot;cn('rounded-ousi-xl bg-ousi-surface p-4', props.class)&quot;>\n    <slot />\n  </div>\n</template>`" show-copy />
        </div>

        <h3 class="text-base font-semibold text-ousi-foreground mt-6 mb-3">Design Tokens</h3>
        <p class="text-sm text-ousi-muted mb-4">
          Ousi UI uses CSS custom properties (design tokens) for colors, radii, and spacing. Override these at the
          root level to theme your entire application.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`/* Override tokens in your global CSS */\n:root {\n  --ousi-foreground: oklch(0.15 0.01 260);\n  --ousi-background: oklch(0.99 0 0);\n  --ousi-accent: oklch(0.6 0.25 270);\n  --ousi-border: oklch(0.9 0.01 260);\n  --ousi-radius-xl: 16px;\n  --ousi-radius-lg: 12px;\n  --ousi-radius-md: 8px;\n}\n\n/* Dark mode overrides */\n.dark {\n  --ousi-foreground: oklch(0.95 0.01 260);\n  --ousi-background: oklch(0.12 0.02 260);\n  --ousi-accent: oklch(0.7 0.2 270);\n  --ousi-border: oklch(0.25 0.02 260);\n}`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Custom Components -->
      <section id="custom-components">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Custom Components</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Build custom components by composing Ousi UI primitives. The design tokens and utility classes
          ensure visual consistency across your application.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<script setup>\nconst props = defineProps<{\n  title: string\n  description: string\n  icon?: string\n  action?: string\n}>()\n</script>\n\n<template>\n  <OCard class=&quot;group hover:border-ousi-accent/50 transition-colors&quot;>\n    <template #header>\n      <div class=&quot;flex items-center gap-3&quot;>\n        <div class=&quot;size-10 rounded-ousi-lg bg-ousi-accent/10 flex items-center justify-center&quot;>\n          <span class=&quot;text-ousi-accent text-lg&quot;>{{ icon }}</span>\n        </div>\n        <div>\n          <h3 class=&quot;font-semibold text-ousi-foreground&quot;>{{ title }}</h3>\n          <p class=&quot;text-xs text-ousi-muted&quot;>{{ description }}</p>\n        </div>\n      </div>\n    </template>\n\n    <slot />\n\n    <template v-if=&quot;action&quot; #footer>\n      <OButton variant=&quot;ghost&quot; size=&quot;sm&quot; class=&quot;ml-auto&quot;>\n        {{ action }}\n      </OButton>\n    </template>\n  </OCard>\n</template>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Responsive Design -->
      <section id="responsive-design">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Responsive Design</h2>
        <p class="text-sm text-ousi-muted mb-4">
          All Ousi UI components work seamlessly with Tailwind's responsive breakpoint prefixes.
          Use <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">sm:</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">md:</code>, and
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">lg:</code> to adapt
          component styling across screen sizes.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Responsive button sizing -->\n<OButton size=&quot;sm&quot; class=&quot;md:size-md lg:size-lg&quot;>\n  Responsive Button\n</OButton>\n\n<!-- Stack on mobile, row on desktop -->\n<div class=&quot;flex flex-col sm:flex-row gap-2&quot;>\n  <OButton variant=&quot;solid&quot; class=&quot;w-full sm:w-auto&quot;>Confirm</OButton>\n  <OButton variant=&quot;outline&quot; class=&quot;w-full sm:w-auto&quot;>Cancel</OButton>\n</div>\n\n<!-- Responsive card grid -->\n<div class=&quot;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4&quot;>\n  <OCard class=&quot;p-4 md:p-6&quot;>Card 1</OCard>\n  <OCard class=&quot;p-4 md:p-6&quot;>Card 2</OCard>\n  <OCard class=&quot;p-4 md:p-6&quot;>Card 3</OCard>\n</div>\n\n<!-- Hide/show elements at breakpoints -->\n<OButton variant=&quot;ghost&quot; class=&quot;md:hidden&quot;>Mobile Menu</OButton>\n<OButton variant=&quot;ghost&quot; class=&quot;hidden md:inline-flex&quot;>Desktop Nav</OButton>`" show-copy />
        </div>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Prefix</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Min width</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Common devices</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">sm:</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">640px</td>
                <td class="px-4 py-3 text-ousi-foreground">Large phones (landscape)</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">md:</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">768px</td>
                <td class="px-4 py-3 text-ousi-foreground">Tablets</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">lg:</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">1024px</td>
                <td class="px-4 py-3 text-ousi-foreground">Laptops, small desktops</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">xl:</td>
                <td class="px-4 py-3 text-xs text-ousi-muted">1280px</td>
                <td class="px-4 py-3 text-ousi-foreground">Large desktops</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
