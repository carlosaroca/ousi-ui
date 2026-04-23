export type KbdKey =
  | 'command'
  | 'shift'
  | 'option'
  | 'alt'
  | 'ctrl'
  | 'control'
  | 'enter'
  | 'return'
  | 'delete'
  | 'backspace'
  | 'escape'
  | 'tab'
  | 'capslock'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'pageup'
  | 'pagedown'
  | 'home'
  | 'end'
  | 'space'
  | 'fn'
  | 'windows'

export type KbdVariant = 'default' | 'light'
export type KbdShadow = 'none' | 'xs' | 'sm'

export interface KbdProps {
  /** Special key(s) to display as symbols. */
  keys?: KbdKey | KbdKey[]
  /** Visual variant. */
  variant?: KbdVariant
  /** Elevation shadow. Defaults to 'none'. */
  shadow?: KbdShadow
  /** Additional CSS classes. */
  class?: string
}

export const KEY_SYMBOLS: Record<KbdKey, string> = {
  command: '⌘',
  shift: '⇧',
  option: '⌥',
  alt: '⌥',
  ctrl: '⌃',
  control: '⌃',
  enter: '↵',
  return: '↵',
  delete: '⌫',
  backspace: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
  space: 'Space',
  fn: 'fn',
  windows: '⊞',
}
