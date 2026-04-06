import type { ComponentData } from './types'

export const disclosureGroupData: ComponentData = {
  title: 'Disclosure Group',
  description: 'Group multiple disclosures with single (accordion) or multiple expand behavior.',
  category: 'Navigation',
  importCode: "import { ODisclosure, ODisclosureGroup } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'DisclosureGroupUsage',
        code: `<!-- Accordion-style FAQ with borders -->
<ODisclosureGroup class="rounded-ousi-2xl border border-ousi-border divide-y divide-ousi-border overflow-hidden">
  <ODisclosure v-for="item in faqItems" :key="item.question" class="px-4">
    <template #title>{{ item.question }}</template>
    <p class="text-sm text-ousi-muted">{{ item.answer }}</p>
  </ODisclosure>
</ODisclosureGroup>`,
      },
    },
    {
      id: 'single-mode',
      title: 'Single Mode (Accordion)',
      example: {
        component: 'DisclosureGroupSingleMode',
        code: `<!-- Default: only one section open at a time -->
<ODisclosureGroup class="rounded-ousi-2xl border border-ousi-border divide-y divide-ousi-border overflow-hidden">
  <ODisclosure class="px-4">
    <template #title>Section A</template>
    <p>Opening another section closes this one.</p>
  </ODisclosure>
  <ODisclosure class="px-4">
    <template #title>Section B</template>
    <p>Accordion behavior by default.</p>
  </ODisclosure>
</ODisclosureGroup>`,
      },
    },
    {
      id: 'multiple-mode',
      title: 'Multiple Mode',
      example: {
        component: 'DisclosureGroupMultipleMode',
        code: `<!-- Multiple panels can be open simultaneously -->
<ODisclosureGroup :allow-multiple="true" class="flex flex-col gap-2">
  <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
    <template #title>Section 1</template>
    <p>Can be open with other sections.</p>
  </ODisclosure>
  <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
    <template #title>Section 2</template>
    <p>Independent open/close.</p>
  </ODisclosure>
</ODisclosureGroup>`,
      },
    },
    {
      id: 'controlled',
      title: 'Controlled with Filters',
      example: {
        component: 'DisclosureGroupControlled',
        code: `<ODisclosureGroup v-model="expandedKeys" :allow-multiple="true">
  <ODisclosure class="border-b border-ousi-border">
    <template #title>Filters</template>
    <OCheckbox label="In stock" />
    <OCheckbox label="On sale" />
  </ODisclosure>
  <ODisclosure class="border-b border-ousi-border">
    <template #title>Price range</template>
    <p>Price slider goes here.</p>
  </ODisclosure>
  <ODisclosure>
    <template #title>Categories</template>
    <OCheckbox label="Electronics" />
    <OCheckbox label="Books" />
  </ODisclosure>
</ODisclosureGroup>`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string[]', description: 'Controlled list of expanded item keys (v-model).' },
    { name: 'defaultExpandedKeys', type: 'string[]', description: 'Keys of items expanded by default.' },
    { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allow multiple items open at once.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'default', type: '-', description: 'ODisclosure children.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string[]]', description: 'Emitted when expanded keys change.' },
    { name: 'change', type: '[value: string[]]', description: 'Emitted when expanded keys change.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Toggles the focused disclosure.' },
    { key: 'space', description: 'Toggles the focused disclosure.' },
    { key: 'tab', description: 'Moves focus between triggers.' },
  ],

  aria: [
    { attribute: 'aria-expanded', condition: 'each disclosure', description: 'Reflects open state.' },
  ],

  bestPractices: [
    { text: 'Use `rounded-ousi-2xl border border-ousi-border divide-y` for a bordered accordion look.', good: true },
    { text: 'Use `flex flex-col gap-2` with individual bordered cards for a separated look.', good: true },
    { text: 'Use single mode (default) when only one section is relevant at a time.', good: true },
    { text: 'Use `allow-multiple` for filter panels where users compare across sections.', good: true },
    { text: "Don't put unrelated content in the same accordion group.", good: false },
  ],
}
