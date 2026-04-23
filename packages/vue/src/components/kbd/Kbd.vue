<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@ousi-ui/core'
import { kbdTheme, kbdAbbrTheme, kbdContentTheme } from './kbd.theme'
import { KEY_SYMBOLS } from './kbd.types'
import type { KbdProps, KbdKey } from './kbd.types'

const props = withDefaults(defineProps<KbdProps>(), {
  variant: 'default',
  shadow: 'none',
})

const keyList = computed((): KbdKey[] => {
  if (!props.keys) return []
  return Array.isArray(props.keys) ? props.keys : [props.keys]
})
</script>

<template>
  <kbd :class="cn(kbdTheme({ variant, shadow }), props.class)">
    <abbr
      v-for="key in keyList"
      :key="key"
      :title="key"
      :class="kbdAbbrTheme"
    >{{ KEY_SYMBOLS[key] }}</abbr>
    <span v-if="$slots.default" :class="kbdContentTheme">
      <slot />
    </span>
  </kbd>
</template>
