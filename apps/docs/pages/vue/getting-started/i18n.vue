<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TimelineToc from '~/components/TimelineToc.vue'
import { ODatePicker, OTimePicker, OCalendar, OSelect } from '@ousi-ui/vue'
import type { SelectOption, TimeFieldValue, CalendarDate } from '@ousi-ui/vue'

useSeoMeta({
  title: 'Internationalization — Ousi UI',
  description: 'Set a global locale, hour format and first day of the week for every date/time component in Ousi UI.',
})

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'setup', label: 'Setup' },
  { id: 'runtime', label: 'Runtime changes' },
  { id: 'per-instance', label: 'Per-instance override' },
  { id: 'try-it', label: 'Try it' },
  { id: 'whats-affected', label: 'What it affects' },
  { id: 'helpers', label: 'Locale helpers' },
  { id: 'caveats', label: 'Caveats' },
]

// Try-it playground state
const localeOptions: SelectOption[] = [
  { value: 'en-US', label: 'English (US) — en-US' },
  { value: 'en-GB', label: 'English (UK) — en-GB' },
  { value: 'es-ES', label: 'Español — es-ES' },
  { value: 'de-DE', label: 'Deutsch — de-DE' },
  { value: 'fr-FR', label: 'Français — fr-FR' },
  { value: 'ja-JP', label: '日本語 — ja-JP' },
  { value: 'zh-CN', label: '中文 — zh-CN' },
  { value: 'ar-EG', label: 'العربية — ar-EG' },
]
const tryLocale = ref<string | number>('en-US')
const tryDate = ref<CalendarDate | null>({ year: 2026, month: 5, day: 15 })
const tryTime = ref<TimeFieldValue | null>({ hour: 14, minute: 30 })

const tryLocaleStr = computed(() => String(tryLocale.value))
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
      <h1 class="text-3xl font-bold text-ousi-foreground tracking-tight">Internationalization</h1>
      <p class="mt-1.5 text-base text-ousi-muted">
        Set a global locale once. Every date and time component picks it up — format, weekday order,
        AM/PM labels, all driven by <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">Intl</code>.
      </p>
    </div>

    <div class="space-y-12">

      <!-- Overview -->
      <section id="overview">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Overview</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Ousi UI ships a global config singleton accessible via
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">useOusiConfig()</code>.
          It holds four reactive refs:
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">locale</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">hour12</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">firstDayOfWeek</code> and
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">dir</code>.
          Date/time components read from this config when their own prop is not set.
        </p>
        <p class="text-sm text-ousi-muted leading-relaxed">
          The resolution order is the same for every locale-aware prop:
        </p>
        <div class="rounded-ousi-xl border border-ousi-border bg-ousi-surface-secondary/40 p-4 mt-3 text-sm font-mono text-ousi-foreground">
          <span class="text-ousi-accent">props.locale</span>
          <span class="text-ousi-muted"> ?? </span>
          <span class="text-ousi-accent">config.locale.value</span>
          <span class="text-ousi-muted"> ?? </span>
          <span class="text-ousi-muted">'en-US'</span>
        </div>
      </section>

      <OSeparator />

      <!-- Setup -->
      <section id="setup">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Setup</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          Set the initial locale (and any other config defaults) when you install the plugin in
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">main.ts</code>.
          This is the most common pattern — works exactly like Vuetify or PrimeVue.
        </p>

        <OCodeBlock filename="main.ts" :code="`import { createApp } from 'vue'
import { OusiUIPlugin } from '@ousi-ui/vue'
import App from './App.vue'

createApp(App)
  .use(OusiUIPlugin, {
    locale: 'de-DE',          // BCP 47 locale tag
    hour12: false,            // override the locale's default if needed
    firstDayOfWeek: 1,        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    dir: 'ltr',               // 'ltr' | 'rtl'
  })
  .mount('#app')`" />

        <p class="text-sm text-ousi-muted mt-3 leading-relaxed">
          All fields are optional. Anything you omit falls back to the locale's natural choice
          (e.g. <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">hour12</code>
          is inferred from <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">Intl.DateTimeFormat.resolvedOptions()</code>).
        </p>
      </section>

      <OSeparator />

      <!-- Runtime changes -->
      <section id="runtime">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Runtime changes</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          When the user toggles language at runtime, write to the config refs. The change propagates
          reactively to every mounted date/time component.
        </p>

        <OCodeBlock filename="LocaleSwitcher.vue" :code="`<script setup lang=&quot;ts&quot;>
import { useOusiConfig } from '@ousi-ui/vue'

const config = useOusiConfig()

function switchTo(locale: string) {
  config.locale.value = locale
}
&lt;/script&gt;

<template>
  <button @click=&quot;switchTo('es-ES')&quot;>Español</button>
  <button @click=&quot;switchTo('ja-JP')&quot;>日本語</button>
</template>`" />

        <p class="text-sm text-ousi-muted mt-3 leading-relaxed">
          If you use <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">vue-i18n</code>,
          add a watcher that syncs its locale into the Ousi config:
        </p>
        <OCodeBlock :code="`import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOusiConfig } from '@ousi-ui/vue'

const { locale } = useI18n()
const config = useOusiConfig()

watch(locale, (next) => {
  config.locale.value = next
}, { immediate: true })`" />
      </section>

      <OSeparator />

      <!-- Per-instance override -->
      <section id="per-instance">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Per-instance override</h2>
        <p class="text-sm text-ousi-foreground leading-relaxed mb-4">
          The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">locale</code>,
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">hour12</code> and
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">firstDayOfWeek</code>
          props on each component still win against the global config. Useful for one-off cases
          (a worldclock widget, a finance form forced to ISO, etc).
        </p>

        <OCodeBlock :code="`&lt;!-- App in 'de-DE' globally — this one stays English. --&gt;
