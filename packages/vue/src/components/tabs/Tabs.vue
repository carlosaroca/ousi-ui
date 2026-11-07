<script setup lang="ts">
import { ref, computed, toRef, watch, onMounted, onBeforeUnmount, nextTick, useSlots } from 'vue'
import { cn, useControllableState, useMounted } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import { useOusiMessages } from '../../config'
import { useScrollFade } from '../scroll-shadow/useScrollFade'
import {
  ODropdown,
  ODropdownTrigger,
  ODropdownPopover,
  ODropdownMenu,
  ODropdownItem,
} from '../dropdown'
import {
  tabsWrapperTheme, tabsListTheme, tabTheme,
  tabIndicatorTheme, tabPanelTheme,
} from './tabs.theme'
import type { TabsProps, TabsEmits } from './tabs.types'

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'primary',
  size: 'md',
  orientation: 'horizontal',
  fullWidth: false,
  overflow: 'scroll',
  showSeparator: false,
  hideBorder: false,
  scrollFade: true,
  contained: false,
  shadow: 'none',
})

const emit = defineEmits<TabsEmits>()
const slots: Record<string, any> = useSlots()
const ousiText = useOusiMessages()

const isMounted = useMounted()

// Only render panels if at least one panel slot is provided
const hasPanels = computed(() =>
  props.items.some(item => !!slots[item.key]),
)

const activeKey = useControllableState<string>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? props.items[0]?.key ?? '',
  onChange: (val) => { emit('update:modelValue', val); emit('change', val) },
})

// Refs for measuring tab positions
const listRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Map<string, HTMLElement>>(new Map())

// Fade the edge(s) that still have tabs beyond them (the same logic OScrollShadow uses)
const { maskStyle: fadeStyle, update: updateFade } = useScrollFade(listRef, {
  orientation: () => 'horizontal',
  size: () => 28,
  enabled: () => props.scrollFade && props.orientation === 'horizontal',
})

function setTabRef(key: string, el: any) {
  if (el) tabRefs.value.set(key, el as HTMLElement)
  else tabRefs.value.delete(key)
}

// ── Overflow menu: tabs past the available width go under "More" ──
const rootRef = ref<HTMLElement | null>(null)
const moreRef = ref<HTMLElement | null>(null)
const tabWidths = new Map<string, number>()
const visibleCount = ref(props.items.length)
const moreOpen = ref(false)

const usesMenu = computed(
  () => props.overflow === 'menu' && props.orientation === 'horizontal' && !props.fullWidth,
)
const hiddenItems = computed(() => (usesMenu.value ? props.items.slice(visibleCount.value) : []))
const activeHidden = computed(() => hiddenItems.value.find((i) => i.key === activeKey.value) ?? null)

function isHidden(index: number) {
  return usesMenu.value && index >= visibleCount.value
}

function layoutTabs() {
  if (!usesMenu.value) {
    visibleCount.value = props.items.length
    return
  }
  const root = rootRef.value
  if (!root) return
  // Hidden tabs keep the width they had when last shown.
  tabRefs.value.forEach((el, key) => {
    if (el.getClientRects().length) tabWidths.set(key, el.getBoundingClientRect().width)
  })
  const widths = props.items.map((item) => tabWidths.get(item.key) ?? 0)
  const available = root.clientWidth
  if (widths.reduce((sum, w) => sum + w, 0) <= available) {
    visibleCount.value = props.items.length
    return
  }
  const moreWidth = moreRef.value?.getBoundingClientRect().width || 96
  let used = 0
  let count = 0
  for (const width of widths) {
    if (used + width + moreWidth > available) break
    used += width
    count++
  }
  visibleCount.value = Math.max(1, count)
}

// Indicator position — measured from DOM
const indicatorStyle = ref<Record<string, string>>({})

