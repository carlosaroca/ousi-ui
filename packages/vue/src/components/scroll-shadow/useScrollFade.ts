import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import type { ScrollShadowOrientation } from './scroll-shadow.types'

export interface ScrollFadeOptions {
  orientation: () => ScrollShadowOrientation
  /** Fade size in px. */
  size: () => number
  /** Scroll offset before activating the fade. */
  offset?: () => number
  /** Turn the fade off without removing the listeners. */
  enabled?: () => boolean
}

/**
 * Edge fade for a scrolling element: a CSS mask that fades the side(s) that still have content
 * beyond them. Used by OScrollShadow and by OTabs, so both look and behave the same.
 * Returns the style to bind on the scrolling element.
 */
export function useScrollFade(el: Ref<HTMLElement | null>, opts: ScrollFadeOptions) {
  const top = ref(false)
  const bottom = ref(false)
  const left = ref(false)
  const right = ref(false)

  function update() {
    const node = el.value
    if (!node) return
    const o = opts.offset?.() ?? 0
    const orientation = opts.orientation()
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = node
    if (orientation === 'vertical' || orientation === 'both') {
      top.value = scrollTop > o
      bottom.value = scrollTop < scrollHeight - clientHeight - o
    }
    if (orientation === 'horizontal' || orientation === 'both') {
      left.value = scrollLeft > o
      right.value = scrollLeft < scrollWidth - clientWidth - o
    }
  }

  const maskStyle = computed<Record<string, string>>(() => {
    if (opts.enabled && !opts.enabled()) return {}
    const s = opts.size()
    const orientation = opts.orientation()
    const isV = orientation === 'vertical' || orientation === 'both'
    const isH = orientation === 'horizontal' || orientation === 'both'
    const t = isV && top.value
    const b = isV && bottom.value
    const l = isH && left.value
    const r = isH && right.value
    if (!t && !b && !l && !r) return {}

    const masks: string[] = []
    if (isV) {
      if (t && b) masks.push(`linear-gradient(to bottom, transparent, #000 ${s}px, #000 calc(100% - ${s}px), transparent)`)
      else if (t) masks.push(`linear-gradient(to bottom, transparent, #000 ${s}px)`)
      else if (b) masks.push(`linear-gradient(to bottom, #000 calc(100% - ${s}px), transparent)`)
    }
    if (isH) {
      if (l && r) masks.push(`linear-gradient(to right, transparent, #000 ${s}px, #000 calc(100% - ${s}px), transparent)`)
      else if (l) masks.push(`linear-gradient(to right, transparent, #000 ${s}px)`)
      else if (r) masks.push(`linear-gradient(to right, #000 calc(100% - ${s}px), transparent)`)
    }
    if (!masks.length) return {}

    const maskImage = masks.join(', ')
    return {
      maskImage,
      WebkitMaskImage: maskImage,
      ...(masks.length > 1 ? { maskComposite: 'intersect', WebkitMaskComposite: 'source-in' } : {}),
    }
  })

  let observer: ResizeObserver | null = null
  onMounted(() => {
    const node = el.value
    if (!node) return
    update()
    node.addEventListener('scroll', update, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      observer.observe(node)
    }
  })
  onBeforeUnmount(() => {
    el.value?.removeEventListener('scroll', update)
    observer?.disconnect()
  })

  return { maskStyle, update }
}
