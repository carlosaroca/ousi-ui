import { cva } from 'class-variance-authority'

export const paginationTheme = 'flex w-full flex-col items-center justify-between gap-4 sm:flex-row'

export const paginationSummaryTheme = cva(
  'flex items-center gap-2 self-start text-ousi-muted sm:self-center',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const paginationContentTheme = 'flex items-center gap-1 self-start sm:self-center'

export const paginationLinkTheme = cva(
  [
    'relative isolate inline-flex origin-center items-center justify-center',
    'rounded-ousi-3xl font-medium whitespace-nowrap',
    'outline-none select-none cursor-pointer',
    'transition-[transform,background-color,box-shadow] duration-150',
    'motion-reduce:transition-none',
    'active:scale-[0.97]',
    'focus-visible:ring-2 focus-visible:ring-ousi-focus',
    'disabled:opacity-[--ousi-disabled-opacity] disabled:pointer-events-none',
  ],
  {
    variants: {
      size: {
        sm: 'size-8 md:size-7 text-xs',
        md: 'size-9 md:size-8 text-sm',
        lg: 'size-10 md:size-9 text-base',
      },
      active: {
        true: [
          'bg-ousi-accent text-ousi-accent-foreground',
          'hover:bg-ousi-accent/90',
          'active:bg-ousi-accent/80',
        ],
        false: [
          'bg-transparent text-ousi-default-foreground',
          'hover:bg-ousi-default-hover',
          'active:bg-ousi-default-hover',
        ],
      },
      nav: {
        true: 'w-auto gap-1.5',
        false: '',
      },
    },
    compoundVariants: [
      { nav: true, size: 'sm', class: 'px-2' },
      { nav: true, size: 'md', class: 'px-2.5' },
      { nav: true, size: 'lg', class: 'px-3' },
    ],
    defaultVariants: { size: 'md', active: false, nav: false },
  },
)

export const paginationEllipsisTheme = cva(
  'inline-flex items-center justify-center text-ousi-muted select-none',
  {
    variants: {
      size: {
        sm: 'size-8 md:size-7 text-xs',
        md: 'size-9 md:size-8 text-sm',
        lg: 'size-10 md:size-9 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
