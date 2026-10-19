import { cva } from 'class-variance-authority'
import { backdropVariants } from '../shared/backdrop'

export const drawerBackdropTheme = cva(
  'fixed inset-0 z-50',
  {
    variants: {
      backdrop: backdropVariants,
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

const SIDE_PLACEMENTS: Array<'left' | 'right' | 'floating-left' | 'floating-right'> = [
  'left',
  'right',
  'floating-left',
  'floating-right',
]

export const drawerPanelTheme = cva(
  [
    'relative flex flex-col',
    'bg-ousi-overlay text-ousi-overlay-foreground outline-none',
    'p-6 pointer-events-auto',
  ],
  {
    variants: {
      shadow: {
        md: 'shadow-ousi-md',
        lg: 'shadow-ousi-lg',
        xl: 'shadow-ousi-xl',
        '2xl': 'shadow-ousi-2xl',
      },
      placement: {
        // Edge-attached — rounded on the open side only
        bottom: 'w-full rounded-t-ousi-3xl max-h-[85vh]',
        top: 'w-full rounded-b-ousi-3xl max-h-[85vh]',
        // Side placements take their width from `size` alone: tailwind-merge 2 does not see
        // `sm:w-96` and `sm:w-4xl` as the same property, so a base width would always win.
        left: 'h-full rounded-r-ousi-3xl w-80 max-w-[85vw]',
        right: 'h-full rounded-l-ousi-3xl w-80 max-w-[85vw]',
        // Floating — rounded all sides, detached from edges
        'floating-center': 'rounded-ousi-3xl w-full max-w-md max-h-[80vh]',
        'floating-left': 'h-[calc(100vh-2rem)] rounded-ousi-3xl w-80 max-w-[85vw]',
        'floating-right': 'h-[calc(100vh-2rem)] rounded-ousi-3xl w-80 max-w-[85vw]',
        'floating-top': 'w-full max-w-lg rounded-ousi-3xl max-h-[85vh]',
        'floating-bottom': 'w-full max-w-lg rounded-ousi-3xl max-h-[85vh]',
      },
      size: { sm: '', md: '', lg: '', xl: '', '2xl': '', full: '' },
    },
    compoundVariants: [
      { placement: SIDE_PLACEMENTS, size: 'sm', class: 'sm:w-96' },
      { placement: SIDE_PLACEMENTS, size: 'md', class: 'sm:w-md' },
      { placement: SIDE_PLACEMENTS, size: 'lg', class: 'sm:w-xl' },
      { placement: SIDE_PLACEMENTS, size: 'xl', class: 'sm:w-2xl' },
      { placement: SIDE_PLACEMENTS, size: '2xl', class: 'sm:w-4xl' },
      // Leaves a strip of the page in view, so the drawer still reads as one.
      { placement: SIDE_PLACEMENTS, size: 'full', class: 'w-[calc(100vw-2rem)] max-w-none sm:w-[calc(100vw-4rem)]' },
    ],
    defaultVariants: { placement: 'right', shadow: 'xl', size: 'sm' },
  },
)
