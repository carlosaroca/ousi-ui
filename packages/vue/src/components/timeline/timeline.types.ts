export type TimelineAlign = 'left' | 'right' | 'alternate'
export type TimelineLayout = 'vertical' | 'horizontal'

export interface TimelineItem {
  /** Unique key. */
  key: string
  /** Content — rendered via slot or as text. */
  content?: string
  /** Opposite side content (for alternate layout). */
  opposite?: string
  /** Marker color. Uses design tokens. */
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'default'
  /** Custom icon name (rendered via #marker slot). */
  icon?: string
}

export interface TimelineProps {
  /** Timeline items. */
  items: TimelineItem[]
  /** Content alignment relative to the line. Default: 'left'. */
  align?: TimelineAlign
  /** Layout direction. Default: 'vertical'. */
  layout?: TimelineLayout
  /** Additional CSS classes. */
  class?: string
}
