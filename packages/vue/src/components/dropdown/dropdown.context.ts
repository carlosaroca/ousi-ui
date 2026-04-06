import { inject, provide, type Ref, type ComputedRef } from 'vue'

interface DropdownContext {
  isOpen: Ref<boolean>
  triggerRef: Ref<HTMLElement | null>
  close: () => void
  toggle: () => void
}

const DROPDOWN_KEY = Symbol('ousi-dropdown')

export function provideDropdown(ctx: DropdownContext) {
  provide(DROPDOWN_KEY, ctx)
}

export function useDropdownContext(): DropdownContext {
  const ctx = inject<DropdownContext>(DROPDOWN_KEY)
  if (!ctx) throw new Error('useDropdownContext must be used within ODropdown')
  return ctx
}

interface MenuContext {
  selectionMode: ComputedRef<string>
  selectedKeys: ComputedRef<Set<string>>
  disabledKeys: ComputedRef<Set<string>>
  toggleSelection: (key: string) => void
  onAction: (key: string) => void
}

const MENU_KEY = Symbol('ousi-dropdown-menu')

export function provideMenu(ctx: MenuContext) {
  provide(MENU_KEY, ctx)
}

export function useMenuContext(): MenuContext | undefined {
  return inject(MENU_KEY, undefined) as MenuContext | undefined!
}

// Item context — so ItemIndicator knows if its parent item is selected
interface ItemContext {
  isSelected: ComputedRef<boolean>
}

const ITEM_KEY = Symbol('ousi-dropdown-item')

export function provideItem(ctx: ItemContext) {
  provide(ITEM_KEY, ctx)
}

export function useItemContext(): ItemContext | undefined {
  return inject(ITEM_KEY, undefined) as ItemContext | undefined!
}