function updateIndicator() {
  const activeEl = activeHidden.value ? moreRef.value : tabRefs.value.get(activeKey.value)
  const listEl = listRef.value
  if (!activeEl || !listEl) return

  const listRect = listEl.getBoundingClientRect()
  const tabRect = activeEl.getBoundingClientRect()
  // Measured against the list's padding box and scroll, so a scrolled list keeps it under its tab.
  const left = tabRect.left - listRect.left - listEl.clientLeft + listEl.scrollLeft
  const top = tabRect.top - listRect.top - listEl.clientTop + listEl.scrollTop

  if (props.orientation === 'horizontal') {
    indicatorStyle.value = {
      left: `${left}px`,
      width: `${tabRect.width}px`,
      height: props.variant === 'secondary' ? '2px' : `${tabRect.height}px`,
      top: props.variant === 'secondary' ? 'auto' : `${top}px`,
      bottom: props.variant === 'secondary' ? '0' : 'auto',
    }
  } else {
    indicatorStyle.value = {
      top: `${top}px`,
      height: `${tabRect.height}px`,
      width: props.variant === 'secondary' ? '2px' : `${tabRect.width}px`,
      left: props.variant === 'secondary' ? '0' : `${left}px`,
    }
  }
}

// Keep the active tab inside the visible part of a scrolling list.
function revealActive(smooth = true) {
  const list = listRef.value
  const el = activeHidden.value ? moreRef.value : tabRefs.value.get(activeKey.value)
  if (!list || !el || props.orientation !== 'horizontal' || list.scrollWidth <= list.clientWidth) return
  const l = list.getBoundingClientRect()
  const t = el.getBoundingClientRect()
  const margin = 12
  const behavior: ScrollBehavior =
    smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto'
  if (t.left < l.left + margin) list.scrollTo({ left: list.scrollLeft - (l.left + margin - t.left), behavior })
  else if (t.right > l.right - margin) list.scrollTo({ left: list.scrollLeft + (t.right - (l.right - margin)), behavior })
}

// Update indicator when active key changes
watch(activeKey, () => nextTick(() => { updateIndicator(); revealActive() }))
watch(() => props.variant, () => nextTick(updateIndicator))
watch(() => props.orientation, () => nextTick(updateIndicator))

// Labels change width when fonts load or items change; keep the indicator on its tab.
let resizeObserver: ResizeObserver | undefined

function observeSizes() {
  if (!resizeObserver) return
  resizeObserver.disconnect()
  if (rootRef.value) resizeObserver.observe(rootRef.value)
  if (listRef.value) resizeObserver.observe(listRef.value)
  tabRefs.value.forEach((el) => resizeObserver!.observe(el))
}

function relayout() {
  layoutTabs()
  nextTick(() => {
    // The More button may now show a longer label; measure again once it rendered.
    layoutTabs()
    updateIndicator()
    updateFade()
  })
}

watch(
  () => props.items,
  () => {
    visibleCount.value = props.items.length
    nextTick(() => {
      observeSizes()
      relayout()
    })
  },
  { deep: true },
)
watch(activeKey, () => {
  if (usesMenu.value) nextTick(relayout)
})

