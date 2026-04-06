export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Backspace: 'Backspace',
  Delete: 'Delete',
} as const

export type Key = (typeof Keys)[keyof typeof Keys]

export function isKey(event: KeyboardEvent, key: Key): boolean {
  return event.key === key
}

export function isModified(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey
}
