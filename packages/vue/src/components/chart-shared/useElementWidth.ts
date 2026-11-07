import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Tracks the width of an element (fluid charts). */
export function useElementWidth(target: Ref<HTMLElement | null>, fallback = 640): Ref<number> {
  const width = ref(fallback)
  let observer: ResizeObserver | null = null
  onMounted(() => {
    const el = target.value
    if (!el) return
    width.value = el.clientWidth || fallback
    observer = new ResizeObserver(([entry]) => { width.value = entry.contentRect.width || width.value })
    observer.observe(el)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return width
}
