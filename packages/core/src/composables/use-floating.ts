import {
  useFloating as useFloatingUI,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
  type Middleware,
} from '@floating-ui/vue'
import { computed, type Ref } from 'vue'

export interface UseFloatingOptions {
  /** Reference element. */
  reference: Ref<HTMLElement | null>
  /** Floating element. */
  floating: Ref<HTMLElement | null>
  /** Placement of the floating element. */
  placement?: Placement
  /** Offset from the reference element in pixels. */
  offsetValue?: number
  /** Additional middleware. */
  middleware?: Middleware[]
  /** Whether the floating element is visible. */
  enabled?: Ref<boolean>
}

/**
 * Wraps @floating-ui/vue with sensible defaults for Oasi UI components.
 */
export function useFloating(options: UseFloatingOptions) {
  const {
    reference,
    floating,
    placement = 'bottom',
    offsetValue = 8,
    middleware: extraMiddleware = [],
    enabled,
  } = options

  const middlewareList = computed(() => [
    offset(offsetValue),
    flip(),
    shift({ padding: 8 }),
    ...extraMiddleware,
  ])

  const { floatingStyles, placement: resolvedPlacement, update } = useFloatingUI(
    reference,
    floating,
    {
      placement,
      middleware: middlewareList,
      whileElementsMounted: enabled?.value !== false ? autoUpdate : undefined,
    },
  )

  return {
    floatingStyles,
    placement: resolvedPlacement,
    update,
  }
}
