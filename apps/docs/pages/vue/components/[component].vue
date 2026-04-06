<script setup lang="ts">
import { OTabs, OChip, OKbd, OSeparator, OButton, OCodeBlock } from '@ousi-ui/vue'
import type { TabItem } from '@ousi-ui/vue'
import { vHaptic } from '@ousi-ui/haptics'
import { componentRegistry } from '~/data/components'

const route = useRoute()
const slug = computed(() => route.params.component as string)
const data = computed(() => componentRegistry[slug.value])

// 404 if component not found
if (!data.value) {
  throw createError({ statusCode: 404, message: `Component "${slug.value}" not found` })
}

useSeoMeta({
  title: `${data.value.title} — Ousi UI`,
  description: data.value.description,
  ogTitle: `${data.value.title} — Ousi UI Component`,
  ogDescription: data.value.description,
  ogImage: '/og-image.png',
  twitterTitle: `${data.value.title} — Ousi UI`,
  twitterDescription: data.value.description,
  twitterImage: '/og-image.png',
})

// Page tabs
const pageTab = ref('component')
const pageTabs: TabItem[] = [
  { key: 'component', label: 'Component' },
  { key: 'api', label: 'API' },
  { key: 'accessibility', label: 'Accessibility' },
]

// TOC items from sections + haptics if present
const tocItems = computed(() => {
  const items = data.value.sections.map(s => ({ id: s.id, label: s.title }))
  if (data.value.haptics) {
    items.push({ id: 'haptics', label: 'Haptic Feedback' })
  }
  return items
})

// Resolve example component by name
const exampleComponents = import.meta.glob('~/components/examples/*.vue', { eager: true })

function resolveExample(name: string) {
  const key = Object.keys(exampleComponents).find(k => k.endsWith(`/${name}.vue`))
  if (!key) return null
  return (exampleComponents[key] as any).default
}
</script>

