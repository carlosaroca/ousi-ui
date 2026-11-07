<script setup lang="ts">
import { computed, ref } from 'vue'
import { OTabs } from '@ousi-ui/vue'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// 24 short tabs
const many = Array.from({ length: 24 }, (_, i) => ({ key: `m${i}`, label: `${months[i % 12]} ${i < 12 ? 2024 : 2025}` }))
// A few very long labels, one disabled
const long = [
  { key: 'a', label: 'Overview' },
  { key: 'b', label: 'Income and international travel over the last five years' },
  { key: 'c', label: 'Corporate links and shareholdings' },
  { key: 'd', label: 'Legal documents pending review', disabled: true },
  { key: 'e', label: 'Press coverage' },
  { key: 'f', label: 'Sources and references used in the investigation' },
]

const active = ref('m3')
const longActive = ref('b')
const sizes = ['sm', 'md', 'lg'] as const
const current = computed(() => many.find((t) => t.key === active.value)?.label)
</script>
<template>
  <!-- w-full min-w-0: a flex or grid child cannot be narrower than its content unless it says so,
       and 24 tabs that never wrap are thousands of pixels wide. -->
  <div class="flex w-full min-w-0 flex-col gap-10">
    <!-- 24 tabs -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">24 tabs · primary · {{ current }} selected</p>
      <OTabs v-model="active" :items="many" class="max-w-xl" />
    </div>
    <div>
      <p class="mb-2 text-xs text-ousi-muted">24 tabs · secondary, as wide as the page</p>
      <OTabs v-model="active" variant="secondary" :items="many" />
    </div>

    <!-- Very long labels: they never wrap, the list scrolls -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">long labels, one disabled · primary and secondary</p>
      <div class="flex max-w-xl flex-col gap-4">
        <OTabs v-model="longActive" :items="long" />
        <OTabs v-model="longActive" variant="secondary" :items="long" />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">sizes sm · md · lg</p>
      <div class="flex max-w-md flex-col gap-3">
        <OTabs v-for="s in sizes" :key="s" :size="s" :items="many" />
      </div>
    </div>

    <!-- Next to a sibling in a flex row: the tabs take what is left and scroll, they do not push the layout -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">inside a flex row, next to other content</p>
      <div class="flex max-w-xl items-center gap-3 rounded-2xl border border-dashed border-ousi-border p-3">
        <div class="shrink-0 rounded-xl bg-ousi-default px-3 py-1.5 text-sm font-medium text-ousi-foreground">Filters</div>
        <OTabs variant="secondary" :items="many" class="min-w-0 flex-1" />
        <div class="shrink-0 rounded-xl bg-ousi-default px-3 py-1.5 text-sm font-medium text-ousi-foreground">Export</div>
      </div>
    </div>

    <!-- With panels, keyboard: focus a tab and use the arrows / Home / End -->
    <div class="max-w-xl">
      <p class="mb-2 text-xs text-ousi-muted">with panels · use ← → Home End: the selected tab always scrolls into view</p>
      <OTabs v-model="active" variant="secondary" :items="many">
        <template v-for="t in many" :key="t.key" #[t.key]>
          <div class="rounded-xl bg-ousi-default px-4 py-6 text-sm text-ousi-muted">Content of <b class="text-ousi-foreground">{{ t.label }}</b>.</div>
        </template>
      </OTabs>
    </div>

    <!-- Menu instead of scrolling -->
    <div>
      <p class="mb-2 text-xs text-ousi-muted">overflow="menu" with the long labels</p>
      <OTabs v-model="longActive" variant="secondary" overflow="menu" :items="long" class="max-w-xl" />
    </div>
  </div>
</template>
