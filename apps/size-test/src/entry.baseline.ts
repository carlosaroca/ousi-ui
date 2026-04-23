// SCENARIO BASELINE: Vue + app shell, no @ousi-ui/vue imports at all.
import { createApp, h } from 'vue'

createApp({
  render: () => h('div', 'hi'),
}).mount('#app')
