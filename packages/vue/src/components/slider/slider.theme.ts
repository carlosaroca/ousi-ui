import { cva } from 'class-variance-authority'

export const sliderTheme = cva(
  'grid w-full gap-1',
  {
    variants: {
      orientation: {
        horizontal: [
          '[grid-template-areas:"label_output"_"track_track"]',
          '[grid-template-columns:1fr_auto]',
        ],
        vertical: [
          'h-full gap-2',
          '[grid-template-areas:"output"_"track"_"label"]',
          '[grid-template-rows:auto_1fr_auto]',
          '[grid-template-columns:1fr]',
          'items-center justify-items-center',
        ],
      },
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] pointer-events-none',
        false: '',
      },
    },
    defaultVariants: { orientation: 'horizontal', disabled: false },
  },
)

/** Outer track wrapper — NO overflow:hidden so thumbs are visible. */
export const sliderTrackWrapperTheme = cva(
  'relative cursor-pointer [grid-area:track]',
  {
    variants: {
      orientation: {
        horizontal: 'w-full',
        vertical: 'h-full justify-self-center',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      { orientation: 'horizontal', size: 'sm', class: 'h-3' },
      { orientation: 'horizontal', size: 'md', class: 'h-5' },
      { orientation: 'horizontal', size: 'lg', class: 'h-7' },
      { orientation: 'vertical', size: 'sm', class: 'w-3' },
      { orientation: 'vertical', size: 'md', class: 'w-5' },
      { orientation: 'vertical', size: 'lg', class: 'w-7' },
    ],
    defaultVariants: { orientation: 'horizontal', size: 'md' },
  },
)

/** Inner track bar — HAS overflow:hidden to clip the fill. */
export const sliderTrackBarTheme = 'absolute inset-0 rounded-full bg-ousi-default overflow-hidden'

/** Fill inside the clipped bar. */
export const sliderFillTheme = cva(
  'absolute pointer-events-none rounded-full transition-[left,width,bottom,height] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-[dragging=true]:transition-none',
  {
    variants: {
      orientation: {
        horizontal: 'inset-y-0',
        vertical: 'inset-x-0',
      },
      color: {
        primary: 'bg-ousi-accent',
        secondary: 'bg-ousi-default-foreground',
        success: 'bg-ousi-success',
        danger: 'bg-ousi-danger',
        warning: 'bg-ousi-warning',
      },
    },
    defaultVariants: { orientation: 'horizontal', color: 'primary' },
  },
)

/** Thumb — white pill, NOT clipped. */
export const sliderThumbTheme = cva(
  [
    'absolute z-10 rounded-full bg-white shadow-md',
    'cursor-grab select-none outline-none',
    'transition-[transform,left,bottom] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-ousi-focus',
    'data-[dragging=true]:cursor-grabbing data-[dragging=true]:scale-95 data-[dragging=true]:transition-[transform]',
    'data-[disabled=true]:cursor-default',
  ],
  {
    variants: {
      orientation: {
        horizontal: 'top-1/2 -translate-y-1/2 -translate-x-1/2',
        vertical: 'left-1/2 -translate-x-1/2 translate-y-1/2',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)

export const sliderLabelTheme = 'w-fit text-sm font-medium text-ousi-foreground [grid-area:label]'

export const sliderOutputTheme = cva(
  'text-sm font-medium tabular-nums text-ousi-foreground [grid-area:output]',
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'text-center',
      },
    },
    defaultVariants: { orientation: 'horizontal' },
  },
)
