<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { AnimatePresence, Motion } from 'motion-v'
import { useMounted } from '@ousi-ui/core'
import { toastStore } from './toast.store'
import { removeToast } from './toast'
import { toastRegionTheme } from './toast.theme'
import ToastItemVue from './ToastItem.vue'
import type { ToastProviderProps } from './toast.types'

const props = withDefaults(defineProps<ToastProviderProps>(), {
  placement: 'bottom-end',
  maxVisible: 5,
  shadow: 'lg',
})

// Inherit theme from nearest [data-theme] ancestor so teleported toasts
// render with the correct color scheme
const currentTheme = ref<string | null>(null)
let themeObserver: MutationObserver | null = null

onMounted(() => {
  const el = document.querySelector('[data-theme]')
  if (el) {
    currentTheme.value = el.getAttribute('data-theme')
    themeObserver = new MutationObserver(() => {
      currentTheme.value = el.getAttribute('data-theme')
    })
    themeObserver.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
  }
})

onBeforeUnmount(() => themeObserver?.disconnect())

const isMounted = useMounted()

const visibleToasts = computed(() =>
  toastStore.value.slice(0, props.maxVisible),
)

const isBottom = computed(() => props.placement.startsWith('bottom'))

// Slide direction based on placement
const enterAnim = computed(() => {
  const p = props.placement
  if (p === 'bottom-end' || p === 'top-end') return { opacity: 0, x: 60 }
  if (p === 'bottom-start' || p === 'top-start') return { opacity: 0, x: -60 }
  // center placements slide from bottom/top
  return isBottom.value ? { opacity: 0, y: 40 } : { opacity: 0, y: -40 }
})

const exitAnim = computed(() => {
  const p = props.placement
  if (p === 'bottom-end' || p === 'top-end') return { opacity: 0, x: 60 }
  if (p === 'bottom-start' || p === 'top-start') return { opacity: 0, x: -60 }
  return isBottom.value ? { opacity: 0, y: 40 } : { opacity: 0, y: -40 }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isMounted"
      :class="toastRegionTheme({ placement })"
      :data-theme="currentTheme"
      role="region"
      aria-label="Notifications"
    >
      <!-- Stack container — relative so toasts can overlap -->
      <div class="relative flex items-end justify-end" style="min-height: 60px">
        <AnimatePresence>
          <Motion
            v-for="(item, index) in visibleToasts"
            :key="item.id"
            tag="div"
            class="w-full overflow-visible"
            :class="index === 0 ? 'relative z-30' : 'absolute inset-x-0'"
            :style="index > 0 ? {
              zIndex: 30 - index,
              [isBottom ? 'bottom' : 'top']: `${index * 10}px`,
              transform: `scaleX(${1 - index * 0.05})`,
              opacity: `${Math.max(0.2, 1 - index * 0.3)}`,
              pointerEvents: 'none',
            } : {}"
            :initial="enterAnim"
            :animate="{ opacity: 1, x: 0, y: 0 }"
            :exit="exitAnim"
            :transition="{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }"
          >
            <ToastItemVue
              :item="item"
              :is-frontmost="index === 0"
              :shadow="shadow"
              @close="removeToast"
            />
          </Motion>
        </AnimatePresence>
      </div>
    </div>
  </Teleport>
</template>
