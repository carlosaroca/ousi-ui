<script setup lang="ts">
import { OButton, OChip, OSeparator } from '@ousi-ui/vue'
import TimelineToc from '~/components/TimelineToc.vue'
import { componentRegistry } from '~/data/components'

useSeoMeta({
  title: 'Agents | Ousi UI',
  description: 'Give Claude, Cursor or any AI assistant the real props, variants and tokens of Ousi UI: a Claude skill, llms.txt and one Markdown file per component.',
})

const tocItems = [
  { id: 'why', label: 'Why' },
  { id: 'skill', label: 'Claude skill' },
  { id: 'llms', label: 'llms.txt' },
  { id: 'instructions', label: 'Project instructions' },
  { id: 'copy', label: 'Copy for AI' },
  { id: 'prompts', label: 'Example prompts' },
]

const count = Object.keys(componentRegistry).length
const SITE = 'https://ousiui.com'

// Code is built from plain strings so that backticks and braces never meet the template parser.
const installProject = `mkdir -p .claude/skills\ncurl -sL ${SITE}/skills/ousi-ui.tar.gz | tar -xz -C .claude/skills`
const installUser = `mkdir -p ~/.claude/skills\ncurl -sL ${SITE}/skills/ousi-ui.tar.gz | tar -xz -C ~/.claude/skills`

const layout = [
  'ousi-ui/',
  '  SKILL.md                workflow and rules that always apply',
  '  references/',
  '    conventions.md        setup, rules, tokens, known quirks',
  '    components.md         every component, by category',
  '    components/<slug>.md  props, slots, events, keyboard, examples',
].join('\n')

const instructions = [
  '## UI',
  '',
  'This project uses Ousi UI (`@ousi-ui/vue`).',
  '',
  '- Import components by name from `@ousi-ui/vue`. They start with `O`',
  '  (OButton, OInput, ODialog).',
  '- Before using a component, read its reference:',
  `  ${SITE}/ai/components/<slug>.md`,
  '  The slug is the kebab-case name without the O (OBarChart is bar-chart).',
  '  Do not invent props, variants or sizes.',
  '- Style with the `class` prop and the token utilities (`bg-ousi-surface`,',
  '  `text-ousi-foreground`, `border-ousi-border`, `bg-ousi-accent`).',
  '  No hard-coded hex colors.',
  `- Documentation for assistants: ${SITE}/llms.txt`,
].join('\n')

const prompts = [
  'Build a sign-in form with Ousi UI: email, password, remember me, and a submit button that shows a loading state.',
  'Add a settings page with tabs for Profile, Notifications and Billing, using the Ousi UI components.',
  'Replace the hand-made chart in Dashboard.vue with the matching Ousi UI chart and keep the data as it is.',
]
</script>

