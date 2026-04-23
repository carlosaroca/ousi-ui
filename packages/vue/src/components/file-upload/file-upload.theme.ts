import { cva } from 'class-variance-authority'

export const fileUploadAreaTheme = cva(
  [
    'relative flex flex-col items-center justify-center gap-3',
    'rounded-ousi-2xl border-2 border-dashed border-ousi-border bg-ousi-surface',
    'cursor-pointer motion-reduce:transition-none',
    'hover:border-ousi-accent/50 hover:bg-ousi-accent/5',
  ],
  {
    variants: {
      size: {
        sm: 'p-5',
        md: 'p-8',
        lg: 'p-12',
      },
      active: {
        true: 'border-ousi-accent bg-ousi-accent/10',
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
        false: [
          'transition-colors',
        ],
      },
    },
    defaultVariants: { size: 'md', active: false, shadow: 'none', animated: false },
  },
)

export const fileUploadIconTheme = cva(
  'text-ousi-muted',
  {
    variants: {
      size: {
        sm: 'size-7',
        md: 'size-10',
        lg: 'size-14',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadTextTheme = cva(
  'text-ousi-muted text-center',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadInlineTheme = cva(
  [
    'flex items-center border border-dashed border-ousi-border bg-ousi-surface',
    'motion-reduce:transition-none',
    'hover:border-ousi-accent/50 hover:bg-ousi-accent/5',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 rounded-ousi-lg px-3 py-1.5',
        md: 'gap-3 rounded-ousi-lg px-4 py-2',
        lg: 'gap-4 rounded-ousi-xl px-5 py-3',
      },
      active: {
        true: 'border-ousi-accent bg-ousi-accent/10',
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
        false: [
          'transition-colors',
        ],
      },
    },
    defaultVariants: { size: 'md', active: false, shadow: 'none', animated: false },
  },
)

export const fileUploadInlineIconTheme = cva(
  'shrink-0 text-ousi-muted',
  {
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadInlineTextTheme = cva(
  'text-ousi-muted truncate',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export const fileUploadFileTheme = cva(
  'flex items-center gap-2 rounded-ousi-lg bg-ousi-default text-ousi-foreground',
  {
    variants: {
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
