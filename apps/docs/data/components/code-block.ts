import type { ComponentData } from './types'

export const codeBlockData: ComponentData = {
  title: 'CodeBlock',
  description: 'Display source code with syntax highlighting, line numbers, copy button, and collapsible mode.',
  category: 'Data Display',
  importCode: "import { OCodeBlock } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CodeBlockBasic',
        code: `<OCodeBlock code="<OButton>Click me</OButton>" />`,
      },
    },
    {
      id: 'with-filename',
      title: 'With Filename',
      example: {
        component: 'CodeBlockFilename',
        code: `<OCodeBlock
  filename="App.vue"
  :code="code"
/>`,
      },
    },
    {
      id: 'collapsible',
      title: 'Collapsible',
      example: {
        component: 'CodeBlockCollapsible',
        code: `<OCodeBlock
  :code="longCode"
  collapsible
  :collapsed-height="88"
/>`,
      },
    },
    {
      id: 'custom-labels',
      title: 'Custom Labels',
      example: {
        component: 'CodeBlockCustomLabels',
        code: `<OCodeBlock
  :code="code"
  collapsible
  expand-label="Show more"
  collapse-label="Show less"
/>`,
      },
    },
    {
      id: 'no-line-numbers',
      title: 'Without Line Numbers',
      example: {
        component: 'CodeBlockNoLines',
        code: `<OCodeBlock
  :code="code"
  :show-line-numbers="false"
/>`,
      },
    },
    {
      id: 'no-copy',
      title: 'Without Copy Button',
      example: {
        component: 'CodeBlockNoCopy',
        code: `<OCodeBlock
  :code="code"
  :show-copy="false"
/>`,
      },
    },
    {
      id: 'multiline',
      title: 'Multi-language Examples',
      example: {
        component: 'CodeBlockMultiline',
        code: `<OCodeBlock
  filename="install.sh"
  code="pnpm add @ousi-ui/vue @ousi-ui/theme"
/>`,
      },
    },
  ],

  props: [
    { name: 'code', type: 'string', default: '-', description: 'Source code string to display (required).' },
    { name: 'lang', type: 'string', default: '-', description: 'Language hint for future syntax highlighting integration.' },
    { name: 'showLineNumbers', type: 'boolean', default: 'true', description: 'Show line numbers on the left.' },
    { name: 'showCopy', type: 'boolean', default: 'true', description: 'Show a copy-to-clipboard button.' },
    { name: 'collapsible', type: 'boolean', default: 'false', description: 'Enable expand/collapse mode.' },
    { name: 'collapsedHeight', type: 'number', default: '88', description: 'Max height in px when collapsed (~3 lines).' },
    { name: 'defaultExpanded', type: 'boolean', default: 'false', description: 'Start in expanded state when collapsible.' },
    { name: 'expandLabel', type: 'string', default: "'Expand code'", description: 'Label for the expand button.' },
    { name: 'collapseLabel', type: 'string', default: "'Collapse code'", description: 'Label for the collapse button.' },
    { name: 'filename', type: 'string', default: '-', description: 'Filename shown in the header bar.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'header', type: 'slot', description: 'Custom header content (replaces the filename display).' },
    { name: 'copy-icon', type: 'slot { copied: boolean }', description: 'Custom copy button icon. Receives copied state.' },
    { name: 'toggle-icon', type: 'slot { expanded: boolean }', description: 'Custom expand/collapse icon. Receives expanded state.' },
  ],

  themeCode: `import { codeBlockTheme, codeBlockHeaderTheme } from '@ousi-ui/vue'

// Tokens used:
// bg-ousi-surface-secondary — code background
// border-ousi-border — container border
// text-ousi-foreground — code text
// text-ousi-muted — line numbers, fade
// text-emerald-600 — string literals
// text-violet-500 — keywords, directives
// text-rose-500 — HTML/component tags`,

  keyboard: [
    { key: 'tab', description: 'Moves focus to the copy button.' },
    { key: 'enter', description: 'Activates the copy or expand/collapse button when focused.' },
  ],

  aria: [
    { attribute: 'role="none"', condition: 'Always', description: 'The code block is presentational, not interactive.' },
  ],

  bestPractices: [
    { text: 'Use the `filename` prop to indicate the file type or source.', good: true },
    { text: 'Enable `collapsible` for code blocks longer than 5-6 lines.', good: true },
    { text: 'Custom `expandLabel`/`collapseLabel` for localization.', good: true },
    { text: "Don't disable both `showLineNumbers` and `showCopy` — leave at least one visual aid.", good: false },
  ],
}
