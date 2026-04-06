import type { ComponentData } from './types'

export const toastData: ComponentData = {
  title: 'Toast',
  description: 'Brief notification messages that appear temporarily.',
  category: 'Feedback',
  importCode: "import { OToastProvider, toast } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'ToastBasic',
        code: `<script setup>
import { toast } from '@ousi-ui/vue'
</script>

<template>
  <!-- Add OToastProvider once in your app root -->
  <OToastProvider />

  <!-- Trigger toasts from anywhere -->
  <OButton @click="toast('Hello world!')">
    Show Toast
  </OButton>
</template>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'ToastVariants',
        code: `toast('Default message')
toast.success('Operation completed')
toast.info('New update available')
toast.warning('Check your settings')
toast.danger('Something went wrong')`,
      },
    },
    {
      id: 'with-action',
      title: 'With Description & Action',
      example: {
        component: 'ToastWithAction',
        code: `toast.info('You have 2 credits left', {
  description: 'Get a paid plan for more credits',
  action: { label: 'Upgrade', onClick: () => {} },
})

toast.danger('Storage is full', {
  description: 'Remove files to release space',
  action: { label: 'Remove', onClick: () => {} },
})`,
      },
    },
    {
      id: 'promise',
      title: 'Promise & Loading',
      example: {
        component: 'ToastPromise',
        code: `// Automatic loading → success/error
toast.promise(
  fetch('/api/upload'),
  {
    loading: 'Uploading...',
    success: 'Upload complete!',
    error: 'Upload failed.',
  }
)

// Manual loading
const id = toast('Saving...', { isLoading: true, timeout: 0 })
await save()
toast.close(id)
toast.success('Saved!')`,
      },
    },
    {
      id: 'custom-icon',
      title: 'Custom Icon',
      example: {
        component: 'ToastCustomIcon',
        code: `toast('Team invitation', {
  description: 'Bob sent you an invitation',
  icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5..." />',
  action: { label: 'Accept', onClick: () => {} },
})

toast.success('Download complete', {
  icon: '<polyline points="7 10 12 15 17 10" />',
  description: 'report.pdf saved to Downloads',
})`,
      },
    },
    {
      id: 'callbacks',
      title: 'Callbacks',
      example: {
        component: 'ToastCallbacks',
        code: `// onClose — fires when user dismisses
toast('Dismiss me', {
  timeout: 0,
  onClose: () => console.log('dismissed'),
})

// onAutoClose — fires when timeout expires
toast('Auto-close in 2s', {
  timeout: 2000,
  onAutoClose: () => console.log('auto-closed'),
})`,
      },
    },
    {
      id: 'persistent',
      title: 'Persistent & Controls',
      example: {
        component: 'ToastPersistent',
        code: `// Persistent — stays until dismissed
toast('Important', { timeout: 0 })

// Short timeout
toast('Quick', { timeout: 2000 })

// Manual loading with close
const id = toast('Saving...', { isLoading: true, timeout: 0 })
setTimeout(() => {
  toast.close(id)
  toast.success('Done!')
}, 2000)

// Clear all
toast.clear()`,
      },
    },
    {
      id: 'placements',
      title: 'Placements',
      example: {
        component: 'ToastPlacements',
        code: `<OToastProvider placement="top" />
<OToastProvider placement="top-start" />
<OToastProvider placement="top-end" />
<OToastProvider placement="bottom" />
<OToastProvider placement="bottom-start" />
<OToastProvider placement="bottom-end" />`,
      },
    },
  ],

  props: [
    { name: 'placement', type: "'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'", default: "'bottom-end'", description: 'Where toasts appear on screen (OToastProvider prop).' },
    { name: 'maxVisible', type: 'number', default: '5', description: 'Maximum number of visible stacked toasts (OToastProvider prop).' },
  ],

  slots: [
    { name: 'title', type: 'string', description: 'Toast title text.' },
    { name: 'description', type: 'string', description: 'Optional description below the title.' },
    { name: 'icon', type: 'string (SVG inner HTML)', description: 'Custom SVG icon content. Replaces the default variant icon.' },
    { name: 'action', type: '{ label: string, onClick: () => void }', description: 'Action button shown in the toast.' },
    { name: 'timeout', type: 'number', description: 'Auto-close delay in ms. Set to 0 for persistent. Default: 4000.' },
    { name: 'isLoading', type: 'boolean', description: 'Show a spinning loader icon instead of the variant icon.' },
    { name: 'onClose', type: '() => void', description: 'Callback when the toast is manually dismissed.' },
    { name: 'onAutoClose', type: '() => void', description: 'Callback when the toast auto-closes after timeout.' },
  ],

  themeCode: `import { toast } from '@ousi-ui/vue'

// Convenience methods
toast('Default message')
toast.success('Success!')
toast.info('Info')
toast.warning('Warning!')
toast.danger('Error!')

// Promise — auto loading → success/error
toast.promise(asyncFn(), {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed.',
})

// Controls
toast.close(id)   // Close specific toast
toast.clear()     // Clear all toasts`,

  keyboard: [
    { key: 'escape', description: 'Dismisses the most recent toast.' },
  ],

  aria: [
    { attribute: 'role="region"', condition: 'toast container', description: 'Toast region is identified as a landmark.' },
    { attribute: 'role="alert"', condition: 'each toast', description: 'Individual toasts are announced by screen readers.' },
    { attribute: 'aria-live="polite"', condition: 'each toast', description: 'New toasts are announced without interrupting.' },
    { attribute: 'aria-atomic="true"', condition: 'each toast', description: 'Entire toast content is announced as a unit.' },
  ],

  bestPractices: [
    { text: 'Place `<OToastProvider />` once in your app root layout.', good: true },
    { text: 'Keep toast messages short and actionable.', good: true },
    { text: 'Use `toast.promise()` for async operations to show loading → success/error.', good: true },
    { text: 'Use `action` to let users undo or take follow-up action.', good: true },
    { text: 'Use custom `icon` SVG paths to match the context (download, team invite, etc.).', good: true },
    { text: "Don't use toasts for critical errors that require user action — use a Dialog instead.", good: false },
  ],

  haptics: {
    defaultPreset: 'Auto-mapped from variant',
    trigger: 'When a toast is added to the store',
    notes: "Maps variant → preset: success→'success', danger→'error', warning→'warning', default→'light'.",
  },
}
