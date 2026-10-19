import {
  computed,
  getCurrentScope,
  onScopeDispose,
  readonly,
  ref,
  shallowReactive,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { isBrowser } from '../utils/dom'
import { Keys } from '../utils/keyboard'

/** z-index of the first open layer's backdrop. Its panel sits one above, and every layer that
 *  opens later takes the next two values. */
export const LAYER_BASE_Z_INDEX = 50
/** Tooltips sit above every layer. */
export const TOOLTIP_Z_INDEX = 1000

type MaybeElement = Element | null | undefined

export interface UseLayerOptions {
  /** The layer's own DOM, usually its teleported root. A pointerdown inside it is inside this
   *  layer and every layer below it. */
  elements?: MaybeRefOrGetter<MaybeElement | ReadonlyArray<MaybeElement>>
  /** The element that toggles the layer. A pointerdown on it is not outside, so its own click
   *  can close the layer. */
  trigger?: MaybeRefOrGetter<MaybeElement>
  /** Runs on Escape while this is the top-most layer. The top-most layer always takes Escape, so
   *  the layers below it stay open. */
  onEscape?: (event: KeyboardEvent) => void
  /** Runs on a pointerdown outside this layer, its trigger and every layer opened above it. */
  onPointerDownOutside?: (event: PointerEvent) => void
  /** Dialogs and drawers. The focus trap of a layer below a modal layer pauses. */
  modal?: boolean
  /** When the layer closes while it holds focus, return focus to where it was when it opened.
   *  Defaults to true. */
  restoreFocus?: boolean
  /** Tooltips take a z-index above every layer and no part in Escape, outside presses or focus. */
  tooltip?: boolean
}

export interface UseLayerReturn {
  /** z-index for the layer's panel. */
  zIndex: Readonly<Ref<number>>
  /** z-index for the layer's backdrop, right below its panel. */
  backdropZIndex: Readonly<Ref<number>>
  /** Whether this is the top-most open layer. */
  isTop: Readonly<Ref<boolean>>
}

interface FocusReturn {
  el: HTMLElement
  owner: Layer | null
}

/** @internal */
export interface Layer {
  /** Null for entries that only take Escape. */
  z: number | null
  modal: boolean
  elements: () => Element[]
  trigger: () => Element | null
  onEscape?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerEvent) => void
  restoreFocus: boolean
  returnFocus: FocusReturn[]
}

interface LayerState {
  layers: Layer[]
  listening: boolean
}

// Shared through globalThis so an app that imports @ousi-ui/core next to the copy bundled in
// @ousi-ui/vue still has a single stack.
const STATE_KEY = Symbol.for('ousi-ui.layers')

function getState(): LayerState {
  const store = globalThis as unknown as Record<symbol, LayerState | undefined>
  return (store[STATE_KEY] ??= { layers: shallowReactive<Layer[]>([]), listening: false })
}

function toElements(value: MaybeElement | ReadonlyArray<MaybeElement>): Element[] {
  const list = Array.isArray(value) ? value : [value]
  return list.filter((el): el is Element => el instanceof Element)
}

function layerContains(layer: Layer, node: Node): boolean {
  return layer.elements().some((el) => el.contains(node))
}

/** @internal The top-most open layer whose DOM contains the node. */
export function getLayerContaining(node: Node | null | undefined): Layer | null {
  if (!node) return null
  const { layers } = getState()
  for (let i = layers.length - 1; i >= 0; i--) {
    if (layerContains(layers[i], node)) return layers[i]
  }
  return null
}

/** @internal The layers opened above the given one, bottom to top. */
export function getLayersAbove(layer: Layer): Layer[] {
  const { layers } = getState()
  const index = layers.indexOf(layer)
  return index === -1 ? [] : layers.slice(index + 1)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== Keys.Escape || event.defaultPrevented || event.isComposing) return
  const { layers } = getState()
  const top = layers[layers.length - 1]
  if (!top) return
  event.preventDefault()
  event.stopPropagation()
  top.onEscape?.(event)
}

