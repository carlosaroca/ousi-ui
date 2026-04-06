import type { ComponentData } from './types'

export const calendarData: ComponentData = {
  title: 'Calendar',
  description: 'A monthly calendar grid for selecting a single date.',
  category: 'Date & Time',
  importCode: "import { OCalendar } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'CalendarUsage',
        code: '<OCalendar v-model="date" />',
      },
    },
    {
      id: 'with-min-max',
      title: 'With Min & Max',
      example: {
        component: 'CalendarWithMinMax',
        code: `<OCalendar
  v-model="date"
  :min-value="{ year: 2026, month: 1, day: 1 }"
  :max-value="{ year: 2026, month: 12, day: 31 }"
/>`,
      },
    },
    {
      id: 'unavailable',
      title: 'Unavailable Dates',
      example: {
        component: 'CalendarUnavailable',
        code: `<OCalendar
  v-model="date"
  :unavailable-dates="[
    { year: 2026, month: 4, day: 5 },
    { year: 2026, month: 4, day: 12 },
    { year: 2026, month: 4, day: 19 },
    { year: 2026, month: 4, day: 26 },
  ]"
/>`,
      },
    },
    {
      id: 'with-indicators',
      title: 'With Indicators',
      example: {
        component: 'CalendarWithIndicators',
        code: `<OCalendar
  v-model="date"
  :indicator-days="[3, 10, 15, 22]"
/>`,
      },
    },
    {
      id: 'year-picker',
      title: 'Year Picker',
      example: {
        component: 'CalendarYearPicker',
        code: '<OCalendar v-model="date" show-year-picker />',
      },
    },
    {
      id: 'locale',
      title: 'Locale',
      example: {
        component: 'CalendarLocale',
        code: '<OCalendar v-model="date" locale="ja-JP" />',
      },
    },
    {
      id: 'custom-cell-prices',
      title: 'Custom Cell — Prices',
      example: {
        component: 'CalendarCustomCellPrices',
        code: `<OCalendar>
  <template #cell="{ day, isSelected, isToday, isOutsideMonth }">
    <span class="absolute inset-0 flex flex-col items-center justify-center">
      <span>{{ day }}</span>
      <span v-if="[5,10,15,20,25].includes(day) && !isOutsideMonth"
        class="text-[8px] text-ousi-success">$99</span>
    </span>
  </template>
</OCalendar>`,
      },
    },
    {
      id: 'custom-cell-colors',
      title: 'Custom Cell — Colored Events',
      example: {
        component: 'CalendarCustomCellColors',
        code: `<OCalendar>
  <template #cell="{ day, isSelected, isOutsideMonth }">
    <span class="absolute inset-1 flex items-center justify-center rounded-ousi-md"
      :class="!isSelected && [3,7].includes(day) ? 'bg-ousi-accent-soft' : ''">
      {{ day }}
    </span>
  </template>
</OCalendar>`,
      },
    },
    {
      id: 'cell-tooltip',
      title: 'Cell with Tooltip',
      example: {
        component: 'CalendarCellTooltip',
        code: `<OCalendar :indicator-days="[3, 7, 12, 15, 21, 28]">
  <template #cell="{ day, isOutsideMonth, hasIndicator }">
    <OTooltip
      :content="hasIndicator ? \`\${day}: Team meeting\` : \`Day \${day}\`"
      placement="top"
    >
      <span class="absolute inset-0 flex flex-col items-center justify-center">
        {{ day }}
        <span v-if="hasIndicator && !isOutsideMonth"
          class="size-1 rounded-full bg-ousi-accent mt-0.5" />
      </span>
    </OTooltip>
  </template>
</OCalendar>`,
      },
    },
    {
      id: 'cell-popover',
      title: 'Cell with Popover',
      example: {
        component: 'CalendarCellPopover',
        code: `<OCalendar :indicator-days="[5, 12, 19, 26]">
  <template #cell="{ day, date, isOutsideMonth, hasIndicator }">
    <OPopover v-if="hasIndicator && !isOutsideMonth" placement="right">
      <template #trigger>
        <span class="absolute inset-1 flex flex-col items-center justify-center
          rounded-ousi-md bg-ousi-accent-soft">
          {{ day }}
        </span>
      </template>
      <template #default="{ close }">
        <p class="font-medium">Sprint Review</p>
        <p class="text-xs text-ousi-muted">{{ date.month }}/{{ day }} at 2 PM</p>
        <OButton size="sm" @click="close">Details</OButton>
      </template>
    </OPopover>
    <span v-else>{{ day }}</span>
  </template>
</OCalendar>`,
      },
    },
    {
      id: 'custom-icons',
      title: 'Custom Navigation Icons',
      example: {
        component: 'CalendarCustomIcons',
        code: `<OCalendar v-model="date">
  <template #prev-icon>
    <MyLeftArrow />
  </template>
  <template #next-icon>
    <MyRightArrow />
  </template>
</OCalendar>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'CalendarDisabled',
        code: '<OCalendar disabled />',
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'CalendarDate | null', default: 'null', description: 'Selected date (v-model).' },
    { name: 'defaultValue', type: 'CalendarDate | null', default: 'null', description: 'Default selected date.' },
    { name: 'minValue', type: 'CalendarDate', default: '-', description: 'Minimum selectable date.' },
    { name: 'maxValue', type: 'CalendarDate', default: '-', description: 'Maximum selectable date.' },
    { name: 'unavailableDates', type: 'CalendarDate[]', default: '[]', description: 'Dates that are not available for selection.' },
    { name: 'indicatorDays', type: 'number[]', default: '[]', description: 'Days with indicator dots.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'Locale for month and day names.' },
    { name: 'showOutsideDays', type: 'boolean', default: 'true', description: 'Show days from previous and next month.' },
    { name: 'showYearPicker', type: 'boolean', default: 'false', description: 'Enable year picker overlay.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevent date selection.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the entire calendar.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'cell', type: '{ date, day, isSelected, isToday, isOutsideMonth, isDisabled, isUnavailable, hasIndicator }', description: 'Custom content for each day cell. Receives the full cell state.' },
    { name: 'prev-icon', type: '-', description: 'Custom icon for the previous month button.' },
    { name: 'next-icon', type: '-', description: 'Custom icon for the next month button.' },
  ],

  emits: [
    { name: 'update:modelValue', type: 'CalendarDate | null', description: 'Emitted when the selected date changes.' },
    { name: 'change', type: 'CalendarDate | null', description: 'Emitted on user-initiated date change.' },
  ],

  themeCode: `import { calendarTheme } from '@ousi-ui/vue'`,

  keyboard: [
    { key: 'ArrowLeft', description: 'Move focus to the previous day.' },
    { key: 'ArrowRight', description: 'Move focus to the next day.' },
    { key: 'ArrowUp', description: 'Move focus to the same day in the previous week.' },
    { key: 'ArrowDown', description: 'Move focus to the same day in the next week.' },
    { key: 'Home', description: 'Move focus to the first day of the week.' },
    { key: 'End', description: 'Move focus to the last day of the week.' },
    { key: 'PageUp', description: 'Move focus to the same day in the previous month.' },
    { key: 'PageDown', description: 'Move focus to the same day in the next month.' },
    { key: 'Enter / Space', description: 'Select the focused date.' },
  ],

  aria: [
    { attribute: 'role="grid"', condition: 'always', description: 'Calendar grid is exposed as a grid role.' },
    { attribute: 'aria-label', condition: 'always', description: 'Announces current month and year.' },
    { attribute: 'aria-selected', condition: 'selected date', description: 'Marks the currently selected date cell.' },
    { attribute: 'aria-disabled', condition: 'disabled or out of range', description: 'Marks non-interactive date cells.' },
  ],

  bestPractices: [
    { text: 'Provide minValue/maxValue to constrain selection to valid ranges.', good: true },
    { text: 'Use locale prop for internationalization instead of manually translating labels.', good: true },
    { text: "Don't remove keyboard navigation — essential for screen reader users.", good: false },
  ],
}
