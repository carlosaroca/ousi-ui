import { cva } from 'class-variance-authority'

/** Outer wrapper — stacks label, trigger, description/error vertically. */
export const timePickerWrapperTheme = 'flex w-full flex-col gap-1'

/** Trigger button — looks like a field, opens the wheels popover. */
export const timePickerTriggerTheme = cva(
  [
    'inline-flex w-full items-center min-h-9 rounded-ousi-field px-3 py-2',
    'border bg-ousi-field text-sm text-ousi-field-foreground',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'cursor-[--ousi-cursor-interactive] outline-none',
    'motion-reduce:transition-none',
    'hover:not-focus:bg-ousi-field-hover',
    'focus:ring-2 focus:ring-ousi-focus focus:bg-ousi-field-focus',
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity] data-[disabled=true]:pointer-events-none',
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: [
          'border-transparent bg-ousi-surface-secondary',
          'hover:not-focus:bg-ousi-surface-tertiary',
          'focus:bg-ousi-surface-secondary',
        ],
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
      animated: {
        true: [
          'transition-all duration-[400ms]',
          'ease-[cubic-bezier(0.33,1,0.68,1)]',
          'focus:scale-[0.98]',
        ],
        false: [
          'transition-[background-color,border-color,box-shadow] duration-150',
        ],
      },
    },
    compoundVariants: [
      { variant: 'secondary', shadow: 'xs', class: 'shadow-none' },
    ],
    defaultVariants: {
      variant: 'primary',
      shadow: 'xs',
      animated: false,
    },
  },
)

/** Placeholder shown when no value is set. */
export const timePickerPlaceholderTheme = 'text-ousi-field-placeholder'

/** Clock icon at the right of the trigger. */
export const timePickerIndicatorTheme = [
  'inline-flex items-center justify-center shrink-0 ml-auto',
  'text-ousi-field-placeholder',
  'transition-colors duration-150',
].join(' ')

/** Label above the field. */
export const timePickerLabelTheme = cva(
  'text-sm font-medium text-ousi-foreground',
  {
    variants: {
      required: { true: 'after:ml-0.5 after:text-ousi-danger after:content-["*"]' },
      disabled: { true: 'opacity-[--ousi-disabled-opacity] pointer-events-none' },
      invalid: { true: 'text-ousi-danger' },
    },
  },
)

export const timePickerDescriptionTheme = 'text-xs text-ousi-muted'
export const timePickerErrorTheme = 'text-xs text-ousi-danger'

/** Floating popover that wraps the wheel columns. */
export const timePickerPopoverTheme = [
  'bg-ousi-overlay text-ousi-overlay-foreground shadow-ousi-xl',
  'rounded-ousi-3xl overflow-hidden',
  'p-3',
  'z-50',
].join(' ')

/** Row containing the wheel columns + the centered selection band behind them. */
export const timePickerWheelRowTheme = 'relative flex items-center gap-2'

/** The translucent band at the wheel's center showing the selected slot. */
export const timePickerSelectionBandTheme = [
  'absolute left-2 right-2 top-1/2 -translate-y-1/2 pointer-events-none',
  'h-10 rounded-ousi-xl bg-ousi-default/60',
].join(' ')

/** A single scrollable wheel column. */
export const timePickerWheelTheme = [
  'relative h-[200px] w-14 overflow-y-auto',
  'snap-y snap-mandatory',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  'scroll-smooth',
].join(' ')

/** Each item inside a wheel. Base text is foreground; the wheel applies inline
 *  scale + opacity per item based on distance from the center. */
export const timePickerWheelItemTheme = cva([
  'flex h-10 items-center justify-center snap-center select-none',
  'text-sm font-medium tabular-nums text-ousi-foreground',
  'transition-[transform,opacity] duration-100 ease-out',
])

/** ":" between hour and minute (and minute and second). */
export const timePickerSeparatorTheme = 'text-base font-semibold text-ousi-muted select-none'

/** Footer with Now / Cancel / OK buttons. */
export const timePickerFooterTheme = 'flex items-center justify-between gap-2 mt-3 pt-3 border-t border-ousi-border'
