import { cva } from 'class-variance-authority'
import { backdropVariants } from '../shared/backdrop'

export const dialogBackdropTheme = cva('fixed inset-0 z-50', {
  variants: {
    backdrop: backdropVariants,
  },
  defaultVariants: { backdrop: 'opaque' },
})

// Viewport layer that places the dialog and catches clicks outside it.
export const dialogContainerTheme = cva(
  ['fixed inset-0 z-50 flex flex-col items-center', 'p-4 sm:p-10'],
  {
    variants: {
      scrollBehavior: {
        inside: '',
        outside: 'overflow-y-auto',
      },
      size: {
        xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', '5xl': '',
        cover: '',
        full: 'p-0 sm:p-0',
      },
    },
    defaultVariants: { scrollBehavior: 'inside', size: 'md' },
  },
)

// Sizes the dialog: `size` is its width, up to the viewport; `placement` uses auto margins so a
// dialog taller than the viewport still scrolls from its top.
export const dialogWrapperTheme = cva('relative flex w-full flex-col', {
  variants: {
    size: {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      cover: 'h-full',
      full: 'h-full',
    },
    placement: {
      auto: 'mt-auto sm:my-auto',
      top: 'mb-auto',
      center: 'my-auto',
      bottom: 'mt-auto',
    },
    scrollBehavior: {
      inside: 'max-h-full min-h-0',
      outside: 'shrink-0',
    },
  },
  defaultVariants: { size: 'md', placement: 'center', scrollBehavior: 'inside' },
})

export const dialogPanelTheme = cva(
  [
    'relative flex min-h-0 w-full flex-1 flex-col',
    'rounded-ousi-3xl bg-ousi-overlay text-ousi-overlay-foreground outline-none',
    'p-6 sm:p-7',
  ],
  {
    variants: {
      size: {
        xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', '5xl': '',
        cover: '',
        full: 'rounded-none',
      },
      scrollBehavior: {
        inside: 'overflow-hidden',
        outside: '',
      },
      shadow: {
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
        '2xl': 'shadow-ousi-2xl',
      },
    },
    compoundVariants: [{ size: 'full', shadow: 'xl', class: 'shadow-none' }],
    defaultVariants: {
      size: 'md',
      scrollBehavior: 'inside',
      shadow: 'xl',
    },
  },
)

export const dialogHeaderTheme = 'flex flex-col gap-1'

export const dialogHeadingTheme = 'text-lg font-medium text-ousi-foreground'

export const dialogBodyTheme = cva(
  // The scroll area reaches 6px past the content on every side so field focus rings aren't clipped.
  [
    '-mx-1.5 mt-3.5 -mb-1.5 min-h-0 flex-1 p-1.5 first:-mt-1.5',
    'text-sm leading-relaxed text-ousi-muted',
  ],
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

export const dialogFooterTheme = 'mt-6 flex flex-row items-center justify-end gap-2 first:mt-0'
