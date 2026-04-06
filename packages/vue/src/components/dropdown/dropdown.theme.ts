import { cva } from 'class-variance-authority'

export const dropdownPopoverTheme = [
  'max-w-[48svw] scroll-py-1 overflow-y-auto overscroll-contain',
  'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground p-0 text-sm md:min-w-[220px]',
  'shadow-ousi-overlay z-50',
].join(' ')

export const dropdownMenuTheme = 'relative flex w-full flex-col gap-0.5 overflow-clip p-1.5 outline-none'

export const dropdownSectionTheme = 'flex flex-col items-start gap-0 w-full'

export const dropdownSectionTitleTheme = 'w-full px-2.5 py-1 text-xs font-medium text-ousi-muted'

export const dropdownSeparatorTheme = 'my-1 ml-[3%] h-px w-[94%] bg-ousi-border'

export const dropdownItemTheme = cva(
  [
    'relative flex min-h-9 w-full items-center justify-start gap-2',
    'rounded-ousi-2xl px-2.5 py-1.5 outline-none select-none',
    'text-sm transition-[transform,background-color,box-shadow] duration-150',
    'ease-[ease] motion-reduce:transition-none',
    'cursor-[--ousi-cursor-interactive]',
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ousi-focus',
    'hover:bg-ousi-default',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        default: 'text-ousi-foreground',
        danger: 'text-ousi-danger hover:bg-ousi-danger-soft',
      },
      disabled: {
        true: 'text-ousi-muted pointer-events-none',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', disabled: false },
  },
)

export const dropdownItemIndicatorTheme = [
  'flex size-4 shrink-0 items-center justify-center text-ousi-accent',
].join(' ')
