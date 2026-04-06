<script setup lang="ts">
import { useHaptics, vHaptic, HapticsEngine } from '@ousi-ui/haptics'
import { OButton } from '@ousi-ui/vue'

const { trigger, isSupported } = useHaptics()

const info = ref({
  browser: '',
  iosVersion: '',
  hasVibrate: false,
  isIOS: false,
})

onMounted(() => {
  const ua = navigator.userAgent
  info.value.hasVibrate = typeof navigator.vibrate === 'function'
  info.value.isIOS = HapticsEngine.isIOS

  if (/CriOS/.test(ua)) info.value.browser = 'Chrome iOS'
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) info.value.browser = 'Safari'
  else if (/Chrome/.test(ua)) info.value.browser = 'Chrome Android'
  else info.value.browser = navigator.userAgent.slice(0, 50)

  const m = ua.match(/OS (\d+[_\.]\d+)/)
  info.value.iosVersion = m ? m[1].replace('_', '.') : 'N/A'
})
</script>

<template>
  <div class="p-6 space-y-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-ousi-foreground">Haptics Test</h1>

    <div class="rounded-xl border border-ousi-border bg-ousi-surface-secondary p-4 space-y-1 text-xs">
      <p><strong>Browser:</strong> {{ info.browser }}</p>
      <p><strong>iOS:</strong> {{ info.isIOS }} | <strong>iOS version:</strong> {{ info.iosVersion }}</p>
      <p><strong>navigator.vibrate:</strong> {{ info.hasVibrate }}</p>
      <p><strong>isSupported:</strong> {{ isSupported }}</p>
    </div>

    <!-- Test: v-haptic directive (new approach) -->
    <div class="space-y-2">
      <p class="text-xs font-bold text-green-600 uppercase tracking-wide">v-haptic directive (iOS overlay)</p>
      <p class="text-xs text-ousi-muted">On iOS, injects an invisible checkbox switch that receives your real touch → triggers Taptic Engine.</p>
      <button
        v-haptic
        class="w-full px-4 py-3 bg-green-500 text-white rounded-lg active:scale-95 transition-transform text-sm font-medium relative overflow-hidden"
      >
        v-haptic (default = medium)
      </button>
      <button
        v-haptic="'heavy'"
        class="w-full px-4 py-3 bg-green-600 text-white rounded-lg active:scale-95 transition-transform text-sm font-medium relative overflow-hidden"
      >
        v-haptic="heavy"
      </button>
      <button
        v-haptic="'success'"
        class="w-full px-4 py-3 bg-green-700 text-white rounded-lg active:scale-95 transition-transform text-sm font-medium relative overflow-hidden"
      >
        v-haptic="success"
      </button>
    </div>

    <!-- Test: useHaptics composable (Android only) -->
    <div class="space-y-2">
      <p class="text-xs font-bold text-purple-600 uppercase tracking-wide">useHaptics() composable</p>
      <p class="text-xs text-ousi-muted">Uses navigator.vibrate — works on Android only.</p>
      <button class="w-full px-4 py-3 bg-purple-500 text-white rounded-lg active:scale-95 transition-transform text-sm font-medium" @click="trigger('heavy')">
        trigger('heavy')
      </button>
      <button class="w-full px-4 py-3 bg-purple-500 text-white rounded-lg active:scale-95 transition-transform text-sm font-medium" @click="trigger('medium')">
        trigger('medium')
      </button>
    </div>

    <!-- Test: OButton -->
    <div class="space-y-2">
      <p class="text-xs font-bold text-blue-600 uppercase tracking-wide">OButton (uses useHaptics internally)</p>
      <ClientOnly>
        <div class="flex flex-col gap-2">
          <OButton class="w-full">Default</OButton>
          <OButton class="w-full" haptic="heavy">haptic="heavy"</OButton>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
