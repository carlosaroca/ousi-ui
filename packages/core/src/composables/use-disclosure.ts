import { type Ref } from 'vue'
import { useControllableState } from './use-controllable-state'

export interface UseDisclosureOptions {
  /** Controlled open state (v-model). */
  modelValue?: Ref<boolean | undefined>
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean
  /** Callback on open/close change. */
  onChange?: (isOpen: boolean) => void
}

export function useDisclosure(options: UseDisclosureOptions = {}) {
  const { modelValue, defaultOpen = false, onChange } = options

  const isOpen = useControllableState({
    prop: modelValue ?? { value: undefined } as Ref<boolean | undefined>,
    defaultValue: defaultOpen,
    onChange,
  })

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
