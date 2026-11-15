import { cva } from 'class-variance-authority'

export const buttonTheme = cva(
  [
    // overflow-clip (not hidden) clips the ripple without making the button a scroll container,
    // so in a flex or grid row it never shrinks below its label.
    'relative isolate inline-flex w-fit origin-center items-center justify-center gap-2 overflow-clip',
    'whitespace-nowrap select-none outline-none',
    'font-medium transition-[transform,background-color,box-shadow]',
    'duration-[250ms,100ms,100ms]',
    'ease-[ease,cubic-bezier(0.32,0.72,0,1),cubic-bezier(0.32,0.72,0,1)]',
    'cursor-(--ousi-cursor-interactive)',
    // An outline's offset gap is transparent, so it shows whatever surface the button sits on.
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-ousi-focus focus-visible:outline-offset-(--ousi-ring-offset-width)',
    'disabled:opacity-(--ousi-disabled-opacity) disabled:cursor-(--ousi-cursor-disabled) disabled:pointer-events-none',
    'active:scale-[0.97]',
    'rounded-ousi-4xl',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-ousi-accent text-ousi-accent-foreground',
          'hover:bg-ousi-accent-hover',
        ],
        secondary: [
          'bg-ousi-default text-ousi-accent',
          'hover:bg-ousi-default-hover',
        ],
        outline: [
          'border border-ousi-border bg-transparent text-ousi-default-foreground',
          'hover:bg-ousi-default',
        ],
        text: [
          'bg-transparent text-ousi-default-foreground',
          'hover:bg-ousi-default',
        ],
        link: [
          'gap-1 overflow-visible bg-transparent text-ousi-accent',
          'underline-offset-2 hover:underline',
        ],
        soft: [
          'bg-ousi-accent-soft text-ousi-accent-soft-foreground',
          'hover:bg-ousi-accent-soft-hover',
        ],
        danger: [
          'bg-ousi-danger text-ousi-danger-foreground',
          'hover:bg-ousi-danger-hover',
        ],
        'danger-soft': [
          'bg-ousi-danger-soft text-ousi-danger-soft-foreground',
          'hover:bg-ousi-danger-soft-hover',
        ],
      },
      // The height lives in a variable, so one class from the caller (`h-auto` for a row with two
      // lines, `h-8`) replaces it at every breakpoint.
      size: {
        xs: '[--ousi-btn-h:2rem] md:[--ousi-btn-h:1.75rem] h-[var(--ousi-btn-h)] px-2.5 text-xs',
        sm: '[--ousi-btn-h:2.25rem] md:[--ousi-btn-h:2rem] h-[var(--ousi-btn-h)] px-3 text-sm',
        md: '[--ousi-btn-h:2.5rem] md:[--ousi-btn-h:2.25rem] h-[var(--ousi-btn-h)] px-4 text-sm',
        lg: '[--ousi-btn-h:2.75rem] md:[--ousi-btn-h:2.5rem] h-[var(--ousi-btn-h)] px-5 text-base',
      },
      isIconOnly: {
        true: 'w-[var(--ousi-btn-h)] p-0',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
    },
    compoundVariants: [
      // A link sits in running text: no box, no press scale, the ring hugs the label.
      { variant: 'link', class: 'h-auto px-0 rounded-ousi-sm active:scale-100' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      isIconOnly: false,
      fullWidth: false,
      shadow: 'none',
    },
  },
)
