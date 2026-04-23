import { defineNuxtModule, addComponent, addImports, addPlugin, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
  /** Theme CSS to inject. Set to false to opt out. */
  theme?: 'ousi-dark' | 'ousi-light' | false
  /** Whether to auto-import components and composables. */
  autoImport?: boolean
  /** Prefix for component names. Defaults to 'O'. */
  prefix?: string
}

const COMPONENTS = [
  'OButton', 'OBadge', 'OChip', 'OAvatar', 'OInput',
  'OCard', 'OCardHeader', 'OCardTitle', 'OCardDescription', 'OCardContent', 'OCardFooter',
  'OTooltip', 'OSelect',
  'ODialog', 'ODialogHeader', 'ODialogBody', 'ODialogFooter',
  'ODrawer', 'OTabs',
  'ODropdown', 'ODropdownTrigger', 'ODropdownPopover', 'ODropdownMenu', 'ODropdownItem',
  'ODropdownItemIndicator', 'ODropdownSection',
  'ODropdownSubmenuTrigger', 'ODropdownSubmenuIndicator', 'ODropdownSeparator',
  'OToastProvider',
  'OCheckbox', 'OSwitch', 'ORadio', 'ORadioGroup',
  'OTextarea', 'OPopover', 'OSeparator', 'OSkeleton', 'OSpinner', 'OAlert',
  'OAutocomplete', 'OBreadcrumbs',
  'OButtonGroup', 'OButtonGroupSeparator',
  'OCalendar', 'ORangeCalendar',
  'OProgressBar', 'OProgressCircle',
  'OColorSwatch', 'OColorField', 'OColorSlider', 'OColorArea', 'OColorPicker',
  'ODateField', 'OTimeField', 'ODatePicker', 'ODateRangePicker',
  'OForm', 'OInputOtp', 'OKbd', 'OMeter', 'ONumberField', 'OPagination', 'OTable', 'OSlider',
  'OScrollShadow', 'OChart', 'OCodeBlock', 'OImageCompare',
  'OTimeline', 'OTimelineNav',
  'OAccordion', 'OMagneticButton', 'OElasticSlider', 'OAnimatedNumber', 'ORating',
  'OCollapsible', 'OTagInput', 'OContextMenu', 'OMarquee', 'OTypewriter',
  'OGradientText', 'OConfetti', 'OCommandPalette', 'OCarousel',
  'OStepper', 'OFileUpload', 'OTreeView',
  'OBentoGrid', 'OBentoGridItem',
  'OResizable', 'OInfiniteScroll', 'OAspectRatio',
] as const

const COMPOSABLES = ['toast'] as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@ousi-ui/nuxt',
    configKey: 'ousiUi',
  },
  defaults: {
    theme: 'ousi-dark',
    autoImport: true,
    prefix: 'O',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.theme !== false) {
      nuxt.options.css ??= []
      nuxt.options.css.unshift(`@ousi-ui/theme/themes/${options.theme}`)
      nuxt.options.css.unshift('@ousi-ui/vue/style.css')
    }

    // Runtime plugin — registers directives (v-tooltip, etc.)
    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.autoImport === false) return

    const prefix = options.prefix ?? 'O'
    for (const exportName of COMPONENTS) {
      const registeredName = prefix === 'O' ? exportName : `${prefix}${exportName.slice(1)}`
      addComponent({
        name: registeredName,
        export: exportName,
        filePath: '@ousi-ui/vue',
      })
    }

    for (const name of COMPOSABLES) {
      addImports({ name, from: '@ousi-ui/vue' })
    }
  },
})
