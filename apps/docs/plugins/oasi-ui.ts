import { OusiUIPlugin } from '@ousi-ui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(OusiUIPlugin)
})
