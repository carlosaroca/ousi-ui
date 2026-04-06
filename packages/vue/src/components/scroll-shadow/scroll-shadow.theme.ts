import { cva } from 'class-variance-authority'

export const scrollShadowTheme = cva(
  'relative',
  {
    variants: {
      orientation: {
        vertical: 'overflow-y-auto',
        horizontal: 'overflow-x-auto',
        both: 'overflow-auto',
      },
      hideScrollbar: {
        true: [
          '[scrollbar-width:none]',
          '[-ms-overflow-style:none]',
          '[&::-webkit-scrollbar]:hidden',
        ],
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
      hideScrollbar: true,
    },
  },
)
