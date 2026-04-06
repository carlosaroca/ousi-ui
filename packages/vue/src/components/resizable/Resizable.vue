<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@ousi-ui/core'
import type { ResizableProps, ResizableEmits } from './resizable.types'
import { resizableTheme, resizableHandleTheme, resizableHandleDotTheme } from './resizable.theme'

const props = withDefaults(defineProps<ResizableProps>(), {
  direction: 'horizontal',
  defaultSize: 50,
  minSize: 20,
  maxSize: 80,
})

const emit = defineEmits<ResizableEmits>()

const size = ref(props.defaultSize)

const isHorizontal = computed(() => props.direction === 'horizontal')

const containerClass = computed(() =>
  cn(resizableTheme, isHorizontal.value ? 'flex-row' : 'flex-col', props.class),
)

const handleClass = computed(() =>
  cn(
    resizableHandleTheme,
    isHorizontal.value ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize',
  ),
)

const dotClass = computed(() =>
  cn(resizableHandleDotTheme, isHorizontal.value ? 'h-1 w-1 my-0.5' : 'w-1 h-1 mx-0.5'),
)

const dotsContainerClass = computed(() =>
  cn('flex', isHorizontal.value ? 'flex-col' : 'flex-row'),
)

const firstPanelStyle = computed(() => {
  if (isHorizontal.value) {
    return { width: `${size.value}%`, flexShrink: 0 }
  }
  return { height: `${size.value}%`, flexShrink: 0 }
})

function onPointerDown(event: PointerEvent) {
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)

  const container = handle.parentElement
  if (!container) return

  const rect = container.getBoundingClientRect()

  function onPointerMove(e: PointerEvent) {
    let percentage: number

    if (isHorizontal.value) {
      percentage = ((e.clientX - rect.left) / rect.width) * 100
    } else {
      percentage = ((e.clientY - rect.top) / rect.height) * 100
    }

    percentage = Math.min(Math.max(percentage, props.minSize), props.maxSize)
    size.value = percentage
    emit('resize', percentage)
  }

  function onPointerUp() {
    handle.removeEventListener('pointermove', onPointerMove)
    handle.removeEventListener('pointerup', onPointerUp)
  }

  handle.addEventListener('pointermove', onPointerMove)
  handle.addEventListener('pointerup', onPointerUp)
}
</script>

<template>
  <div :class="containerClass">
    <div :style="firstPanelStyle" class="overflow-auto">
      <slot name="first" />
    </div>
    <div :class="handleClass" @pointerdown="onPointerDown">
      <div :class="dotsContainerClass">
        <div :class="dotClass" />
        <div :class="dotClass" />
        <div :class="dotClass" />
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <slot name="second" />
    </div>
  </div>
</template>
