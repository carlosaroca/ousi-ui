<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import {
  breadcrumbsTheme,
  breadcrumbItemTheme,
  breadcrumbLinkTheme,
  breadcrumbSeparatorTheme,
} from './breadcrumbs.theme'
import type { BreadcrumbsProps, BreadcrumbsEmits } from './breadcrumbs.types'

const props = withDefaults(defineProps<BreadcrumbsProps>(), {
  separator: 'chevron',
})

const emit = defineEmits<BreadcrumbsEmits>()

const separators = {
  chevron: '<path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>',
  slash: '<line x1="16" y1="4" x2="8" y2="20"/>',
  dot: '<circle cx="12" cy="12" r="2" fill="currentColor"/>',
}

function isCurrent(index: number) {
  return index === props.items.length - 1
}

function handleClick(item: typeof props.items[0], index: number) {
  if (item.disabled || isCurrent(index)) return
  item.onClick?.()
  emit('navigate', item, index)
}
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol :class="cn(breadcrumbsTheme, props.class)">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="breadcrumbItemTheme"
      >
        <component
          :is="item.href && !isCurrent(index) ? 'a' : 'span'"
          :href="item.href && !isCurrent(index) ? item.href : undefined"
          :class="breadcrumbLinkTheme(isCurrent(index), !!item.disabled)"
          :aria-current="isCurrent(index) ? 'page' : undefined"
          :aria-disabled="item.disabled || undefined"
          @click="!item.href && handleClick(item, index)"
        >
          <slot :name="`item-${index}`" :item="item" :is-current="isCurrent(index)">
            {{ item.label }}
          </slot>
        </component>

        <span
          v-if="!isCurrent(index)"
          :class="breadcrumbSeparatorTheme"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="separators[separator]" />
        </span>
      </li>
    </ol>
  </nav>
</template>