function handlePointerDown(event: PointerEvent) {
  const { layers } = getState()
  if (layers.length === 0) return
  const target = (event.composedPath?.()[0] ?? event.target) as Node | null
  if (!(target instanceof Node)) return
  const snapshot = layers.slice()
  for (let i = snapshot.length - 1; i >= 0; i--) {
    const layer = snapshot[i]
    if (!layer.onPointerDownOutside || !layers.includes(layer)) continue
    if (layer.trigger()?.contains(target)) continue
    if (snapshot.slice(i).some((l) => layerContains(l, target))) continue
    layer.onPointerDownOutside(event)
  }
}

function listen(state: LayerState) {
  if (state.listening) return
  state.listening = true
  // Escape is taken in the bubble phase, so a widget inside a layer can keep it by stopping it.
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('pointerdown', handlePointerDown, true)
}

function push(layer: Layer) {
  if (!isBrowser()) return
  const state = getState()
  if (state.layers.includes(layer)) return
  listen(state)

  if (layer.z !== null) {
    let top = LAYER_BASE_Z_INDEX - 1
    for (const l of state.layers) if (l.z !== null && l.z > top) top = l.z
    layer.z = top + 2
  }

  const active = document.activeElement
  if (layer.restoreFocus && active instanceof HTMLElement && active !== document.body) {
    const owner = getLayerContaining(active)
    layer.returnFocus = [{ el: active, owner }, ...(owner?.returnFocus ?? [])]
  } else {
    layer.returnFocus = []
  }

  state.layers.push(layer)
}

function remove(layer: Layer) {
  const { layers } = getState()
  const index = layers.indexOf(layer)
  if (index === -1) return
  layers.splice(index, 1)
  const returnFocus = layer.returnFocus
  layer.returnFocus = []

  const active = document.activeElement
  if (!layer.restoreFocus || !active || !layerContains(layer, active)) return
  const target = returnFocus.find(
    ({ el, owner }) =>
      el.isConnected && (!owner || layers.includes(owner)) && !layerContains(layer, el),
  )
  target?.el.focus({ preventScroll: true })
}

/** @internal Keeps an entry on the stack while `open` is true. */
export function useLayerEntry(open: MaybeRefOrGetter<boolean>, layer: Layer, onPush?: () => void) {
  watch(
    () => !!toValue(open),
    (isOpen) => {
      if (isOpen) {
        push(layer)
        onPush?.()
      } else {
        remove(layer)
      }
    },
    { immediate: true, flush: 'sync' },
  )
  if (getCurrentScope()) onScopeDispose(() => remove(layer))
}

/**
 * Puts an overlay on the shared layer stack while `open` is true. A layer joins the top when it
 * opens, so the order overlays open in decides how they stack, whatever order they mounted in.
 * Only the top-most layer takes Escape, and a pointerdown inside a layer opened above another one
 * is not outside the lower one.
 */
export function useLayer(
  open: MaybeRefOrGetter<boolean>,
  options: UseLayerOptions = {},
): UseLayerReturn {
  if (options.tooltip) {
    const zIndex = readonly(ref(TOOLTIP_Z_INDEX))
    return { zIndex, backdropZIndex: zIndex, isTop: computed(() => false) }
  }

  const z = ref(LAYER_BASE_Z_INDEX + 1)
  const layer: Layer = {
    z: z.value,
    modal: options.modal ?? false,
    elements: () => toElements(toValue(options.elements)),
    trigger: () => toValue(options.trigger) ?? null,
    onEscape: options.onEscape,
    onPointerDownOutside: options.onPointerDownOutside,
    restoreFocus: options.restoreFocus ?? true,
    returnFocus: [],
  }

  useLayerEntry(open, layer, () => {
    z.value = layer.z!
  })

  const state = getState()
  return {
    zIndex: readonly(z),
    backdropZIndex: computed(() => z.value - 1),
    isTop: computed(() => state.layers[state.layers.length - 1] === layer),
  }
}
