export interface PropDef {
  name: string
  type: string
  default?: string
  description: string
}

export interface KeyboardDef {
  key: string
  description: string
}

export interface AriaDef {
  attribute: string
  condition: string
  description: string
}

export interface ExampleDef {
  /** Matches a component in components/examples/ — e.g. 'ButtonVariants' */
  component: string
  /** Source code shown in the code block */
  code: string
}

export interface SectionDef {
  id: string
  title: string
  example: ExampleDef
}

export interface ComponentData {
  /** Display name */
  title: string
  /** Short description */
  description: string
  /** Category shown as chip */
  category: string
  /** Import statement */
  importCode: string
  /** Sections with live examples */
  sections: SectionDef[]
  /** Props for the API tab */
  props: PropDef[]
  /** Slots for the API tab */
  slots?: PropDef[]
  /** Emits for the API tab */
  emits?: PropDef[]
  /** Methods exposed via `defineExpose` — accessed through a template ref. */
  methods?: PropDef[]
  /** Theme import info */
  themeCode?: string
  /** Keyboard interactions for accessibility tab */
  keyboard?: KeyboardDef[]
  /** ARIA attributes for accessibility tab */
  aria?: AriaDef[]
  /** Best practices for accessibility tab */
  bestPractices?: { text: string; good: boolean }[]
  /** Haptic feedback info — shown in a dedicated section */
  haptics?: {
    /** Default preset for this component */
    defaultPreset: string
    /** When the haptic fires */
    trigger: string
    /** Extra notes */
    notes?: string
  }
}
