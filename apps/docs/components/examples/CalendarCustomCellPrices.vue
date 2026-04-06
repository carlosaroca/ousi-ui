<script setup lang="ts">
import { OCalendar } from '@ousi-ui/vue'
</script>
<template>
  <OCalendar>
    <template #cell="{ day, isSelected, isToday, isOutsideMonth }">
      <span
        class="absolute inset-0 flex flex-col items-center justify-center"
        :class="isOutsideMonth ? 'opacity-30' : ''"
      >
        <span :class="[
          'text-sm',
          isSelected ? 'font-bold' : '',
          isToday && !isSelected ? 'text-ousi-accent' : '',
        ]">{{ day }}</span>
        <span
          v-if="[5, 10, 15, 20, 25].includes(day) && !isOutsideMonth"
          class="text-[8px] leading-none mt-0.5"
          :class="isSelected ? 'text-ousi-accent-foreground/80' : 'text-ousi-success'"
        >$99</span>
      </span>
    </template>
  </OCalendar>
</template>
