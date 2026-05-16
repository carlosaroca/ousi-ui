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
      shadow: {
        none: 'shadow-none',
        xs: 'shadow-ousi-xs',
        sm: 'shadow-ousi-sm',
        md: 'shadow-ousi-md',
      },
    },
    defaultVariants: { variant: 'primary', shadow: 'none' },
  },
)

export const tableScrollContainerTheme = cva(
  [
    'overflow-x-auto',
    // Hide native scrollbars on both axes — wheel/touch scroll still works.
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
  ],
  {
    variants: {
      stickyHeader: {
        true: 'max-h-[var(--ousi-table-max-height,30rem)] overflow-y-auto',
        false: '',
      },
    },
    defaultVariants: { stickyHeader: false },
  },
)

export const tableContentTheme = 'w-full border-separate border-spacing-0 text-sm'

export const tableHeaderTheme = cva(
  '',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface-secondary border-b border-ousi-separator/50',
        secondary: '',
      },
      sticky: {
        true: '[&_th]:sticky [&_th]:top-0 [&_th]:z-10',
        false: '',
      },
    },
    compoundVariants: [
      // Make sure the header bg shows through even when th is sticky in primary variant
      { variant: 'primary', sticky: true, class: '[&_th]:bg-ousi-surface-secondary' },
      { variant: 'secondary', sticky: true, class: '[&_th]:bg-ousi-surface' },
    ],
    defaultVariants: { variant: 'primary', sticky: false },
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
      // When multi-select is on, disable text selection on rows so shift+click
      // doesn't paint a text range across the table.
      selectable: {
        true: 'select-none',
        false: '',
      },
    },
    defaultVariants: { disabled: false, clickable: false, selectable: false },
  },
)

export const tableCellTheme = cva(
  [
    'h-full px-4 align-middle text-ousi-foreground',
    'border-b border-ousi-separator/50',
    'outline-none',
    // Visible focus ring when the cell is focused via keyboard nav
    'focus-visible:relative focus-visible:z-[1]',
    'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ousi-focus',
    'focus-visible:rounded-ousi-md',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface group-hover:bg-ousi-surface-secondary/60',
        secondary: 'bg-transparent group-hover:bg-ousi-default/50',
      },
      selected: {
        // Match the visual weight of an active checkbox cell — full accent-soft fill.
        true: '!bg-ousi-accent-soft/20 group-hover:!bg-ousi-accent-soft/40',
        false: '',
      },
      density: {
        compact: 'py-1.5 text-xs',
        normal:  'py-3 text-sm',
        relaxed: 'py-5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', selected: false, density: 'normal' },
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

/** Applied to any sticky column cell — keeps it opaque while non-sticky cells scroll behind. */
export const tableStickyCellTheme = cva(
  'sticky z-[2]',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface',
        secondary: 'bg-ousi-surface',
      },
      // The cell at the boundary between sticky and scrolling area gets a soft
      // shadow so the layering reads visually.
      edge: {
        // Subtle 1px crisp shadow on the boundary — communicates "this column is
        // pinned" without creating the perception of a gap between columns.
        left: 'shadow-[1px_0_0_0_hsl(var(--ousi-shadow-color)/0.10)]',
        right: 'shadow-[-1px_0_0_0_hsl(var(--ousi-shadow-color)/0.10)]',
        none: '',
      },
    },
    defaultVariants: { variant: 'primary', edge: 'none' },
  },
)

/** Same idea for sticky header cells — z-index above body sticky cells. */
export const tableStickyHeaderCellTheme = cva(
  'sticky z-[11]',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface-secondary',
        secondary: 'bg-ousi-default',
      },
      edge: {
        // Subtle 1px crisp shadow on the boundary — communicates "this column is
        // pinned" without creating the perception of a gap between columns.
        left: 'shadow-[1px_0_0_0_hsl(var(--ousi-shadow-color)/0.10)]',
        right: 'shadow-[-1px_0_0_0_hsl(var(--ousi-shadow-color)/0.10)]',
        none: '',
      },
    },
    defaultVariants: { variant: 'primary', edge: 'none' },
  },
)

/** Tiny numeric badge that shows the priority order of a multi-sort column. */
export const tableSortRankTheme = [
  'inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem]',
  'ml-1 px-1 rounded-full text-[10px] font-semibold',
  'bg-ousi-accent text-ousi-accent-foreground',
].join(' ')

/** Chevron button used in the expand toggle column. */
export const tableExpandToggleTheme = [
  'inline-flex size-6 items-center justify-center rounded-ousi-lg',
  'text-ousi-muted hover:text-ousi-foreground hover:bg-ousi-default/60',
  'outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus',
  'transition-transform duration-150',
].join(' ')

/** The full-width row that hosts the `#expanded-row` slot content. */
export const tableExpandedRowTheme = cva(
  '',
  {
    variants: {
      variant: {
        primary: 'bg-ousi-surface/60',
        secondary: 'bg-ousi-default/30',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export const tableEmptyTheme = 'py-12 text-center text-sm text-ousi-muted'
