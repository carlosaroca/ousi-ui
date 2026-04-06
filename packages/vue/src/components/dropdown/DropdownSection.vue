<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import { dropdownSectionTheme, dropdownSectionTitleTheme } from './dropdown.theme'

const props = defineProps<{ title?: string; class?: string }>()
</script>

<template>
  <li role="presentation" :class="cn(dropdownSectionTheme, props.class)">
    <p v-if="title" :class="dropdownSectionTitleTheme" role="presentation">{{ title }}</p>
    <ul role="group" class="w-full flex flex-col gap-0.5">
      <slot />
    </ul>
  </li>
</template>
