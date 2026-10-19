import { computed, useAttrs } from 'vue'

const isListener = (key: string) => /^on[^a-z]/.test(key)

/**
 * Splits the fallthrough attributes of a field component (declared with `inheritAttrs: false`).
 * `class`, `style` and listeners stay on the root wrapper, as before: the control's events bubble
 * to it, so @keydown or @paste work as on the input and @click covers the whole field. Every other
 * attribute goes to the native control: aria-*, data-*, name, autocomplete, inputmode,
 * enterkeyhint, autofocus, spellcheck, pattern... Bind `controlAttrs` after the defaults a passed
 * attribute may replace (aria-label, inputmode, autocomplete) and before the state the field owns
 * (value, role, aria-expanded). A passed `id` replaces the generated one, so the label follows it,
 * and a passed `aria-describedby` is joined to the field's own description or error.
 */
export function useFieldAttrs(generatedId: string, ownDescribedBy?: () => string | undefined) {
  const attrs = useAttrs()

  const rootAttrs = computed(() => {
    const out: Record<string, unknown> = { class: attrs.class, style: attrs.style }
    for (const key in attrs) if (isListener(key)) out[key] = attrs[key]
    return out
  })

  const controlAttrs = computed(() => {
    const out: Record<string, unknown> = {}
    for (const key in attrs) {
      if (key === 'class' || key === 'style' || key === 'id' || key === 'aria-describedby') continue
      if (!isListener(key)) out[key] = attrs[key]
    }
    return out
  })

  const controlId = computed(() => (attrs.id as string | undefined) || generatedId)

  const describedBy = computed(() => {
    const ids = [ownDescribedBy?.(), attrs['aria-describedby'] as string | undefined]
    return ids.filter(Boolean).join(' ') || undefined
  })

  return { attrs, rootAttrs, controlAttrs, controlId, describedBy }
}

type MaybeElement = HTMLElement | null | undefined

/**
 * `focus()` and `blur()` for a field's `defineExpose`. `control` is the element that takes focus;
 * `container`, when given, is where blur looks for the focused element (segmented fields).
 */
export function fieldFocus(control: () => MaybeElement, container?: () => MaybeElement) {
  return {
    focus(options?: FocusOptions) {
      control()?.focus(options)
    },
    blur() {
      const box = container ? container() : control()
      const active = box?.ownerDocument.activeElement
      if (active instanceof HTMLElement && box?.contains(active)) active.blur()
    },
  }
}

/** First editable segment of a segmented date or time field. */
export function firstSegment(container: MaybeElement): HTMLElement | null {
  return container?.querySelector<HTMLElement>('[role="spinbutton"]:not([tabindex="-1"])') ?? null
}
