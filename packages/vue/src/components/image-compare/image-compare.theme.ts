import { cva } from 'class-variance-authority'

/** Root container. */
export const imageCompareTheme = cva('relative select-none overflow-hidden', {
  variants: {
    shadow: {
      none: 'shadow-none',
      xs: 'shadow-ousi-xs',
      sm: 'shadow-ousi-sm',
      md: 'shadow-ousi-md',
      lg: 'shadow-ousi-lg',
    },
  },
  defaultVariants: {
    shadow: 'sm',
  },
})

/** Each image layer. */
export const imageCompareImageTheme = 'absolute inset-0 w-full h-full object-cover'

/** Divider line. */
export const imageCompareDividerTheme = 'absolute z-20 bg-white/80 shadow-sm'

/** Drag handle. */
export const imageCompareHandleTheme = [
  'absolute z-30 flex items-center justify-center',
  'rounded-full bg-white/90 backdrop-blur-sm shadow-lg',
  'border-2 border-white/50',
  'cursor-grab active:cursor-grabbing',
  'transition-transform duration-100',
  'hover:scale-110 active:scale-95',
].join(' ')

/** Label badge. */
export const imageCompareLabelTheme = [
  'absolute z-10 px-2.5 py-1 rounded-ousi-lg',
  'text-xs font-medium text-white',
  'bg-black/50 backdrop-blur-sm',
  'pointer-events-none select-none',
  'transition-opacity duration-200',
].join(' ')
