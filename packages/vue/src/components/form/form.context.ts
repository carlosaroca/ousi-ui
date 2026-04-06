import { inject, provide, type Ref } from 'vue'

export interface FormContext {
  /** Server-side validation errors keyed by field name. */
  validationErrors: Ref<Record<string, string | string[]>>
}

const FORM_KEY = Symbol('ousi-form')

export function provideForm(ctx: FormContext) {
  provide(FORM_KEY, ctx)
}

export function useFormContext(): FormContext | undefined {
  return inject(FORM_KEY, undefined) as FormContext | undefined!
}
