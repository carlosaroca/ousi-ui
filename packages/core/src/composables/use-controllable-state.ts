import { ref, computed, watch, type Ref } from 'vue'

export interface UseControllableStateOptions<T> {
  /** The controlled value (from v-model / prop). `undefined` means uncontrolled. */
  prop: Ref<T | undefined>
  /** Default value when uncontrolled. */
  defaultValue: T
  /** Callback when value changes (emits update). */
  onChange?: (value: T) => void
}

/**
 * Manages controlled vs uncontrolled state.
 * When `prop` is defined, the component is controlled.
 * When `prop` is undefined, internal state is used with `defaultValue`.
 */
export function useControllableState<T>(options: UseControllableStateOptions<T>) {
  const { prop, defaultValue, onChange } = options
  const internalValue = ref<T>(defaultValue) as Ref<T>

  const isControlled = computed(() => prop.value !== undefined)

  const value = computed({
    get() {
      return isControlled.value ? prop.value! : internalValue.value
    },
    set(newValue: T) {
      if (isControlled.value) {
        onChange?.(newValue)
      } else {
        internalValue.value = newValue
        onChange?.(newValue)
      }
    },
  })

  watch(
    () => prop.value,
    (newProp) => {
      if (newProp !== undefined) {
        internalValue.value = newProp
      }
    },
  )

  return value
}
