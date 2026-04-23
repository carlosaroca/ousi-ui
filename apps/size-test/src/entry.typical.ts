// SCENARIO TYPICAL: what a real app using 5-10 components pulls in.
import { createApp, h } from 'vue'
import {
  OButton,
  OInput,
  OCard,
  OCardHeader,
  OCardTitle,
  OCardContent,
  OCardFooter,
  OTooltip,
  OAvatar,
  OCheckbox,
} from '@ousi-ui/vue'

createApp({
  render: () => h('div', [
    h(OButton),
    h(OInput),
    h(OCard, null, [
      h(OCardHeader, null, [h(OCardTitle, null, 'x')]),
      h(OCardContent, null, 'x'),
      h(OCardFooter, null, 'x'),
    ]),
    h(OTooltip, { content: 'hi' }, { default: () => h('span', 'x') }),
    h(OAvatar, { name: 'x' }),
    h(OCheckbox),
  ]),
}).mount('#app')
