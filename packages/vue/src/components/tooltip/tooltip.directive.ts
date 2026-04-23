import { h, render, reactive, type ObjectDirective } from 'vue'
import type { Placement } from '@floating-ui/vue'
import TooltipRenderer from './TooltipRenderer.vue'
import type { TooltipConfig } from './use-tooltip'
import type { TooltipShadow } from './tooltip.types'

/**
 * v-tooltip — attach a tooltip to any element without a wrapper.
 *
 * Usage:
 *   v-tooltip="'Text'"
 *   v-tooltip.bottom="'Text'"
 *   v-tooltip="{ content: 'Text', delay: 500, shadow: 'lg' }"
 *   v-tooltip.top-end="{ content: 'Text', showArrow: false }"
 */

export type TooltipDirectiveBinding = string | TooltipConfig

const PLACEMENTS: ReadonlySet<string> = new Set([
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
])

interface ElementState {
  container: HTMLDivElement
  options: TooltipConfig
}

// Keyed by the element the directive is bound to.
const STATE = new WeakMap<HTMLElement, ElementState>()

function normalize(
  value: TooltipDirectiveBinding | undefined,
  modifiers: Record<string, boolean | undefined>,
): TooltipConfig {
  const base: TooltipConfig = typeof value === 'string'
    ? { content: value }
    : { ...(value ?? { content: '' }) }

  // Placement modifier takes precedence over an explicit placement in the value.
  for (const key of Object.keys(modifiers)) {
    if (PLACEMENTS.has(key)) {
      base.placement = key as Placement
      break
    }
  }

  return base
}

export const vTooltip: ObjectDirective<HTMLElement, TooltipDirectiveBinding | undefined> = {
  mounted(el, binding) {
    const options = reactive(normalize(binding.value, binding.modifiers)) as TooltipConfig
    const container = document.createElement('div')
    document.body.appendChild(container)

    render(h(TooltipRenderer, { anchor: el, options }), container)

    STATE.set(el, { container, options })
  },

  updated(el, binding) {
    const state = STATE.get(el)
    if (!state) return
    const next = normalize(binding.value, binding.modifiers)

    // Drop keys no longer present, then merge the new values.
    const current = state.options as unknown as Record<string, unknown>
    const nextRec = next as unknown as Record<string, unknown>
    for (const key of Object.keys(current)) {
      if (!(key in nextRec)) delete current[key]
    }
    Object.assign(current, nextRec)
  },

  unmounted(el) {
    const state = STATE.get(el)
    if (!state) return
    render(null, state.container)
    state.container.remove()
    STATE.delete(el)
  },
}

// Exported aliases so users can import either name.
export { vTooltip as tooltipDirective }
export type { TooltipShadow }
