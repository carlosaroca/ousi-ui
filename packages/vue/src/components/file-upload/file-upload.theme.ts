import { cva } from 'class-variance-authority'

// Dashed edges need more contrast than a solid border to be seen. An app can replace the color with
// --file-upload-border, the corners with --file-upload-radius and the fill with --file-upload-bg.
const ZONE = [
  'rounded-[var(--file-upload-radius,var(--ousi-radius-2xl))] border',
  'outline-none motion-reduce:transition-none',
]

// Fill and line style belong to the state, so no two classes ever compete for them.
const RESTING = 'border-dashed bg-[var(--file-upload-bg,transparent)]'

const ZONE_STATES = {
  idle: [
    RESTING,
    'border-[color:var(--file-upload-border,color-mix(in_oklab,var(--ousi-foreground)_32%,transparent))]',
    'hover:border-[color:var(--file-upload-border,color-mix(in_oklab,var(--ousi-foreground)_58%,transparent))]',
  ],
  active: 'border-solid border-ousi-accent bg-[color-mix(in_oklab,var(--ousi-accent)_7%,transparent)]',
  invalid: [RESTING, 'border-ousi-danger'],
  disabled: [
    RESTING,
    'border-[color:var(--file-upload-border,color-mix(in_oklab,var(--ousi-foreground)_16%,transparent))]',
    'cursor-(--ousi-cursor-disabled)',
  ],
}

const SHADOWS = {
  none: 'shadow-none',
  xs: 'shadow-ousi-xs',
  sm: 'shadow-ousi-sm',
  md: 'shadow-ousi-md',
}

const PRESS = {
  true: [
    'transition-all duration-[400ms]',
    'ease-[cubic-bezier(0.33,1,0.68,1)]',
    'active:scale-[0.98]',
  ],
  false: 'transition-colors',
}

export const fileUploadAreaTheme = cva(
  [
    'flex w-full flex-col items-center justify-center text-center select-none',
    ...ZONE,
    // The native input is the control: its focus ring is drawn here.
    'peer-focus-visible:ring-2 peer-focus-visible:ring-ousi-focus peer-focus-visible:border-ousi-accent',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 px-4 py-4',
        md: 'gap-3 px-6 py-7',
        lg: 'gap-4 px-8 py-10',
      },
      state: {
        ...ZONE_STATES,
        idle: [...ZONE_STATES.idle, 'cursor-(--ousi-cursor-interactive)'],
        invalid: [ZONE_STATES.invalid, 'cursor-(--ousi-cursor-interactive)'],
      },
      shadow: SHADOWS,
      animated: PRESS,
    },
    defaultVariants: { size: 'md', state: 'idle', shadow: 'none', animated: false },
  },
)

/** The box of the illustration of the drop area. */
export const fileUploadIconTheme = cva('relative block w-24 shrink-0', {
  variants: {
    size: {
      sm: 'h-10 scale-[0.85]',
      md: 'h-12',
      lg: 'h-14 scale-[1.15]',
    },
    active: { true: '', false: '' },
    disabled: { true: 'opacity-50 grayscale', false: '' },
  },
  defaultVariants: { size: 'md', active: false, disabled: false },
})

const FAN_MOTION = [
  'absolute left-1/2 top-1/2',
  'transition-[translate,rotate,scale,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  'motion-reduce:transition-none',
]

/** The three pieces of the illustration, at rest and opened by hover, focus or a drag. */
export const fileUploadFanTheme = cva(FAN_MOTION, {
  variants: {
    side: {
      left: '-ml-4 -mt-5 block h-10 w-8 -translate-x-[1.25rem] -rotate-[10deg]',
      right: '-ml-4 -mt-5 block h-10 w-8 translate-x-[1.25rem] rotate-[10deg]',
      front: [
        '-ml-[1.125rem] -mt-[1.125rem] flex size-9 items-center justify-center rounded-ousi-xl',
        'bg-ousi-surface text-ousi-foreground shadow-ousi-md',
        'ring-1 ring-[color:color-mix(in_oklab,var(--ousi-foreground)_16%,transparent)]',
      ],
    },
    disabled: { true: '', false: '' },
  },
  compoundVariants: [
    {
      side: 'left',
      disabled: false,
      class: [
        'group-hover/zone:-translate-x-[1.75rem] group-hover/zone:-translate-y-0.5 group-hover/zone:-rotate-[18deg]',
        'group-has-focus-visible/zone:-translate-x-[1.75rem] group-has-focus-visible/zone:-rotate-[18deg]',
        'group-data-dragging/zone:-translate-x-[2rem] group-data-dragging/zone:-translate-y-1 group-data-dragging/zone:-rotate-[24deg]',
      ],
    },
    {
      side: 'right',
      disabled: false,
      class: [
        'group-hover/zone:translate-x-[1.75rem] group-hover/zone:-translate-y-0.5 group-hover/zone:rotate-[18deg]',
        'group-has-focus-visible/zone:translate-x-[1.75rem] group-has-focus-visible/zone:rotate-[18deg]',
        'group-data-dragging/zone:translate-x-[2rem] group-data-dragging/zone:-translate-y-1 group-data-dragging/zone:rotate-[24deg]',
      ],
    },
    {
      side: 'front',
      disabled: false,
      class: [
        'group-hover/zone:-translate-y-0.5',
        'group-data-dragging/zone:-translate-y-1 group-data-dragging/zone:scale-110',
      ],
    },
  ],
  defaultVariants: { side: 'front', disabled: false },
})

