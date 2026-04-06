<script setup lang="ts">
import { OCalendar, OTooltip } from '@ousi-ui/vue'
</script>
<template>
  <OCalendar :indicator-days="[3, 7, 12, 15, 21, 28]">
    <template #cell="{ day, isSelected, isToday, isOutsideMonth, hasIndicator }">
      <OTooltip
        :content="hasIndicator && !isOutsideMonth ? `${day}: Team meeting` : `Day ${day}`"
        :delay="200"
        placement="top"
      >
        <span class="absolute inset-0 flex flex-col items-center justify-center">
          <span :class="[
            'text-sm',
            isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
            isOutsideMonth ? 'opacity-30' : '',
          ]">{{ day }}</span>
          <span
            v-if="hasIndicator && !isOutsideMonth"
            class="size-1 rounded-full mt-0.5"
            :class="isSelected ? 'bg-ousi-accent-foreground' : 'bg-ousi-accent'"
          />
        </span>
      </OTooltip>
    </template>
  </OCalendar>
</template>
