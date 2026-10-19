import { cva } from 'class-variance-authority'

export const fileUploadAreaTheme = cva(
  [
    'relative flex w-full flex-col items-center justify-center gap-3 text-center',
    'rounded-ousi-2xl border-[1.5px] border-dashed border-ousi-border',
    'cursor-pointer outline-none motion-reduce:transition-none',
    'hover:border-ousi-accent/60',
    'focus-visible:border-ousi-accent focus-visible:ring-2 focus-visible:ring-ousi-focus',
  ],
  {
    variants: {
      size: {
        sm: 'px-4 py-5',
        md: 'px-6 py-9',
        lg: 'px-8 py-12',
      },
      active: {
        true: 'border-ousi-accent bg-ousi-accent-soft',
        false: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
      animated: {
        true: [
          'transition-all duration-[400ms]',
          'ease-[cubic-bezier(0.33,1,0.68,1)]',
          'focus-within:scale-[0.98] active:scale-[0.98]',
        ],
        false: 'transition-colors',
      },
    },
    defaultVariants: { size: 'md', active: false, shadow: 'none', animated: false },
  },
)

export const fileUploadIconTheme = cva('transition-colors', {
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
    },
    active: {
      true: 'text-ousi-accent',
      false: 'text-ousi-muted',
    },
  },
  defaultVariants: { size: 'md', active: false },
})

export const fileUploadTextTheme = cva('text-ousi-foreground', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fileUploadLinkTheme = 'font-medium text-ousi-accent underline underline-offset-2'

export const fileUploadInlineTheme = cva(
  [
    'flex w-full items-center rounded-ousi-xl border-[1.5px] border-dashed border-ousi-border',
    'motion-reduce:transition-none',
    'hover:border-ousi-accent/60',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 px-3 py-1.5',
        md: 'gap-3 px-4 py-2',
        lg: 'gap-4 px-5 py-3',
      },
      active: {
        true: 'border-ousi-accent bg-ousi-accent-soft',
        false: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
      animated: {
        true: [
          'transition-all duration-[400ms]',
          'ease-[cubic-bezier(0.33,1,0.68,1)]',
          'focus-within:scale-[0.98] active:scale-[0.98]',
        ],
        false: 'transition-colors',
      },
    },
    defaultVariants: { size: 'md', active: false, shadow: 'none', animated: false },
  },
)

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

export const fileUploadInlineTextTheme = cva('flex-1 truncate text-ousi-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { size: 'md' },
})

export const fileUploadHintTheme =
  'mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-ousi-muted'

export const fileUploadErrorTheme = 'mt-2 text-xs text-ousi-danger'

export const fileUploadListTheme = 'mt-3 flex flex-col gap-2'

export const fileUploadFileTheme = cva(
  'relative flex items-center gap-3 overflow-hidden rounded-ousi-xl border border-ousi-border/70',
  {
    variants: {
      size: {
        sm: 'px-2.5 py-2 text-xs',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadFileIconTheme = cva(
  'flex size-9 shrink-0 items-center justify-center rounded-ousi-lg',
  {
    variants: {
      tone: {
        default: 'bg-ousi-default text-ousi-muted',
        success: 'bg-ousi-success-soft text-ousi-success',
        danger: 'bg-ousi-danger-soft text-ousi-danger',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

export const fileUploadProgressTheme =
  'absolute inset-x-0 bottom-0 h-0.5 bg-ousi-accent transition-[width] duration-200 ease-out'