<template>
  <div>
    <Teleport to="#docs-toc">
      <TimelineToc :items="tocItems" />
    </Teleport>

    <div class="mb-6">
      <div class="mb-1 flex items-center gap-2">
        <OChip color="accent" variant="soft" size="sm">AI</OChip>
      </div>
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Agents</h1>
      <p class="mt-1.5 text-base text-ousi-muted">Give Claude, Cursor or any assistant the real props, variants and tokens of Ousi UI, so it stops guessing.</p>
    </div>

    <div class="space-y-12">

      <section id="why">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Why</h2>
        <p class="text-sm text-ousi-muted leading-relaxed">
          A model that has not seen a library well invents props that look right: a variant that does not exist, a size that is not offered, a value of the wrong type.
          Ousi UI publishes its full reference in formats made for assistants. All of it is generated from the same data as these docs on every build, so it is never behind the components.
        </p>
        <ul class="mt-3 space-y-1.5 text-sm text-ousi-muted list-disc pl-5">
          <li><strong class="text-ousi-foreground">A Claude skill</strong> that Claude Code loads when the task involves Ousi UI.</li>
          <li><strong class="text-ousi-foreground">llms.txt</strong> and one Markdown file per component, for any tool that can read a URL.</li>
          <li><strong class="text-ousi-foreground">A ready block</strong> for CLAUDE.md, AGENTS.md or Cursor rules.</li>
        </ul>
      </section>

      <OSeparator />

      <section id="skill">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Claude skill</h2>
        <p class="text-sm text-ousi-muted mb-3">
          The skill gives Claude the workflow, the rules and a reference for each of the {{ count }} components.
          Install it in your project so the whole team gets it:
        </p>
        <DocsSnippet :code="installProject" filename="Terminal, from your project root" />
        <p class="text-sm text-ousi-muted mt-4 mb-3">Or install it for every project on your machine:</p>
        <DocsSnippet :code="installUser" filename="Terminal" />
        <p class="text-xs text-ousi-muted mt-2">Run the same command again to update it. You can also download the <a href="/skills/ousi-ui.tar.gz" class="text-ousi-accent hover:underline">tar.gz</a> and unpack it into <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">.claude/skills</code> yourself.</p>

        <h3 class="text-sm font-semibold text-ousi-foreground mt-6 mb-2">What is inside</h3>
        <DocsSnippet :code="layout" filename="What the skill contains" />

        <h3 class="text-sm font-semibold text-ousi-foreground mt-6 mb-2">How Claude uses it</h3>
        <p class="text-sm text-ousi-muted leading-relaxed">
          Claude loads the skill when your request involves Ousi UI or the project imports from <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">@ousi-ui/vue</code>.
          It reads the reference of every component before using it, then checks the props it wrote against that reference.
          The reference also lists the quirks that most often make generated code look wrong, such as a button that hides its label while it loads.
        </p>
      </section>

      <OSeparator />

      <section id="llms">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">llms.txt</h2>
        <p class="text-sm text-ousi-muted mb-3">
          For assistants that are not Claude Code, the same reference is available as plain text. Most tools that read a URL or index documentation accept these.
        </p>
        <div class="rounded-ousi-xl border border-ousi-border overflow-hidden divide-y divide-ousi-border/60">
          <a href="/llms.txt" target="_blank" rel="noopener" class="flex items-start gap-3 px-5 py-3.5 hover:bg-ousi-default/60 transition-colors">
            <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono text-ousi-accent shrink-0 mt-0.5">/llms.txt</code>
            <span class="text-sm text-ousi-muted">The index: one line and one link for every component. Start here.</span>
          </a>
          <a href="/ai/components/button.md" target="_blank" rel="noopener" class="flex items-start gap-3 px-5 py-3.5 hover:bg-ousi-default/60 transition-colors">
            <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono text-ousi-accent shrink-0 mt-0.5">/ai/components/&lt;slug&gt;.md</code>
            <span class="text-sm text-ousi-muted">One component: import, examples, props, slots, events, keyboard and ARIA. Good for pasting into a chat.</span>
          </a>
          <a href="/ai/conventions.md" target="_blank" rel="noopener" class="flex items-start gap-3 px-5 py-3.5 hover:bg-ousi-default/60 transition-colors">
            <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono text-ousi-accent shrink-0 mt-0.5">/ai/conventions.md</code>
            <span class="text-sm text-ousi-muted">Setup, the rules for writing code with Ousi UI, design tokens and known quirks.</span>
          </a>
          <a href="/llms-full.txt" target="_blank" rel="noopener" class="flex items-start gap-3 px-5 py-3.5 hover:bg-ousi-default/60 transition-colors">
            <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono text-ousi-accent shrink-0 mt-0.5">/llms-full.txt</code>
            <span class="text-sm text-ousi-muted">Everything in one file, around 500 KB. Too large for most chats; meant for tools that index documentation.</span>
          </a>
        </div>
      </section>

      <OSeparator />

      <section id="instructions">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Project instructions</h2>
        <p class="text-sm text-ousi-muted mb-3">
          Paste this into <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">CLAUDE.md</code>, <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">AGENTS.md</code> or your Cursor rules.
          It works on its own, with or without the skill:
        </p>
        <DocsSnippet :code="instructions" filename="CLAUDE.md" />
      </section>

      <OSeparator />

      <section id="copy">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Copy for AI</h2>
        <p class="text-sm text-ousi-muted leading-relaxed">
          Every component page has a <strong class="text-ousi-foreground">Copy for AI</strong> button next to its title. It copies that component's reference as Markdown, ready to paste into any chat.
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <NuxtLink to="/vue/components/button"><OButton variant="outline" size="sm">Try it on Button</OButton></NuxtLink>
        </div>
      </section>

      <OSeparator />

      <section id="prompts">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Example prompts</h2>
        <ul class="space-y-2">
          <li v-for="prompt in prompts" :key="prompt" class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary/50 px-4 py-3 text-sm text-ousi-foreground">
            {{ prompt }}
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>
