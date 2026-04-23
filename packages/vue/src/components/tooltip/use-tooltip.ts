import { ref, computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import {
  useFloating,
  autoUpdate,
  offset as offsetMiddleware,
  flip,
  shift,
  arrow,
  type Placement,
} from '@floating-ui/vue'
import type { TooltipShadow } from './tooltip.types'

/** Plain tooltip config — static values, no refs/getters. */
export interface TooltipConfig {
  content: string
  placement?: Placement
  offset?: number
  showArrow?: boolean
  delay?: number
  closeDelay?: number
  disabled?: boolean
  shadow?: TooltipShadow
  class?: string
}

/** Options for `useTooltip` — each field may be a plain value, a ref, or a getter. */
export interface UseTooltipOptions {
  content: MaybeRefOrGetter<string>
  placement?: MaybeRefOrGetter<Placement | undefined>
  offset?: MaybeRefOrGetter<number | undefined>
  showArrow?: MaybeRefOrGetter<boolean | undefined>
  delay?: MaybeRefOrGetter<number | undefined>
  closeDelay?: MaybeRefOrGetter<number | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  shadow?: MaybeRefOrGetter<TooltipShadow | undefined>
  class?: MaybeRefOrGetter<string | undefined>
}

/**
 * Headless tooltip logic — floating-ui positioning, show/hide with delays,
 * arrow placement, and enter-animation geometry. Consumed by both the
 * `<OTooltip>` component and the `v-tooltip` directive.
 *
 * The caller is responsible for rendering the floating panel and wiring up
 * the trigger's event listeners (mouseenter/leave/focus/blur/keydown).
 */
export function useTooltip(
  anchorRef: Ref<HTMLElement | null>,
  options: UseTooltipOptions,
) {
  const floatingRef = ref<HTMLElement | null>(null)
  const arrowRef = ref<HTMLElement | null>(null)
  const isOpen = ref(false)

  const placement = computed<Placement>(() => toValue(options.placement) ?? 'top')
  const offsetValue = computed(() => toValue(options.offset) ?? 8)
  const showArrow = computed(() => toValue(options.showArrow) ?? true)
  const delay = computed(() => toValue(options.delay) ?? 200)
  const closeDelay = computed(() => toValue(options.closeDelay) ?? 150)
  const disabled = computed(() => toValue(options.disabled) ?? false)
  const shadow = computed<TooltipShadow>(() => toValue(options.shadow) ?? 'md')
  const content = computed(() => toValue(options.content))
  const className = computed(() => toValue(options.class))

  const middleware = computed(() => {
    const mw = [
      offsetMiddleware(showArrow.value ? offsetValue.value + 4 : offsetValue.value),
      flip(),
      shift({ padding: 8 }),
    ]
    if (showArrow.value) mw.push(arrow({ element: arrowRef }))
    return mw
  })

  const { floatingStyles, placement: currentPlacement, middlewareData } = useFloating(
    anchorRef,
    floatingRef,
    {
      placement,
      strategy: 'fixed',
      whileElementsMounted: autoUpdate,
      middleware,
    },
  )

  let openTimeout: ReturnType<typeof setTimeout> | null = null
  let closeTimeout: ReturnType<typeof setTimeout> | null = null

  function clearTimeouts() {
    if (openTimeout) { clearTimeout(openTimeout); openTimeout = null }
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null }
  }

  function show() {
    if (disabled.value) return
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null }
    openTimeout = setTimeout(() => { isOpen.value = true }, delay.value)
  }

  function hide() {
    if (openTimeout) { clearTimeout(openTimeout); openTimeout = null }
    closeTimeout = setTimeout(() => { isOpen.value = false }, closeDelay.value)
  }

  function showImmediate() {
    if (disabled.value) return
    clearTimeouts()
    isOpen.value = true
  }

  function hideImmediate() {
    clearTimeouts()
    isOpen.value = false
  }

  const basePlacement = computed(() =>
    (currentPlacement.value?.split('-')[0]) ?? 'top',
  )

  const enterAnimation = computed(() => {
    const map: Record<string, object> = {
      top:    { opacity: 0, scale: 0.9, y: 4 },
      bottom: { opacity: 0, scale: 0.9, y: -4 },
      left:   { opacity: 0, scale: 0.9, x: 4 },
      right:  { opacity: 0, scale: 0.9, x: -4 },
    }
    return map[basePlacement.value] ?? map.top
  })

  const arrowStaticSide = computed(() =>
    ({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' })[basePlacement.value] ?? 'bottom',
  )

  const arrowStyles = computed(() => {
    const data = middlewareData.value.arrow
    if (!data) return {}
    const s: Record<string, string> = {}
    if (data.x != null) s.left = `${data.x}px`
    if (data.y != null) s.top = `${data.y}px`
    s[arrowStaticSide.value] = '-4px'
    return s
  })

  return {
    // state
    isOpen,
    // refs (consumer binds these in its template / rendering)
    floatingRef,
    arrowRef,
    // resolved options
    content,
    shadow,
    showArrow,
    className,
    // positioning
    floatingStyles,
    enterAnimation,
    arrowStyles,
    // handlers
    show,
    hide,
    showImmediate,
    hideImmediate,
  }
}
