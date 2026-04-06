import { inject, provide, type Ref, type ComputedRef } from 'vue'

export interface DisclosureGroupContext {
  expandedKeys: Ref<string[]>
  allowMultiple: ComputedRef<boolean>
  toggle: (key: string) => void
  isExpanded: (key: string) => boolean
}

const DISCLOSURE_GROUP_KEY = Symbol('ousi-disclosure-group')

export function provideDisclosureGroup(ctx: DisclosureGroupContext) {
  provide(DISCLOSURE_GROUP_KEY, ctx)
}

export function useDisclosureGroupContext(): DisclosureGroupContext | undefined {
  return inject<DisclosureGroupContext>(DISCLOSURE_GROUP_KEY, undefined)
}
