import type { App } from 'vue'
import { OButton } from '../components/button'
import { OBadge } from '../components/badge'
import { OChip } from '../components/chip'
import { OAvatar } from '../components/avatar'
import { OInput } from '../components/input'
import { OCard, OCardHeader, OCardTitle, OCardDescription, OCardContent, OCardFooter } from '../components/card'
import { OTooltip } from '../components/tooltip'
import { OSelect } from '../components/select'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter } from '../components/dialog'
import { ODrawer } from '../components/drawer'
import { OTabs } from '../components/tabs'
import { ODropdown, ODropdownTrigger, ODropdownPopover, ODropdownMenu, ODropdownItem, ODropdownItemIndicator, ODropdownSection, ODropdownSubmenuTrigger, ODropdownSubmenuIndicator, ODropdownSeparator } from '../components/dropdown'
import { OToastProvider } from '../components/toast'
import { OCheckbox } from '../components/checkbox'
import { OSwitch } from '../components/switch'
import { ORadio, ORadioGroup } from '../components/radio'
import { OTextarea } from '../components/textarea'
import { OPopover } from '../components/popover'
import { OSeparator } from '../components/separator'
import { OSkeleton } from '../components/skeleton'
import { OSpinner } from '../components/spinner'
import { OAlert } from '../components/alert'
import { OAutocomplete } from '../components/autocomplete'
import { OBreadcrumbs } from '../components/breadcrumbs'
import { OButtonGroup, OButtonGroupSeparator } from '../components/button-group'
import { OCalendar } from '../components/calendar'
import { ORangeCalendar } from '../components/range-calendar'
import { OProgressBar } from '../components/progress-bar'
import { OProgressCircle } from '../components/progress-circle'
import { OColorSwatch } from '../components/color-swatch'
import { OColorField } from '../components/color-field'
import { OColorSlider } from '../components/color-slider'
import { OColorArea } from '../components/color-area'
import { OColorPicker } from '../components/color-picker'
import { ODateField } from '../components/date-field'
import { OTimeField } from '../components/time-field'
import { ODatePicker } from '../components/date-picker'
import { ODateRangePicker } from '../components/date-range-picker'
import { OForm } from '../components/form'
import { OInputOtp } from '../components/input-otp'
import { OKbd } from '../components/kbd'
import { OMeter } from '../components/meter'
import { ONumberField } from '../components/number-field'
import { OPagination } from '../components/pagination'
import { OTable } from '../components/table'
import { OSlider } from '../components/slider'
import { OScrollShadow } from '../components/scroll-shadow'
import { OChart } from '../components/chart'
import { OCodeBlock } from '../components/code-block'
import { OImageCompare } from '../components/image-compare'
import { OTimeline } from '../components/timeline'
import { OAccordion } from '../components/accordion'
import { OMagneticButton } from '../components/magnetic-button'
import { OElasticSlider } from '../components/elastic-slider'
import { OAnimatedNumber } from '../components/animated-number'
import { ORating } from '../components/rating'
import { OCollapsible } from '../components/collapsible'
import { OTagInput } from '../components/tag-input'
import { OContextMenu } from '../components/context-menu'
import { OMarquee } from '../components/marquee'
import { OTypewriter } from '../components/typewriter'
import { OGradientText } from '../components/gradient-text'
import { OConfetti } from '../components/confetti'
import { OCommandPalette } from '../components/command-palette'
import { OCarousel } from '../components/carousel'
import { OStepper } from '../components/stepper'
import { OFileUpload } from '../components/file-upload'
import { OTimelineNav } from '../components/timeline-nav'
import { OTreeView } from '../components/tree-view'
import { OBentoGrid, OBentoGridItem } from '../components/bento-grid'
import { OResizable } from '../components/resizable'
import { OInfiniteScroll } from '../components/infinite-scroll'
import { OAspectRatio } from '../components/aspect-ratio'
import { vTooltip } from '../components/tooltip'

const components = {
  OButton,
  OBadge,
  OChip,
  OAvatar,
  OInput,
  OCard,
  OCardHeader,
  OCardTitle,
  OCardDescription,
  OCardContent,
  OCardFooter,
  OTooltip,
  OSelect,
  ODialog,
  ODialogHeader,
  ODialogBody,
  ODialogFooter,
  ODrawer,
  OTabs,
  ODropdown,
  ODropdownTrigger,
  ODropdownPopover,
  ODropdownMenu,
  ODropdownItem,
  ODropdownItemIndicator,
  ODropdownSection,
  ODropdownSubmenuTrigger,
  ODropdownSubmenuIndicator,
  ODropdownSeparator,
  OToastProvider,
  OCheckbox,
  OSwitch,
  ORadio,
  ORadioGroup,
  OTextarea,
  OPopover,
  OSeparator,
  OSkeleton,
  OSpinner,
  OAlert,
  OAutocomplete,
  OBreadcrumbs,
  OButtonGroup,
  OButtonGroupSeparator,
  OCalendar,
  ORangeCalendar,
  OProgressBar,
  OProgressCircle,
  OColorSwatch,
  OColorField,
  OColorSlider,
  OColorArea,
  OColorPicker,
  ODateField,
  OTimeField,
  ODatePicker,
  ODateRangePicker,
  OForm,
  OInputOtp,
  OKbd,
  OMeter,
  ONumberField,
  OPagination,
  OTable,
  OSlider,
  OScrollShadow,
  OChart,
  OCodeBlock,
  OImageCompare,
  OTimeline,
  OAccordion,
  OMagneticButton,
  OElasticSlider,
  OAnimatedNumber,
  ORating,
  OCollapsible,
  OTagInput,
  OContextMenu,
  OMarquee,
  OTypewriter,
  OGradientText,
  OConfetti,
  OCommandPalette,
  OCarousel,
  OStepper,
  OFileUpload,
  OTimelineNav,
  OTreeView,
  OBentoGrid,
  OBentoGridItem,
  OResizable,
  OInfiniteScroll,
  OAspectRatio,
} as const

import { applyOusiConfig, type OusiConfigInit } from '../config'

export interface OusiUIPluginOptions extends OusiConfigInit {
  /** Prefix for component registration. Defaults to 'O'. */
  prefix?: string
}

export function install(app: App, options: OusiUIPluginOptions = {}) {
  const { prefix = 'O', locale, hour12, firstDayOfWeek, dir } = options

  // Seed the global config singleton — useOusiConfig() will pick these up.
  applyOusiConfig({ locale, hour12, firstDayOfWeek, dir })

  for (const [name, component] of Object.entries(components)) {
    const registeredName = prefix ? name.replace(/^O/, prefix) : name
    app.component(registeredName, component)
  }

  // Directives
  app.directive('tooltip', vTooltip)
}

export const OusiUIPlugin = { install }
