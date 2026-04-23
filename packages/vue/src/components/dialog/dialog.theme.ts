import { cva } from 'class-variance-authority'

export const dialogBackdropTheme = cva(
  [
    'fixed inset-0 z-50',
    'flex flex-row items-center justify-center',
    'w-full',
  ],
  {
    variants: {
      backdrop: {
        opaque: 'bg-black/50',
        blur: 'bg-black/50 backdrop-blur-md',
        transparent: 'bg-transparent',
      },
    },
    defaultVariants: { backdrop: 'opaque' },
  },
)

export const dialogContainerTheme = cva(
  [
    'flex flex-col items-center',
    'w-full min-w-0 flex-1',
    'p-4 sm:w-fit sm:p-10',
    'pointer-events-none',
    'min-h-screen',
  ],
  {
    variants: {
      placement: {
        auto: '',
        top: 'justify-start',
        center: 'justify-center',
        bottom: 'justify-end',
      },
      scrollBehavior: {
        outside: 'overflow-y-auto pointer-events-auto',
        inside: '',
      },
    },
    defaultVariants: {
      placement: 'auto',
      scrollBehavior: 'inside',
    },
  },
)

export const dialogPanelTheme = cva(
  [
    'relative flex w-full flex-col',
    'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground outline-none',
    'p-6',
    'pointer-events-auto',
  ],
  {
    variants: {
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        cover: 'h-full min-h-full w-full',
        full: 'h-full min-h-full w-full rounded-none',
      },
      placement: {
        auto: 'mt-auto sm:my-auto',
        top: 'mt-0',
        center: 'my-auto',
        bottom: 'mt-auto',
      },
      scrollBehavior: {
        inside: 'overflow-hidden',
        outside: 'h-auto min-h-0 shrink-0',
      },
      shadow: {
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
        '2xl': 'shadow-ousi-2xl',
      },
    },
    compoundVariants: [
      { size: 'full', shadow: 'xl', class: 'shadow-none' },
    ],
    defaultVariants: {
      size: 'md',
      placement: 'auto',
      scrollBehavior: 'inside',
      shadow: 'xl',
    },
  },
)

export const dialogHeaderTheme = 'flex flex-col gap-1'

export const dialogHeadingTheme = 'text-base font-medium text-ousi-foreground'

export const dialogBodyTheme = cva(
  'min-h-0 flex-1 text-sm leading-relaxed text-ousi-muted mt-2',
  {
    variants: {
      scrollBehavior: {
        inside: 'overflow-y-auto',
        outside: 'overflow-y-visible',
      },
    },
    defaultVariants: { scrollBehavior: 'inside' },
  },
)

export const dialogFooterTheme = 'flex flex-row items-center justify-end gap-2 mt-5'
