import { cva } from 'class-variance-authority'

export const elasticSliderBarTheme = cva(
  'transition-[height,opacity,background-color]',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
        warning: '',
      },
      active: {
        true: '',
        false: 'opacity-25',
      },
    },
    compoundVariants: [
      { color: 'primary', active: true, class: 'bg-ousi-accent' },
      { color: 'primary', active: false, class: 'bg-ousi-accent' },
      { color: 'secondary', active: true, class: 'bg-ousi-foreground' },
      { color: 'secondary', active: false, class: 'bg-ousi-foreground' },
      { color: 'success', active: true, class: 'bg-ousi-success' },
      { color: 'success', active: false, class: 'bg-ousi-success' },
      { color: 'danger', active: true, class: 'bg-ousi-danger' },
      { color: 'danger', active: false, class: 'bg-ousi-danger' },
      { color: 'warning', active: true, class: 'bg-ousi-warning' },
      { color: 'warning', active: false, class: 'bg-ousi-warning' },
    ],
    defaultVariants: { color: 'primary', active: false },
  },
)
