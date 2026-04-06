import { cva } from 'class-variance-authority'

export const fileUploadAreaTheme = cva(
  [
    'relative flex flex-col items-center justify-center gap-3',
    'rounded-ousi-2xl border-2 border-dashed border-ousi-border bg-ousi-surface',
    'transition-colors cursor-pointer',
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
    },
    defaultVariants: { size: 'md', active: false },
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
    'transition-colors',
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
    },
    defaultVariants: { size: 'md', active: false },
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
