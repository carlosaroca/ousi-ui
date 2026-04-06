export interface CodeBlockProps {
  /** Source code string to display. */
  code: string
  /** Language hint (for future syntax highlighting integration). */
  lang?: string
  /** Show line numbers. Default: true. */
  showLineNumbers?: boolean
  /** Show a copy-to-clipboard button. Default: true. */
  showCopy?: boolean
  /** Whether the code is collapsible. Default: false. */
  collapsible?: boolean
  /** Max height in px when collapsed. Default: 88 (~3 lines). */
  collapsedHeight?: number
  /** Whether the code starts expanded. Default: false (collapsed if collapsible). */
  defaultExpanded?: boolean
  /** Label for the expand button. */
  expandLabel?: string
  /** Label for the collapse button. */
  collapseLabel?: string
  /** Filename or label shown in the header bar. */
  filename?: string
  /** Additional CSS classes. */
  class?: string
}
