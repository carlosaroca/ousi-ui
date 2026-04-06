export interface TimelineNavItem {
  /** Unique key for this item. */
  key: string
  /** Display label. */
  label: string
  /** Optional badge text (e.g. "Soon", "New"). Items with badges are non-interactive. */
  badge?: string
}

export interface TimelineNavSection {
  /** Section heading text. */
  title: string
  /** Items in this section. */
  items: TimelineNavItem[]
}

export interface TimelineNavProps {
  /** Sections with grouped items. */
  sections: TimelineNavSection[]
  /** Currently active item key (v-model). */
  modelValue?: string
  /** Default active key when uncontrolled. */
  defaultValue?: string
  /** Additional CSS classes. */
  class?: string
}

export interface TimelineNavEmits {
  'update:modelValue': [key: string]
  'select': [key: string]
}
