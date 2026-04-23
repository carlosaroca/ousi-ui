export interface AccordionItem {
  /** Unique key. */
  key: string
  /** Title text. */
  title: string
  /** Description shown when expanded. */
  description?: string
}

export type AccordionShadow = 'none' | 'xs' | 'sm' | 'md' | 'lg'

export interface AccordionProps {
  /** Accordion items. */
  items: AccordionItem[]
  /** Currently expanded key (v-model). */
  modelValue?: string | null
  /** Default expanded key. */
  defaultValue?: string | null
  /** Gap size in px when an item separates. Default: 10. */
  gap?: number
  /** Show separator lines between collapsed items. Default: true. */
  showDividers?: boolean
  /** Visual variant. Default: 'primary'. */
  variant?: 'primary' | 'secondary'
  /** Elevation shadow on the outer wrapper. Defaults to 'none'. */
  shadow?: AccordionShadow
  /** Additional CSS classes. */
  class?: string
}

export interface AccordionEmits {
  'update:modelValue': [key: string | null]
  'change': [key: string | null]
}
