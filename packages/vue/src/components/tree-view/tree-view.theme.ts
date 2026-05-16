import { cva } from 'class-variance-authority'

export const treeViewTheme = 'w-full text-sm select-none'

/** A row in the tree — the chevron + checkbox + icon + label container. */
export const treeViewNodeTheme = cva(
  [
    'flex items-center gap-1.5 px-2 py-1 rounded-ousi-lg text-ousi-foreground',
    'cursor-pointer transition-colors',
    'hover:bg-ousi-default',
    'outline-none',
    // Visible focus ring when keyboard-focused on this row.
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ousi-focus',
  ],
  {
    variants: {
      selected: {
        true: 'bg-ousi-accent-soft text-ousi-accent-soft-foreground hover:bg-ousi-accent-soft/90',
        false: '',
      },
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] pointer-events-none',
        false: '',
      },
    },
    defaultVariants: { selected: false, disabled: false },
  },
)

/** Vertical line + indentation for the children block. */
export const treeViewChildrenTheme = 'pl-4 ml-2 border-l border-ousi-border/30'

/** Chevron arrow on parent nodes. Rotates 90deg when expanded. */
export const treeViewChevronTheme = [
  'size-4 text-ousi-muted transition-transform duration-200 shrink-0',
  'rounded-sm cursor-pointer',
  'hover:text-ousi-foreground',
  'outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus',
].join(' ')

/** Empty 16px spacer rendered for leaf nodes so labels align with their siblings. */
export const treeViewChevronSpacerTheme = 'size-4 shrink-0'

/** Built-in icon rendering — uses the node.icon as an SVG path 'd' attribute. */
export const treeViewIconTheme = 'size-4 text-ousi-muted shrink-0'
