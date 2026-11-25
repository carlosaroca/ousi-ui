import { cva } from 'class-variance-authority'

// Shape, border and states come from the theme's tokens, as a button's do. One radius, the
// button's, shapes the track; the thumb and the fill sit inside it by the padding, so their radius
// is that much smaller and the curves stay concentric, whatever the theme's radius is.
export const slideButtonTheme = cva(
  [
    'relative isolate inline-block max-w-full select-none overflow-hidden align-top',
    'h-(--slide-h) min-w-64',
    '[--slide-pad:0.25rem] [--slide-radius:var(--ousi-radius-4xl)]',
    '[--slide-thumb:calc(var(--slide-h)_-_var(--slide-pad)_*_2_-_var(--ousi-border-width)_*_2)]',
    'rounded-(--slide-radius)',
    'border-solid border-[length:var(--ousi-border-width)] border-ousi-border bg-ousi-default',
  ],
  {
    variants: {
      size: {
        sm: '[--slide-h:2.5rem] text-sm',
        md: '[--slide-h:3rem] text-sm',
        lg: '[--slide-h:3.5rem] text-base',
      },
      fullWidth: { true: 'w-full', false: 'w-72' },
      disabled: {
        true: 'opacity-(--ousi-disabled-opacity) cursor-(--ousi-cursor-disabled)',
        false: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
    },
    defaultVariants: { size: 'md', fullWidth: false, disabled: false, shadow: 'none' },
  },
)

export const slideButtonThumbTheme = cva(
  [
    'absolute top-(--slide-pad) z-10 flex size-(--slide-thumb) items-center justify-center',
    'rounded-[max(0px,calc(var(--slide-radius)_-_var(--slide-pad)_-_var(--ousi-border-width)))] shadow-ousi-sm outline-none',
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ousi-focus focus-visible:outline-offset-[var(--ousi-ring-offset-width)]',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-ousi-accent text-ousi-accent-foreground',
        success: 'bg-ousi-success text-ousi-success-foreground',
        danger: 'bg-ousi-danger text-ousi-danger-foreground',
      },
      grab: {
        // Only the thumb holds a finger back from scrolling; the rest of the track lets it pass.
        true: 'cursor-grab touch-none active:cursor-grabbing',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', grab: true },
  },
)

export const slideButtonFillTheme = cva(
  'pointer-events-none absolute inset-y-(--slide-pad) start-(--slide-pad) rounded-[max(0px,calc(var(--slide-radius)_-_var(--slide-pad)_-_var(--ousi-border-width)))]',
  {
    variants: {
      variant: { primary: 'bg-ousi-accent-soft', success: 'bg-ousi-success-soft', danger: 'bg-ousi-danger-soft' },
    },
    defaultVariants: { variant: 'primary' },
  },
)
