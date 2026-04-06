import { cva } from 'class-variance-authority'

// Reuse Input's label and field tokens
export { labelTheme as autocompleteLabelTheme } from '../input/input.theme'
export { inputGroupTheme as autocompleteTriggerTheme } from '../input/input.theme'

export const autocompleteWrapperTheme = cva(
  'flex flex-col gap-1.5',
  {
    variants: {
      fullWidth: { true: 'w-full', false: 'w-fit' },
    },
    defaultVariants: { fullWidth: false },
  },
)

export const autocompleteInputTheme = [
  'flex-1 bg-transparent outline-none border-none min-w-0',
  'text-ousi-field-foreground placeholder:text-ousi-field-placeholder',
  'text-sm px-3 py-2',
].join(' ')

export const autocompletePopoverTheme = [
  'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground shadow-ousi-overlay',
  'overflow-y-auto overscroll-contain max-h-60',
  'z-50',
].join(' ')

export const autocompleteListboxTheme = 'p-1.5 outline-none'

export const autocompleteOptionTheme = cva(
  [
    'relative flex min-h-9 w-full items-center justify-start gap-2',
    'rounded-ousi-2xl px-2.5 py-1.5 outline-none select-none text-sm',
    'transition-[transform,background-color] duration-150',
    'ease-[ease] motion-reduce:transition-none',
    'cursor-pointer',
    'hover:bg-ousi-default',
    'active:scale-[0.98]',
    'data-[disabled=true]:text-ousi-muted data-[disabled=true]:pointer-events-none',
  ],
  {
    variants: {
      selected: {
        true: 'text-ousi-accent font-medium',
        false: 'text-ousi-foreground',
      },
      focused: {
        true: 'bg-ousi-default',
        false: '',
      },
    },
    defaultVariants: { selected: false, focused: false },
  },
)

export const autocompleteEmptyTheme = 'px-4 py-6 text-center text-sm text-ousi-muted'

export const autocompleteDescriptionTheme = 'text-xs text-ousi-muted'

export const autocompleteErrorTheme = 'text-xs text-ousi-danger'
