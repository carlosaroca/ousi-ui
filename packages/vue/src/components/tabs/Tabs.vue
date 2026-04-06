<script setup lang="ts">
import { ref, computed, toRef, watch, onMounted, nextTick, useSlots } from 'vue'
import { cn, useControllableState, useMounted } from '@ousi-ui/core'
import { vHaptic } from '@ousi-ui/haptics'
import {
  tabsWrapperTheme, tabsListTheme, tabTheme,
  tabIndicatorTheme, tabPanelTheme,
} from './tabs.theme'
import type { TabsProps, TabsEmits } from './tabs.types'

const props = withDefaults(defineProps<TabsProps>(), {
  variant: 'primary',
  size: 'md',
  orientation: 'horizontal',
  showSeparator: false,
})

const emit = defineEmits<TabsEmits>()
const slots: Record<string, any> = useSlots()

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

function setTabRef(key: string, el: any) {
  if (el) tabRefs.value.set(key, el as HTMLElement)
  else tabRefs.value.delete(key)
}

// Indicator position — measured from DOM
const indicatorStyle = ref<Record<string, string>>({})

function updateIndicator() {
  const activeEl = tabRefs.value.get(activeKey.value)
  const listEl = listRef.value
  if (!activeEl || !listEl) return

  const listRect = listEl.getBoundingClientRect()
  const tabRect = activeEl.getBoundingClientRect()

  if (props.orientation === 'horizontal') {
    indicatorStyle.value = {
      left: `${tabRect.left - listRect.left}px`,
      width: `${tabRect.width}px`,
      height: props.variant === 'secondary' ? '2px' : `${tabRect.height}px`,
      top: props.variant === 'secondary' ? 'auto' : `${tabRect.top - listRect.top}px`,
      bottom: props.variant === 'secondary' ? '0' : 'auto',
    }
  } else {
    indicatorStyle.value = {
      top: `${tabRect.top - listRect.top}px`,
      height: `${tabRect.height}px`,
      width: props.variant === 'secondary' ? '2px' : `${tabRect.width}px`,
      left: props.variant === 'secondary' ? '0' : `${tabRect.left - listRect.left}px`,
    }
  }
}

// Update indicator when active key changes
watch(activeKey, () => nextTick(updateIndicator))
watch(() => props.variant, () => nextTick(updateIndicator))
watch(() => props.orientation, () => nextTick(updateIndicator))

onMounted(() => {
  nextTick(updateIndicator)
})

const resolvedHaptic = computed(() => {
  return props.haptic ?? 'none' // No haptic by default — user opts in via haptic prop
})

function selectTab(key: string) {
  const item = props.items.find((i) => i.key === key)
  if (!item || item.disabled) return
  activeKey.value = key
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
  }
}
</script>

<template>
  <div
    :class="cn(tabsWrapperTheme({ orientation }), props.class)"
    :data-orientation="orientation"
  >
    <!-- Tab list -->
    <div
      ref="listRef"
      role="tablist"
      :aria-orientation="orientation"
      :class="cn(tabsListTheme({ variant, size, orientation }), 'relative')"
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
          v-if="showSeparator && index > 0"
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
          :class="tabTheme({ variant, size, selected: activeKey === item.key })"
          :tabindex="activeKey === item.key ? 0 : -1"
          @click="selectTab(item.key)"
          @keydown="handleKeydown"
        >
          <slot name="tab" :item="item" :selected="activeKey === item.key">
            {{ item.label }}
          </slot>
        </button>
      </template>
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
