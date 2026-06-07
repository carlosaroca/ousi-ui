import type { Component, Ref } from 'vue'

export type ContextMenuShadow = 'sm' | 'md' | 'lg' | 'xl'

export interface ContextMenuItem {
  /** Item key — emitted on `select`. Falls back to `label` if not provided. */
  key?: string
  /** Visible label. Required unless `separator: true`. */
  label?: string
  /** Icon — string (treated as a CSS class), a Vue component, or anything renderable.
   *  For full control (e.g. Hugeicons array format), use the per-item `#icon` slot. */
  icon?: string | Component | any
  /** Right-aligned keyboard shortcut hint (e.g. '⌘C'). Hidden when the item has children. */
  shortcut?: string
  /** Disable the item — not focusable, not selectable. */
  disabled?: boolean
  /** Render label in danger color. */
  danger?: boolean
  /** Render as a horizontal separator line. Other fields are ignored. */
  separator?: boolean
  /** Render as a section heading — uppercase muted text, non-interactive, skipped in keyboard nav. */
  heading?: boolean
  /** Keep the menu open after selecting this item. Useful for toggles (column visibility, etc.). */
  keepOpen?: boolean
  /** Nested submenu items. When present, the item opens a submenu instead of being selected. */
  children?: ContextMenuItem[]
}

export interface ContextMenuProps {
  /** Items to render in the menu. */
  items: ContextMenuItem[]
  /** Disable right-click activation on the trigger slot. */
  disabled?: boolean
  /** Elevation shadow. Defaults to 'lg'. */
  shadow?: ContextMenuShadow
  /** Pixel gap between a parent item and its open submenu. Defaults to 4. */
  submenuOffset?: number
  /** Additional CSS classes on the menu surface. */
  class?: string
}

export interface ContextMenuEmits {
  /** Fired when a leaf item is selected. */
  'select': [key: string, item: ContextMenuItem]
  /** Fired when the menu opens. */
  'open': []
  /** Fired when the menu closes. */
  'close': []
}

/** Exposed imperative methods on OContextMenu (via template ref). */
export interface ContextMenuExposed {
  /** Open the menu programmatically. Accepts a MouseEvent (uses clientX/clientY)
   *  or a coordinate pair. Calling without args opens at (0, 0). */
  show: (input?: MouseEvent | { x: number; y: number }) => void
  /** Close the menu programmatically. */
  hide: () => void
  /** Reactive open state. */
  isOpen: Ref<boolean>
}
