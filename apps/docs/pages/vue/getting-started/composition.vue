<script setup lang="ts">
import TimelineToc from '~/components/TimelineToc.vue'

useSeoMeta({
  title: 'Composition — Ousi UI',
  description: 'Composition patterns, slots, composables, and compound components in Ousi UI.',
})

const tocItems = [
  { id: 'component-composition', label: 'Component Composition' },
  { id: 'slot-based-api', label: 'Slot-Based API' },
  { id: 'scoped-slots', label: 'Scoped Slots' },
  { id: 'composables', label: 'Composables' },
  { id: 'controlled-vs-uncontrolled', label: 'Controlled vs Uncontrolled' },
  { id: 'compound-components', label: 'Compound Components' },
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
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Composition</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Patterns for composing, extending, and controlling Ousi UI components in your application.</p>
    </div>

    <div class="space-y-12">

      <!-- Component Composition -->
      <section id="component-composition">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Component Composition</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI components are designed to compose together. Rather than monolithic components with dozens of props,
          the library favors small, focused components that combine through Vue's slot system. This gives you full
          control over layout and content while the components handle behavior, accessibility, and styling.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed">
          The composition model follows three layers: <strong>slots</strong> for content injection,
          <strong>composables</strong> for shared logic, and <strong>compound components</strong> for
          coordinated groups.
        </p>
      </section>

      <OSeparator />

      <!-- Slot-Based API -->
      <section id="slot-based-api">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Slot-Based API</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Most components expose named slots that let you replace or augment specific parts of the component.
          The default slot handles the main content, while named slots target specific regions.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Card with named slots -->\n<OCard>\n  <template #header>\n    <div class=&quot;flex items-center justify-between&quot;>\n      <h3 class=&quot;font-semibold&quot;>Settings</h3>\n      <OChip variant=&quot;soft&quot; size=&quot;sm&quot; color=&quot;accent&quot;>Pro</OChip>\n    </div>\n  </template>\n\n  <!-- Default slot: main content -->\n  <p class=&quot;text-sm text-ousi-muted&quot;>Configure your account preferences below.</p>\n\n  <template #footer>\n    <div class=&quot;flex justify-end gap-2&quot;>\n      <OButton variant=&quot;ghost&quot;>Cancel</OButton>\n      <OButton variant=&quot;solid&quot;>Save</OButton>\n    </div>\n  </template>\n</OCard>`" show-copy />
        </div>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Component</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Available Slots</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OCard</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">default, header, footer</td>
                <td class="px-4 py-3 text-ousi-foreground">Header/footer render with dividers</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OButton</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">default, leading, trailing</td>
                <td class="px-4 py-3 text-ousi-foreground">Leading/trailing for icons</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODialog</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">default, header, footer, trigger</td>
                <td class="px-4 py-3 text-ousi-foreground">Trigger slot opens the dialog</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OInput</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">leading, trailing</td>
                <td class="px-4 py-3 text-ousi-foreground">Prefix/suffix icons or text</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODropdown</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">default, trigger</td>
                <td class="px-4 py-3 text-ousi-foreground">Default slot for menu items</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OCollapsible</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">default, trigger</td>
                <td class="px-4 py-3 text-ousi-foreground">Trigger is a scoped slot</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Scoped Slots -->
      <section id="scoped-slots">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Scoped Slots</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Some components expose internal state through scoped slots, giving you full control over rendering
          while the component manages behavior and accessibility.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Collapsible with custom trigger -->\n<OCollapsible>\n  <template #trigger=&quot;{ isOpen, toggle }&quot;>\n    <button\n      @click=&quot;toggle&quot;\n      class=&quot;flex items-center gap-2 text-sm font-medium&quot;\n    >\n      <span\n        class=&quot;transition-transform duration-200&quot;\n        :class=&quot;isOpen ? 'rotate-90' : ''&quot;\n      >\n        &#x25B6;\n      </span>\n      {{ isOpen ? 'Hide details' : 'Show details' }}\n    </button>\n  </template>\n\n  <div class=&quot;mt-2 pl-6 text-sm text-ousi-muted&quot;>\n    Expandable content goes here.\n  </div>\n</OCollapsible>`" show-copy />
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Dialog with scoped trigger -->\n<ODialog>\n  <template #trigger=&quot;{ open }&quot;>\n    <OButton @click=&quot;open&quot; variant=&quot;outline&quot;>Open Settings</OButton>\n  </template>\n\n  <template #header>\n    <h2 class=&quot;text-lg font-semibold&quot;>Settings</h2>\n  </template>\n\n  <div class=&quot;space-y-4&quot;>\n    <OInput label=&quot;Display name&quot; />\n    <OInput label=&quot;Email&quot; type=&quot;email&quot; />\n  </div>\n\n  <template #footer=&quot;{ close }&quot;>\n    <div class=&quot;flex justify-end gap-2&quot;>\n      <OButton variant=&quot;ghost&quot; @click=&quot;close&quot;>Cancel</OButton>\n      <OButton variant=&quot;solid&quot;>Save</OButton>\n    </div>\n  </template>\n</ODialog>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Composables -->
      <section id="composables">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Composables</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Ousi UI exports composables from <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">@ousi-ui/core</code>
          that power the components internally. You can use these same composables in your own components to get
          consistent behavior.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Composable</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Description</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">useControllableState</td>
                <td class="px-4 py-3 text-ousi-foreground">Manages v-model support for controlled/uncontrolled patterns</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">Ref&lt;T&gt;</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">useDisclosure</td>
                <td class="px-4 py-3 text-ousi-foreground">Open/close state management with toggle</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{ isOpen, open, close, toggle }</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">useClickOutside</td>
                <td class="px-4 py-3 text-ousi-foreground">Detects clicks outside a target element</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">void (callback-based)</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">useEscapeKey</td>
                <td class="px-4 py-3 text-ousi-foreground">Handles Escape key press with stack awareness</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">void (callback-based)</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">useFloating</td>
                <td class="px-4 py-3 text-ousi-foreground">Floating element positioning (tooltips, popovers, dropdowns)</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">{ x, y, placement, strategy }</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<script setup>\nimport {\n  useDisclosure,\n  useClickOutside,\n  useEscapeKey\n} from '@ousi-ui/core'\n\nconst menuRef = ref<HTMLElement>()\nconst { isOpen, open, close, toggle } = useDisclosure()\n\n// Close when clicking outside\nuseClickOutside(menuRef, () => {\n  if (isOpen.value) close()\n})\n\n// Close on Escape key\nuseEscapeKey(() => {\n  if (isOpen.value) close()\n})\n</script>\n\n<template>\n  <div ref=&quot;menuRef&quot;>\n    <OButton @click=&quot;toggle&quot;>Menu</OButton>\n    <div v-if=&quot;isOpen&quot; class=&quot;absolute mt-2 rounded-ousi-lg border border-ousi-border bg-ousi-surface p-2 shadow-lg&quot;>\n      <a href=&quot;#&quot; class=&quot;block px-3 py-2 text-sm rounded-ousi-md hover:bg-ousi-default&quot;>Profile</a>\n      <a href=&quot;#&quot; class=&quot;block px-3 py-2 text-sm rounded-ousi-md hover:bg-ousi-default&quot;>Settings</a>\n      <a href=&quot;#&quot; class=&quot;block px-3 py-2 text-sm rounded-ousi-md hover:bg-ousi-default&quot;>Log out</a>\n    </div>\n  </div>\n</template>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Controlled vs Uncontrolled -->
      <section id="controlled-vs-uncontrolled">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Controlled vs Uncontrolled</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Every stateful Ousi UI component supports both <strong>controlled</strong> (parent manages state via v-model)
          and <strong>uncontrolled</strong> (component manages its own state) modes. This is powered by the
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">useControllableState</code> composable.
        </p>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Uncontrolled: component manages own state -->\n<!-- Just pass a default value and let the component handle the rest -->\n<OTabs :default-value=&quot;'photos'&quot; :items=&quot;tabItems&quot; />\n<OAccordion :default-value=&quot;'item-1'&quot; :items=&quot;accordionItems&quot; />\n<OSwitch :default-checked=&quot;true&quot; />\n\n<!-- Controlled: parent manages state with v-model -->\n<!-- Use this when you need to react to changes or set state externally -->\n<OTabs v-model=&quot;activeTab&quot; :items=&quot;tabItems&quot; />\n<OAccordion v-model=&quot;openItem&quot; :items=&quot;accordionItems&quot; />\n<OSwitch v-model=&quot;isDarkMode&quot; />`" show-copy />
        </div>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Pattern</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Prop</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">When to use</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Uncontrolled</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">:default-value</td>
                <td class="px-4 py-3 text-ousi-foreground">Simple cases where you don't need to read or set state externally</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">Controlled</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">v-model</td>
                <td class="px-4 py-3 text-ousi-foreground">When you need to react to changes, sync with URL, or set state from outside</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Example: syncing tabs with URL query -->\n<script setup>\nconst route = useRoute()\nconst router = useRouter()\n\nconst activeTab = computed({\n  get: () => route.query.tab as string || 'overview',\n  set: (val) => router.push({ query: { tab: val } })\n})\n\nconst tabItems = [\n  { value: 'overview', label: 'Overview' },\n  { value: 'settings', label: 'Settings' },\n  { value: 'billing', label: 'Billing' },\n]\n</script>\n\n<template>\n  <OTabs v-model=&quot;activeTab&quot; :items=&quot;tabItems&quot; />\n</template>`" show-copy />
        </div>
      </section>

      <OSeparator />

      <!-- Compound Components -->
      <section id="compound-components">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Compound Components</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Some components work as coordinated groups, where a parent component manages shared state and
          child components participate in that state. This pattern is common for selection, disclosure, and layout components.
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border mb-4">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Parent</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Child</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Relationship</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODisclosureGroup</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">ODisclosure</td>
                <td class="px-4 py-3 text-ousi-foreground">Coordinates which disclosures are open (accordion behavior)</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ORadioGroup</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">ORadio</td>
                <td class="px-4 py-3 text-ousi-foreground">Manages single-selection across radio items</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OBentoGrid</td>
                <td class="px-4 py-3 font-mono text-xs text-ousi-muted">OBentoGridItem</td>
                <td class="px-4 py-3 text-ousi-foreground">Manages grid layout with span configuration</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Disclosure group: only one open at a time -->\n<ODisclosureGroup v-model=&quot;openItem&quot;>\n  <ODisclosure value=&quot;faq-1&quot;>\n    <template #trigger=&quot;{ isOpen }&quot;>\n      <span>What is Ousi UI?</span>\n    </template>\n    A Vue 3 component library with built-in animations and haptics.\n  </ODisclosure>\n\n  <ODisclosure value=&quot;faq-2&quot;>\n    <template #trigger=&quot;{ isOpen }&quot;>\n      <span>Is it free?</span>\n    </template>\n    Yes, Ousi UI is open source and free to use.\n  </ODisclosure>\n\n  <ODisclosure value=&quot;faq-3&quot;>\n    <template #trigger=&quot;{ isOpen }&quot;>\n      <span>Does it support dark mode?</span>\n    </template>\n    Yes, all components support light and dark themes via design tokens.\n  </ODisclosure>\n</ODisclosureGroup>`" show-copy />
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden mb-4">
          <CodeBlock :code="`<!-- Radio group: single selection -->\n<ORadioGroup v-model=&quot;plan&quot; label=&quot;Select a plan&quot;>\n  <ORadio value=&quot;free&quot; label=&quot;Free&quot; description=&quot;Up to 3 projects&quot; />\n  <ORadio value=&quot;pro&quot; label=&quot;Pro&quot; description=&quot;Unlimited projects&quot; />\n  <ORadio value=&quot;team&quot; label=&quot;Team&quot; description=&quot;Unlimited + collaboration&quot; />\n</ORadioGroup>`" show-copy />
        </div>

        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <CodeBlock :code="`<!-- Bento grid layout -->\n<OBentoGrid :cols=&quot;3&quot; :rows=&quot;3&quot; class=&quot;gap-4&quot;>\n  <OBentoGridItem :col-span=&quot;2&quot; :row-span=&quot;2&quot;>\n    <OCard class=&quot;h-full&quot;>\n      <h3 class=&quot;text-lg font-bold&quot;>Featured</h3>\n      <p class=&quot;text-sm text-ousi-muted&quot;>Main content area</p>\n    </OCard>\n  </OBentoGridItem>\n\n  <OBentoGridItem>\n    <OCard class=&quot;h-full&quot;>Small card 1</OCard>\n  </OBentoGridItem>\n\n  <OBentoGridItem>\n    <OCard class=&quot;h-full&quot;>Small card 2</OCard>\n  </OBentoGridItem>\n\n  <OBentoGridItem>\n    <OCard class=&quot;h-full&quot;>Small card 3</OCard>\n  </OBentoGridItem>\n</OBentoGrid>`" show-copy />
        </div>
      </section>
    </div>
  </div>
</template>
