import { onMounted, ref, type Ref } from 'vue'

/**
 * Entrance animation state shared by the charts.
 * `mounted` flips to true one frame after mount (charts start collapsed and animate in).
 * `motion` is false when animation is disabled or the user prefers reduced motion.
 */
export function useChartMotion(animated: () => boolean): { mounted: Ref<boolean>; motion: Ref<boolean> } {
  const mounted = ref(false)
  const motion = ref(true)
  onMounted(() => {
    motion.value = animated() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!motion.value) {
      mounted.value = true
      return
    }
    requestAnimationFrame(() => requestAnimationFrame(() => { mounted.value = true }))
  })
  return { mounted, motion }
}
