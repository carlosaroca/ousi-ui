<script setup lang="ts">
import { OCalendar } from '@ousi-ui/vue'
</script>
<template>
  <div>
    <OCalendar>
      <template #cell="{ day, isSelected, isToday, isOutsideMonth }">
        <span
          class="absolute inset-1 flex items-center justify-center rounded-ousi-md"
          :class="[
            isOutsideMonth ? 'opacity-30' : '',
            !isSelected && !isOutsideMonth && [3, 7, 12, 15, 21, 28].includes(day) ? 'bg-ousi-accent-soft' : '',
            !isSelected && !isOutsideMonth && [8, 22].includes(day) ? 'bg-ousi-danger-soft' : '',
            !isSelected && !isOutsideMonth && [1, 14].includes(day) ? 'bg-ousi-success-soft' : '',
          ]"
        >
          <span :class="[
            'text-sm',
            isSelected ? 'font-bold' : '',
            isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
            !isSelected && !isOutsideMonth && [3, 7, 12, 15, 21, 28].includes(day) ? 'text-ousi-accent' : '',
            !isSelected && !isOutsideMonth && [8, 22].includes(day) ? 'text-ousi-danger' : '',
            !isSelected && !isOutsideMonth && [1, 14].includes(day) ? 'text-ousi-success' : '',
          ]">{{ day }}</span>
        </span>
      </template>
    </OCalendar>
    <div class="flex items-center gap-4 mt-3 text-xs text-ousi-muted">
      <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-accent-soft" /> Meetings</span>
      <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-danger-soft" /> Deadlines</span>
      <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-success-soft" /> Milestones</span>
    </div>
  </div>
</template>
