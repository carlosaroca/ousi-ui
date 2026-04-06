import { cva } from 'class-variance-authority'

export const tabsWrapperTheme = cva(
  'flex gap-2',
  {
    variants: {
      orientation: {
        horizontal: 'flex-col',
        vertical: 'flex-row',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)

export const tabsListTheme = cva(
  'inline-flex bg-ousi-default',
  {
    variants: {
      variant: {
        primary: 'rounded-[calc(var(--ousi-radius-2xl)+0.25rem)]',
        secondary: 'bg-transparent p-0 rounded-none border-ousi-border',
      },
      size: {
        sm: 'p-0.5',
        md: 'p-1',
        lg: 'p-1',
      },
      orientation: {
        horizontal: 'w-full flex-row',
        vertical: 'flex-col gap-1',
      },
    },
    compoundVariants: [
      { variant: 'secondary', orientation: 'horizontal', class: 'border-b overflow-x-auto' },
      { variant: 'secondary', orientation: 'vertical', class: 'border-l' },
      { variant: 'secondary', size: 'sm', class: 'p-0' },
      { variant: 'secondary', size: 'md', class: 'p-0' },
      { variant: 'secondary', size: 'lg', class: 'p-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', orientation: 'horizontal' },
  },
)

export const tabTheme = cva(
  [
    'relative z-10 flex w-full items-center justify-center',
    'text-center font-medium text-ousi-muted outline-none select-none',
    'transition-[color,opacity] duration-150',
    'ease-[ease] motion-reduce:transition-none',
    'cursor-[--ousi-cursor-interactive]',
    'data-[disabled=true]:text-ousi-muted data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-default',
    'focus-visible:ring-2 focus-visible:ring-ousi-focus',
  ],
  {
    variants: {
      variant: {
        primary: 'rounded-ousi-2xl',
        secondary: 'rounded-none',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-4 text-sm',
        lg: 'h-10 px-5 text-sm',
      },
      selected: {
        true: 'text-ousi-foreground',
        false: 'hover:opacity-70',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', selected: false },
  },
)

export const tabIndicatorTheme = cva(
  [
    'absolute pointer-events-none',
    'transition-[left,top,width,height] duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
    'motion-reduce:transition-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface shadow-ousi-surface rounded-ousi-2xl',
        secondary: 'bg-ousi-accent',
      },
      orientation: {
        horizontal: '',
        vertical: '',
      },
    },
    defaultVariants: { variant: 'primary', orientation: 'horizontal' },
  },
)

export const tabPanelTheme = cva(
  'w-full outline-none',
  {
    variants: {
      orientation: {
        horizontal: 'mt-4',
        vertical: 'ml-4',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)
