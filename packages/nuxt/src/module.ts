import { defineNuxtModule, addPlugin, createResolver, addComponentsDir } from '@nuxt/kit'

export interface ModuleOptions {
  theme?: string
  autoImport?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@ousi-ui/nuxt',
    configKey: 'ousiUi',
  },
  defaults: {
    theme: 'oasi-dark',
    autoImport: true,
  },
  setup(_options, _nuxt) {
    // TODO: Implement module setup
    // - Register Tailwind plugin with theme
    // - Auto-import components
    // - Auto-import composables
    // - Register global plugin
  },
})
