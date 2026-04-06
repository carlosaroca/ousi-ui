export interface NavItem {
  title: string
  path: string
  badge?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

// Vue documentation navigation
export function useVueNavigation(): NavSection[] {
  return [
    {
      title: 'Overview',
      items: [
        { title: 'Introduction', path: '/vue/getting-started/introduction' },
        { title: 'Installation', path: '/vue/getting-started/installation' },
      ],
    },
    {
      title: 'Handbook',
      items: [
        { title: 'Theming', path: '/vue/getting-started/theming' },
        { title: 'Colors', path: '/vue/getting-started/colors' },
        { title: 'Styling', path: '/vue/getting-started/styling' },
        { title: 'Animation', path: '/vue/getting-started/animation' },
        { title: 'Composition', path: '/vue/getting-started/composition' },
        { title: 'Haptics', path: '/vue/getting-started/haptics' },
      ],
    },
    {
      title: 'Buttons',
      items: [
        { title: 'Button', path: '/vue/components/button' },
        { title: 'ButtonGroup', path: '/vue/components/button-group' },
        { title: 'MagneticButton', path: '/vue/components/magnetic-button' },
      ],
    },
    {
      title: 'Forms',
      items: [
        { title: 'Input', path: '/vue/components/input' },
        { title: 'Textarea', path: '/vue/components/textarea' },
        { title: 'Select', path: '/vue/components/select' },
        { title: 'Autocomplete', path: '/vue/components/autocomplete' },
        { title: 'Checkbox', path: '/vue/components/checkbox' },
        { title: 'Radio', path: '/vue/components/radio' },
        { title: 'Switch', path: '/vue/components/switch' },
        { title: 'Slider', path: '/vue/components/slider' },
        { title: 'ElasticSlider', path: '/vue/components/elastic-slider' },
        { title: 'NumberField', path: '/vue/components/number-field' },
        { title: 'InputOtp', path: '/vue/components/input-otp' },
        { title: 'TagInput', path: '/vue/components/tag-input' },
        { title: 'Rating', path: '/vue/components/rating' },
        { title: 'FileUpload', path: '/vue/components/file-upload' },
        { title: 'Form', path: '/vue/components/form' },
      ],
    },
    {
      title: 'Date & Time',
      items: [
        { title: 'Calendar', path: '/vue/components/calendar' },
        { title: 'RangeCalendar', path: '/vue/components/range-calendar' },
        { title: 'DateField', path: '/vue/components/date-field' },
        { title: 'TimeField', path: '/vue/components/time-field' },
        { title: 'DatePicker', path: '/vue/components/date-picker' },
        { title: 'DateRangePicker', path: '/vue/components/date-range-picker' },
      ],
    },
    {
      title: 'Colors',
      items: [
        { title: 'ColorSwatch', path: '/vue/components/color-swatch' },
        { title: 'ColorField', path: '/vue/components/color-field' },
        { title: 'ColorSlider', path: '/vue/components/color-slider' },
        { title: 'ColorArea', path: '/vue/components/color-area' },
        { title: 'ColorPicker', path: '/vue/components/color-picker' },
      ],
    },
    {
      title: 'Data Display',
      items: [
        { title: 'AnimatedNumber', path: '/vue/components/animated-number' },
        { title: 'Badge', path: '/vue/components/badge' },
        { title: 'Chart', path: '/vue/components/chart' },
        { title: 'Chip', path: '/vue/components/chip' },
        { title: 'CodeBlock', path: '/vue/components/code-block' },
        { title: 'Table', path: '/vue/components/table' },
        { title: 'Kbd', path: '/vue/components/kbd' },
        { title: 'Timeline', path: '/vue/components/timeline' },
        { title: 'TimelineNav', path: '/vue/components/timeline-nav' },
      ],
    },
    {
      title: 'Feedback',
      items: [
        { title: 'Alert', path: '/vue/components/alert' },
        { title: 'Confetti', path: '/vue/components/confetti' },
        { title: 'ProgressBar', path: '/vue/components/progress-bar' },
        { title: 'ProgressCircle', path: '/vue/components/progress-circle' },
        { title: 'Meter', path: '/vue/components/meter' },
        { title: 'Skeleton', path: '/vue/components/skeleton' },
        { title: 'Spinner', path: '/vue/components/spinner' },
        { title: 'Toast', path: '/vue/components/toast' },
      ],
    },
    {
      title: 'Layout',
      items: [
        { title: 'AspectRatio', path: '/vue/components/aspect-ratio' },
        { title: 'BentoGrid', path: '/vue/components/bento-grid' },
        { title: 'Card', path: '/vue/components/card' },
        { title: 'Resizable', path: '/vue/components/resizable' },
        { title: 'Separator', path: '/vue/components/separator' },
      ],
    },
    {
      title: 'Media',
      items: [
        { title: 'Avatar', path: '/vue/components/avatar' },
        { title: 'Carousel', path: '/vue/components/carousel' },
        { title: 'ImageCompare', path: '/vue/components/image-compare' },
        { title: 'Marquee', path: '/vue/components/marquee' },
      ],
    },
    {
      title: 'Navigation',
      items: [
        { title: 'Breadcrumbs', path: '/vue/components/breadcrumbs' },
        { title: 'Pagination', path: '/vue/components/pagination' },
        { title: 'Stepper', path: '/vue/components/stepper' },
        { title: 'Tabs', path: '/vue/components/tabs' },
        { title: 'Accordion', path: '/vue/components/accordion' },
        { title: 'TreeView', path: '/vue/components/tree-view' },
      ],
    },
    {
      title: 'Overlays',
      items: [
        { title: 'CommandPalette', path: '/vue/components/command-palette' },
        { title: 'ContextMenu', path: '/vue/components/context-menu' },
        { title: 'Dialog', path: '/vue/components/dialog' },
        { title: 'Drawer', path: '/vue/components/drawer' },
        { title: 'Dropdown', path: '/vue/components/dropdown' },
        { title: 'Popover', path: '/vue/components/popover' },
        { title: 'Tooltip', path: '/vue/components/tooltip' },
      ],
    },
    {
      title: 'Typography',
      items: [
        { title: 'GradientText', path: '/vue/components/gradient-text' },
        { title: 'Typewriter', path: '/vue/components/typewriter' },
      ],
    },
    {
      title: 'Interactive',
      items: [
        { title: 'Collapsible', path: '/vue/components/collapsible' },
      ],
    },
    {
      title: 'Utilities',
      items: [
        { title: 'InfiniteScroll', path: '/vue/components/infinite-scroll' },
        { title: 'ScrollShadow', path: '/vue/components/scroll-shadow' },
      ],
    },
  ]
}

// Flutter documentation navigation (different structure)
export function useFlutterNavigation(): NavSection[] {
  return [
    {
      title: 'Overview',
      items: [
        { title: 'Introduction', path: '/flutter/getting-started/introduction' },
        { title: 'Installation', path: '/flutter/getting-started/installation' },
      ],
    },
    {
      title: 'Handbook',
      items: [
        { title: 'Theming', path: '/flutter/getting-started/theming' },
        { title: 'Colors', path: '/flutter/getting-started/colors' },
        { title: 'Styling', path: '/flutter/getting-started/styling' },
      ],
    },
    {
      title: 'Widgets',
      items: [
        { title: 'Button', path: '/flutter/widgets/button', badge: 'Soon' },
        { title: 'Input', path: '/flutter/widgets/input', badge: 'Soon' },
        { title: 'Card', path: '/flutter/widgets/card', badge: 'Soon' },
        { title: 'Avatar', path: '/flutter/widgets/avatar', badge: 'Soon' },
        { title: 'Switch', path: '/flutter/widgets/switch', badge: 'Soon' },
        { title: 'Slider', path: '/flutter/widgets/slider', badge: 'Soon' },
        { title: 'Spinner', path: '/flutter/widgets/spinner', badge: 'Soon' },
        { title: 'Alert', path: '/flutter/widgets/alert', badge: 'Soon' },
        { title: 'Toast', path: '/flutter/widgets/toast', badge: 'Soon' },
        { title: 'Tabs', path: '/flutter/widgets/tabs', badge: 'Soon' },
      ],
    },
  ]
}

// Dynamic navigation based on current platform
export function useNavigation() {
  const route = useRoute()
  const isFlutter = computed(() => route.path.startsWith('/flutter'))

  const sections = computed(() =>
    isFlutter.value ? useFlutterNavigation() : useVueNavigation(),
  )

  return { sections, isFlutter }
}
