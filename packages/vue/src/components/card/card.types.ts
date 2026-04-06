import type { Component } from 'vue'

export interface CardProps {
  /** Visual variant of the card. */
  variant?: 'transparent' | 'default' | 'secondary' | 'tertiary'
  /** Renders the card as a different element or component. */
  as?: string | Component
  /** Additional CSS classes (merged, never replaced). */
  class?: string
}

export interface CardSubProps {
  /** Renders the sub-component as a different element or component. */
  as?: string | Component
  /** Additional CSS classes (merged, never replaced). */
  class?: string
}