<ODatePicker v-model=&quot;date&quot; locale=&quot;en-US&quot; />

&lt;!-- Force 24h regardless of locale defaults. --&gt;
<OTimePicker v-model=&quot;time&quot; :hour12=&quot;false&quot; />

&lt;!-- Force Monday as first day of week, even in en-US. --&gt;
<OCalendar v-model=&quot;date&quot; :first-day-of-week=&quot;1&quot; />`" />
      </section>

      <OSeparator />

      <!-- Try it -->
      <section id="try-it">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Try it</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Switch the locale below and watch the three components below adapt. Note the
          changes in date order, separator, weekday start, month name, and AM/PM labels.
        </p>

        <div class="rounded-ousi-2xl border border-ousi-border bg-ousi-surface-secondary/40 p-5 space-y-4">
          <div class="max-w-xs">
            <OSelect v-model="tryLocale" :options="localeOptions" label="Locale" size="sm" />
          </div>
          <ClientOnly>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wider mb-2">ODatePicker</p>
                <ODatePicker v-model="tryDate" :locale="tryLocaleStr" />
              </div>
              <div>
                <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wider mb-2">OTimePicker</p>
                <OTimePicker v-model="tryTime" :locale="tryLocaleStr" />
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-ousi-muted uppercase tracking-wider mb-2 mt-2">OCalendar</p>
              <OCalendar v-model="tryDate" :locale="tryLocaleStr" />
            </div>
          </ClientOnly>
        </div>
      </section>

      <OSeparator />

      <!-- What it affects -->
      <section id="whats-affected">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">What it affects</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Every component in the Date &amp; Time family consumes the config. Here's the exact behavior per component:
        </p>

        <div class="overflow-x-auto rounded-ousi-xl border border-ousi-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-ousi-border bg-ousi-surface-secondary/50">
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Component</th>
                <th class="px-4 py-2.5 text-left text-xs font-semibold text-ousi-muted">Driven by config</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OCalendar</td>
                <td class="px-4 py-3 text-ousi-muted">Month name, weekday labels, weekday column order, grid offset</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ORangeCalendar</td>
                <td class="px-4 py-3 text-ousi-muted">Same as OCalendar</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODateField</td>
                <td class="px-4 py-3 text-ousi-muted">Segment order and separator (DD/MM/YYYY vs MM/DD/YYYY vs DD.MM.YYYY vs YYYY/MM/DD)</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODatePicker</td>
                <td class="px-4 py-3 text-ousi-muted">Same as ODateField + inherits to its inner OCalendar</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">ODateRangePicker</td>
                <td class="px-4 py-3 text-ousi-muted">Same as ODatePicker + inherits to its inner ORangeCalendar</td>
              </tr>
              <tr class="border-b border-ousi-border">
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OTimeField</td>
                <td class="px-4 py-3 text-ousi-muted"><code class="text-xs bg-ousi-default px-1 rounded font-mono">hour12</code> auto-detect; AM/PM segment when 12h</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-mono text-xs text-ousi-accent">OTimePicker</td>
                <td class="px-4 py-3 text-ousi-muted"><code class="text-xs bg-ousi-default px-1 rounded font-mono">hour12</code> auto-detect; AM/PM wheel labels via <code class="text-xs bg-ousi-default px-1 rounded font-mono">formatToParts</code> (e.g. "a. m." / "p. m." in es-ES, "午前" / "午後" in ja-JP)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <OSeparator />

      <!-- Helpers -->
      <section id="helpers">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Locale helpers</h2>
        <p class="text-sm text-ousi-muted mb-4">
          Two utilities exposed alongside the config — useful if you build your own locale-aware UI.
        </p>

        <OCodeBlock :code="`import {
  getFirstDayOfWeekForLocale,
  getHour12ForLocale,
} from '@ousi-ui/vue'

getFirstDayOfWeekForLocale('en-US')  // 0  (Sunday)
getFirstDayOfWeekForLocale('en-GB')  // 1  (Monday)
getFirstDayOfWeekForLocale('ar-EG')  // 6  (Saturday)
getFirstDayOfWeekForLocale('de-DE')  // 1  (Monday)

getHour12ForLocale('en-US')          // true
getHour12ForLocale('de-DE')          // false
getHour12ForLocale('ja-JP')          // true`" />

        <p class="text-sm text-ousi-muted mt-3 leading-relaxed">
          <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">getFirstDayOfWeekForLocale</code>
          tries the experimental <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">Intl.Locale#getWeekInfo()</code>
          first and falls back to a CLDR-derived region map for browsers without support (Firefox, older Safari).
        </p>
      </section>

      <OSeparator />

      <!-- Caveats -->
      <section id="caveats">
        <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Caveats</h2>
        <ul class="space-y-3 text-sm text-ousi-foreground">
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-warning shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>
              <strong>The config is a singleton.</strong> Calling
              <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">useOusiConfig()</code>
              from any component returns the same refs. You cannot scope different locales to different
              subtrees with this API alone — if you need that, fork the prop on the boundary component.
            </span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-warning shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>
              <strong>Non-Intl components are not covered.</strong> Strings like button labels, "Cancel" / "OK"
              in dialogs, and error messages are still English. Wire those through your own i18n library
              (<code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">vue-i18n</code>,
              <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">@nuxtjs/i18n</code>).
              The Ousi config only handles what
              <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">Intl</code> can compute.
            </span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="size-4 text-ousi-warning shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>
              <strong>RTL is on the roadmap.</strong> The <code class="text-xs rounded bg-ousi-default px-1.5 py-0.5 font-mono">dir</code>
              ref exists in the config but the components don't yet flip their layouts (drawer side,
              dropdown placement, tooltip side). Coming in a follow-up release.
            </span>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>
