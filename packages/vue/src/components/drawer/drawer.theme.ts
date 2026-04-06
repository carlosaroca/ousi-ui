import { cva } from 'class-variance-authority'

export const drawerBackdropTheme = cva(
  'fixed inset-0 z-50',
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

export const drawerContentTheme = cva(
  'pointer-events-none',
  {
    variants: {
      placement: {
        // Edge-attached
        bottom: 'fixed inset-x-0 bottom-0 flex flex-col justify-end',
        top: 'fixed inset-x-0 top-0 flex flex-col justify-start',
        left: 'fixed inset-y-0 left-0 flex flex-row justify-start',
        right: 'fixed inset-y-0 right-0 flex flex-row justify-end',
        // Floating
        'floating-center': 'fixed inset-0 flex items-center justify-center p-4',
        'floating-left': 'fixed inset-y-0 left-0 flex items-center p-4',
        'floating-right': 'fixed inset-y-0 right-0 flex items-center p-4',
        'floating-top': 'fixed inset-x-0 top-0 flex justify-center p-4',
        'floating-bottom': 'fixed inset-x-0 bottom-0 flex justify-center p-4',
      },
    },
    defaultVariants: { placement: 'right' },
  },
)

export const drawerPanelTheme = cva(
  [
    'relative flex flex-col',
    'bg-ousi-overlay text-ousi-overlay-foreground shadow-ousi-overlay outline-none',
    'p-6 pointer-events-auto',
  ],
  {
    variants: {
      placement: {
        // Edge-attached — rounded on the open side only
        bottom: 'w-full rounded-t-ousi-3xl max-h-[85vh]',
        top: 'w-full rounded-b-ousi-3xl max-h-[85vh]',
        left: 'h-full rounded-r-ousi-3xl w-80 max-w-[85vw] sm:w-96',
        right: 'h-full rounded-l-ousi-3xl w-80 max-w-[85vw] sm:w-96',
        // Floating — rounded all sides, detached from edges
        'floating-center': 'rounded-ousi-3xl w-full max-w-md max-h-[80vh]',
        'floating-left': 'h-[calc(100vh-2rem)] rounded-ousi-3xl w-80 max-w-[85vw] sm:w-96',
        'floating-right': 'h-[calc(100vh-2rem)] rounded-ousi-3xl w-80 max-w-[85vw] sm:w-96',
        'floating-top': 'w-full max-w-lg rounded-ousi-3xl max-h-[85vh]',
        'floating-bottom': 'w-full max-w-lg rounded-ousi-3xl max-h-[85vh]',
      },
    },
    defaultVariants: { placement: 'right' },
  },
)
