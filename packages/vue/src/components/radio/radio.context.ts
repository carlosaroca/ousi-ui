import { inject, provide, type Ref, type ComputedRef } from 'vue'

interface RadioGroupContext {
  selectedValue: Ref<string> | ComputedRef<string>
  disabled: ComputedRef<boolean>
  isInvalid: ComputedRef<boolean>
  select: (value: string) => void
}

const RADIO_GROUP_KEY = Symbol('ousi-radio-group')

export function provideRadioGroup(ctx: RadioGroupContext) {
  provide(RADIO_GROUP_KEY, ctx)
}

export function useRadioGroupContext(): RadioGroupContext | undefined {
  return inject(RADIO_GROUP_KEY, undefined) as RadioGroupContext | undefined
}
