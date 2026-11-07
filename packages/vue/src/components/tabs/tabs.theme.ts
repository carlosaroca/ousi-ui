import { cva } from 'class-variance-authority'

export const tabsWrapperTheme = cva(
  'flex min-w-0 gap-2',
  {
    variants: {
      orientation: {
        horizontal: 'max-w-full flex-col',
        vertical: 'flex-row',
      },
      // Zero intrinsic width + fill the parent: the tabs never push a grid or flex parent wider.
      contained: { true: '', false: '' },
    },
    compoundVariants: [
      { orientation: 'horizontal', contained: true, class: 'w-0 min-w-full' },
    ],
    defaultVariants: { orientation: 'horizontal', contained: false },
  },
)

export const tabsListTheme = cva(
  'inline-flex min-w-0 bg-ousi-default',
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
        horizontal: 'max-w-full flex-row',
        vertical: 'flex-col gap-1',
      },
      fullWidth: { true: '', false: '' },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
      // Whether to draw the secondary variant's track border (long underline / left rail).
      // The active-tab indicator is rendered separately and is unaffected.
      hideBorder: { true: '', false: '' },
    },
    compoundVariants: [
      // Primary hugs its tabs unless stretched; secondary's track always spans the width.
      { variant: 'primary', orientation: 'horizontal', fullWidth: false, class: 'self-start' },
      { orientation: 'horizontal', fullWidth: true, class: 'w-full' },
      { variant: 'secondary', orientation: 'horizontal', class: 'w-full' },
      // Tabs that do not fit scroll sideways, with the scrollbar hidden. Both variants.
      { orientation: 'horizontal', class: 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' },
      // Track border — only when not hidden.
      { variant: 'secondary', orientation: 'horizontal', hideBorder: false, class: 'border-b' },
      { variant: 'secondary', orientation: 'vertical', hideBorder: false, class: 'border-l' },
      { variant: 'secondary', size: 'sm', class: 'p-0' },
      { variant: 'secondary', size: 'md', class: 'p-0' },
      { variant: 'secondary', size: 'lg', class: 'p-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', orientation: 'horizontal', fullWidth: false, shadow: 'none', hideBorder: false },
  },
)

export const tabTheme = cva(
  [
    'relative z-10 flex items-center justify-center whitespace-nowrap',
    'text-center font-medium text-ousi-muted outline-none select-none',
    'transition-[color,opacity] duration-150',
    'ease-[ease] motion-reduce:transition-none',
    'cursor-(--ousi-cursor-interactive)',
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
      orientation: {
        horizontal: '',
        vertical: 'w-full',
      },
      fullWidth: { true: '', false: '' },
    },
    compoundVariants: [
      // Share the width when it is enough, keep the label's own width (and scroll) when it is not.
      { orientation: 'horizontal', fullWidth: true, class: 'flex-1 shrink-0' },
      { orientation: 'horizontal', fullWidth: false, class: 'shrink-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', selected: false, orientation: 'horizontal', fullWidth: false },
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
        primary: 'bg-ousi-surface shadow-ousi-sm rounded-ousi-2xl',
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
