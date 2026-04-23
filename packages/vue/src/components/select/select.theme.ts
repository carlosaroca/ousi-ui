import { cva } from 'class-variance-authority'

export const selectWrapperTheme = 'flex w-full flex-col gap-1'

export const selectTriggerTheme = cva(
  [
    'relative isolate flex w-full min-h-9 items-center',
    'rounded-ousi-field border bg-ousi-field',
    'px-3 py-2 pr-8 text-sm text-ousi-field-foreground',
    'outline-none select-none',
    'border-[length:var(--ousi-field-border-width)] border-[color:var(--ousi-field-border)]',
    'motion-reduce:transition-none',
    'cursor-[--ousi-cursor-interactive]',
    // Hover
    'hover:bg-ousi-field-hover',
    // Focus visible
    'focus-visible:ring-2 focus-visible:ring-ousi-focus',
    'focus-visible:bg-ousi-field-focus',
    // Disabled
    'data-[disabled=true]:opacity-[--ousi-disabled-opacity]',
    'data-[disabled=true]:cursor-[--ousi-cursor-disabled]',
    'data-[disabled=true]:pointer-events-none',
    // Invalid
    'data-[invalid=true]:outline data-[invalid=true]:outline-1 data-[invalid=true]:outline-ousi-danger',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: 'border-transparent bg-ousi-surface-secondary hover:bg-ousi-surface-tertiary',
      },
      size: {
        sm: 'min-h-8 text-xs',
        md: 'min-h-9 text-sm',
        lg: 'min-h-10 text-base',
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
          'focus-within:scale-[0.98]',
        ],
        false: [
          'transition-[background-color,border-color,box-shadow] duration-150',
          'ease-[ease]',
        ],
      },
    },
    compoundVariants: [
      { variant: 'secondary', shadow: 'xs', class: 'shadow-none' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shadow: 'xs',
      animated: false,
    },
  },
)

export const selectPopoverTheme = [
  'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground',
  'shadow-ousi-lg',
  'overflow-hidden',
  'z-50',
].join(' ')

export const listboxTheme = 'p-1.5 outline-none'

export const menuItemTheme = cva(
  [
    'relative flex min-h-9 w-full items-center justify-start gap-3',
    'rounded-ousi-2xl px-2 py-1.5 outline-none select-none',
    'transition-[transform,box-shadow] duration-[250ms]',
    'ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none',
    'cursor-[--ousi-cursor-interactive]',
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
    },
    defaultVariants: { selected: false },
  },
)
