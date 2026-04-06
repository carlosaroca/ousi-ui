import { ref, readonly, onMounted, type Ref } from 'vue'

/**
 * SSR-safe guard. Returns a readonly ref that becomes `true` after mount.
 * Use this to gate browser-only APIs.
 */
export function useMounted(): Readonly<Ref<boolean>> {
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  return readonly(mounted)
}
