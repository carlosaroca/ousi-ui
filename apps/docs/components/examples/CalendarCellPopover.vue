<script setup lang="ts">
import { OCalendar, OPopover, OAvatar, OButton } from '@ousi-ui/vue'
</script>
<template>
  <OCalendar :indicator-days="[5, 12, 19, 26]">
    <template #cell="{ day, date, isSelected, isToday, isOutsideMonth, hasIndicator }">
      <OPopover v-if="hasIndicator && !isOutsideMonth" placement="right" :show-arrow="true">
        <template #trigger>
          <span class="absolute inset-1 flex flex-col items-center justify-center rounded-ousi-md bg-ousi-accent-soft">
            <span class="text-sm" :class="isToday ? 'font-semibold' : ''">{{ day }}</span>
            <span class="size-1 rounded-full bg-ousi-accent mt-0.5" />
          </span>
        </template>
        <template #default="{ close }">
          <div class="min-w-48">
            <p class="text-sm font-medium text-ousi-foreground mb-1">Sprint Review</p>
            <p class="text-xs text-ousi-muted mb-3">{{ date.year }}-{{ String(date.month).padStart(2,'0') }}-{{ String(date.day).padStart(2,'0') }} at 2:00 PM</p>
            <div class="flex items-center gap-2 mb-3">
              <OAvatar name="Carlos R" size="sm" />
              <OAvatar name="Ana T" size="sm" />
              <OAvatar name="Bob M" size="sm" />
              <span class="text-xs text-ousi-muted">+2 others</span>
            </div>
            <div class="flex gap-2">
              <OButton size="sm" variant="soft" @click="close">Details</OButton>
              <OButton size="sm" variant="text" @click="close">Dismiss</OButton>
            </div>
          </div>
        </template>
      </OPopover>
      <span v-else class="absolute inset-0 flex items-center justify-center">
        <span :class="[
          'text-sm',
          isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
          isOutsideMonth ? 'opacity-30' : '',
        ]">{{ day }}</span>
      </span>
    </template>
  </OCalendar>
</template>