export const fileUploadTextTheme = cva('block font-medium text-balance', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    disabled: { true: 'text-ousi-muted', false: 'text-ousi-foreground' },
  },
  defaultVariants: { size: 'md', disabled: false },
})

export const fileUploadInlineTheme = cva(['flex w-full flex-wrap items-center', ...ZONE], {
  variants: {
    size: {
      sm: 'gap-2 px-3 py-1.5',
      md: 'gap-3 px-4 py-2',
      lg: 'gap-4 px-5 py-3',
    },
    state: ZONE_STATES,
    shadow: SHADOWS,
    animated: PRESS,
  },
  defaultVariants: { size: 'md', state: 'idle', shadow: 'none', animated: false },
})

export const fileUploadInlineIconTheme = cva('shrink-0 transition-colors', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
    active: {
      true: 'text-ousi-accent',
      false: 'text-ousi-muted',
    },
  },
  defaultVariants: { size: 'md', active: false },
})

export const fileUploadInlineTextTheme = cva('min-w-0 flex-1 basis-24 truncate text-ousi-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
})

/** What turns the label of the native input into a button: classes added over `buttonTheme`. */
export const fileUploadTriggerTheme = cva(
  [
    'peer-focus-visible:outline-solid peer-focus-visible:outline-2 peer-focus-visible:outline-ousi-focus',
    // Brackets on purpose: tailwind-merge takes `outline-offset-(--x)` for a color and drops the one above.
    'peer-focus-visible:outline-offset-[var(--ousi-ring-offset-width)]',
  ],
  {
    variants: {
      state: {
        idle: '',
        // The button variant: an edge that reads as a place to drop a file, like the area.
        outlined: [
          'border-[color:var(--file-upload-border,color-mix(in_oklab,var(--ousi-foreground)_32%,transparent))]',
          'hover:border-[color:var(--file-upload-border,color-mix(in_oklab,var(--ousi-foreground)_58%,transparent))]',
        ],
        active: 'border-ousi-accent bg-[color-mix(in_oklab,var(--ousi-accent)_7%,transparent)]',
        invalid: 'border-ousi-danger',
        disabled: 'pointer-events-none opacity-(--ousi-disabled-opacity)',
      },
    },
    defaultVariants: { state: 'idle' },
  },
)

export const fileUploadHintTheme = 'block text-xs text-ousi-muted text-pretty'

export const fileUploadMessageTheme = 'mt-1.5 text-xs'

export const fileUploadListTheme =
  'mt-2 flex flex-col rounded-[var(--file-upload-radius,var(--ousi-radius-2xl))] border border-ousi-border [&:not(:has(li))]:hidden'

/** A row of the list. Its actions wrap under the name only when the list is very narrow. */
export const fileUploadFileTheme = cva(
  'group/item relative flex flex-wrap items-center gap-x-3 gap-y-1 px-3',
  {
    variants: {
      size: {
        sm: 'py-2 text-xs',
        md: 'py-2.5 text-sm',
        lg: 'py-3 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadFileIconTheme = cva(
  [
    'block shrink-0 transition-[translate,rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
    'group-hover/item:-translate-y-px group-hover/item:-rotate-6 motion-reduce:transition-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 w-[1.625rem]',
        md: 'h-10 w-8',
        lg: 'h-11 w-[2.2rem]',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

/** The approval buttons, on their own line under the row, lined up with the name. */
export const fileUploadReviewTheme = cva('flex basis-full flex-wrap items-center gap-1.5 pt-0.5 pb-0.5', {
  variants: {
    size: {
      sm: 'pl-[2.375rem]',
      md: 'pl-11',
      lg: 'pl-12',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fileUploadProgressTheme =
  'absolute inset-x-3 bottom-0 h-0.5 overflow-hidden rounded-full bg-ousi-default'

export const fileUploadProgressFillTheme = cva('absolute inset-y-0 rounded-full bg-ousi-accent', {
  variants: {
    indeterminate: {
      // The keyframes come with the theme package (motion.css).
      true: 'left-0 w-2/5 animate-[progress-bar-indeterminate_1.4s_ease-in-out_infinite]',
      false: 'left-0 transition-[width] duration-200 ease-out',
    },
  },
  defaultVariants: { indeterminate: false },
})
