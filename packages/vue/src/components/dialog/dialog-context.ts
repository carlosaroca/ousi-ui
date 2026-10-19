import type { InjectionKey, Ref } from 'vue'

export interface DialogContext {
  titleId: string
  scrollBehavior: Ref<'inside' | 'outside'>
  /** A header with a title calls this so the dialog points `aria-labelledby` at it. */
  registerTitle: () => () => void
}

export const DIALOG_CONTEXT: InjectionKey<DialogContext> = Symbol('ODialog')
