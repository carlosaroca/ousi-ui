// SCENARIO A: consumer imports only OButton.
// This measures what tree-shaking can strip down to.
import { createApp, h } from 'vue'
import { OButton } from '@ousi-ui/vue'

createApp({
  render: () => h(OButton, { variant: 'primary' }, { default: () => 'Hi' }),
}).mount('#app')
