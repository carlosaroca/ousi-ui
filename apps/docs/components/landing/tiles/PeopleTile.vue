<script setup lang="ts">
import { computed } from 'vue'
import { OAnimatedNumber, OAvatar } from '@ousi-ui/vue'
import { useShowcase } from '~/composables/useShowcase'
import ShowcaseTile from '../ShowcaseTile.vue'

const { slot } = useShowcase()

const people = ['Olivia Reed', 'Leo Marsh', 'Jun Park', 'Mia Torres']
// People come and go: the count changes every 2 s and the avatars follow it.
const counts = [4, 5, 7, 6, 3, 5]
const count = computed(() => counts[slot(2).value % counts.length])
const visible = computed(() => Math.min(people.length, Math.max(2, count.value - 1)))
</script>

<template>
  <ShowcaseTile class="grow">
    <p class="text-xs font-medium text-ousi-muted">Live in file</p>
    <div class="mt-4 flex">
      <OAvatar
        v-for="(name, i) in people"
        :key="name"
        :name="name"
        size="md"
        class="-ml-1.5 bg-ousi-surface text-ousi-foreground ring-2 ring-ousi-default transition-all duration-300 first:ml-0"
        :class="i < visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
      />
    </div>
    <div class="mt-auto flex items-baseline gap-1.5 pt-6">
      <OAnimatedNumber :value="count" animation="roll" :duration="400" class="text-2xl font-medium tabular-nums text-ousi-foreground" />
      <span class="text-[11px] text-ousi-muted">people editing</span>
    </div>
  </ShowcaseTile>
</template>
