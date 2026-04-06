<script setup lang="ts">
import { computed, toRef } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { provideDisclosureGroup } from './disclosure.context'
import { disclosureGroupTheme } from './disclosure.theme'
import type { DisclosureGroupProps, DisclosureGroupEmits } from './disclosure.types'

const props = withDefaults(defineProps<DisclosureGroupProps>(), {
  allowMultiple: false,
})

const emit = defineEmits<DisclosureGroupEmits>()

const expandedKeys = useControllableState<string[]>({
  prop: toRef(props, 'modelValue') as any,
  defaultValue: props.defaultExpandedKeys ?? [],
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

function isExpanded(key: string): boolean {
  return expandedKeys.value.includes(key)
}

function toggle(key: string) {
  if (props.allowMultiple) {
    expandedKeys.value = isExpanded(key)
      ? expandedKeys.value.filter((k) => k !== key)
      : [...expandedKeys.value, key]
  } else {
    expandedKeys.value = isExpanded(key) ? [] : [key]
  }
}

provideDisclosureGroup({
  expandedKeys,
  allowMultiple: computed(() => props.allowMultiple),
  toggle,
  isExpanded,
})
</script>

<template>
  <div :class="cn(disclosureGroupTheme, props.class)">
    <slot />
  </div>
</template>
