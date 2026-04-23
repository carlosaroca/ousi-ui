// SCENARIO B: consumer imports everything.
// This is the "no tree-shaking" ceiling for comparison.
import { createApp, h } from 'vue'
import * as OasiUI from '@ousi-ui/vue'

// Force-reference every export to prevent tree-shaking from stripping anything.
const keys = Object.keys(OasiUI)
console.log(keys.length)

createApp({
  render: () => h('div'),
}).mount('#app')