onMounted(() => {
  nextTick(() => { relayout(); revealActive(false) })
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(() => relayout())
  nextTick(observeSizes)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

const resolvedHaptic = computed(() => {
  return props.haptic ?? 'none' // No haptic by default — user opts in via haptic prop
})

function selectTab(key: string) {
  const item = props.items.find((i) => i.key === key)
  if (!item || item.disabled) return
  activeKey.value = key
}

function focusActive() {
  const el = activeHidden.value ? moreRef.value : tabRefs.value.get(activeKey.value)
  el?.focus()
}

function handleKeydown(e: KeyboardEvent) {
  const enabledItems = props.items.filter((i) => !i.disabled)
  const currentIndex = enabledItems.findIndex((i) => i.key === activeKey.value)

  const isHorizontal = props.orientation === 'horizontal'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

  if (e.key === nextKey) {
    e.preventDefault()
    const next = enabledItems[(currentIndex + 1) % enabledItems.length]
    selectTab(next.key)
  } else if (e.key === prevKey) {
    e.preventDefault()
    const prev = enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length]
    selectTab(prev.key)
  } else if (e.key === 'Home') {
    e.preventDefault()
    selectTab(enabledItems[0]?.key)
  } else if (e.key === 'End') {
    e.preventDefault()
    selectTab(enabledItems[enabledItems.length - 1]?.key)
  } else {
    return
  }
  nextTick(focusActive)
}
</script>

<template>
  <div
    ref="rootRef"
    :class="cn(tabsWrapperTheme({ orientation, contained }), props.class)"
    :data-orientation="orientation"
  >
    <!-- Tab list -->
    <div
      ref="listRef"
      role="tablist"
      :aria-orientation="orientation"
      :class="cn(tabsListTheme({ variant, size, orientation, fullWidth, shadow, hideBorder }), 'relative')"
      :style="fadeStyle"
    >
      <!-- Sliding indicator — single element, animated via CSS transition -->
      <span
        v-if="isMounted"
        :class="tabIndicatorTheme({ variant, orientation })"
        :style="indicatorStyle"
      />

      <!-- Tab buttons with optional separators -->
      <template v-for="(item, index) in items" :key="item.key">
        <!-- Separator (between tabs, hidden when adjacent tab is selected) -->
        <span
          v-if="showSeparator && index > 0 && !isHidden(index)"
          class="shrink-0 self-center transition-opacity duration-150"
          :class="[
            orientation === 'horizontal' ? 'h-4 w-px' : 'w-4 h-px',
            'bg-ousi-border',
            (activeKey === item.key || activeKey === items[index - 1]?.key) ? 'opacity-0' : 'opacity-100',
          ]"
          aria-hidden="true"
        />

        <button
          :ref="(el) => setTabRef(item.key, el)"
          v-haptic="resolvedHaptic"
          role="tab"
          :aria-selected="activeKey === item.key"
          :aria-controls="`panel-${item.key}`"
          :aria-disabled="item.disabled || undefined"
          :data-selected="activeKey === item.key || undefined"
          :data-disabled="item.disabled || undefined"
          :class="[
            tabTheme({ variant, size, orientation, fullWidth, selected: activeKey === item.key }),
            isHidden(index) && 'hidden',
          ]"
          :tabindex="activeKey === item.key ? 0 : -1"
          @click="selectTab(item.key)"
          @keydown="handleKeydown"
        >
          <slot name="tab" :item="item" :selected="activeKey === item.key">
            {{ item.label }}
          </slot>
        </button>
      </template>

      <ODropdown v-if="hiddenItems.length" v-model="moreOpen">
        <ODropdownTrigger>
          <button
            ref="moreRef"
            type="button"
            :aria-expanded="moreOpen"
            :tabindex="activeHidden ? 0 : -1"
            :class="cn(tabTheme({ variant, size, orientation, fullWidth, selected: !!activeHidden }), 'gap-1')"
            @keydown="handleKeydown"
          >
            <slot v-if="activeHidden" name="tab" :item="activeHidden" :selected="true">
              {{ activeHidden.label }}
            </slot>
            <template v-else>{{ ousiText.moreTabs }}</template>
            <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </ODropdownTrigger>
        <ODropdownPopover placement="bottom-end">
          <ODropdownMenu @action="(key: string) => selectTab(key)">
            <ODropdownItem
              v-for="item in hiddenItems"
              :id="item.key"
              :key="item.key"
              :disabled="item.disabled"
            >
              <slot name="tab" :item="item" :selected="item.key === activeKey">
                {{ item.label }}
              </slot>
            </ODropdownItem>
          </ODropdownMenu>
        </ODropdownPopover>
      </ODropdown>
    </div>

    <!-- Tab panels (only rendered if panel slots are provided) -->
    <template v-if="hasPanels">
      <div
        v-for="item in items"
        v-show="activeKey === item.key"
        :key="item.key"
        :id="`panel-${item.key}`"
        role="tabpanel"
        :aria-labelledby="item.key"
        :class="tabPanelTheme({ orientation })"
      >
        <slot :name="item.key" />
      </div>
    </template>
  </div>
</template>
