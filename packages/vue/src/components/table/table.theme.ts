import { cva } from 'class-variance-authority'

export const tableRootTheme = cva(
  'relative grid w-full overflow-clip [grid-template-columns:minmax(0,1fr)]',
  {
    variants: {
      variant: {
        primary: [
          'bg-ousi-surface-secondary px-1 pb-1',
        ],
        secondary: '',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export const tableScrollContainerTheme = 'overflow-x-auto'

export const tableContentTheme = 'w-full border-separate border-spacing-0 text-sm'

export const tableHeaderTheme = cva(
  '',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface-secondary border-b border-ousi-separator/50',
        secondary: '',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export const tableColumnTheme = cva(
  [
    'relative px-4 py-2.5 text-left text-xs font-medium text-ousi-muted',
    'outline-none select-none',
    'focus-visible:rounded-ousi-lg',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: 'bg-ousi-default first:rounded-l-ousi-2xl last:rounded-r-ousi-2xl',
      },
      sortable: {
        true: 'cursor-pointer hover:text-ousi-foreground',
        false: '',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: { sortable: false, align: 'left', variant: 'primary' },
  },
)

export const tableColumnSeparatorTheme = [
  'absolute top-1/2 right-0 h-4 w-px -translate-y-1/2 rounded-sm',
  'bg-ousi-separator pointer-events-none',
].join(' ')

export const tableBodyTheme = [
  '[&_tr:first-child_td:first-child]:rounded-tl-ousi-2xl',
  '[&_tr:first-child_td:last-child]:rounded-tr-ousi-2xl',
  '[&_tr:last-child_td:first-child]:rounded-bl-ousi-2xl',
  '[&_tr:last-child_td:last-child]:rounded-br-ousi-2xl',
].join(' ')

export const tableRowTheme = cva(
  [
    'relative h-full group',
    'outline-none',
  ],
  {
    variants: {
      disabled: {
        true: 'opacity-[--ousi-disabled-opacity] pointer-events-none',
        false: '',
      },
      clickable: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: { disabled: false, clickable: false },
  },
)

export const tableCellTheme = cva(
  [
    'h-full px-4 py-3 align-middle text-sm text-ousi-foreground',
    'border-b border-ousi-separator/50',
    'outline-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface group-hover:bg-ousi-surface-secondary/60',
        secondary: 'bg-transparent group-hover:bg-ousi-default/50',
      },
      selected: {
        true: 'bg-ousi-accent-soft/20 group-hover:bg-ousi-accent-soft/30',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', selected: false },
  },
)

export const tableFooterTheme = 'flex items-center px-4 py-2.5'

export const tableColumnResizerTheme = [
  'absolute top-1/2 right-0 h-4 w-px -translate-y-1/2 rounded-sm',
  'bg-ousi-separator translate-x-1/2',
  'box-content cursor-col-resize touch-none px-2',
  'border-none bg-clip-content outline-none',
  'hover:h-full hover:w-0.5 hover:bg-ousi-accent',
  'data-[resizing=true]:h-full data-[resizing=true]:w-0.5 data-[resizing=true]:bg-ousi-accent',
].join(' ')

export const tableSortIndicatorTheme = 'ml-1.5 inline-flex size-3 text-ousi-muted shrink-0'

export const tableEmptyTheme = 'py-12 text-center text-sm text-ousi-muted'
