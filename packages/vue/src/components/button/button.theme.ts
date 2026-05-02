import { cva } from 'class-variance-authority'

export const buttonTheme = cva(
  [
    'relative isolate inline-flex w-fit origin-center items-center justify-center gap-2 overflow-hidden',
    'whitespace-nowrap select-none outline-none',
    'font-medium transition-[transform,background-color,box-shadow]',
    'duration-[250ms,100ms,100ms]',
    'ease-[ease,cubic-bezier(0.32,0.72,0,1),cubic-bezier(0.32,0.72,0,1)]',
    'cursor-[--ousi-cursor-interactive]',
    'focus-visible:ring-2 focus-visible:ring-ousi-focus focus-visible:ring-offset-[--ousi-ring-offset-width]',
    'disabled:opacity-[--ousi-disabled-opacity] disabled:cursor-[--ousi-cursor-disabled] disabled:pointer-events-none',
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
      size: {
        sm: 'h-9 px-3 text-sm md:h-8',
        md: 'h-10 px-4 text-sm md:h-9',
        lg: 'h-11 px-5 text-base md:h-10',
      },
      isIconOnly: {
        true: 'w-10 p-0 md:w-9',
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
      { size: 'sm', isIconOnly: true, class: 'w-9 md:w-8' },
      { size: 'lg', isIconOnly: true, class: 'w-11 md:w-10' },
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
