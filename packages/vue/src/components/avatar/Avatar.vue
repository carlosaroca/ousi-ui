<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { cn, useMounted } from '@ousi-ui/core'
import { avatarTheme } from './avatar.theme'
import type { AvatarProps } from './avatar.types'

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
  shadow: 'none',
  alt: '',
})

const id = useId()
const isMounted = useMounted()

const imageStatus = ref<'loading' | 'loaded' | 'error'>(
  props.src ? 'loading' : 'error',
)

function onImageLoad() {
  imageStatus.value = 'loaded'
}

function onImageError() {
  imageStatus.value = 'error'
}

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
})

const showImage = computed(() => props.src && imageStatus.value !== 'error')
const showInitials = computed(() => !showImage.value && initials.value)
const showFallback = computed(() => !showImage.value && !showInitials.value)

const classes = computed(() =>
  cn(
    avatarTheme({
      size: props.size,
      shape: props.shape,
      shadow: props.shadow,
    }),
    props.class,
  ),
)
</script>

<template>
  <span
    :id="id"
    :class="classes"
    role="img"
    :aria-label="name || alt || undefined"
  >
    <!-- Image -->
    <img
      v-if="showImage"
      :src="src"
      :alt="alt || name || ''"
      class="h-full w-full object-cover"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- Initials fallback -->
    <span
      v-else-if="showInitials"
      aria-hidden="true"
    >
      {{ initials }}
    </span>

    <!-- Custom fallback slot or generic icon -->
    <template v-else-if="showFallback">
      <slot name="fallback">
        <svg
          class="h-[60%] w-[60%] text-ousi-muted-foreground/60"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z"
          />
        </svg>
      </slot>
    </template>

    <!-- Hidden img for SSR: triggers load/error after hydration -->
    <img
      v-if="src && isMounted && imageStatus === 'loading'"
      :src="src"
      :alt="''"
      class="sr-only"
      aria-hidden="true"
      @load="onImageLoad"
      @error="onImageError"
    />
  </span>
</template>
