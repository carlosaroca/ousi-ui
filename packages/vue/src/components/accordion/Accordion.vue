<script setup lang="ts">
import { ref, toRef, nextTick, watch, useSlots } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import type { AccordionProps, AccordionEmits } from './accordion.types'

const props = withDefaults(defineProps<AccordionProps>(), {
  gap: 10,
  showDividers: true,
  variant: 'primary',
})

const emit = defineEmits<AccordionEmits>()
const slots = useSlots()

const expandedKey = useControllableState<string | null>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultValue ?? null,
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const bodyRefs = ref<Record<string, HTMLElement | null>>({})
const contentHeights = ref<Record<string, number>>({})

function measureHeight(key: string) {
  const el = bodyRefs.value[key]
  if (el) contentHeights.value[key] = el.scrollHeight
}

function toggle(key: string) {
  expandedKey.value = expandedKey.value === key ? null : key
  if (expandedKey.value) nextTick(() => measureHeight(expandedKey.value!))
}

watch(expandedKey, async (key) => {
  if (key) { await nextTick(); measureHeight(key) }
})

function hasIcon(key: string): boolean {
  return !!slots[`icon-${key}`] || !!slots.icon
}

const r = 'calc(var(--ousi-radius, 0.5rem) * 2.5)'

function getItemRadius(index: number): string {
  const ei = props.items.findIndex(i => i.key === expandedKey.value)
  const isExpanded = props.items[index].key === expandedKey.value
  const total = props.items.length
  if (isExpanded) return r
  if (ei === -1) {
    if (total === 1) return r
    if (index === 0) return `${r} ${r} 0 0`
    if (index === total - 1) return `0 0 ${r} ${r}`
    return '0'
  }
  if (index < ei) {
    if (index === 0 && index === ei - 1) return r
    if (index === 0) return `${r} ${r} 0 0`
    if (index === ei - 1) return `0 0 ${r} ${r}`
    return '0'
  }
  if (index > ei) {
    if (index === ei + 1 && index === total - 1) return r
    if (index === ei + 1) return `${r} ${r} 0 0`
    if (index === total - 1) return `0 0 ${r} ${r}`
    return '0'
  }
  return '0'
}

function getItemMargin(index: number): string {
  const ei = props.items.findIndex(i => i.key === expandedKey.value)
  if (ei === -1) return '0'
  const g = `${props.gap}px`
  if (index === ei) {
    const mt = ei > 0 ? g : '0'
    const mb = ei < props.items.length - 1 ? g : '0'
    return `${mt} 0 ${mb} 0`
  }
  return '0'
}

// Divider: show between two adjacent collapsed items (not next to the expanded one)
function showDivider(index: number): boolean {
  if (!props.showDividers) return false
  if (index >= props.items.length - 1) return false
  const ei = props.items.findIndex(i => i.key === expandedKey.value)
  if (index === ei || index + 1 === ei) return false
  if (index === ei - 1) return false
  return true
}

// Border: only show on items that form the edge of a group
// The expanded item always has a full border.
// For collapsed items, we use clip to hide borders that overlap with siblings.
function getItemBorder(index: number): string {
  const ei = props.items.findIndex(i => i.key === expandedKey.value)
  const isExpanded = props.items[index].key === expandedKey.value
  const total = props.items.length

  if (isExpanded) return 'border border-ousi-border/50'
  if (ei === -1) {
    // No expanded — single group
    if (index === 0) return 'border border-b-0 border-ousi-border/50'
    if (index === total - 1) return 'border border-ousi-border/50'
    return 'border-x border-ousi-border/50'
  }
  // Above expanded
  if (index < ei) {
    if (index === 0 && index === ei - 1) return 'border border-ousi-border/50'
    if (index === 0) return 'border border-b-0 border-ousi-border/50'
    if (index === ei - 1) return 'border border-ousi-border/50'
    return 'border-x border-ousi-border/50'
  }
  // Below expanded
  if (index > ei) {
    if (index === ei + 1 && index === total - 1) return 'border border-ousi-border/50'
    if (index === ei + 1) return 'border border-b-0 border-ousi-border/50'
    if (index === total - 1) return 'border border-ousi-border/50'
    return 'border-x border-ousi-border/50'
  }
  return 'border border-ousi-border/50'
}

const variantBg = {
  primary: 'bg-ousi-surface',
  secondary: 'bg-ousi-default',
}

const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'
const SMOOTH = 'cubic-bezier(0.32, 0.72, 0, 1)'

function setBodyRef(el: any, key: string) {
  if (el instanceof HTMLElement) bodyRefs.value[key] = el
}
</script>

<template>
  <div :class="cn('flex flex-col', props.class)">
    <div
      v-for="(item, index) in items"
      :key="item.key"
      :class="[
        variantBg[variant],
        variant === 'primary' ? getItemBorder(index) : '',
        'overflow-hidden',
      ]"
      :style="{
        borderRadius: getItemRadius(index),
        margin: getItemMargin(index),
        transition: `border-radius 450ms ${SMOOTH}, margin 450ms ${BOUNCE}`,
      }"
    >
      <!-- Divider -->
      <div v-if="showDivider(index - 1) && index > 0" class="h-px bg-ousi-border/30" />

      <!-- Trigger -->
      <button
        type="button"
        class="flex w-full items-center gap-2.5 px-4 py-3 text-left outline-none transition-colors hover:bg-ousi-default/20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ousi-focus"
        :aria-expanded="expandedKey === item.key"
        @click="toggle(item.key)"
      >
        <div v-if="hasIcon(item.key)" class="flex size-5 items-center justify-center shrink-0 text-ousi-muted">
          <slot :name="`icon-${item.key}`" :item="item" :index="index">
            <slot name="icon" :item="item" :index="index" />
          </slot>
        </div>
        <span class="flex-1 text-sm font-medium text-ousi-foreground">
          <slot :name="`title-${item.key}`" :item="item">{{ item.title }}</slot>
        </span>
        <svg
          class="size-4 shrink-0 text-ousi-muted"
          :style="{ transform: expandedKey === item.key ? 'rotate(180deg)' : 'rotate(0deg)', transition: `transform 350ms ${BOUNCE}` }"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        ><path d="M6 9l6 6 6-6" /></svg>
      </button>

      <!-- Content -->
      <div
        :style="{
          maxHeight: expandedKey === item.key ? `${contentHeights[item.key] ?? 200}px` : '0px',
          opacity: expandedKey === item.key ? 1 : 0,
          transition: `max-height 450ms ${BOUNCE}, opacity 300ms ease`,
          overflow: 'hidden',
        }"
      >
        <div :ref="(el) => setBodyRef(el, item.key)" class="px-4 pb-3.5 pt-0">
          <slot :name="`content-${item.key}`" :item="item">
            <p class="text-sm text-ousi-muted leading-relaxed">{{ item.description }}</p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
