import { computed, ref, type ComputedRef } from 'vue'

/**
 * Focus state that works controlled and uncontrolled.
 * With `v-model:focused` (or `:focused`) the parent owns the value; without it the chart keeps
 * its own, so hover reactions and tooltips work out of the box.
 */
export function useFocus<T>(
  prop: () => T | null | undefined,
  emit: (value: T | null) => void,
): { focused: ComputedRef<T | null>; setFocused: (value: T | null) => void } {
  const inner = ref<T | null>(null)
  const focused = computed<T | null>(() => {
    const p = prop()
    return p !== undefined ? p : (inner.value as T | null)
  })
  function setFocused(value: T | null) {
    inner.value = value
    emit(value)
  }
  return { focused, setFocused }
}