<template>
  <div v-if="data">
    <!-- TOC teleport -->
    <ClientOnly>
      <Teleport to="#docs-toc">
        <TimelineToc :items="tocItems" />
      </Teleport>
    </ClientOnly>

    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <OChip color="accent" variant="soft" size="sm">{{ data.category }}</OChip>
        </div>
        <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">{{ data.title }}</h1>
        <p class="mt-1.5 text-base text-ousi-muted">{{ data.description }}</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 shrink-0 mt-1">
        <a href="#" class="inline-flex items-center gap-1.5 h-8 rounded-ousi-lg border border-ousi-border px-3 text-xs font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Source
        </a>
        <a href="#" class="inline-flex items-center gap-1.5 h-8 rounded-ousi-lg border border-ousi-border px-3 text-xs font-medium text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default transition-colors">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Styles
        </a>
      </div>
    </div>

    <!-- Page tabs -->
    <div class="mb-8 w-fit">
      <ClientOnly>
        <OTabs v-model="pageTab" :items="pageTabs" />
      </ClientOnly>
    </div>

    <!-- ═══ TAB: Component ═══ -->
    <div v-show="pageTab === 'component'" class="space-y-14">

      <!-- Import -->
      <section id="import">
        <SectionHeading id="import" title="Import" />
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
          <div class="flex items-center px-4 py-2 border-b border-ousi-border/50">
            <span class="text-xs text-ousi-muted font-mono">vue</span>
          </div>
          <ClientOnly><OCodeBlock :code="data.importCode" show-copy /></ClientOnly>
        </div>
      </section>

      <!-- Dynamic sections -->
      <section v-for="section in data.sections" :key="section.id" :id="section.id">
        <SectionHeading :id="section.id" :title="section.title" />
        <ComponentPreview :code="section.example.code">
          <template #preview>
            <ClientOnly>
              <component :is="resolveExample(section.example.component)" />
            </ClientOnly>
          </template>
          <template #code>
            <ClientOnly><OCodeBlock :code="section.example.code" :show-copy="false" /></ClientOnly>
          </template>
        </ComponentPreview>
      </section>

      <!-- Haptics section (only for components with haptic support) -->
      <section v-if="data.haptics" id="haptics">
        <SectionHeading id="haptics" title="Haptic Feedback" />
        <div class="rounded-ousi-xl border border-ousi-border overflow-hidden">
          <div class="px-5 py-4 bg-ousi-surface-secondary/40 border-b border-ousi-border/50">
            <p class="text-sm text-ousi-foreground">
              This component supports haptic feedback on mobile devices (Android via Vibration API, iOS via Taptic Engine).
            </p>
          </div>
          <div class="divide-y divide-ousi-border/50">
            <div class="flex items-start gap-3 px-5 py-3">
              <span class="text-xs font-semibold text-ousi-muted w-24 shrink-0 pt-0.5">Default</span>
              <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono text-ousi-accent">{{ data.haptics.defaultPreset }}</code>
            </div>
            <div class="flex items-start gap-3 px-5 py-3">
              <span class="text-xs font-semibold text-ousi-muted w-24 shrink-0 pt-0.5">Triggers</span>
              <span class="text-sm text-ousi-foreground">{{ data.haptics.trigger }}</span>
            </div>
            <div v-if="data.haptics.notes" class="flex items-start gap-3 px-5 py-3">
              <span class="text-xs font-semibold text-ousi-muted w-24 shrink-0 pt-0.5">Notes</span>
              <span class="text-sm text-ousi-muted">{{ data.haptics.notes }}</span>
            </div>
          </div>

          <!-- Try it: interactive haptic preset tester -->
          <div class="px-5 py-4 border-t border-ousi-border/50">
            <p class="text-xs font-semibold text-ousi-muted mb-3">Try on your phone</p>
            <ClientOnly>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="preset in ['selection', 'light', 'medium', 'heavy', 'success', 'warning', 'error']"
                  :key="preset"
                  v-haptic="preset"
                  class="relative overflow-hidden px-3 py-1.5 text-xs font-medium rounded-ousi-xl border border-ousi-border bg-ousi-surface text-ousi-foreground hover:bg-ousi-default transition-colors active:scale-95"
                >
                  {{ preset }}
                </button>
              </div>
            </ClientOnly>
          </div>

          <div class="px-5 py-3 bg-ousi-surface-secondary/20 border-t border-ousi-border/50">
            <p class="text-xs text-ousi-muted">
              Enable with the <code class="text-xs rounded bg-ousi-default px-1 py-0.5 font-mono">haptic</code> prop:
              <code class="text-xs font-mono">'selection'</code>,
              <code class="text-xs font-mono">'light'</code>,
              <code class="text-xs font-mono">'medium'</code>,
              <code class="text-xs font-mono">'heavy'</code>,
              <code class="text-xs font-mono">'success'</code>,
              <code class="text-xs font-mono">'warning'</code>,
              <code class="text-xs font-mono">'error'</code>,
              or <code class="text-xs font-mono">'none'</code> to disable.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- ═══ TAB: API ═══ -->
    <div v-show="pageTab === 'api'" class="space-y-10">
      <section>
        <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Props</h2>
        <PropsTable :props="data.props" />
      </section>

      <template v-if="data.slots?.length">
        <OSeparator />
        <section>
          <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Slots</h2>
          <PropsTable :props="data.slots" />
        </section>
      </template>

      <template v-if="data.emits?.length">
        <OSeparator />
        <section>
          <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Emits</h2>
          <PropsTable :props="data.emits" />
        </section>
      </template>

      <template v-if="data.themeCode">
        <OSeparator />
        <section>
          <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Theme</h2>
          <p class="text-sm text-ousi-muted mb-3">
            Built with <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">class-variance-authority</code>.
          </p>
          <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary overflow-hidden">
            <ClientOnly><OCodeBlock :code="data.themeCode" show-copy /></ClientOnly>
          </div>
        </section>
      </template>
    </div>

    <!-- ═══ TAB: Accessibility ═══ -->
    <div v-show="pageTab === 'accessibility'" class="space-y-10">

      <!-- Keyboard -->
      <section v-if="data.keyboard?.length">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Keyboard Interactions</h2>
        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted w-32">Key</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(k, i) in data.keyboard" :key="k.key" :class="i < data.keyboard.length - 1 ? 'border-b border-ousi-border' : ''">
                <td class="px-4 py-3">
                  <ClientOnly><OKbd :keys="k.key as any" /></ClientOnly>
                </td>
                <td class="px-4 py-3 text-ousi-foreground">{{ k.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ARIA -->
      <template v-if="data.aria?.length">
        <OSeparator />
        <section>
          <h2 class="text-lg font-semibold text-ousi-foreground mb-4">ARIA Attributes</h2>
          <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Attribute</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Condition</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(a, i) in data.aria" :key="a.attribute" :class="i < data.aria.length - 1 ? 'border-b border-ousi-border' : ''">
                  <td class="px-4 py-3 font-mono text-xs text-ousi-accent">{{ a.attribute }}</td>
                  <td class="px-4 py-3 text-xs text-ousi-muted">{{ a.condition }}</td>
                  <td class="px-4 py-3 text-ousi-foreground">{{ a.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <!-- Best Practices -->
      <template v-if="data.bestPractices?.length">
        <OSeparator />
        <section>
          <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Best Practices</h2>
          <ul class="space-y-2.5 text-sm text-ousi-foreground">
            <li v-for="bp in data.bestPractices" :key="bp.text" class="flex items-start gap-2">
              <svg v-if="bp.good" class="size-4 text-ousi-success shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              <svg v-else class="size-4 text-ousi-danger shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
              <span v-html="bp.text.replace(/`([^`]+)`/g, '<code class=&quot;text-xs rounded bg-ousi-default px-1 py-0.5 font-mono&quot;>$1</code>')" />
            </li>
          </ul>
        </section>
      </template>
    </div>
  </div>
</template>
