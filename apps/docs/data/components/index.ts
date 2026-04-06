import type { ComponentData } from './types'

// Buttons
import { buttonData } from './button'
import { buttonGroupData } from './button-group'
import { magneticButtonData } from './magnetic-button'

// Forms
import { inputData } from './input'
import { textareaData } from './textarea'
import { selectData } from './select'
import { autocompleteData } from './autocomplete'
import { checkboxData } from './checkbox'
import { radioData } from './radio'
import { switchData } from './switch'
import { sliderData } from './slider'
import { elasticSliderData } from './elastic-slider'
import { numberFieldData } from './number-field'
import { inputOtpData } from './input-otp'
import { formData } from './form'
import { ratingData } from './rating'
import { tagInputData } from './tag-input'

// Date & Time
import { calendarData } from './calendar'
import { rangeCalendarData } from './range-calendar'
import { dateFieldData } from './date-field'
import { timeFieldData } from './time-field'
import { datePickerData } from './date-picker'
import { dateRangePickerData } from './date-range-picker'

// Colors
import { colorSwatchData } from './color-swatch'
import { colorFieldData } from './color-field'
import { colorSliderData } from './color-slider'
import { colorAreaData } from './color-area'
import { colorPickerData } from './color-picker'

// Data Display
import { animatedNumberData } from './animated-number'
import { codeBlockData } from './code-block'
import { badgeData } from './badge'
import { chipData } from './chip'
import { tableData } from './table'
import { kbdData } from './kbd'
import { timelineData } from './timeline'

// Feedback
import { alertData } from './alert'
import { progressBarData } from './progress-bar'
import { progressCircleData } from './progress-circle'
import { meterData } from './meter'
import { skeletonData } from './skeleton'
import { spinnerData } from './spinner'
import { toastData } from './toast'

// Layout
import { cardData } from './card'
import { separatorData } from './separator'

// Media
import { avatarData } from './avatar'
import { imageCompareData } from './image-compare'

// Navigation
import { disclosureData } from './disclosure'
import { disclosureGroupData } from './disclosure-group'
import { breadcrumbsData } from './breadcrumbs'
import { paginationData } from './pagination'
import { tabsData } from './tabs'
import { accordionData } from './accordion'

// Interactive
import { collapsibleData } from './collapsible'

// Overlays
import { dialogData } from './dialog'
import { drawerData } from './drawer'
import { dropdownData } from './dropdown'
import { popoverData } from './popover'
import { tooltipData } from './tooltip'
import { contextMenuData } from './context-menu'

// Utilities
import { scrollShadowData } from './scroll-shadow'

// Data Visualization
import { chartData } from './chart'

// Batch 2 — Trendy
import { marqueeData } from './marquee'
import { dockData } from './dock'
import { typewriterData } from './typewriter'
import { gradientTextData } from './gradient-text'
import { confettiData } from './confetti'

// Batch 3 — Complex
import { commandPaletteData } from './command-palette'
import { carouselData } from './carousel'
import { stepperData } from './stepper'
import { fileUploadData } from './file-upload'

// Batch 4 — Layout/Utility
import { treeViewData } from './tree-view'
import { bentoGridData } from './bento-grid'
import { resizableData } from './resizable'
import { infiniteScrollData } from './infinite-scroll'
import { aspectRatioData } from './aspect-ratio'

/** Registry mapping URL slugs to component data */
export const componentRegistry: Record<string, ComponentData> = {
  'button': buttonData,
  'button-group': buttonGroupData,
  'magnetic-button': magneticButtonData,
  'input': inputData,
  'textarea': textareaData,
  'select': selectData,
  'autocomplete': autocompleteData,
  'checkbox': checkboxData,
  'radio': radioData,
  'switch': switchData,
  'slider': sliderData,
  'elastic-slider': elasticSliderData,
  'number-field': numberFieldData,
  'input-otp': inputOtpData,
  'form': formData,
  'rating': ratingData,
  'tag-input': tagInputData,
  'calendar': calendarData,
  'range-calendar': rangeCalendarData,
  'date-field': dateFieldData,
  'time-field': timeFieldData,
  'date-picker': datePickerData,
  'date-range-picker': dateRangePickerData,
  'color-swatch': colorSwatchData,
  'color-field': colorFieldData,
  'color-slider': colorSliderData,
  'color-area': colorAreaData,
  'color-picker': colorPickerData,
  'animated-number': animatedNumberData,
  'code-block': codeBlockData,
  'badge': badgeData,
  'chip': chipData,
  'table': tableData,
  'kbd': kbdData,
  'timeline': timelineData,
  'alert': alertData,
  'progress-bar': progressBarData,
  'progress-circle': progressCircleData,
  'meter': meterData,
  'skeleton': skeletonData,
  'spinner': spinnerData,
  'toast': toastData,
  'card': cardData,
  'separator': separatorData,
  'avatar': avatarData,
  'image-compare': imageCompareData,
  'disclosure': disclosureData,
  'disclosure-group': disclosureGroupData,
  'breadcrumbs': breadcrumbsData,
  'pagination': paginationData,
  'tabs': tabsData,
  'accordion': accordionData,
  'dialog': dialogData,
  'drawer': drawerData,
  'dropdown': dropdownData,
  'popover': popoverData,
  'tooltip': tooltipData,
  'context-menu': contextMenuData,
  'collapsible': collapsibleData,
  'scroll-shadow': scrollShadowData,
  'chart': chartData,
  'marquee': marqueeData,
  'dock': dockData,
  'typewriter': typewriterData,
  'gradient-text': gradientTextData,
  'confetti': confettiData,
  'command-palette': commandPaletteData,
  'carousel': carouselData,
  'stepper': stepperData,
  'file-upload': fileUploadData,
  'tree-view': treeViewData,
  'bento-grid': bentoGridData,
  'resizable': resizableData,
  'infinite-scroll': infiniteScrollData,
  'aspect-ratio': aspectRatioData,
}

export type { ComponentData } from './types'
