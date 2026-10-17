import { cva } from 'class-variance-authority'

export const statusTheme = cva('inline-flex items-center whitespace-nowrap text-ousi-foreground', {
  variants: {
    variant: { dot: '', halo: '', tinted: 'font-medium' },
    color: { accent: '', success: '', warning: '', danger: '', default: '' },
    size: { sm: 'gap-1.5 text-xs', md: 'gap-2 text-sm' },
  },
  compoundVariants: [
    { variant: 'halo', size: 'sm', class: 'gap-2' },
    { variant: 'halo', size: 'md', class: 'gap-2.5' },
    { variant: 'tinted', color: 'accent', class: 'text-ousi-accent-soft-strong' },
    { variant: 'tinted', color: 'success', class: 'text-ousi-success-soft-strong' },
    { variant: 'tinted', color: 'warning', class: 'text-ousi-warning-soft-strong' },
    { variant: 'tinted', color: 'danger', class: 'text-ousi-danger-soft-strong' },
    { variant: 'tinted', color: 'default', class: 'text-ousi-muted' },
  ],
  defaultVariants: { variant: 'dot', color: 'default', size: 'md' },
})

export const statusDotTheme = cva('shrink-0 rounded-full', {
  variants: {
    variant: { dot: '', halo: '', tinted: '' },
    color: {
      accent: 'bg-ousi-accent',
      success: 'bg-ousi-success',
      warning: 'bg-ousi-warning',
      danger: 'bg-ousi-danger',
      default: 'bg-ousi-muted',
    },
    size: { sm: 'size-1.5', md: 'size-2' },
  },
  compoundVariants: [
    { variant: 'halo', color: 'accent', class: 'ring-[3px] ring-ousi-accent/20' },
    { variant: 'halo', color: 'success', class: 'ring-[3px] ring-ousi-success/20' },
    { variant: 'halo', color: 'warning', class: 'ring-[3px] ring-ousi-warning/20' },
    { variant: 'halo', color: 'danger', class: 'ring-[3px] ring-ousi-danger/20' },
    { variant: 'halo', color: 'default', class: 'ring-[3px] ring-ousi-muted/20' },
  ],
  defaultVariants: { variant: 'dot', color: 'default', size: 'md' },
})
