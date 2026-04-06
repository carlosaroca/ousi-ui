<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OButton, OBadge, OChip, OAvatar, OInput, OCard, OTooltip, OSelect, ODialog, ODrawer, OTabs, ODropdown, OToastProvider, toast, OCheckbox, OSwitch, ORadio, ORadioGroup, OTextarea, OPopover, OSeparator, OSkeleton, OSpinner, OAlert, OAutocomplete, OBreadcrumbs, OButtonGroup, OCalendar, ORangeCalendar, OProgressBar, OProgressCircle, OColorSwatch, OColorField, OColorSlider, OColorArea, OColorPicker, ODateField, OTimeField, ODatePicker, ODateRangePicker, ODisclosure, ODisclosureGroup, OForm, OInputOtp, OKbd, OMeter, ONumberField, OPagination, OTable, OSlider } from '@ousi-ui/vue'
import type { TableColumn, SortDescriptor } from '@ousi-ui/vue'
import type { ButtonVariant, ButtonSize, ChipVariant, ChipColor, ChipSize, AvatarSize, SelectOption, TabItem, CalendarDate, DateRange, DateFieldValue, TimeFieldValue, DateRangeValue } from '@ousi-ui/vue'

const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'soft', 'danger', 'danger-soft']
const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg']

const chipVariants: ChipVariant[] = ['solid', 'outline', 'soft', 'ghost']
const chipColors: ChipColor[] = ['accent', 'success', 'warning', 'danger', 'default']
const chipSizes: ChipSize[] = ['sm', 'md', 'lg']

const avatarSizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl']

const radiusSteps = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const

const inputDemo = ref('')
const clearableDemo = ref('Hello world')

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]
const roleOptions: SelectOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]
const stateOptions: SelectOption[] = [
  { value: 'florida', label: 'Florida' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'california', label: 'California' },
  { value: 'texas', label: 'Texas' },
  { value: 'new-york', label: 'New York' },
  { value: 'washington', label: 'Washington' },
]
const animalOptions: SelectOption[] = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat', disabled: true },
  { value: 'bird', label: 'Bird' },
  { value: 'kangaroo', label: 'Kangaroo', disabled: true },
  { value: 'elephant', label: 'Elephant' },
  { value: 'tiger', label: 'Tiger' },
]
const countryOptions: SelectOption[] = [
  { value: 'argentina', label: 'Argentina' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'japan', label: 'Japan' },
  { value: 'france', label: 'France' },
  { value: 'italy', label: 'Italy' },
  { value: 'spain', label: 'Spain' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'iceland', label: 'Iceland' },
]
const dialogBasic = ref(false)
const dialogSizes = ref({ xs: false, sm: false, md: false, lg: false })
const dialogPlacements = ref({ top: false, center: false, bottom: false })
const dialogBlur = ref(false)
const dialogNoClose = ref(false)
const dialogScrollable = ref(false)

const selectedFruit = ref<string | number>('')
const selectedRole = ref<string | number>('')
const selectedState = ref<string | number>('california')
const selectedCountries = ref<(string | number)[]>(['japan', 'france'])

const tabItems: TabItem[] = [
  { key: 'photos', label: 'Photos' },
  { key: 'videos', label: 'Videos' },
  { key: 'music', label: 'Music' },
  { key: 'files', label: 'Files', disabled: true },
]
const activeTab = ref('photos')
const activeTab2 = ref('photos')
const activeTab3 = ref('photos')
const activeTab4 = ref('photos')
const activeTab5 = ref('photos')

// toast() is imported directly — imperative API

function demoUpload() {
  toast.promise(
    new Promise<{ filename: string }>(res => setTimeout(() => res({ filename: 'doc.pdf' }), 2000)),
    { loading: 'Uploading file...', success: (d) => `${d.filename} uploaded`, error: 'Upload failed' },
  )
}

function demoFail() {
  toast.promise(
    new Promise<void>((_, rej) => setTimeout(() => rej(new Error('Network error')), 2000)),
    { loading: 'Creating event...', success: 'Created', error: (e) => e.message },
  ).catch(() => {})
}

const toastPlacement = ref<string>('bottom-end')
const ddOpen = ref(false)

const cbTerms = ref(false)
const cbMarketing = ref(false)
const cbRequired = ref(false)
const cbPrimary = ref(true)
const cbSecondary = ref(false)
const cbSlot = ref(false)
const cbIndeterminate = ref(true)
const cbIndeterminateVal = ref(false)
const notif = ref({ email: true, sms: false, push: true })

const sw1 = ref(false)
const sw2 = ref(true)
const swSm = ref(false)
const swMd = ref(true)
const swLg = ref(false)
const swDark = ref(false)

const radioPlan = ref('pro')
const radioSize = ref('md')
const radioGender = ref('')
const radioPayment = ref('card')
const radioLocked = ref('a')

const taBio = ref('')
const taAutoResize = ref('')
const taFeedback = ref('')

const skeletonLoading = ref(true)
const showAlert = ref(true)

const calDate1 = ref<CalendarDate | null>(null)
const calDate2 = ref<CalendarDate | null>(null)
const calDate3 = ref<CalendarDate | null>(null)
const calDate4 = ref<CalendarDate | null>(null)
const calDatePicker = ref<CalendarDate | null>(null)

const range1 = ref<DateRange | null>(null)
const range2 = ref<DateRange | null>(null)
const rangePicker = ref<DateRange | null>(null)

const uploadProgress = ref(0)
const selectedSwatchColor = ref('#006FEE')

const cfBrand = ref('#006FEE')
const cfHex = ref('#17C964')
const cfRgb = ref('rgb(245, 165, 36)')
const themeColors = ref({ primary: '#006FEE', secondary: '#7828C8', background: '#ffffff', text: '#000000' })
const cfPresetColor = ref('#F31260')
const cfPresets = ['#006FEE', '#17C964', '#F5A524', '#F31260', '#7828C8', '#000000']

const csH = ref(220)
const csS = ref(80)
const csL = ref(50)
const csA = ref(1)
const csColor = computed(() => `hsla(${csH.value}, ${csS.value}%, ${csL.value}%, ${csA.value})`)

const caHue = ref(220)
const caArea = ref({ x: 80, y: 70 })
const caAlpha = ref(1)
const caColor = computed(() => {
  const s = caArea.value.x
  const v = caArea.value.y
  const l = v * (1 - s / 200)
  const sl = l === 0 || l === 100 ? 0 : ((v - l) / Math.min(l, 100 - l)) * 100
  return `hsla(${caHue.value}, ${sl.toFixed(0)}%, ${l.toFixed(0)}%, ${caAlpha.value})`
})

// DateField / TimeField
const dfDate = ref<DateFieldValue | null>(null)
const dfPreset = ref<DateFieldValue | null>({ year: 2025, month: 6, day: 15 })
const dfJp = ref<DateFieldValue | null>(null)
const dfDe = ref<DateFieldValue | null>(null)
const dfMonth = ref<DateFieldValue | null>(null)

const tfTime = ref<TimeFieldValue | null>(null)
const tf24 = ref<TimeFieldValue | null>(null)
const tfPreset = ref<TimeFieldValue | null>({ hour: 14, minute: 30 })
const tfSeconds = ref<TimeFieldValue | null>(null)

// DatePicker
const dpDate1 = ref<DateFieldValue | null>(null)
const dpDate2 = ref<DateFieldValue | null>(null)
const dpDate3 = ref<DateFieldValue | null>(null)
const dpDate4 = ref<DateFieldValue | null>(null)
const dpDate5 = ref<DateFieldValue | null>(null)
const dpDateEs = ref<DateFieldValue | null>(null)
const dpDateUp = ref<DateFieldValue | null>(null)
const dpFull = ref<DateFieldValue | null>(null)
const bookingDate = ref<DateFieldValue | null>(null)
const bookingTime = ref<string | number>('')
const timeSlots: SelectOption[] = [
  { value: '9am', label: '9:00 AM' },
  { value: '10am', label: '10:00 AM' },
  { value: '11am', label: '11:00 AM' },
  { value: '2pm', label: '2:00 PM' },
  { value: '3pm', label: '3:00 PM' },
]

// DateRangePicker
const drpRange1 = ref<DateRangeValue | null>(null)
const drpRange2 = ref<DateRangeValue | null>(null)
const drpRange3 = ref<DateRangeValue | null>(null)
const drpRange4 = ref<DateRangeValue | null>(null)
const drpRange5 = ref<DateRangeValue | null>(null)
const drpRangeEs = ref<DateRangeValue | null>(null)
const drpRangeUp = ref<DateRangeValue | null>(null)
const drpFull = ref<DateRangeValue | null>(null)
const hotelDates = ref<DateRangeValue | null>(null)
const hotelGuests = ref<string | number>('')

// Disclosure
const disclosureOpen = ref(false)
const disclosureGroupKeys = ref<string[]>([])
// Form
const formServerErrors = ref<Record<string, string | string[]>>({
  email: 'This email is already taken',
  username: ['Username too short', 'Only letters allowed'],
})
const loginErrors = ref<Record<string, string | string[]>>({})
const loginLoading = ref(false)
const globalError = ref<string | null>(null)

// InputOtp
const otp1 = ref('')
const otp2 = ref('')
const otp3 = ref('')
const otp4 = ref('')
const otp5 = ref('')
const otp6 = ref('')
const otp7 = ref('')
const otpShake = ref('')
const otpShakeErr = ref<string | undefined>(undefined)
const otpClear = ref('')
const otpClearErr = ref<string | undefined>(undefined)
const twoFaCode = ref('')
const twoFaError = ref<string | undefined>(undefined)
const isVerifying = ref(false)

function simulateWrongOtp() {
  otpShakeErr.value = 'Invalid code'
  setTimeout(() => { otpShakeErr.value = undefined }, 500)
}

function simulateClearOtp() {
  otpClearErr.value = 'Wrong code — clearing...'
  setTimeout(() => { otpClearErr.value = undefined }, 2000)
}

function verifyCode() {
  isVerifying.value = true
  twoFaError.value = undefined
  setTimeout(() => {
    isVerifying.value = false
    if (twoFaCode.value !== '123456') {
      twoFaError.value = 'Invalid code'
      setTimeout(() => { twoFaError.value = undefined }, 2000)
    } else {
      toast.success('Verified!')
    }
  }, 1500)
}

function handleLoginSubmit() {
  loginLoading.value = true
  loginErrors.value = {}
  setTimeout(() => {
    loginErrors.value = { email: 'Invalid credentials' }
    loginLoading.value = false
  }, 1500)
}

function handleFormWithError() {
  globalError.value = 'Something went wrong. Please try again.'
}

// NumberField
const nfQty = ref<number | null>(1)
const nfRating = ref<number | null>(5)
const nfPrice = ref<number | null>(29.99)
const nfPercent = ref<number | null>(0.5)
const nfPlain = ref<number | null>(null)
const nfV1 = ref<number | null>(0)
const nfV2 = ref<number | null>(0)
const nfS1 = ref<number | null>(0)
const nfS2 = ref<number | null>(0)
const nfS3 = ref<number | null>(0)
const nfFw = ref<number | null>(0)
const nfCart = ref<number | null>(1)
const nfFontSize = ref<number | null>(16)
const nfOpacity = ref<number | null>(100)
const nfColumns = ref<number | null>(3)
const nfChevron = ref<number | null>(50)
const nfVolume = ref<number | null>(75)

// Pagination
const pg1 = ref(1)
const pg2 = ref(1)
const pg3 = ref(1)
const pg4 = ref(1)
const pg5 = ref(1)
const pg6 = ref(1)
const pg7 = ref(1)
const pg8 = ref(1)
const pg9 = ref(1)
const pg10 = ref(1)
const pg11 = ref(1)
const pg12 = ref(1)
const pgTable = ref(1)

// Table
const tblColumns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true, resizable: true },
  { key: 'role', label: 'Role', sortable: true, resizable: true },
  { key: 'status', label: 'Status', resizable: true },
  { key: 'age', label: 'Age', sortable: true, align: 'right', resizable: true },
]
const tblRows = [
  { id: '1', name: 'Carlos Roca', role: 'Developer', status: 'active', age: 28 },
  { id: '2', name: 'Ana Torres', role: 'Designer', status: 'inactive', age: 32 },
  { id: '3', name: 'Luis Mora', role: 'Manager', status: 'active', age: 45 },
  { id: '4', name: 'Sara Jiménez', role: 'Developer', status: 'pending', age: 24 },
  { id: '5', name: 'Pedro Gómez', role: 'Designer', status: 'active', age: 36 },
]
const tblSelected = ref(new Set<string>())
const tblSort = ref<SortDescriptor>({ column: 'name', direction: 'asc' })
const tblPage = ref(1)

// Slider
const sl1 = ref(50)
const slRange = ref<[number, number]>([20, 80])
const slRating = ref(5)
const slBudget = ref(500)
const slOpacity = ref(0.75)
const slV1 = ref(50)
const slV2 = ref(30)
const slV3 = ref(70)
const slPlain = ref(40)
const slPriceRange = ref<[number, number]>([100, 700])
const slSm = ref(40)
const slMd = ref(50)
const slLg = ref(60)
const slC1 = ref(50)
const slC2 = ref(50)
const slC3 = ref(50)
const slC4 = ref(50)
const slC5 = ref(50)
const slHsl = ref({ h: 220, s: 80, l: 50 })
const slEq = ref<Record<string, number>>({ '60Hz': 0, '250Hz': 3, '1kHz': -2, '4kHz': 5, '16kHz': 1 })

const tableRows = [
  { id: 1, name: 'Alice Johnson', status: 'Active', color: 'success' as const, date: 'Apr 1, 2025' },
  { id: 2, name: 'Bob Smith', status: 'Pending', color: 'warning' as const, date: 'Apr 2, 2025' },
  { id: 3, name: 'Carol Davis', status: 'Active', color: 'success' as const, date: 'Apr 3, 2025' },
  { id: 4, name: 'Dan Wilson', status: 'Inactive', color: 'danger' as const, date: 'Apr 4, 2025' },
  { id: 5, name: 'Eve Martinez', status: 'Active', color: 'success' as const, date: 'Apr 5, 2025' },
]

const faqItems = [
  { id: '1', question: 'What is Ousi UI?', answer: 'Ousi UI is a Vue 3 component library inspired by HeroUI v3, built with Tailwind CSS v4 and CVA.' },
  { id: '2', question: 'How do I install it?', answer: 'Run pnpm add @ousi-ui/vue @ousi-ui/theme and import the CSS in your entry file.' },
  { id: '3', question: 'Does it support dark mode?', answer: 'Yes! Add data-theme="dark" to your root element and all components adapt automatically.' },
  { id: '4', question: 'Is it SSR-safe?', answer: 'Absolutely. All composables check for browser APIs before using them.' },
]

const circleProgress = ref(0)
const circleTimer = setInterval(() => {
  if (circleProgress.value >= 100) { clearInterval(circleTimer); return }
  circleProgress.value += 5
}, 200)

const uploadInterval = setInterval(() => {
  if (uploadProgress.value >= 100) { clearInterval(uploadInterval); return }
  uploadProgress.value += 5
}, 300)

const acCountry = ref<string | number>('')
const acLang = ref<string | number>('')
const countryAcOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
  { value: 'in', label: 'India' },
  { value: 'mx', label: 'Mexico' },
]
const langAcOptions = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'py', label: 'Python', disabled: true },
  { value: 'go', label: 'Go', disabled: true },
  { value: 'rs', label: 'Rust' },
  { value: 'kt', label: 'Kotlin' },
]

function demoManualLoading() {
  const id = toast('Saving changes...', { isLoading: true, timeout: 0 })
  setTimeout(() => { toast.close(id); toast.success('Changes saved!') }, 2000)
}

const isDark = ref(false)
onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
})
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="min-h-screen px-8 py-12 max-w-6xl mx-auto">
    <!-- Header -->
    <header class="mb-16 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-4xl font-bold tracking-tight text-ousi-foreground">
          Ousi UI
          <span class="text-ousi-accent">Playground</span>
        </h1>
        <p class="mt-2 text-ousi-muted text-lg">
          Design system showcase — HeroUI-inspired tokens.
        </p>
      </div>

      <!-- Theme toggle -->
      <button
        class="mt-1 flex items-center gap-2 rounded-full bg-ousi-default px-4 py-2 text-sm font-medium text-ousi-default-foreground transition-colors hover:bg-ousi-default-hover"
        @click="toggleTheme"
      >
        <!-- Sun icon -->
        <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Moon icon -->
        <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        {{ isDark ? 'Light' : 'Dark' }}
      </button>
    </header>

    <!-- ═══════════ BUTTON ═══════════ -->
    <div class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Button</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Button: All Variants -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton
          v-for="v in buttonVariants"
          :key="v"
          :variant="v"
        >
          {{ v }}
        </OButton>
      </div>
    </section>

    <!-- Button: Sizes -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton
          v-for="s in buttonSizes"
          :key="s"
          :size="s"
          variant="primary"
        >
          {{ s.toUpperCase() }}
        </OButton>
      </div>
    </section>

    <!-- Button: Colors — solid & soft side by side -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">Color Intents</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="primary">Accent</OButton>
        <OButton variant="soft">Accent Soft</OButton>
        <OButton variant="danger">Danger</OButton>
        <OButton variant="danger-soft">Danger Soft</OButton>
        <OButton variant="secondary">Secondary</OButton>
        <OButton variant="outline">Outline</OButton>
        <OButton variant="ghost">Ghost</OButton>
      </div>
    </section>

    <!-- Button: States -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">States</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OButton variant="primary">Default</OButton>
        <OButton variant="primary" disabled>Disabled</OButton>
        <OButton variant="primary" loading>Loading</OButton>
        <OButton variant="primary" full-width class="mt-2">Full Width</OButton>
      </div>
    </section>

    <!-- Button: Icon Only -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">Icon Only</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton
          v-for="s in buttonSizes"
          :key="s"
          :size="s"
          variant="secondary"
          is-icon-only
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </OButton>
        <OButton variant="danger" is-icon-only>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </OButton>
      </div>
    </section>

    <!-- Button: Slots -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold text-ousi-foreground mb-4">Slots</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="primary">
          <template #start>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </template>
          Start icon
        </OButton>
        <OButton variant="outline">
          End icon
          <template #end>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </template>
        </OButton>
      </div>
    </section>

    <!-- ═══════════ RADIUS SCALE ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Radius Scale</h1>
      <p class="text-ousi-muted mt-1">
        Base: <code class="text-ousi-accent">--ousi-radius: 0.5rem</code> — all values computed from base.
      </p>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <section class="mb-12">
      <div class="flex items-end gap-4 flex-wrap">
        <div
          v-for="r in radiusSteps"
          :key="r"
          class="flex flex-col items-center gap-2"
        >
          <div
            class="h-16 w-16 bg-ousi-accent"
            :class="`rounded-ousi-${r}`"
          />
          <span class="text-xs text-ousi-muted font-mono">{{ r }}</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <div class="h-16 w-16 bg-ousi-accent rounded-full" />
          <span class="text-xs text-ousi-muted font-mono">full</span>
        </div>
      </div>
    </section>

    <!-- ═══════════ COLOR SWATCHES ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Colors</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <section class="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div v-for="color in ['accent', 'success', 'warning', 'danger']" :key="color">
        <div
          class="h-20 rounded-ousi-xl flex items-end p-3"
          :class="`bg-ousi-${color}`"
        >
          <span
            class="text-sm font-medium capitalize"
            :class="`text-ousi-${color}-foreground`"
          >{{ color }}</span>
        </div>
        <div
          class="h-12 mt-2 rounded-ousi-xl flex items-center px-3"
          :class="`bg-ousi-${color}-soft`"
        >
          <span
            class="text-sm font-medium capitalize"
            :class="`text-ousi-${color}-soft-foreground`"
          >{{ color }} soft</span>
        </div>
      </div>
    </section>

    <!-- Neutral surfaces -->
    <section class="mb-12">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Surfaces</h2>
      <div class="grid grid-cols-3 gap-3">
        <div class="h-16 rounded-ousi-xl bg-ousi-surface flex items-center justify-center">
          <span class="text-xs text-ousi-muted font-mono">surface</span>
        </div>
        <div class="h-16 rounded-ousi-xl bg-ousi-surface-secondary flex items-center justify-center">
          <span class="text-xs text-ousi-muted font-mono">surface-secondary</span>
        </div>
        <div class="h-16 rounded-ousi-xl bg-ousi-surface-tertiary flex items-center justify-center">
          <span class="text-xs text-ousi-muted font-mono">surface-tertiary</span>
        </div>
      </div>
    </section>

    <!-- ═══════════ CHIP ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Chip</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <section
      v-for="bv in chipVariants"
      :key="'badge-' + bv"
      class="mb-8"
    >
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3 capitalize">{{ bv }}</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OChip
          v-for="bc in chipColors"
          :key="bc"
          :variant="bv"
          :color="bc"
        >
          {{ bc }}
        </OChip>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Sizes</h2>
      <div class="flex items-center gap-3">
        <OChip v-for="bs in chipSizes" :key="bs" :size="bs" color="accent">{{ bs }}</OChip>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Slots</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OChip variant="soft" color="success">
          <template #start>
            <span class="w-1.5 h-1.5 rounded-full bg-ousi-success" />
          </template>
          Online
        </OChip>
        <OChip variant="soft" color="danger">
          <template #start>
            <span class="w-1.5 h-1.5 rounded-full bg-ousi-danger" />
          </template>
          Offline
        </OChip>
        <OChip variant="outline" color="default">
          Tag
          <template #end>
            <button class="ml-0.5 -mr-1 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center hover:bg-ousi-default" aria-label="Remove">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>
        </OChip>
      </div>
    </section>

    <!-- ═══════════ AVATAR ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Avatar</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Sizes</h2>
      <div class="flex items-end gap-4 flex-wrap">
        <OAvatar v-for="s in avatarSizes" :key="s" :size="s" name="Carlos Roca" />
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Square</h2>
      <div class="flex items-end gap-4 flex-wrap">
        <OAvatar v-for="s in avatarSizes" :key="s" :size="s" shape="square" name="Carlos Roca" />
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">With Image</h2>
      <div class="flex items-end gap-4">
        <OAvatar src="https://i.pravatar.cc/80?u=a" alt="User A" size="sm" />
        <OAvatar src="https://i.pravatar.cc/80?u=b" alt="User B" size="md" />
        <OAvatar src="https://i.pravatar.cc/80?u=c" alt="User C" size="lg" />
        <OAvatar src="https://i.pravatar.cc/80?u=d" alt="User D" size="xl" />
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Fallbacks</h2>
      <div class="flex items-end gap-4 flex-wrap">
        <div class="text-center">
          <OAvatar name="Carlos Roca" size="lg" />
          <p class="text-xs text-ousi-muted mt-2">Initials</p>
        </div>
        <div class="text-center">
          <OAvatar src="https://broken.invalid/nope.jpg" name="Fallback User" size="lg" />
          <p class="text-xs text-ousi-muted mt-2">Broken src</p>
        </div>
        <div class="text-center">
          <OAvatar size="lg" />
          <p class="text-xs text-ousi-muted mt-2">Generic</p>
        </div>
        <div class="text-center">
          <OAvatar size="lg">
            <template #fallback>
              <span class="text-lg">?</span>
            </template>
          </OAvatar>
          <p class="text-xs text-ousi-muted mt-2">Custom</p>
        </div>
      </div>
    </section>

    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-3">Group</h2>
      <div class="flex items-center -space-x-3">
        <OAvatar class="ring-2 ring-ousi-background" src="https://i.pravatar.cc/80?u=e" alt="User E" />
        <OAvatar class="ring-2 ring-ousi-background" src="https://i.pravatar.cc/80?u=f" alt="User F" />
        <OAvatar class="ring-2 ring-ousi-background" src="https://i.pravatar.cc/80?u=g" alt="User G" />
        <OAvatar class="ring-2 ring-ousi-background" name="+3" />
      </div>
    </section>

    <!-- ═══════════ INPUT ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Input</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Input: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OInput label="Primary" placeholder="Primary variant" variant="primary" full-width />
        <OInput label="Secondary" placeholder="Secondary variant" variant="secondary" full-width />
      </div>
    </section>

    <!-- Input: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <OInput label="Small" placeholder="Size sm" size="sm" full-width />
        <OInput label="Medium" placeholder="Size md" size="md" full-width />
        <OInput label="Large" placeholder="Size lg" size="lg" full-width />
      </div>
    </section>

    <!-- Input: Label + Description -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Label &amp; Description</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OInput
          v-model="inputDemo"
          label="Email"
          placeholder="you@example.com"
          type="email"
          description="We'll never share your email."
          full-width
        />
        <OInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          required
          full-width
        />
      </div>
    </section>

    <!-- Input: Error state -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Error State</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OInput
          label="Email"
          placeholder="you@example.com"
          error-message="Please enter a valid email address."
          model-value="bad-email"
          full-width
        />
        <OInput
          label="Email (secondary)"
          placeholder="you@example.com"
          error-message="This email is already taken."
          model-value="taken@email.com"
          variant="secondary"
          full-width
        />
      </div>
    </section>

    <!-- Input: Disabled & Readonly -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled &amp; Readonly</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OInput
          label="Disabled"
          placeholder="Can't type here"
          disabled
          model-value="Disabled value"
          full-width
        />
        <OInput
          label="Readonly"
          placeholder="Can't edit"
          readonly
          model-value="Readonly value"
          full-width
        />
      </div>
    </section>

    <!-- Input: Clearable -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Clearable</h2>
      <div class="max-w-sm">
        <OInput
          v-model="clearableDemo"
          label="Search"
          placeholder="Type something…"
          clearable
          full-width
        />
        <p class="text-xs text-ousi-muted mt-2 font-mono">value: "{{ clearableDemo }}"</p>
      </div>
    </section>

    <!-- Input: Loading -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Loading</h2>
      <div class="max-w-sm">
        <OInput
          label="Verifying"
          placeholder="Checking availability…"
          loading
          model-value="ousi-ui"
          full-width
        />
      </div>
    </section>

    <!-- Input: Slots -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Slots</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <OInput label="Website" placeholder="example.com" full-width>
          <template #start>
            <span class="text-ousi-muted text-sm">https://</span>
          </template>
        </OInput>
        <OInput label="Price" placeholder="0.00" type="number" full-width>
          <template #start>
            <span class="text-ousi-muted text-sm">$</span>
          </template>
          <template #end>
            <span class="text-ousi-muted text-sm">USD</span>
          </template>
        </OInput>
        <OInput label="Search" placeholder="Search…" full-width>
          <template #start>
            <svg class="w-4 h-4 text-ousi-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </OInput>
        <OInput label="Email" placeholder="you@example.com" type="email" full-width>
          <template #end>
            <svg class="w-4 h-4 text-ousi-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </template>
        </OInput>
      </div>
    </section>

    <!-- Input: Full width -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Full Width</h2>
      <OInput label="Full width input" placeholder="This stretches to fill the container" full-width />
    </section>

    <!-- ═══════════ CARD ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Card</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Card: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OCard v-for="v in (['transparent', 'default', 'secondary', 'tertiary'] as const)" :key="v" :variant="v">
          <OCard.Header>
            <OCard.Title>{{ v.charAt(0).toUpperCase() + v.slice(1) }}</OCard.Title>
            <OCard.Description>The {{ v }} card variant.</OCard.Description>
          </OCard.Header>
          <OCard.Content>
            <p class="text-sm text-ousi-muted">Card content goes here. This shows the visual difference between variants.</p>
          </OCard.Content>
          <OCard.Footer>
            <OButton size="sm" variant="secondary">Action</OButton>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <!-- Card: Horizontal layout -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Horizontal Layout</h2>
      <OCard class="flex-row items-stretch max-w-lg" variant="secondary">
        <div class="w-32 shrink-0 rounded-ousi-xl overflow-hidden bg-ousi-accent/20 flex items-center justify-center">
          <svg class="w-10 h-10 text-ousi-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </div>
        <div class="flex flex-col gap-2 py-1">
          <OCard.Header>
            <OCard.Title>Horizontal Card</OCard.Title>
            <OCard.Description>Image on the left, content on the right.</OCard.Description>
          </OCard.Header>
          <OCard.Content>
            <p class="text-sm text-ousi-muted">Achieved with <code class="text-ousi-accent">class="flex-row"</code> on the Card.</p>
          </OCard.Content>
        </div>
      </OCard>
    </section>

    <!-- Card: With Avatar -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Avatar</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <OCard variant="secondary">
          <div class="h-28 -mx-4 -mt-4 rounded-t-ousi-4xl overflow-hidden bg-ousi-accent/15 flex items-center justify-center">
            <svg class="w-12 h-12 text-ousi-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <OCard.Header>
            <OCard.Title>Project Alpha</OCard.Title>
            <OCard.Description>A design system built with Vue 3.</OCard.Description>
          </OCard.Header>
          <OCard.Footer class="gap-2">
            <OAvatar name="Carlos Roca" size="sm" />
            <span class="text-sm text-ousi-foreground">Carlos Roca</span>
          </OCard.Footer>
        </OCard>

        <OCard variant="secondary">
          <div class="h-28 -mx-4 -mt-4 rounded-t-ousi-4xl overflow-hidden bg-ousi-success/15 flex items-center justify-center">
            <svg class="w-12 h-12 text-ousi-success/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <OCard.Header>
            <OCard.Title>Project Beta</OCard.Title>
            <OCard.Description>An open-source component library.</OCard.Description>
          </OCard.Header>
          <OCard.Footer class="gap-2">
            <OAvatar name="Ana Torres" size="sm" />
            <span class="text-sm text-ousi-foreground">Ana Torres</span>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <!-- Card: With Form -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Form</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Header>
          <OCard.Title class="text-base">Login</OCard.Title>
          <OCard.Description>Enter your credentials to continue.</OCard.Description>
        </OCard.Header>
        <OCard.Content class="gap-3">
          <OInput label="Email" placeholder="you@example.com" type="email" variant="secondary" full-width />
          <OInput label="Password" placeholder="Enter password" type="password" variant="secondary" full-width />
        </OCard.Content>
        <OCard.Footer>
          <OButton variant="primary" full-width>Sign In</OButton>
        </OCard.Footer>
      </OCard>
    </section>

    <!-- Card: As link -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Card as Link</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <OCard as="a" href="#" variant="secondary" class="hover:bg-ousi-surface-tertiary transition-colors cursor-pointer no-underline">
          <OCard.Header>
            <OCard.Title>Documentation</OCard.Title>
            <OCard.Description>Read the full API reference and guides.</OCard.Description>
          </OCard.Header>
          <OCard.Footer class="text-ousi-accent text-sm gap-1">
            Learn more
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </OCard.Footer>
        </OCard>

        <OCard as="a" href="#" variant="secondary" class="hover:bg-ousi-surface-tertiary transition-colors cursor-pointer no-underline">
          <OCard.Header>
            <OCard.Title>GitHub</OCard.Title>
            <OCard.Description>Star the repo and contribute.</OCard.Description>
          </OCard.Header>
          <OCard.Footer class="text-ousi-accent text-sm gap-1">
            View source
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <!-- Card: With Images (HeroUI-style grid) -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Images</h2>

      <div class="grid w-full max-w-2xl grid-cols-12 gap-4">

        <!-- Row 1: Large banner card -->
        <OCard class="col-span-12 flex-col sm:flex-row min-h-[152px]">
          <div class="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
            <img
              alt="Cherries"
              class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
              loading="lazy"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
            />
          </div>
          <div class="flex flex-1 flex-col gap-3">
            <OCard.Header class="gap-1">
              <OCard.Title class="pr-8">Become an ACME Creator!</OCard.Title>
              <OCard.Description>
                Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet faucibus etiam.
              </OCard.Description>
            </OCard.Header>
            <OCard.Footer class="mt-auto flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-ousi-foreground">Only 10 spots</span>
                <span class="text-xs text-ousi-muted">Submission ends Oct 10.</span>
              </div>
              <OButton class="w-full sm:w-auto">Apply Now</OButton>
            </OCard.Footer>
          </div>
        </OCard>

        <!-- Row 2 -->
        <div class="col-span-12 grid grid-cols-12 gap-4">

          <!-- Left column -->
          <div class="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6">

            <!-- Payment notification card -->
            <OCard class="col-span-12">
              <OCard.Header class="gap-3 flex-row">
                <svg class="text-ousi-accent size-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-medium text-ousi-muted uppercase">Payment</span>
                  <OCard.Title class="pr-8 text-sm sm:text-base">You can now withdraw on crypto</OCard.Title>
                  <OCard.Description class="text-xs sm:text-sm">Add your wallet in settings to withdraw</OCard.Description>
                </div>
              </OCard.Header>
              <OCard.Footer>
                <a href="#" class="text-sm text-ousi-accent flex items-center gap-1 hover:underline">
                  Go to settings
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </OCard.Footer>
            </OCard>

            <!-- Community cards -->
            <div class="col-span-12 grid grid-cols-12 gap-4">
              <OCard class="col-span-12 gap-2 sm:col-span-6">
                <OCard.Header>
                  <OAvatar
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
                    alt="Indie Hackers"
                    shape="square"
                    size="xl"
                    class="rounded-xl !h-14 !w-14"
                  />
                </OCard.Header>
                <OCard.Content class="mt-1">
                  <p class="text-sm leading-4 font-medium text-ousi-foreground">Indie Hackers</p>
                  <p class="text-xs text-ousi-muted">148 members</p>
                </OCard.Content>
                <OCard.Footer class="gap-2">
                  <OAvatar
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
                    alt="John"
                    size="sm"
                    class="!h-4 !w-4"
                  />
                  <p class="text-xs text-ousi-muted">By John</p>
                </OCard.Footer>
              </OCard>

              <OCard class="col-span-12 gap-2 sm:col-span-6">
                <OCard.Header>
                  <OAvatar
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg"
                    alt="AI Builders"
                    shape="square"
                    size="xl"
                    class="rounded-xl !h-14 !w-14"
                  />
                </OCard.Header>
                <OCard.Content class="mt-1">
                  <p class="text-sm leading-4 font-medium text-ousi-foreground">AI Builders</p>
                  <p class="text-xs text-ousi-muted">362 members</p>
                </OCard.Content>
                <OCard.Footer class="gap-2">
                  <OAvatar
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                    alt="Martha"
                    size="sm"
                    class="!h-4 !w-4"
                  />
                  <p class="text-xs text-ousi-muted">By Martha</p>
                </OCard.Footer>
              </OCard>
            </div>
          </div>

          <!-- Right column: Full image card -->
          <OCard class="col-span-12 min-h-[200px] overflow-hidden rounded-3xl lg:col-span-6">
            <img
              alt="NEO Home Robot"
              aria-hidden="true"
              class="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo2.jpeg"
            />
            <OCard.Header class="z-10">
              <OCard.Title class="text-xs font-semibold tracking-wide text-black/70">NEO</OCard.Title>
              <OCard.Description class="text-sm leading-5 font-medium text-black/50">Home Robot</OCard.Description>
            </OCard.Header>
            <OCard.Footer class="z-10 mt-auto justify-between">
              <div>
                <div class="text-sm font-medium text-black">Available soon</div>
                <div class="text-xs text-black/60">Get notified</div>
              </div>
              <OButton size="sm" class="bg-white text-black hover:bg-white/90">Notify me</OButton>
            </OCard.Footer>
          </OCard>
        </div>

        <!-- Row 3 -->
        <div class="col-span-12 grid grid-cols-12 gap-4">

          <!-- Left: Large image card -->
          <OCard class="relative col-span-12 h-[250px] sm:h-[300px] md:col-span-8 md:h-[350px]">
            <img
              alt="NEO Robot"
              aria-hidden="true"
              class="absolute inset-0 h-full w-full object-cover"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg"
            />
            <OCard.Footer class="z-10 mt-auto items-end justify-between">
              <div>
                <div class="text-base font-medium text-black sm:text-lg">NEO</div>
                <div class="text-xs font-medium text-black/50 sm:text-sm">$499/m</div>
              </div>
              <OButton size="sm" class="bg-white text-black hover:bg-white/90">Get now</OButton>
            </OCard.Footer>
          </OCard>

          <!-- Right: Events stack -->
          <div class="col-span-12 flex flex-col gap-2 md:col-span-4 md:justify-between md:gap-0 md:py-2">
            <OCard class="flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Futuristic Robot"
                class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg"
              />
              <div class="flex flex-1 flex-col justify-center gap-1">
                <OCard.Title class="text-sm">Bridging the Future</OCard.Title>
                <OCard.Description class="text-xs">Today, 6:30 PM</OCard.Description>
              </div>
            </OCard>

            <OCard class="flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Avocado"
                class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg"
              />
              <div class="flex flex-1 flex-col justify-center gap-1">
                <OCard.Title class="text-sm">Avocado Hackathon</OCard.Title>
                <OCard.Description class="text-xs">Wed, 4:30 PM</OCard.Description>
              </div>
            </OCard>

            <OCard class="flex-row gap-3 p-1" variant="transparent">
              <img
                alt="Sound Electro event"
                class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                loading="lazy"
                src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg"
              />
              <div class="flex flex-1 flex-col justify-center gap-1">
                <OCard.Title class="text-sm">Sound Electro | Beyond art</OCard.Title>
                <OCard.Description class="text-xs">Fri, 8:00 PM</OCard.Description>
              </div>
            </OCard>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ TOOLTIP ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Tooltip</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Tooltip: Placements -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Placements</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OTooltip content="Top tooltip" placement="top">
          <OButton variant="secondary" size="sm">Top</OButton>
        </OTooltip>
        <OTooltip content="Bottom tooltip" placement="bottom">
          <OButton variant="secondary" size="sm">Bottom</OButton>
        </OTooltip>
        <OTooltip content="Left tooltip" placement="left">
          <OButton variant="secondary" size="sm">Left</OButton>
        </OTooltip>
        <OTooltip content="Right tooltip" placement="right">
          <OButton variant="secondary" size="sm">Right</OButton>
        </OTooltip>
      </div>
    </section>

    <!-- Tooltip: Arrow & Offset -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Arrow &amp; Offset</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OTooltip content="With arrow (default)" :delay="0">
          <OButton variant="secondary" size="sm">With Arrow</OButton>
        </OTooltip>
        <OTooltip content="No arrow" :show-arrow="false" :delay="0">
          <OButton variant="secondary" size="sm">No Arrow</OButton>
        </OTooltip>
        <OTooltip content="Custom offset (20px)" :offset="20" :delay="0">
          <OButton variant="secondary" size="sm">Offset 20</OButton>
        </OTooltip>
      </div>
    </section>

    <!-- Tooltip: Disabled -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled</h2>
      <div class="flex items-center gap-4">
        <OTooltip content="This won't show" :disabled="true">
          <OButton variant="secondary" size="sm" disabled>Disabled tooltip</OButton>
        </OTooltip>
      </div>
    </section>

    <!-- Tooltip: On inline text -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Inline Text</h2>
      <p class="text-sm text-ousi-foreground">
        Hover over
        <OTooltip content="This is an important technical term with a longer explanation.">
          <span class="underline decoration-dotted cursor-help text-ousi-accent">this term</span>
        </OTooltip>
        for more info.
      </p>
    </section>

    <!-- Tooltip: Custom delay -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Delay</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OTooltip content="Instant (0ms)" :delay="0">
          <OButton variant="secondary" size="sm">No delay</OButton>
        </OTooltip>
        <OTooltip content="Fast (100ms)" :delay="100">
          <OButton variant="secondary" size="sm">100ms</OButton>
        </OTooltip>
        <OTooltip content="Default (200ms)">
          <OButton variant="secondary" size="sm">200ms (default)</OButton>
        </OTooltip>
        <OTooltip content="Slow (1000ms)" :delay="1000">
          <OButton variant="secondary" size="sm">1000ms</OButton>
        </OTooltip>
      </div>
    </section>

    <!-- ═══════════ SELECT ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Select</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Select: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OSelect
          v-model="selectedFruit"
          :options="fruitOptions"
          label="Favorite fruit"
          placeholder="Pick a fruit"
          full-width
        />
        <div class="flex flex-col gap-1 justify-end">
          <p class="text-xs text-ousi-muted font-mono">v-model: "{{ selectedFruit }}"</p>
        </div>
      </div>
    </section>

    <!-- Select: Controlled with default value -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Controlled</h2>
      <div class="max-w-[256px] space-y-2">
        <OSelect
          v-model="selectedState"
          :options="stateOptions"
          label="State (controlled)"
          placeholder="Select a state"
          full-width
        />
        <p class="text-xs text-ousi-muted font-mono">Selected: {{ stateOptions.find(s => s.value === selectedState)?.label || 'None' }}</p>
      </div>
    </section>

    <!-- Select: Multiple -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Multiple Select</h2>
      <div class="max-w-[256px] space-y-2">
        <OSelect
          :options="countryOptions"
          multiple
          label="Countries to Visit"
          placeholder="Select countries"
          full-width
        />
      </div>
    </section>

    <!-- Select: Controlled Multiple -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Controlled Multiple</h2>
      <div class="max-w-[256px] space-y-2">
        <OSelect
          v-model="selectedCountries"
          :options="countryOptions"
          multiple
          label="Countries (controlled)"
          placeholder="Select countries"
          full-width
        />
        <p class="text-xs text-ousi-muted font-mono">
          Selected: {{ selectedCountries.length > 0 ? selectedCountries.join(', ') : 'None' }}
        </p>
      </div>
    </section>

    <!-- Select: Description & Error -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Description &amp; Error</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OSelect
          v-model="selectedRole"
          :options="roleOptions"
          label="Role"
          description="Select your role in the organization"
          full-width
        />
        <OSelect
          :options="roleOptions"
          label="Required field"
          error-message="This field is required"
          required
          full-width
        />
      </div>
    </section>

    <!-- Select: With disabled options -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Disabled Options</h2>
      <div class="max-w-[256px]">
        <OSelect
          :options="animalOptions"
          label="Animal"
          placeholder="Select an animal"
          full-width
        />
        <p class="text-xs text-ousi-muted mt-1">Cat and Kangaroo are disabled.</p>
      </div>
    </section>

    <!-- Select: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OSelect :options="stateOptions" label="Primary" variant="primary" placeholder="Select one" full-width />
        <OSelect :options="stateOptions" label="Secondary" variant="secondary" placeholder="Select one" full-width />
      </div>
    </section>

    <!-- Select: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <OSelect :options="fruitOptions" size="sm" placeholder="Small" full-width />
        <OSelect :options="fruitOptions" size="md" placeholder="Medium" full-width />
        <OSelect :options="fruitOptions" size="lg" placeholder="Large" full-width />
      </div>
    </section>

    <!-- Select: In Card (secondary variant) -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Card</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Header>
          <OCard.Title class="text-base">Settings</OCard.Title>
          <OCard.Description>Configure your preferences.</OCard.Description>
        </OCard.Header>
        <OCard.Content class="gap-3">
          <OSelect
            :options="stateOptions"
            label="State"
            placeholder="Select one"
            variant="secondary"
            required
            full-width
          />
          <OSelect
            :options="roleOptions"
            label="Role"
            placeholder="Select a role"
            variant="secondary"
            full-width
          />
        </OCard.Content>
        <OCard.Footer>
          <OButton variant="primary" full-width>Save</OButton>
        </OCard.Footer>
      </OCard>
    </section>

    <!-- Select: Disabled & Full Width -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled &amp; Full Width</h2>
      <div class="flex flex-col gap-4 max-w-lg">
        <OSelect :options="stateOptions" label="Disabled" disabled model-value="california" full-width />
        <OSelect :options="fruitOptions" label="Full width" placeholder="Stretches to container" full-width />
      </div>
    </section>

    <!-- ═══════════ DIALOG ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Dialog</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Dialog: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <OButton @click="dialogBasic = true">Open Dialog</OButton>
      <ODialog v-model="dialogBasic">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Are you sure?" />
          <ODialog.Body>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </ODialog.Body>
          <ODialog.Footer>
            <OButton variant="ghost" @click="close">Cancel</OButton>
            <OButton variant="danger" @click="close">Delete Account</OButton>
          </ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- Dialog: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="dialogSizes.xs = true">XS</OButton>
        <OButton variant="secondary" size="sm" @click="dialogSizes.sm = true">SM</OButton>
        <OButton variant="secondary" size="sm" @click="dialogSizes.md = true">MD</OButton>
        <OButton variant="secondary" size="sm" @click="dialogSizes.lg = true">LG</OButton>
      </div>
      <ODialog v-model="dialogSizes.xs" size="xs">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Extra Small" />
          <ODialog.Body>A compact dialog for quick confirmations.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">OK</OButton></ODialog.Footer>
        </template>
      </ODialog>
      <ODialog v-model="dialogSizes.sm" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Small" />
          <ODialog.Body>A small dialog with moderate content space.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">OK</OButton></ODialog.Footer>
        </template>
      </ODialog>
      <ODialog v-model="dialogSizes.md" size="md">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Medium (default)" />
          <ODialog.Body>The default dialog size, suitable for most use cases.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">OK</OButton></ODialog.Footer>
        </template>
      </ODialog>
      <ODialog v-model="dialogSizes.lg" size="lg">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Large" />
          <ODialog.Body>A large dialog for complex content or forms.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">OK</OButton></ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- Dialog: Placements -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Placements</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="dialogPlacements.top = true">Top</OButton>
        <OButton variant="secondary" size="sm" @click="dialogPlacements.center = true">Center</OButton>
        <OButton variant="secondary" size="sm" @click="dialogPlacements.bottom = true">Bottom</OButton>
      </div>
      <ODialog v-model="dialogPlacements.top" placement="top" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Top Placement" />
          <ODialog.Body>This dialog appears at the top of the viewport.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">Close</OButton></ODialog.Footer>
        </template>
      </ODialog>
      <ODialog v-model="dialogPlacements.center" placement="center" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Center Placement" />
          <ODialog.Body>This dialog appears centered vertically.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">Close</OButton></ODialog.Footer>
        </template>
      </ODialog>
      <ODialog v-model="dialogPlacements.bottom" placement="bottom" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Bottom Placement" />
          <ODialog.Body>This dialog appears at the bottom, like a mobile sheet.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">Close</OButton></ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- Dialog: Blur backdrop -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Blur Backdrop</h2>
      <OButton variant="secondary" @click="dialogBlur = true">Blur Backdrop</OButton>
      <ODialog v-model="dialogBlur" backdrop="blur" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Blurred Background" />
          <ODialog.Body>The backdrop uses a blur filter for a frosted glass effect.</ODialog.Body>
          <ODialog.Footer><OButton size="sm" @click="close">Close</OButton></ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- Dialog: No close button -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">No Close Button</h2>
      <OButton variant="secondary" @click="dialogNoClose = true">No Close Button</OButton>
      <ODialog v-model="dialogNoClose" :hide-close-button="true" size="sm">
        <template #default="{ close }">
          <ODialog.Header title="Custom Close" />
          <ODialog.Body>This dialog has no X button. Use the button below or press Escape.</ODialog.Body>
          <ODialog.Footer><OButton @click="close">Got it</OButton></ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- Dialog: Scrollable content -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Scrollable Content</h2>
      <OButton variant="secondary" @click="dialogScrollable = true">Scrollable Content</OButton>
      <ODialog v-model="dialogScrollable" scroll-behavior="inside" size="sm">
        <template #default="{ titleId, close }">
          <ODialog.Header :title-id="titleId" title="Long Content" />
          <ODialog.Body scroll-behavior="inside" class="max-h-60">
            <p v-for="i in 20" :key="i" class="mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Paragraph {{ i }}.
            </p>
          </ODialog.Body>
          <ODialog.Footer><OButton @click="close">Close</OButton></ODialog.Footer>
        </template>
      </ODialog>
    </section>

    <!-- ═══════════ DRAWER ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Drawer</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Drawer: Placements -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Placements</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <ODrawer placement="right" title="Right Drawer" description="Slides from the right edge.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Right</OButton>
          </template>
          <p>This drawer slides in from the right. It's the default placement, great for settings panels and detail views.</p>
          <template #footer="{ close }">
            <OButton variant="ghost" @click="close">Cancel</OButton>
            <OButton @click="close">Save</OButton>
          </template>
        </ODrawer>

        <ODrawer placement="left" title="Left Drawer" description="Slides from the left edge.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Left</OButton>
          </template>
          <p>A left-side drawer, commonly used for navigation menus.</p>
        </ODrawer>

        <ODrawer placement="bottom" title="Bottom Sheet" description="Slides up from the bottom." :show-handle="true">
          <template #trigger>
            <OButton variant="secondary" size="sm">Bottom</OButton>
          </template>
          <p>A bottom sheet with a drag handle, perfect for mobile-style interactions.</p>
        </ODrawer>

        <ODrawer placement="top" title="Top Drawer" description="Slides down from the top.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Top</OButton>
          </template>
          <p>A top drawer for banners, notifications, or alerts.</p>
        </ODrawer>
      </div>
    </section>

    <!-- Drawer: Floating variants (Ousi exclusive) -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Floating Variants</h2>
      <p class="text-sm text-ousi-muted mb-4">Exclusive to Ousi UI — detached from edges with rounded corners on all sides.</p>
      <div class="flex items-center gap-3 flex-wrap">
        <ODrawer placement="floating-center" title="Floating Center" description="Centered with zoom animation." backdrop="blur">
          <template #trigger>
            <OButton size="sm">Center</OButton>
          </template>
          <p>Centered floating panel with zoom animation, like a dialog.</p>
        </ODrawer>

        <ODrawer placement="floating-left" title="Floating Left" description="Detached from the left edge.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Left</OButton>
          </template>
          <p>Slides from the left with padding from the viewport edge.</p>
        </ODrawer>

        <ODrawer placement="floating-right" title="Floating Right" description="Detached from the right edge.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Right</OButton>
          </template>
          <p>Try dragging right to dismiss.</p>
        </ODrawer>

        <ODrawer placement="floating-bottom" title="Floating Bottom" description="Detached from the bottom.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Bottom</OButton>
          </template>
          <p>Try dragging down to dismiss.</p>
        </ODrawer>

        <ODrawer placement="floating-top" title="Floating Top" description="Detached from the top.">
          <template #trigger>
            <OButton variant="secondary" size="sm">Top</OButton>
          </template>
          <p>Slides from the top with padding.</p>
        </ODrawer>
      </div>
    </section>



    <!-- Drawer: Backdrops -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Backdrop Variants</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <ODrawer placement="right" backdrop="opaque" title="Opaque Backdrop">
          <template #trigger>
            <OButton variant="secondary" size="sm">Opaque</OButton>
          </template>
          <p>Standard dark overlay behind the drawer.</p>
        </ODrawer>

        <ODrawer placement="right" backdrop="blur" title="Blur Backdrop">
          <template #trigger>
            <OButton variant="secondary" size="sm">Blur</OButton>
          </template>
          <p>Frosted glass effect with backdrop blur.</p>
        </ODrawer>

        <ODrawer placement="right" backdrop="transparent" title="Transparent Backdrop">
          <template #trigger>
            <OButton variant="secondary" size="sm">Transparent</OButton>
          </template>
          <p>No visible backdrop — the page remains fully visible.</p>
        </ODrawer>
      </div>
    </section>

    <!-- Drawer: With form content -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Form</h2>
      <ODrawer placement="right" title="Edit Profile" description="Update your personal information.">
        <template #trigger>
          <OButton variant="secondary">Edit Profile</OButton>
        </template>
        <div class="flex flex-col gap-3">
          <OInput label="Name" placeholder="Your name" variant="secondary" full-width />
          <OInput label="Email" placeholder="you@example.com" type="email" variant="secondary" full-width />
          <OSelect :options="roleOptions" label="Role" variant="secondary" placeholder="Select role" full-width />
        </div>
        <template #footer="{ close }">
          <OButton variant="ghost" @click="close">Cancel</OButton>
          <OButton @click="close">Save Changes</OButton>
        </template>
      </ODrawer>
    </section>

    <!-- ═══════════ TABS ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Tabs</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Tabs: Primary -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Primary (default)</h2>
      <OTabs v-model="activeTab" :items="tabItems" class="max-w-md">
        <template #photos>
          <div class="flex flex-col gap-2">
            <OCard v-for="i in 3" :key="i" variant="secondary" class="p-3">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-ousi-lg bg-ousi-accent/10 flex items-center justify-center text-ousi-accent text-sm font-medium">{{ i }}</div>
                <div>
                  <p class="text-sm font-medium text-ousi-foreground">Photo {{ i }}</p>
                  <p class="text-xs text-ousi-muted">landscape-{{ i }}.jpg</p>
                </div>
              </div>
            </OCard>
          </div>
        </template>
        <template #videos>
          <div class="flex flex-col gap-2">
            <OCard v-for="i in 2" :key="i" variant="secondary" class="p-3">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-ousi-lg bg-ousi-success/10 flex items-center justify-center text-ousi-success text-sm font-medium">{{ i }}</div>
                <div>
                  <p class="text-sm font-medium text-ousi-foreground">Video {{ i }}</p>
                  <p class="text-xs text-ousi-muted">clip-{{ i }}.mp4</p>
                </div>
              </div>
            </OCard>
          </div>
        </template>
        <template #music>
          <p class="text-sm text-ousi-muted">Your music collection will appear here.</p>
        </template>
        <template #files>
          <p class="text-sm text-ousi-muted">Files tab is disabled.</p>
        </template>
      </OTabs>
    </section>

    <!-- Tabs: Vertical -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Vertical</h2>
      <OTabs v-model="activeTab2" :items="tabItems" orientation="vertical" class="max-w-lg">
        <template #photos><p class="text-sm text-ousi-muted">Photos panel — vertical orientation.</p></template>
        <template #videos><p class="text-sm text-ousi-muted">Videos panel — vertical orientation.</p></template>
        <template #music><p class="text-sm text-ousi-muted">Music panel — vertical orientation.</p></template>
      </OTabs>
    </section>

    <!-- Tabs: Disabled Tab -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Tab</h2>
      <p class="text-sm text-ousi-muted mb-3">The "Files" tab is disabled and cannot be selected.</p>
      <OTabs
        :items="tabItems"
        default-value="photos"
        class="max-w-md"
      >
        <template #photos><p class="text-sm text-ousi-muted">Photos content.</p></template>
        <template #videos><p class="text-sm text-ousi-muted">Videos content.</p></template>
        <template #music><p class="text-sm text-ousi-muted">Music content.</p></template>
      </OTabs>
    </section>

    <!-- Tabs: With Separator -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Separator</h2>
      <p class="text-sm text-ousi-muted mb-3">Separator lines between tabs that hide when the adjacent tab is selected.</p>
      <OTabs :items="tabItems" default-value="photos" show-separator class="max-w-md">
        <template #photos><p class="text-sm text-ousi-muted">Photos content.</p></template>
        <template #videos><p class="text-sm text-ousi-muted">Videos content.</p></template>
        <template #music><p class="text-sm text-ousi-muted">Music content.</p></template>
      </OTabs>
    </section>

    <!-- Tabs: Secondary Variant -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Secondary Variant</h2>
      <OTabs v-model="activeTab3" :items="tabItems" variant="secondary" class="max-w-md">
        <template #photos><p class="text-sm text-ousi-muted">Photos with underline indicator.</p></template>
        <template #videos><p class="text-sm text-ousi-muted">Videos with underline indicator.</p></template>
        <template #music><p class="text-sm text-ousi-muted">Music with underline indicator.</p></template>
      </OTabs>
    </section>

    <!-- Tabs: Secondary Vertical -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Secondary Vertical</h2>
      <OTabs v-model="activeTab4" :items="tabItems" variant="secondary" orientation="vertical" class="max-w-lg">
        <template #photos><p class="text-sm text-ousi-muted">Photos — secondary vertical.</p></template>
        <template #videos><p class="text-sm text-ousi-muted">Videos — secondary vertical.</p></template>
        <template #music><p class="text-sm text-ousi-muted">Music — secondary vertical.</p></template>
      </OTabs>
    </section>

    <!-- Tabs: Inside Card -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Inside Card</h2>
      <OCard variant="secondary" class="max-w-md">
        <OTabs
          v-model="activeTab5"
          :items="[
            { key: 'overview', label: 'Overview' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'reports', label: 'Reports' },
          ]"
        >
          <template #overview>
            <p class="text-sm text-ousi-muted">View your project overview and recent activity.</p>
          </template>
          <template #analytics>
            <p class="text-sm text-ousi-muted">Track your metrics and analyze performance data.</p>
          </template>
          <template #reports>
            <p class="text-sm text-ousi-muted">Generate and download detailed reports.</p>
          </template>
        </OTabs>
      </OCard>
    </section>

    <!-- ═══════════ DROPDOWN ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Dropdown</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Dropdown: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary">Actions</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu>
            <ODropdown.Item id="new-file">New file</ODropdown.Item>
            <ODropdown.Item id="copy-link">Copy link</ODropdown.Item>
            <ODropdown.Item id="edit-file">Edit file</ODropdown.Item>
            <ODropdown.Separator />
            <ODropdown.Item id="delete-file" variant="danger">Delete file</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: With Sections + Descriptions -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Sections</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary">Menu</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu>
            <ODropdown.Section title="Actions">
              <ODropdown.Item id="new">
                <div class="flex flex-col">
                  <span>New file</span>
                  <span class="text-xs text-ousi-muted">Create a new file</span>
                </div>
                <kbd class="ml-auto text-xs text-ousi-muted bg-ousi-surface-secondary rounded-ousi-sm px-1.5 py-0.5">⌘N</kbd>
              </ODropdown.Item>
              <ODropdown.Item id="edit">
                <div class="flex flex-col">
                  <span>Edit file</span>
                  <span class="text-xs text-ousi-muted">Make changes</span>
                </div>
                <kbd class="ml-auto text-xs text-ousi-muted bg-ousi-surface-secondary rounded-ousi-sm px-1.5 py-0.5">⌘E</kbd>
              </ODropdown.Item>
            </ODropdown.Section>
            <ODropdown.Separator />
            <ODropdown.Section title="Danger zone">
              <ODropdown.Item id="delete" variant="danger">
                <div class="flex flex-col">
                  <span>Delete file</span>
                  <span class="text-xs text-ousi-danger/70">Move to trash</span>
                </div>
              </ODropdown.Item>
            </ODropdown.Section>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: Single Selection -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Single Selection</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary">Fruit</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu selection-mode="single">
            <ODropdown.Item id="apple"><ODropdown.ItemIndicator /> Apple</ODropdown.Item>
            <ODropdown.Item id="banana"><ODropdown.ItemIndicator /> Banana</ODropdown.Item>
            <ODropdown.Item id="cherry"><ODropdown.ItemIndicator /> Cherry</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: Multiple Selection -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Multiple Selection</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary">Text Style</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu selection-mode="multiple">
            <ODropdown.Item id="bold"><ODropdown.ItemIndicator /> Bold</ODropdown.Item>
            <ODropdown.Item id="italic"><ODropdown.ItemIndicator /> Italic</ODropdown.Item>
            <ODropdown.Item id="underline"><ODropdown.ItemIndicator /> Underline</ODropdown.Item>
            <ODropdown.Item id="strikethrough"><ODropdown.ItemIndicator /> Strikethrough</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: Disabled Items -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Items</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary" size="sm">Actions</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu :disabled-keys="new Set(['paste'])">
            <ODropdown.Item id="copy">Copy</ODropdown.Item>
            <ODropdown.Item id="paste">Paste (disabled)</ODropdown.Item>
            <ODropdown.Item id="cut">Cut</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: With Submenu -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Submenu</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OButton variant="secondary">Share</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu>
            <ODropdown.Item id="copy-link">Copy Link</ODropdown.Item>
            <ODropdown.Item id="email">Email</ODropdown.Item>
            <ODropdown.SubmenuTrigger>
              <template #trigger>
                <ODropdown.Item id="more">More options <ODropdown.SubmenuIndicator /></ODropdown.Item>
              </template>
              <template #popover>
                <ODropdown.Menu>
                  <ODropdown.Item id="whatsapp">WhatsApp</ODropdown.Item>
                  <ODropdown.Item id="telegram">Telegram</ODropdown.Item>
                  <ODropdown.Item id="discord">Discord</ODropdown.Item>
                </ODropdown.Menu>
              </template>
            </ODropdown.SubmenuTrigger>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: Custom Trigger (Avatar) -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Trigger</h2>
      <ODropdown>
        <ODropdown.Trigger>
          <OAvatar name="Jane Doe" size="md" class="cursor-pointer" />
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <div class="px-3 pt-3 pb-1 flex items-center gap-2">
            <OAvatar name="Jane Doe" size="sm" />
            <div>
              <p class="text-sm font-medium text-ousi-foreground">Jane Doe</p>
              <p class="text-xs text-ousi-muted">jane@example.com</p>
            </div>
          </div>
          <ODropdown.Menu>
            <ODropdown.Item id="dashboard">Dashboard</ODropdown.Item>
            <ODropdown.Item id="profile">Profile</ODropdown.Item>
            <ODropdown.Item id="settings">Settings</ODropdown.Item>
            <ODropdown.Separator />
            <ODropdown.Item id="logout" variant="danger">Log Out</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- Dropdown: Controlled -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Controlled</h2>
      <p class="text-xs text-ousi-muted mb-2 font-mono">isOpen: {{ ddOpen }}</p>
      <ODropdown v-model="ddOpen">
        <ODropdown.Trigger>
          <OButton variant="secondary">Controlled</OButton>
        </ODropdown.Trigger>
        <ODropdown.Popover>
          <ODropdown.Menu>
            <ODropdown.Item id="item1">Item 1</ODropdown.Item>
            <ODropdown.Item id="item2">Item 2</ODropdown.Item>
            <ODropdown.Item id="item3">Item 3</ODropdown.Item>
          </ODropdown.Menu>
        </ODropdown.Popover>
      </ODropdown>
    </section>

    <!-- ═══════════ TOAST ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Toast</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Toast: Simple variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Simple</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton size="sm" variant="secondary" @click="toast('Simple message')">Default</OButton>
        <OButton size="sm" variant="secondary" @click="toast.success('Operation completed')">Success</OButton>
        <OButton size="sm" variant="secondary" @click="toast.info('New update available')">Info</OButton>
        <OButton size="sm" variant="secondary" @click="toast.warning('Check your settings')">Warning</OButton>
        <OButton size="sm" variant="secondary" @click="toast.danger('Something went wrong')">Error</OButton>
      </div>
    </section>

    <!-- Toast: With description & action -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Description &amp; Action</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="toast.info('You have 2 credits left', { description: 'Get a paid plan for more credits', action: { label: 'Upgrade', onClick: () => {} } })">
          Accent with action
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast.success('Plan upgraded', { description: 'You can continue using Ousi UI', action: { label: 'Billing', onClick: () => {} } })">
          Success with action
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast.danger('Storage is full', { description: 'Remove files to release space', action: { label: 'Remove', onClick: () => {} } })">
          Danger with action
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast('Team invitation', { description: 'Bob invited you to join the team', action: { label: 'Dismiss', onClick: () => toast.clear() } })">
          Default with action
        </OButton>
      </div>
    </section>

    <!-- Toast: Promise & Loading -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Promise &amp; Loading</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="demoUpload">
          Upload (success)
        </OButton>
        <OButton variant="secondary" size="sm" @click="demoFail">
          Create event (fails)
        </OButton>
        <OButton variant="secondary" size="sm" @click="demoManualLoading">
          Manual loading
        </OButton>
      </div>
    </section>

    <!-- Toast: Custom Icon -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Icon</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="toast('You have been invited to join a team', {
          description: 'Bob sent you an invitation to join HeroUI team',
          icon: '<path d=&quot;M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2&quot;/><circle cx=&quot;9&quot; cy=&quot;7&quot; r=&quot;4&quot;/><path d=&quot;M23 21v-2a4 4 0 0 0-3-3.87&quot;/><path d=&quot;M16 3.13a4 4 0 0 1 0 7.75&quot;/>',
          action: { label: 'Dismiss', onClick: () => toast.clear() },
        })">
          Team invite
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast('Custom icon indicator', {
          icon: '<polygon points=&quot;12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2&quot;/>',
        })">
          Star icon
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast.success('Download complete', {
          icon: '<path d=&quot;M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4&quot;/><polyline points=&quot;7 10 12 15 17 10&quot;/><line x1=&quot;12&quot; y1=&quot;15&quot; x2=&quot;12&quot; y2=&quot;3&quot;/>',
          description: 'report-2026.pdf saved to Downloads',
        })">
          Download icon
        </OButton>
      </div>
    </section>

    <!-- Toast: Callbacks -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Callbacks</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="toast('With onClose callback', {
          timeout: 0,
          description: 'Dismiss this and check the console.',
          onClose: () => toast.success('onClose fired!'),
        })">
          onClose
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast('Auto-close in 2s', {
          timeout: 2000,
          onAutoClose: () => toast.info('onAutoClose fired!'),
        })">
          onAutoClose
        </OButton>
      </div>
    </section>

    <!-- Toast: Persistent & Controls -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Persistent &amp; Controls</h2>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton variant="secondary" size="sm" @click="toast('Important notice', { timeout: 0, description: 'This stays until you dismiss it.' })">
          Persistent
        </OButton>
        <OButton variant="secondary" size="sm" @click="toast('Quick message', { timeout: 2000 })">
          2s timeout
        </OButton>
        <OButton variant="danger-soft" size="sm" @click="toast.clear()">
          Clear all
        </OButton>
      </div>
    </section>

    <!-- Toast: Placements -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Placements</h2>
      <p class="text-sm text-ousi-muted mb-3">
        Click a placement then "Show toast" to see it in that position.
      </p>
      <div class="flex items-center gap-3 flex-wrap">
        <OButton
          v-for="p in ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end']"
          :key="p"
          size="sm"
          :variant="toastPlacement === p ? 'primary' : 'secondary'"
          @click="toastPlacement = p"
        >
          {{ p }}
        </OButton>
        <OButton size="sm" @click="toast(`Toast at ${toastPlacement}`)">
          Show toast
        </OButton>
      </div>
      <p class="text-xs text-ousi-muted mt-2 font-mono">placement: "{{ toastPlacement }}"</p>
    </section>

    <!-- Toast Provider — placement is reactive -->
    <OToastProvider :placement="toastPlacement as any" :max-visible="5" />

    <!-- ═══════════ CHECKBOX ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Checkbox</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Checkbox: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="flex flex-col gap-4">
        <OCheckbox v-model="cbTerms" label="Accept terms and conditions" />
        <p class="text-xs text-ousi-muted font-mono">v-model: {{ cbTerms }}</p>
      </div>
    </section>

    <!-- Checkbox: With Description -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Description</h2>
      <OCheckbox
        v-model="cbMarketing"
        label="Marketing emails"
        description="Receive emails about new products, features, and more."
      />
    </section>

    <!-- Checkbox: Indeterminate -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Indeterminate</h2>
      <OCheckbox
        v-model="cbIndeterminateVal"
        v-model:indeterminate="cbIndeterminate"
        label="Select all"
        description="Click to check. Supports v-model:indeterminate."
      />
      <p class="text-xs text-ousi-muted font-mono mt-2">checked: {{ cbIndeterminateVal }}, indeterminate: {{ cbIndeterminate }}</p>
      <OButton size="sm" variant="secondary" class="mt-2" @click="cbIndeterminate = true; cbIndeterminateVal = false">
        Reset to indeterminate
      </OButton>
    </section>

    <!-- Checkbox: States -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">States</h2>
      <div class="flex flex-col gap-3">
        <OCheckbox :model-value="true" label="Checked" />
        <OCheckbox :model-value="false" label="Unchecked" />
        <OCheckbox :model-value="true" disabled label="Checked disabled" />
        <OCheckbox :model-value="false" disabled label="Unchecked disabled" />
        <OCheckbox :model-value="false" readonly label="Readonly" />
      </div>
    </section>

    <!-- Checkbox: Invalid -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Invalid</h2>
      <div class="flex flex-col gap-3">
        <OCheckbox
          v-model="cbRequired"
          label="Required field"
          required
          error-message="You must accept the terms"
        />
        <OCheckbox :model-value="true" :invalid="true" label="Checked invalid" />
      </div>
    </section>

    <!-- Checkbox: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="flex flex-col gap-3">
        <OCheckbox v-model="cbPrimary" label="Primary variant" variant="primary" />
        <OCheckbox v-model="cbSecondary" label="Secondary variant" variant="secondary" />
      </div>
    </section>

    <!-- Checkbox: Group -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Checkbox Group</h2>
      <div class="flex flex-col gap-3">
        <p class="text-sm font-medium text-ousi-foreground">Notifications</p>
        <OCheckbox v-model="notif.email" label="Email" description="Get notified by email" />
        <OCheckbox v-model="notif.sms" label="SMS" description="Get notified by text message" />
        <OCheckbox v-model="notif.push" label="Push" description="Get push notifications" />
      </div>
    </section>

    <!-- Checkbox: Custom content via slot -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Content (slot)</h2>
      <OCheckbox v-model="cbSlot">
        <span class="text-sm text-ousi-foreground">
          I agree to the
          <a href="#" class="text-ousi-accent underline" @click.stop>Terms of Service</a>
          and
          <a href="#" class="text-ousi-accent underline" @click.stop>Privacy Policy</a>
        </span>
      </OCheckbox>
    </section>

    <!-- ═══════════ SWITCH ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Switch</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Switch: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="flex flex-col gap-4">
        <OSwitch v-model="sw1" label="Airplane mode" />
        <p class="text-xs text-ousi-muted font-mono">v-model: {{ sw1 }}</p>
      </div>
    </section>

    <!-- Switch: With Description -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Description</h2>
      <OSwitch
        v-model="sw2"
        label="Marketing emails"
        description="Receive emails about new products and features."
      />
    </section>

    <!-- Switch: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex flex-col gap-4">
        <OSwitch v-model="swSm" size="sm" label="Small" />
        <OSwitch v-model="swMd" size="md" label="Medium (default)" />
        <OSwitch v-model="swLg" size="lg" label="Large" />
      </div>
    </section>

    <!-- Switch: States -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">States</h2>
      <div class="flex flex-col gap-3">
        <OSwitch :model-value="true" label="On" />
        <OSwitch :model-value="false" label="Off" />
        <OSwitch :model-value="true" disabled label="On disabled" />
        <OSwitch :model-value="false" disabled label="Off disabled" />
      </div>
    </section>

    <!-- Switch: Label position -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Label Position</h2>
      <div class="flex flex-col gap-3">
        <OSwitch v-model="swDark" label="Dark mode (label right)" />
        <OSwitch v-model="swDark" label="Dark mode (label left)" class="flex-row-reverse justify-between w-64" />
      </div>
    </section>

    <!-- Switch: Group -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Switch Group</h2>
      <div class="flex flex-col gap-4">
        <p class="text-sm font-medium text-ousi-foreground">Notifications</p>
        <OSwitch v-model="notif.email" label="Email" description="Daily digest" />
        <OSwitch v-model="notif.push" label="Push" description="Real-time alerts" />
        <OSwitch v-model="notif.sms" label="SMS" description="Critical alerts only" />
      </div>
    </section>

    <!-- ═══════════ RADIO ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Radio</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Radio: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <ORadioGroup v-model="radioPlan" label="Select plan">
        <ORadio value="free" label="Free" description="Up to 5 projects" />
        <ORadio value="pro" label="Pro" description="Unlimited projects" />
        <ORadio value="enterprise" label="Enterprise" description="Custom pricing" />
      </ORadioGroup>
      <p class="text-xs text-ousi-muted font-mono mt-2">v-model: "{{ radioPlan }}"</p>
    </section>

    <!-- Radio: Horizontal -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Horizontal</h2>
      <ORadioGroup v-model="radioSize" label="Size" orientation="horizontal">
        <ORadio value="sm" label="Small" />
        <ORadio value="md" label="Medium" />
        <ORadio value="lg" label="Large" />
      </ORadioGroup>
    </section>

    <!-- Radio: With Error -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Error</h2>
      <ORadioGroup
        v-model="radioGender"
        label="Gender"
        required
        error-message="Please select an option"
      >
        <ORadio value="male" label="Male" />
        <ORadio value="female" label="Female" />
        <ORadio value="other" label="Prefer not to say" />
      </ORadioGroup>
    </section>

    <!-- Radio: Disabled Items -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Items</h2>
      <ORadioGroup v-model="radioPayment" label="Payment method">
        <ORadio value="card" label="Credit card" />
        <ORadio value="paypal" label="PayPal" />
        <ORadio value="crypto" label="Crypto" disabled description="Coming soon" />
      </ORadioGroup>
    </section>

    <!-- Radio: Disabled Group -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Group</h2>
      <ORadioGroup v-model="radioLocked" label="Locked group" disabled>
        <ORadio value="a" label="Option A" />
        <ORadio value="b" label="Option B" />
      </ORadioGroup>
    </section>

    <!-- Radio: Custom Indicator -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Indicator</h2>
      <ORadioGroup default-value="premium" label="Plan selection" description="Choose the plan that suits you best">
        <ORadio value="basic" label="Basic Plan" description="Includes 100 messages per month">
          <template #indicator="{ isSelected }">
            <span v-if="isSelected" class="text-xs leading-none text-white font-bold">✓</span>
          </template>
        </ORadio>
        <ORadio value="premium" label="Premium Plan" description="Includes 200 messages per month">
          <template #indicator="{ isSelected }">
            <span v-if="isSelected" class="text-xs leading-none text-white font-bold">✓</span>
          </template>
        </ORadio>
        <ORadio value="business" label="Business Plan" description="Unlimited messages">
          <template #indicator="{ isSelected }">
            <span v-if="isSelected" class="text-xs leading-none text-white font-bold">✓</span>
          </template>
        </ORadio>
      </ORadioGroup>
    </section>

    <!-- ═══════════ TEXTAREA ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Textarea</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Textarea: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="max-w-md">
        <OTextarea v-model="taBio" label="Bio" placeholder="Tell us about yourself..." full-width />
      </div>
    </section>

    <!-- Textarea: With Description -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Description</h2>
      <div class="max-w-md">
        <OTextarea label="Notes" description="Add any additional notes here." :rows="4" full-width />
      </div>
    </section>

    <!-- Textarea: Auto-resize -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Auto-resize</h2>
      <div class="max-w-md">
        <OTextarea
          v-model="taAutoResize"
          label="Message"
          placeholder="Start typing, I'll grow with you..."
          auto-resize
          :min-rows="2"
          :max-rows="8"
          full-width
        />
      </div>
    </section>

    <!-- Textarea: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OTextarea variant="primary" label="Primary" placeholder="Primary variant" full-width />
        <OTextarea variant="secondary" label="Secondary" placeholder="Secondary variant" full-width />
      </div>
    </section>

    <!-- Textarea: Resize options -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Resize Options</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <OTextarea resize="none" label="No resize" placeholder="Fixed size" :rows="3" full-width />
        <OTextarea resize="vertical" label="Vertical" placeholder="Drag bottom edge" :rows="3" full-width />
        <OTextarea resize="both" label="Both" placeholder="Drag any corner" :rows="3" full-width />
      </div>
    </section>

    <!-- Textarea: States -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">States</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OTextarea label="Required" required error-message="This field is required" full-width />
        <OTextarea label="Disabled" placeholder="Cannot edit" disabled full-width />
        <OTextarea label="Readonly" model-value="Cannot change this" readonly full-width />
      </div>
    </section>

    <!-- Textarea: Full width -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Full Width</h2>
      <OTextarea
        v-model="taFeedback"
        label="Feedback"
        placeholder="Write your feedback here..."
        full-width
        :rows="5"
      />
    </section>

    <!-- ═══════════ POPOVER ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Popover</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Popover: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OPopover title="Information">
          <template #trigger>
            <OButton variant="secondary">Open Popover</OButton>
          </template>
          <p class="text-sm text-ousi-muted max-w-xs">
            This is a popover with rich content. Click outside or press Escape to dismiss.
          </p>
        </OPopover>
      </div>
    </section>

    <!-- Popover: With Arrow -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Arrow</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OPopover title="With Arrow" :show-arrow="true" placement="top">
          <template #trigger>
            <OButton variant="secondary" size="sm">Top</OButton>
          </template>
          <p class="text-sm text-ousi-muted">Arrow points to the trigger.</p>
        </OPopover>
        <OPopover title="With Arrow" :show-arrow="true" placement="bottom">
          <template #trigger>
            <OButton variant="secondary" size="sm">Bottom</OButton>
          </template>
          <p class="text-sm text-ousi-muted">Arrow points to the trigger.</p>
        </OPopover>
        <OPopover title="With Arrow" :show-arrow="true" placement="left">
          <template #trigger>
            <OButton variant="secondary" size="sm">Left</OButton>
          </template>
          <p class="text-sm text-ousi-muted">Arrow points to the trigger.</p>
        </OPopover>
        <OPopover title="With Arrow" :show-arrow="true" placement="right">
          <template #trigger>
            <OButton variant="secondary" size="sm">Right</OButton>
          </template>
          <p class="text-sm text-ousi-muted">Arrow points to the trigger.</p>
        </OPopover>
      </div>
    </section>

    <!-- Popover: With Form -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Form</h2>
      <OPopover title="Update name">
        <template #trigger>
          <OButton>Edit profile</OButton>
        </template>
        <template #default="{ close }">
          <div class="flex flex-col gap-3 min-w-64">
            <OInput label="Name" placeholder="Your name" variant="secondary" full-width />
            <OInput label="Email" type="email" placeholder="your@email.com" variant="secondary" full-width />
            <div class="flex justify-end gap-2 mt-1">
              <OButton variant="ghost" size="sm" @click="close">Cancel</OButton>
              <OButton size="sm" @click="close">Save</OButton>
            </div>
          </div>
        </template>
      </OPopover>
    </section>

    <!-- Popover: Custom Triggers -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Triggers</h2>
      <div class="flex items-center gap-4 flex-wrap">
        <OPopover>
          <template #trigger>
            <OAvatar name="Carlos Roca" class="cursor-pointer" />
          </template>
          <div class="flex flex-col gap-2 min-w-48">
            <div class="flex items-center gap-2">
              <OAvatar name="Carlos Roca" size="sm" />
              <div>
                <p class="text-sm font-medium text-ousi-foreground">Carlos Roca</p>
                <p class="text-xs text-ousi-muted">carlos@example.com</p>
              </div>
            </div>
            <div class="h-px bg-ousi-border" />
            <p class="text-xs text-ousi-muted">Joined January 2026</p>
          </div>
        </OPopover>

        <OPopover title="Help" placement="bottom-start">
          <template #trigger>
            <button class="text-ousi-muted hover:text-ousi-foreground transition-colors">
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          </template>
          <p class="text-sm text-ousi-muted min-w-56">
            Click the button to perform the action. Need more help? Check the documentation.
          </p>
        </OPopover>
      </div>
    </section>

    <!-- ═══════════ SEPARATOR ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Separator</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Separator: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="flex flex-col gap-6 max-w-md">
        <div>
          <p class="text-xs text-ousi-muted mb-2">Default</p>
          <OSeparator />
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Secondary</p>
          <OSeparator variant="secondary" />
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Tertiary</p>
          <OSeparator variant="tertiary" />
        </div>
      </div>
    </section>

    <!-- Separator: With Content -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Content</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <OSeparator>OR</OSeparator>
        <OSeparator>Continue with</OSeparator>
        <OSeparator variant="secondary">Section</OSeparator>
      </div>
    </section>

    <!-- Separator: Vertical -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Vertical</h2>
      <div class="flex items-center h-8 gap-4">
        <span class="text-sm text-ousi-foreground">Left</span>
        <OSeparator orientation="vertical" />
        <span class="text-sm text-ousi-foreground">Center</span>
        <OSeparator orientation="vertical" />
        <span class="text-sm text-ousi-foreground">Right</span>
      </div>
    </section>

    <!-- Separator: Login form -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Login Form</h2>
      <div class="flex flex-col gap-4 max-w-sm">
        <OButton variant="secondary" full-width>Continue with Google</OButton>
        <OSeparator>OR</OSeparator>
        <OInput label="Email" type="email" placeholder="you@example.com" full-width />
        <OInput label="Password" type="password" placeholder="Enter password" full-width />
        <OButton full-width>Sign in</OButton>
      </div>
    </section>

    <!-- Separator: In Card -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Card</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Header>
          <OCard.Title>Settings</OCard.Title>
        </OCard.Header>
        <OCard.Content class="gap-3">
          <p class="text-sm text-ousi-foreground">Notifications</p>
          <OSeparator />
          <p class="text-sm text-ousi-foreground">Privacy</p>
          <OSeparator variant="secondary" />
          <p class="text-sm text-ousi-foreground">Security</p>
        </OCard.Content>
      </OCard>
    </section>

    <!-- ═══════════ SKELETON ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Skeleton</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Skeleton: Basic shapes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic Shapes</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex flex-col gap-2">
          <OSkeleton class="h-4 w-48" />
          <OSkeleton class="h-4 w-64" />
          <OSkeleton class="h-4 w-32" />
        </div>
        <div class="flex items-center gap-3">
          <OSkeleton class="h-10 w-10 rounded-full" />
          <OSkeleton class="h-10 w-10 rounded-ousi-xl" />
          <OSkeleton class="h-9 w-24 rounded-ousi-4xl" />
        </div>
        <OSkeleton class="h-32 w-full rounded-ousi-2xl" />
      </div>
    </section>

    <!-- Skeleton: Animations -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Animations</h2>
      <div class="flex flex-col gap-3 max-w-md">
        <div class="flex items-center gap-3">
          <span class="text-xs text-ousi-muted w-16">Shimmer</span>
          <OSkeleton animation="shimmer" class="h-4 w-48" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-ousi-muted w-16">Pulse</span>
          <OSkeleton animation="pulse" class="h-4 w-48" />
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-ousi-muted w-16">None</span>
          <OSkeleton animation="none" class="h-4 w-48" />
        </div>
      </div>
    </section>

    <!-- Skeleton: Card skeleton -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Card Skeleton</h2>
      <div class="flex flex-col gap-3 p-4 rounded-ousi-3xl border border-ousi-border w-72">
        <div class="flex items-center gap-3">
          <OSkeleton class="h-10 w-10 rounded-full shrink-0" />
          <div class="flex flex-col gap-2 flex-1">
            <OSkeleton class="h-3.5 w-24" />
            <OSkeleton class="h-3 w-16" />
          </div>
        </div>
        <OSkeleton class="h-36 w-full rounded-ousi-2xl" />
        <div class="flex flex-col gap-2">
          <OSkeleton class="h-3.5 w-full" />
          <OSkeleton class="h-3.5 w-4/5" />
          <OSkeleton class="h-3.5 w-3/5" />
        </div>
        <div class="flex justify-between items-center">
          <OSkeleton class="h-3 w-20" />
          <OSkeleton class="h-8 w-16 rounded-ousi-4xl" />
        </div>
      </div>
    </section>

    <!-- Skeleton: List skeleton -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">List Skeleton</h2>
      <div class="flex flex-col gap-4 w-72">
        <div v-for="i in 4" :key="i" class="flex items-center gap-3">
          <OSkeleton class="h-9 w-9 rounded-ousi-xl shrink-0" />
          <div class="flex flex-col gap-1.5 flex-1">
            <OSkeleton class="h-3.5" :class="i % 2 === 0 ? 'w-3/4' : 'w-full'" />
            <OSkeleton class="h-3 w-1/2" />
          </div>
        </div>
      </div>
    </section>

    <!-- Skeleton: Toggle loading -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Toggle Loading</h2>
      <div class="flex flex-col gap-4">
        <div v-if="skeletonLoading" class="flex items-center gap-3">
          <OSkeleton class="h-10 w-10 rounded-full" />
          <div class="flex flex-col gap-2">
            <OSkeleton class="h-4 w-32" />
            <OSkeleton class="h-3 w-20" />
          </div>
        </div>
        <div v-else class="flex items-center gap-3">
          <OAvatar name="Carlos Roca" />
          <div>
            <p class="text-sm font-medium text-ousi-foreground">Carlos Roca</p>
            <p class="text-xs text-ousi-muted">carlos@example.com</p>
          </div>
        </div>
        <OButton size="sm" variant="secondary" @click="skeletonLoading = !skeletonLoading">
          Toggle loading
        </OButton>
      </div>
    </section>

    <!-- ═══════════ SPINNER ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Spinner</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Spinner: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex items-center gap-6">
        <OSpinner size="sm" color="accent" />
        <OSpinner size="md" color="accent" />
        <OSpinner size="lg" color="accent" />
        <OSpinner size="xl" color="accent" />
      </div>
    </section>

    <!-- Spinner: Colors -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Colors</h2>
      <div class="flex items-center gap-6">
        <OSpinner color="current" />
        <OSpinner color="accent" />
        <OSpinner color="success" />
        <OSpinner color="warning" />
        <OSpinner color="danger" />
      </div>
    </section>

    <!-- Spinner: Inherit color -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Inherit Color</h2>
      <div class="flex items-center gap-6">
        <span class="text-ousi-accent"><OSpinner size="sm" /></span>
        <span class="text-ousi-danger"><OSpinner size="sm" /></span>
        <span class="text-ousi-success"><OSpinner size="sm" /></span>
        <span class="text-ousi-warning"><OSpinner size="sm" /></span>
      </div>
    </section>

    <!-- Spinner: Loading overlay -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Loading Overlay</h2>
      <div class="relative h-32 w-full max-w-md rounded-ousi-2xl bg-ousi-surface flex items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <OSpinner size="lg" color="accent" />
          <p class="text-sm text-ousi-muted">Loading content...</p>
        </div>
      </div>
    </section>

    <!-- Spinner: Inline -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Inline</h2>
      <div class="flex items-center gap-2 text-ousi-muted">
        <OSpinner size="sm" />
        <span class="text-sm">Processing your request...</span>
      </div>
    </section>

    <!-- ═══════════ ALERT ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Alert</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Alert: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="flex flex-col gap-3 max-w-lg">
        <OAlert variant="default" title="Default alert" description="This is a default informational alert." />
        <OAlert variant="accent" title="Info" description="New features are available in this version." />
        <OAlert variant="success" title="Success" description="Your changes have been saved successfully." />
        <OAlert variant="warning" title="Warning" description="Your subscription will expire in 3 days." />
        <OAlert variant="danger" title="Error" description="There was a problem processing your request." />
      </div>
    </section>

    <!-- Alert: Closable -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Closable</h2>
      <div class="max-w-lg">
        <OAlert
          v-if="showAlert"
          variant="accent"
          title="Dismissible alert"
          description="You can close this alert by clicking the X button."
          closable
          @close="showAlert = false"
        />
        <OButton v-else size="sm" variant="secondary" @click="showAlert = true">Show alert again</OButton>
      </div>
    </section>

    <!-- Alert: Title only -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Title Only</h2>
      <div class="max-w-lg">
        <OAlert variant="success" title="File uploaded successfully." />
      </div>
    </section>

    <!-- Alert: Custom icon -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Icon</h2>
      <div class="max-w-lg">
        <OAlert variant="warning" title="Storage almost full" description="You've used 90% of your storage.">
          <template #indicator>
            <svg class="size-5 text-ousi-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </template>
        </OAlert>
      </div>
    </section>

    <!-- Alert: With actions -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Actions</h2>
      <div class="max-w-lg">
        <OAlert variant="accent" title="Update available" description="Version 2.0 is now available with new features.">
          <div class="flex gap-2">
            <OButton size="sm" variant="soft">Learn more</OButton>
            <OButton size="sm" variant="ghost">Dismiss</OButton>
          </div>
        </OAlert>
      </div>
    </section>

    <!-- Alert: In form -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Form</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Content class="gap-4">
          <OAlert variant="danger" title="Invalid credentials" description="The email or password you entered is incorrect." />
          <OInput label="Email" type="email" placeholder="you@example.com" variant="secondary" full-width />
          <OInput label="Password" type="password" placeholder="Enter password" variant="secondary" full-width />
          <OButton full-width>Sign in</OButton>
        </OCard.Content>
      </OCard>
    </section>

    <!-- ═══════════ AUTOCOMPLETE ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Autocomplete</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Autocomplete: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="max-w-sm">
        <OAutocomplete
          v-model="acCountry"
          :options="countryAcOptions"
          label="Country"
          placeholder="Search a country..."
          full-width
        />
        <p class="text-xs text-ousi-muted font-mono mt-2">v-model: "{{ acCountry }}"</p>
      </div>
    </section>

    <!-- Autocomplete: With Description -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Description</h2>
      <div class="max-w-sm">
        <OAutocomplete
          :options="countryAcOptions"
          label="Destination"
          description="Select your travel destination"
          placeholder="Search..."
          full-width
        />
      </div>
    </section>

    <!-- Autocomplete: With Error -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Error</h2>
      <div class="max-w-sm">
        <OAutocomplete
          :options="countryAcOptions"
          label="Country"
          required
          error-message="Please select a country"
          full-width
        />
      </div>
    </section>

    <!-- Autocomplete: Disabled Options -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Options</h2>
      <div class="max-w-sm">
        <OAutocomplete
          v-model="acLang"
          :options="langAcOptions"
          label="Language"
          description="Python and Go are coming soon"
          placeholder="Search languages..."
          full-width
        />
      </div>
    </section>

    <!-- Autocomplete: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OAutocomplete :options="countryAcOptions" variant="primary" label="Primary" placeholder="Search..." full-width />
        <OAutocomplete :options="countryAcOptions" variant="secondary" label="Secondary" placeholder="Search..." full-width />
      </div>
    </section>

    <!-- Autocomplete: Empty State -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Empty State</h2>
      <div class="max-w-sm">
        <OAutocomplete
          :options="[{ value: 'vue', label: 'Vue' }, { value: 'react', label: 'React' }]"
          label="Framework"
          empty-message="No frameworks match your search"
          placeholder="Try 'angular'..."
          full-width
        />
      </div>
    </section>

    <!-- Autocomplete: Disabled & No clear -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">States</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OAutocomplete :options="countryAcOptions" label="Disabled" disabled placeholder="Cannot interact" full-width />
        <OAutocomplete :options="countryAcOptions" label="No clear button" :clearable="false" placeholder="Search..." full-width />
      </div>
    </section>

    <!-- ═══════════ BADGE ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Badge</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Badge: Standalone -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Standalone</h2>
      <div class="flex gap-3 flex-wrap items-center">
        <OBadge content="New" color="accent" />
        <OBadge content="5" color="success" />
        <OBadge content="!" color="danger" />
        <OBadge content="Beta" color="warning" />
        <OBadge content="New" color="accent" variant="soft" />
        <OBadge content="5" color="success" variant="soft" />
        <OBadge content="Tag" color="accent" variant="secondary" />
      </div>
    </section>

    <!-- Badge: Anchored on Avatar -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">On Avatar</h2>
      <div class="flex gap-6 items-center">
        <OBadge color="success" dot placement="bottom-right">
          <OAvatar name="Carlos Roca" />
        </OBadge>
        <OBadge content="3" color="danger" placement="top-right">
          <OAvatar name="Ana Torres" />
        </OBadge>
        <OBadge content="99+" color="accent" placement="top-right">
          <OAvatar src="https://i.pravatar.cc/80?u=a" alt="User" />
        </OBadge>
      </div>
    </section>

    <!-- Badge: Anchored on Button -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">On Button</h2>
      <div class="flex gap-6 items-center">
        <OBadge content="9+" color="danger" placement="top-right">
          <OButton variant="secondary">Notifications</OButton>
        </OBadge>
        <OBadge dot color="success" placement="top-right">
          <OButton variant="secondary" is-icon-only>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </OButton>
        </OBadge>
      </div>
    </section>

    <!-- Badge: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex gap-4 items-center">
        <OBadge content="sm" color="accent" size="sm" />
        <OBadge content="md" color="accent" size="md" />
        <OBadge content="lg" color="accent" size="lg" />
      </div>
    </section>

    <!-- Badge: Dot -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Dot</h2>
      <div class="flex gap-4 items-center">
        <OBadge dot color="success" />
        <OBadge dot color="danger" />
        <OBadge dot color="warning" />
        <OBadge dot color="accent" />
      </div>
    </section>

    <!-- Badge: Max & Zero -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Max &amp; Zero</h2>
      <div class="flex gap-4 items-center">
        <OBadge :content="150" :max="99" color="danger" />
        <OBadge :content="0" color="accent" />
        <OBadge :content="0" :show-zero="true" color="accent" />
      </div>
      <p class="text-xs text-ousi-muted mt-2">150 with max=99 → "99+". Content 0 hidden by default. showZero makes it visible.</p>
    </section>

    <!-- Badge: Invisible -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Invisible</h2>
      <div class="flex gap-6 items-center">
        <OBadge content="5" color="danger" placement="top-right">
          <OAvatar name="Visible" />
        </OBadge>
        <OBadge content="5" color="danger" :invisible="true" placement="top-right">
          <OAvatar name="Hidden" />
        </OBadge>
      </div>
    </section>

    <!-- ═══════════ BREADCRUMBS ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Breadcrumbs</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Breadcrumbs: Chevron (default) -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Chevron (default)</h2>
      <OBreadcrumbs
        :items="[
          { label: 'Home', href: '#' },
          { label: 'Components', href: '#' },
          { label: 'Breadcrumbs' },
        ]"
      />
    </section>

    <!-- Breadcrumbs: Separators -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Separators</h2>
      <div class="flex flex-col gap-4">
        <OBreadcrumbs
          separator="slash"
          :items="[
            { label: 'Home', href: '#' },
            { label: 'Docs', href: '#' },
            { label: 'Button' },
          ]"
        />
        <OBreadcrumbs
          separator="dot"
          :items="[
            { label: 'Home', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Getting Started' },
          ]"
        />
      </div>
    </section>

    <!-- Breadcrumbs: Disabled item -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled Item</h2>
      <OBreadcrumbs
        :items="[
          { label: 'Home', href: '#' },
          { label: 'Products', href: '#', disabled: true },
          { label: 'Laptop' },
        ]"
      />
    </section>

    <!-- Breadcrumbs: Long path -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Long Path</h2>
      <OBreadcrumbs
        :items="[
          { label: 'Home', href: '#' },
          { label: 'Categories', href: '#' },
          { label: 'Electronics', href: '#' },
          { label: 'Computers', href: '#' },
          { label: 'Laptops' },
        ]"
      />
    </section>

    <!-- Breadcrumbs: With icon -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Icon</h2>
      <OBreadcrumbs
        :items="[
          { label: 'Home', href: '#' },
          { label: 'Settings', href: '#' },
          { label: 'Account' },
        ]"
      >
        <template #item-0="{ item }">
          <span class="flex items-center gap-1">
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {{ item.label }}
          </span>
        </template>
      </OBreadcrumbs>
    </section>

    <!-- Breadcrumbs: Page header usage -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Page Header</h2>
      <div class="flex flex-col gap-2">
        <OBreadcrumbs
          :items="[
            { label: 'Components', href: '#' },
            { label: 'Navigation', href: '#' },
            { label: 'Breadcrumbs' },
          ]"
        />
        <h3 class="text-2xl font-bold text-ousi-foreground">Breadcrumbs</h3>
        <p class="text-ousi-muted">Navigation component for hierarchical pages.</p>
      </div>
    </section>

    <!-- ═══════════ BUTTON GROUP ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Button Group</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ButtonGroup: Real-world examples -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Real-World Examples</h2>
      <div class="flex flex-col items-start gap-6">
        <!-- Merge button + dropdown trigger -->
        <OButtonGroup>
          <OButton>Merge pull request</OButton>
          <OButton is-icon-only>
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </OButton>
        </OButtonGroup>

        <!-- Fork / Star / Thumbs patterns -->
        <div class="flex flex-wrap gap-3">
          <OButtonGroup>
            <OButton variant="secondary">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v6m0 0l-3-3m3 3l3-3M18 21v-6m0 0l3 3m-3-3l-3 3M6 21V9m12 12V3"/></svg>
              Fork
              <OChip color="accent" variant="soft" size="sm">24</OChip>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </OButton>
          </OButtonGroup>

          <OButtonGroup>
            <OButton variant="secondary">
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Star
            </OButton>
            <OButton variant="secondary" class="px-2">
              <OButtonGroup.Separator />
              <OChip color="accent" variant="soft" size="sm">104</OChip>
            </OButton>
          </OButtonGroup>

          <OButtonGroup>
            <OButton variant="secondary">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
              <span class="text-xs font-semibold">2.4K</span>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"/></svg>
            </OButton>
          </OButtonGroup>
        </div>

        <!-- Previous / Next -->
        <OButtonGroup>
          <OButton variant="secondary">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Previous
          </OButton>
          <OButton variant="secondary">
            <OButtonGroup.Separator />
            Next
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </OButton>
        </OButtonGroup>

        <!-- Text alignment icons -->
        <OButtonGroup>
          <OButton variant="secondary" is-icon-only>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </OButton>
          <OButton variant="secondary" is-icon-only>
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
          </OButton>
          <OButton variant="secondary" is-icon-only>
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </OButton>
          <OButton variant="secondary" is-icon-only>
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
          </OButton>
        </OButtonGroup>
      </div>
    </section>

    <!-- ButtonGroup: Variants -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Variants</h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-xs text-ousi-muted mb-2">Primary</p>
          <OButtonGroup>
            <OButton>First</OButton>
            <OButton><OButtonGroup.Separator />Second</OButton>
            <OButton><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Secondary</p>
          <OButtonGroup>
            <OButton variant="secondary">First</OButton>
            <OButton variant="secondary"><OButtonGroup.Separator />Second</OButton>
            <OButton variant="secondary"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Outline</p>
          <OButtonGroup>
            <OButton variant="outline">First</OButton>
            <OButton variant="outline"><OButtonGroup.Separator />Second</OButton>
            <OButton variant="outline"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Ghost</p>
          <OButtonGroup>
            <OButton variant="ghost">First</OButton>
            <OButton variant="ghost"><OButtonGroup.Separator />Second</OButton>
            <OButton variant="ghost"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Danger</p>
          <OButtonGroup>
            <OButton variant="danger">First</OButton>
            <OButton variant="danger"><OButtonGroup.Separator />Second</OButton>
            <OButton variant="danger"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
      </div>
    </section>

    <!-- ButtonGroup: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex flex-col items-start gap-4">
        <div>
          <p class="text-xs text-ousi-muted mb-2">Small</p>
          <OButtonGroup>
            <OButton size="sm" variant="secondary">First</OButton>
            <OButton size="sm" variant="secondary"><OButtonGroup.Separator />Second</OButton>
            <OButton size="sm" variant="secondary"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Medium (default)</p>
          <OButtonGroup>
            <OButton variant="secondary">First</OButton>
            <OButton variant="secondary"><OButtonGroup.Separator />Second</OButton>
            <OButton variant="secondary"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Large</p>
          <OButtonGroup>
            <OButton size="lg" variant="secondary">First</OButton>
            <OButton size="lg" variant="secondary"><OButtonGroup.Separator />Second</OButton>
            <OButton size="lg" variant="secondary"><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
      </div>
    </section>

    <!-- ButtonGroup: Orientation -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Orientation</h2>
      <div class="flex items-start gap-8">
        <div>
          <p class="text-xs text-ousi-muted mb-2">Horizontal</p>
          <OButtonGroup>
            <OButton variant="secondary" is-icon-only>
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
            </OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Vertical</p>
          <OButtonGroup orientation="vertical">
            <OButton variant="secondary" is-icon-only>
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
            </OButton>
            <OButton variant="secondary" is-icon-only>
              <OButtonGroup.Separator />
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
            </OButton>
          </OButtonGroup>
        </div>
      </div>
    </section>

    <!-- ButtonGroup: With Icons -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Icons</h2>
      <div class="flex flex-col items-start gap-4">
        <OButtonGroup>
          <OButton variant="secondary">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Search
          </OButton>
          <OButton variant="secondary">
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add
          </OButton>
          <OButton variant="secondary">
            <OButtonGroup.Separator />
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            Delete
          </OButton>
        </OButtonGroup>
      </div>
    </section>

    <!-- ButtonGroup: Full Width -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Full Width</h2>
      <div class="max-w-md space-y-3">
        <OButtonGroup full-width>
          <OButton variant="secondary">First</OButton>
          <OButton variant="secondary"><OButtonGroup.Separator />Second</OButton>
          <OButton variant="secondary"><OButtonGroup.Separator />Third</OButton>
        </OButtonGroup>
      </div>
    </section>

    <!-- ButtonGroup: Disabled -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled</h2>
      <div class="flex flex-col items-start gap-4">
        <div>
          <p class="text-xs text-ousi-muted mb-2">All disabled</p>
          <OButtonGroup>
            <OButton disabled>First</OButton>
            <OButton disabled><OButtonGroup.Separator />Second</OButton>
            <OButton disabled><OButtonGroup.Separator />Third</OButton>
          </OButtonGroup>
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Mixed (Third enabled)</p>
          <OButtonGroup>
            <OButton disabled>First</OButton>
            <OButton disabled><OButtonGroup.Separator />Second</OButton>
            <OButton><OButtonGroup.Separator />Third (enabled)</OButton>
          </OButtonGroup>
        </div>
      </div>
    </section>

    <!-- ButtonGroup: Without Separator -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Without Separator</h2>
      <OButtonGroup>
        <OButton variant="secondary">First</OButton>
        <OButton variant="secondary">Second</OButton>
        <OButton variant="secondary">Third</OButton>
      </OButtonGroup>
    </section>

    <!-- ═══════════ CALENDAR ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Calendar</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- Calendar: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="flex flex-col gap-2">
        <OCalendar v-model="calDate1" />
        <p class="text-xs text-ousi-muted font-mono">
          Selected: {{ calDate1 ? `${calDate1.year}-${String(calDate1.month).padStart(2,'0')}-${String(calDate1.day).padStart(2,'0')}` : 'None' }}
        </p>
      </div>
    </section>

    <!-- Calendar: Min/Max range -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Min / Max Date</h2>
      <OCalendar
        v-model="calDate2"
        :min-value="{ year: 2026, month: 4, day: 1 }"
        :max-value="{ year: 2026, month: 4, day: 15 }"
      />
      <p class="text-xs text-ousi-muted mt-2">Only April 1-15 selectable.</p>
    </section>

    <!-- Calendar: Unavailable dates -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Unavailable Dates</h2>
      <OCalendar
        v-model="calDate3"
        :unavailable-dates="[
          { year: 2026, month: 4, day: 5 },
          { year: 2026, month: 4, day: 12 },
          { year: 2026, month: 4, day: 19 },
          { year: 2026, month: 4, day: 26 },
        ]"
      />
      <p class="text-xs text-ousi-muted mt-2">Saturdays are unavailable.</p>
    </section>

    <!-- Calendar: Year Picker -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Year Picker</h2>
      <p class="text-sm text-ousi-muted mb-3">Click the month/year heading to open the year picker.</p>
      <OCalendar v-model="calDate4" show-year-picker />
    </section>

    <!-- Calendar: Cell Indicators -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Cell Indicators</h2>
      <p class="text-sm text-ousi-muted mb-3">Dots mark days with events. Today also gets an indicator.</p>
      <OCalendar :indicator-days="[3, 7, 12, 15, 21, 28]" />
    </section>

    <!-- Calendar: Custom Navigation Icons -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Navigation Icons</h2>
      <OCalendar>
        <template #prev-icon>
          <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
        </template>
        <template #next-icon>
          <svg class="size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
        </template>
      </OCalendar>
    </section>

    <!-- Calendar: Without Outside Days -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Without Outside Days</h2>
      <OCalendar :show-outside-days="false" />
    </section>

    <!-- Calendar: Disabled & Readonly -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled &amp; Readonly</h2>
      <div class="flex gap-8 flex-wrap">
        <div>
          <p class="text-xs text-ousi-muted mb-2">Disabled</p>
          <OCalendar disabled :default-value="{ year: 2026, month: 4, day: 2 }" />
        </div>
        <div>
          <p class="text-xs text-ousi-muted mb-2">Readonly</p>
          <OCalendar readonly :default-value="{ year: 2026, month: 4, day: 2 }" />
        </div>
      </div>
    </section>

    <!-- Calendar: In Card -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Card</h2>
      <OCard class="w-fit" variant="secondary">
        <OCard.Content>
          <OCalendar v-model="calDate1" show-year-picker />
        </OCard.Content>
        <OCard.Footer class="justify-between">
          <OButton variant="ghost" size="sm" @click="calDate1 = null">Clear</OButton>
          <OButton size="sm">Apply</OButton>
        </OCard.Footer>
      </OCard>
    </section>

    <!-- Calendar: Custom Cell — Prices -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Cell — Prices</h2>
      <p class="text-sm text-ousi-muted mb-3">The <code class="text-ousi-accent">#cell</code> slot lets you add prices, badges, or any content per day.</p>
      <OCalendar>
        <template #cell="{ day, isSelected, isToday, isOutsideMonth }">
          <span
            class="absolute inset-0 flex flex-col items-center justify-center"
            :class="isOutsideMonth ? 'opacity-30' : ''"
          >
            <span :class="[
              'text-sm',
              isSelected ? 'font-bold' : '',
              isToday && !isSelected ? 'text-ousi-accent' : '',
            ]">{{ day }}</span>
            <span
              v-if="[5, 10, 15, 20, 25].includes(day) && !isOutsideMonth"
              class="text-[8px] leading-none mt-0.5"
              :class="isSelected ? 'text-ousi-accent-foreground/80' : 'text-ousi-success'"
            >$99</span>
          </span>
        </template>
      </OCalendar>
    </section>

    <!-- Calendar: Custom Cell — Soft Background -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Cell — Soft Background</h2>
      <p class="text-sm text-ousi-muted mb-3">Add a soft colored background to event days using the slot.</p>
      <OCalendar>
        <template #cell="{ day, isSelected, isToday, isOutsideMonth }">
          <span
            class="absolute inset-1 flex items-center justify-center rounded-ousi-md"
            :class="[
              isOutsideMonth ? 'opacity-30' : '',
              !isSelected && !isOutsideMonth && [3, 7, 12, 15, 21, 28].includes(day) ? 'bg-ousi-accent-soft' : '',
              !isSelected && !isOutsideMonth && [8, 22].includes(day) ? 'bg-ousi-danger-soft' : '',
              !isSelected && !isOutsideMonth && [1, 14].includes(day) ? 'bg-ousi-success-soft' : '',
            ]"
          >
            <span :class="[
              'text-sm',
              isSelected ? 'font-bold' : '',
              isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
              !isSelected && !isOutsideMonth && [3, 7, 12, 15, 21, 28].includes(day) ? 'text-ousi-accent' : '',
              !isSelected && !isOutsideMonth && [8, 22].includes(day) ? 'text-ousi-danger' : '',
              !isSelected && !isOutsideMonth && [1, 14].includes(day) ? 'text-ousi-success' : '',
            ]">{{ day }}</span>
          </span>
        </template>
      </OCalendar>
      <div class="flex items-center gap-4 mt-3 text-xs text-ousi-muted">
        <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-accent-soft" /> Meetings</span>
        <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-danger-soft" /> Deadlines</span>
        <span class="flex items-center gap-1"><span class="size-2 rounded-sm bg-ousi-success-soft" /> Milestones</span>
      </div>
    </section>

    <!-- Calendar: Custom Cell — Tooltip -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Cell with Tooltip</h2>
      <p class="text-sm text-ousi-muted mb-3">Every cell gets a tooltip on hover. Event days show details.</p>
      <OCalendar :indicator-days="[3, 7, 12, 15, 21, 28]">
        <template #cell="{ day, isSelected, isToday, isOutsideMonth, hasIndicator }">
          <OTooltip
            :content="hasIndicator && !isOutsideMonth ? `${day}: Team meeting` : `Day ${day}`"
            :delay="200"
            placement="top"
          >
            <span class="absolute inset-0 flex flex-col items-center justify-center">
              <span :class="[
                'text-sm',
                isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
                isOutsideMonth ? 'opacity-30' : '',
              ]">{{ day }}</span>
              <span
                v-if="hasIndicator && !isOutsideMonth"
                class="size-1 rounded-full mt-0.5"
                :class="isSelected ? 'bg-ousi-accent-foreground' : 'bg-ousi-accent'"
              />
            </span>
          </OTooltip>
        </template>
      </OCalendar>
    </section>

    <!-- Calendar: Custom Cell — Popover on Click -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Cell with Popover</h2>
      <p class="text-sm text-ousi-muted mb-3">Click an event day to see details in a popover. Non-event days select normally.</p>
      <OCalendar :indicator-days="[5, 12, 19, 26]">
        <template #cell="{ day, date, isSelected, isToday, isOutsideMonth, hasIndicator }">
          <OPopover v-if="hasIndicator && !isOutsideMonth" placement="right" :show-arrow="true">
            <template #trigger>
              <span class="absolute inset-1 flex flex-col items-center justify-center rounded-ousi-md bg-ousi-accent-soft">
                <span class="text-sm" :class="isToday ? 'font-semibold' : ''">{{ day }}</span>
                <span class="size-1 rounded-full bg-ousi-accent mt-0.5" />
              </span>
            </template>
            <template #default="{ close }">
              <div class="min-w-48">
                <p class="text-sm font-medium text-ousi-foreground mb-1">Sprint Review</p>
                <p class="text-xs text-ousi-muted mb-3">{{ date.year }}-{{ String(date.month).padStart(2,'0') }}-{{ String(date.day).padStart(2,'0') }} at 2:00 PM</p>
                <div class="flex items-center gap-2 mb-3">
                  <OAvatar name="Carlos R" size="sm" />
                  <OAvatar name="Ana T" size="sm" />
                  <OAvatar name="Bob M" size="sm" />
                  <span class="text-xs text-ousi-muted">+2 others</span>
                </div>
                <div class="flex gap-2">
                  <OButton size="sm" variant="soft" @click="close">Details</OButton>
                  <OButton size="sm" variant="ghost" @click="close">Dismiss</OButton>
                </div>
              </div>
            </template>
          </OPopover>
          <span v-else class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm" :class="[
              isOutsideMonth ? 'opacity-30' : '',
              isToday && !isSelected ? 'text-ousi-accent font-semibold' : '',
            ]">{{ day }}</span>
          </span>
        </template>
      </OCalendar>
    </section>

    <!-- Calendar: Date Picker (Popover) -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Date Picker (Popover)</h2>
      <OPopover>
        <template #trigger>
          <OButton variant="outline">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ calDatePicker
              ? `${calDatePicker.year}-${String(calDatePicker.month).padStart(2,'0')}-${String(calDatePicker.day).padStart(2,'0')}`
              : 'Pick a date'
            }}
          </OButton>
        </template>
        <template #default="{ close }">
          <OCalendar v-model="calDatePicker" @change="close" />
        </template>
      </OPopover>
    </section>

    <!-- ═══════════ RANGE CALENDAR ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Range Calendar</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- RangeCalendar: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="flex flex-col gap-2">
        <ORangeCalendar v-model="range1" />
        <p class="text-xs text-ousi-muted font-mono">
          {{ range1?.start && range1?.end
            ? `${range1.start.year}-${String(range1.start.month).padStart(2,'0')}-${String(range1.start.day).padStart(2,'0')} → ${range1.end.year}-${String(range1.end.month).padStart(2,'0')}-${String(range1.end.day).padStart(2,'0')}`
            : range1?.start
              ? `Start: ${range1.start.year}-${String(range1.start.month).padStart(2,'0')}-${String(range1.start.day).padStart(2,'0')} (select end)`
              : 'No range selected'
          }}
        </p>
      </div>
    </section>

    <!-- RangeCalendar: Min/Max -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Min / Max Date</h2>
      <ORangeCalendar
        v-model="range2"
        :min-value="{ year: 2026, month: 4, day: 1 }"
        :max-value="{ year: 2026, month: 4, day: 28 }"
      />
      <p class="text-xs text-ousi-muted mt-2">Only April 1-28 selectable.</p>
    </section>

    <!-- RangeCalendar: Readonly preset -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Readonly</h2>
      <ORangeCalendar
        :model-value="{
          start: { year: 2026, month: 4, day: 7 },
          end: { year: 2026, month: 4, day: 18 },
        }"
        readonly
      />
    </section>

    <!-- RangeCalendar: Date Range Picker (Popover) -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Range Picker (Popover)</h2>
      <OPopover placement="bottom-start">
        <template #trigger>
          <OButton variant="outline">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span v-if="rangePicker?.start && rangePicker?.end">
              {{ rangePicker.start.month }}/{{ rangePicker.start.day }} →
              {{ rangePicker.end.month }}/{{ rangePicker.end.day }}
            </span>
            <span v-else>Select date range</span>
          </OButton>
        </template>
        <template #default="{ close }">
          <ORangeCalendar v-model="rangePicker" />
          <div class="flex justify-end gap-2 px-4 pb-3">
            <OButton variant="ghost" size="sm" @click="rangePicker = null">Clear</OButton>
            <OButton size="sm" @click="close">Apply</OButton>
          </div>
        </template>
      </OPopover>
    </section>

    <!-- ═══════════ PROGRESS BAR ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Progress Bar</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ProgressBar: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="max-w-md">
        <OProgressBar :value="60" label="Loading" show-value-label />
      </div>
    </section>

    <!-- ProgressBar: Colors -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Colors</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <OProgressBar :value="75" color="accent" label="Accent" show-value-label />
        <OProgressBar :value="80" color="success" label="Success" show-value-label />
        <OProgressBar :value="45" color="warning" label="Warning" show-value-label />
        <OProgressBar :value="30" color="danger" label="Danger" show-value-label />
        <OProgressBar :value="60" color="default" label="Default" show-value-label />
      </div>
    </section>

    <!-- ProgressBar: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <OProgressBar :value="60" size="sm" label="Small" />
        <OProgressBar :value="60" size="md" label="Medium" />
        <OProgressBar :value="60" size="lg" label="Large" />
      </div>
    </section>

    <!-- ProgressBar: Indeterminate -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Indeterminate</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <OProgressBar label="Loading..." />
        <OProgressBar color="success" label="Processing..." />
      </div>
    </section>

    <!-- ProgressBar: Animated -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Animated</h2>
      <div class="max-w-md">
        <OProgressBar :value="uploadProgress" color="accent" label="Uploading..." show-value-label />
      </div>
    </section>

    <!-- ProgressBar: In Card -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Card</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Content class="gap-4">
          <div class="flex justify-between items-center">
            <p class="text-sm font-medium text-ousi-foreground">Project Progress</p>
            <span class="text-sm text-ousi-muted">3 of 5 tasks</span>
          </div>
          <OProgressBar :value="60" color="accent" />
          <div class="flex flex-col gap-2">
            <OProgressBar :value="100" size="sm" color="success" label="Design" show-value-label />
            <OProgressBar :value="80" size="sm" color="success" label="Frontend" show-value-label />
            <OProgressBar :value="40" size="sm" color="warning" label="Backend" show-value-label />
            <OProgressBar :value="20" size="sm" color="danger" label="Testing" show-value-label />
            <OProgressBar size="sm" color="accent" label="Deployment" />
          </div>
        </OCard.Content>
      </OCard>
    </section>

    <!-- ═══════════ PROGRESS CIRCLE ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Progress Circle</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ProgressCircle: Colors -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Colors</h2>
      <div class="flex items-center gap-4">
        <OProgressCircle :value="70" color="accent" show-value-label />
        <OProgressCircle :value="80" color="success" show-value-label />
        <OProgressCircle :value="45" color="warning" show-value-label />
        <OProgressCircle :value="30" color="danger" show-value-label />
        <OProgressCircle :value="60" color="default" show-value-label />
      </div>
    </section>

    <!-- ProgressCircle: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex items-center gap-4">
        <OProgressCircle :value="75" size="sm" show-value-label />
        <OProgressCircle :value="75" size="md" show-value-label />
        <OProgressCircle :value="75" size="lg" show-value-label />
      </div>
    </section>

    <!-- ProgressCircle: Indeterminate -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Indeterminate</h2>
      <div class="flex items-center gap-4">
        <OProgressCircle color="accent" />
        <OProgressCircle color="success" />
        <OProgressCircle color="danger" size="lg" />
      </div>
    </section>

    <!-- ProgressCircle: Custom center content -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Custom Content</h2>
      <div class="flex items-center gap-4">
        <OProgressCircle :value="100" size="lg" color="success">
          <svg class="size-4 text-ousi-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </OProgressCircle>
        <OProgressCircle :value="0" size="lg" color="danger">
          <svg class="size-4 text-ousi-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </OProgressCircle>
      </div>
    </section>

    <!-- ProgressCircle: Animated -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Animated</h2>
      <OProgressCircle :value="circleProgress" color="accent" size="lg" show-value-label />
    </section>

    <!-- ProgressCircle: In Card -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">In Card</h2>
      <div class="flex gap-4">
        <OCard class="flex-1 max-w-48">
          <OCard.Content class="items-center gap-3">
            <OProgressCircle :value="87" color="success" size="lg" show-value-label />
            <div class="text-center">
              <p class="text-sm font-medium text-ousi-foreground">CPU Usage</p>
              <p class="text-xs text-ousi-muted">8 cores active</p>
            </div>
          </OCard.Content>
        </OCard>
        <OCard class="flex-1 max-w-48">
          <OCard.Content class="items-center gap-3">
            <OProgressCircle :value="34" color="warning" size="lg" show-value-label />
            <div class="text-center">
              <p class="text-sm font-medium text-ousi-foreground">Memory</p>
              <p class="text-xs text-ousi-muted">5.4 / 16 GB</p>
            </div>
          </OCard.Content>
        </OCard>
      </div>
    </section>

    <!-- ═══════════ COLOR SWATCH ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Color Swatch</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ColorSwatch: Basic colors -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic Colors</h2>
      <div class="flex gap-2 flex-wrap">
        <OColorSwatch color="#006FEE" />
        <OColorSwatch color="#17C964" />
        <OColorSwatch color="#F5A524" />
        <OColorSwatch color="#F31260" />
        <OColorSwatch color="#7828C8" />
        <OColorSwatch color="#000000" />
        <OColorSwatch color="#ffffff" />
      </div>
    </section>

    <!-- ColorSwatch: Shapes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Shapes</h2>
      <div class="flex gap-3 items-center">
        <OColorSwatch color="#006FEE" shape="square" />
        <OColorSwatch color="#006FEE" shape="circle" />
      </div>
    </section>

    <!-- ColorSwatch: Sizes -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Sizes</h2>
      <div class="flex gap-2 items-center">
        <OColorSwatch color="#006FEE" size="xs" />
        <OColorSwatch color="#006FEE" size="sm" />
        <OColorSwatch color="#006FEE" size="md" />
        <OColorSwatch color="#006FEE" size="lg" />
        <OColorSwatch color="#006FEE" size="xl" />
      </div>
    </section>

    <!-- ColorSwatch: Transparency -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Transparency</h2>
      <p class="text-sm text-ousi-muted mb-3">Checkerboard pattern shows through when color has alpha.</p>
      <div class="flex gap-2">
        <OColorSwatch color="rgba(0, 111, 238, 1)" />
        <OColorSwatch color="rgba(0, 111, 238, 0.7)" />
        <OColorSwatch color="rgba(0, 111, 238, 0.4)" />
        <OColorSwatch color="rgba(0, 111, 238, 0.1)" />
        <OColorSwatch color="rgba(0, 0, 0, 0)" />
      </div>
    </section>

    <!-- ColorSwatch: Palette strip -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Palette Strip</h2>
      <div class="flex gap-0">
        <OColorSwatch
          v-for="h in [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]"
          :key="h"
          :color="`hsl(${h}, 70%, 55%)`"
          size="sm"
          shape="square"
          class="rounded-none first:rounded-l-ousi-md last:rounded-r-ousi-md"
        />
      </div>
    </section>

    <!-- ColorSwatch: Color picker -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Color Picker</h2>
      <div class="flex flex-col gap-3">
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="c in ['#006FEE', '#17C964', '#F5A524', '#F31260', '#7828C8', '#000000']"
            :key="c"
            class="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
            :class="selectedSwatchColor === c ? 'ring-2 ring-offset-2 ring-ousi-accent' : ''"
            @click="selectedSwatchColor = c"
          >
            <OColorSwatch :color="c" shape="circle" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <OColorSwatch :color="selectedSwatchColor" size="sm" shape="circle" />
          <span class="text-sm text-ousi-muted font-mono">{{ selectedSwatchColor }}</span>
        </div>
      </div>
    </section>

    <!-- ═══════════ COLOR FIELD ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Color Field</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ColorField: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <div class="max-w-sm">
        <OColorField v-model="cfBrand" label="Brand color" full-width />
        <p class="text-xs text-ousi-muted font-mono mt-2">v-model: "{{ cfBrand }}"</p>
      </div>
    </section>

    <!-- ColorField: Formats -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Output Formats</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
        <OColorField v-model="cfHex" format="hex" label="Hex format" full-width />
        <OColorField v-model="cfRgb" format="rgb" label="RGB format" full-width />
      </div>
    </section>

    <!-- ColorField: Without swatch -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Without Swatch</h2>
      <div class="max-w-sm">
        <OColorField model-value="#F5A524" :show-swatch="false" label="No preview" full-width />
      </div>
    </section>

    <!-- ColorField: With presets -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Presets</h2>
      <div class="flex flex-col gap-2 max-w-sm">
        <OColorField v-model="cfPresetColor" label="Custom color" full-width />
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="c in cfPresets"
            :key="c"
            class="rounded-ousi-sm outline-none focus-visible:ring-2 focus-visible:ring-ousi-focus"
            @click="cfPresetColor = c"
          >
            <OColorSwatch :color="c" size="sm" />
          </button>
        </div>
      </div>
    </section>

    <!-- ColorField: Theme editor -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Theme Editor</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Header>
          <OCard.Title>Theme Colors</OCard.Title>
          <OCard.Description>Customize your brand colors</OCard.Description>
        </OCard.Header>
        <OCard.Content class="gap-3">
          <OColorField v-model="themeColors.primary" label="Primary" variant="secondary" full-width />
          <OColorField v-model="themeColors.secondary" label="Secondary" variant="secondary" full-width />
          <OColorField v-model="themeColors.background" label="Background" variant="secondary" full-width />
          <OColorField v-model="themeColors.text" label="Text" variant="secondary" full-width />
        </OCard.Content>
        <OCard.Footer>
          <OButton variant="ghost" class="mr-auto" size="sm">Reset</OButton>
          <OButton size="sm">Save theme</OButton>
        </OCard.Footer>
      </OCard>
    </section>

    <!-- ═══════════ COLOR SLIDER ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Color Slider</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ColorSlider: HSL Color Picker -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">HSL Color Picker</h2>
      <div class="flex flex-col gap-4 max-w-md">
        <OColorSlider v-model="csH" channel="hue" label="Hue" show-output :context-color="{ s: csS, l: csL }" />
        <OColorSlider v-model="csS" channel="saturation" label="Saturation" show-output :context-color="{ h: csH, l: csL }" />
        <OColorSlider v-model="csL" channel="lightness" label="Lightness" show-output :context-color="{ h: csH, s: csS }" />
        <OColorSlider v-model="csA" channel="alpha" label="Alpha" show-output :context-color="{ h: csH, s: csS, l: csL }" />

        <div class="flex items-center gap-3">
          <OColorSwatch :color="csColor" size="xl" shape="square" class="rounded-ousi-xl" />
          <div>
            <p class="text-sm font-medium text-ousi-foreground font-mono">{{ csColor }}</p>
            <p class="text-xs text-ousi-muted">H:{{ csH }}° S:{{ csS }}% L:{{ csL }}% A:{{ Math.round(csA * 100) }}%</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ColorSlider: Standalone Hue -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Standalone Hue</h2>
      <div class="max-w-md">
        <OColorSlider :model-value="180" channel="hue" :context-color="{ s: 100, l: 50 }" />
      </div>
    </section>

    <!-- ColorSlider: Vertical -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Vertical</h2>
      <div class="flex gap-6 h-48">
        <OColorSlider v-model="csH" channel="hue" orientation="vertical" label="H" show-output :context-color="{ s: csS, l: csL }" />
        <OColorSlider v-model="csS" channel="saturation" orientation="vertical" label="S" show-output :context-color="{ h: csH, l: csL }" />
        <OColorSlider v-model="csL" channel="lightness" orientation="vertical" label="L" show-output :context-color="{ h: csH, s: csS }" />
        <OColorSlider v-model="csA" channel="alpha" orientation="vertical" label="A" show-output :context-color="{ h: csH, s: csS, l: csL }" />
      </div>
    </section>

    <!-- ColorSlider: Disabled -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled</h2>
      <div class="max-w-md">
        <OColorSlider :model-value="220" channel="hue" label="Disabled" show-output disabled :context-color="{ s: 80, l: 50 }" />
      </div>
    </section>

    <!-- ═══════════ COLOR AREA ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Color Area</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ColorArea: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <OColorArea v-model="caArea" :hue="caHue" />
      <p class="text-xs text-ousi-muted font-mono mt-2">S: {{ caArea.x }}% V: {{ caArea.y }}%</p>
    </section>

    <!-- ColorArea: With Hue Slider -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Hue Slider</h2>
      <div class="flex flex-col gap-3 w-56">
        <OColorArea v-model="caArea" :hue="caHue" />
        <OColorSlider v-model="caHue" channel="hue" :context-color="{ s: caArea.x, l: 50 }" />
        <div class="flex items-center gap-2">
          <OColorSwatch :color="caColor" size="lg" shape="circle" />
          <span class="text-sm text-ousi-muted font-mono">{{ caColor }}</span>
        </div>
      </div>
    </section>

    <!-- ColorArea: Full Color Picker -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Full Color Picker</h2>
      <div class="flex flex-col gap-3 w-64 p-4 rounded-ousi-3xl bg-ousi-surface shadow-ousi-surface">
        <OColorArea v-model="caArea" :hue="caHue" class="max-w-full" />
        <OColorSlider v-model="caHue" channel="hue" :context-color="{ s: caArea.x, l: 50 }" />
        <OColorSlider v-model="caAlpha" channel="alpha" :context-color="{ h: caHue, s: caArea.x, l: caArea.y / 2 }" />
        <div class="flex items-center gap-2">
          <OColorSwatch :color="caColor" shape="circle" />
          <OColorField :model-value="caColor" :show-swatch="false" full-width />
        </div>
      </div>
    </section>

    <!-- ColorArea: Dots overlay -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Dots Overlay</h2>
      <OColorArea :model-value="{ x: 70, y: 80 }" :hue="120" show-dots />
    </section>

    <!-- ColorArea: Disabled -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled</h2>
      <OColorArea :model-value="{ x: 80, y: 60 }" :hue="220" disabled />
    </section>

    <!-- ═══════════ COLOR PICKER ═══════════ -->
    <div class="mt-20 mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-ousi-foreground">Color Picker</h1>
      <div class="h-px bg-ousi-border mt-2" />
    </div>

    <!-- ColorPicker: Basic -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Basic</h2>
      <OColorPicker />
    </section>

    <!-- ColorPicker: With Label -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Label</h2>
      <OColorPicker label="Brand color" />
    </section>

    <!-- ColorPicker: With Swatches -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">With Swatches</h2>
      <div class="flex gap-4 flex-wrap">
        <OColorPicker show-swatches label="Default palette" />
        <OColorPicker
          show-swatches
          :swatches="['#006FEE', '#17C964', '#F5A524', '#F31260', '#7828C8']"
          label="Custom palette"
        />
      </div>
    </section>

    <!-- ColorPicker: Without Alpha / Hex -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Toggles</h2>
      <div class="flex gap-4 flex-wrap">
        <OColorPicker :show-alpha="false" label="No alpha" />
        <OColorPicker :show-hex-input="false" label="No hex input" />
      </div>
    </section>

    <!-- ColorPicker: Disabled -->
    <section class="mb-10">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Disabled</h2>
      <OColorPicker disabled label="Disabled" />
    </section>

    <!-- ColorPicker: Theme Builder -->
    <section class="mb-14">
      <h2 class="text-lg font-semibold text-ousi-foreground mb-4">Theme Builder</h2>
      <OCard variant="secondary" class="max-w-sm">
        <OCard.Header>
          <OCard.Title>Theme Builder</OCard.Title>
          <OCard.Description>Customize your design tokens</OCard.Description>
        </OCard.Header>
        <OCard.Content class="gap-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-foreground">Primary</span>
            <OColorPicker show-swatches />
          </div>
          <OSeparator />
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-foreground">Accent</span>
            <OColorPicker :show-alpha="false" />
          </div>
          <OSeparator />
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-foreground">Background</span>
            <OColorPicker :default-value="{ h: 0, s: 0, v: 100, a: 1 }" />
          </div>
        </OCard.Content>
      </OCard>
    </section>

    <!-- DateField -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">DateField</h2>
        <p class="text-sm text-ousi-muted mt-1">Segmented date input with locale-aware ordering and keyboard navigation.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Default (en-US) -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Default (en-US)</label>
          <ODateField v-model="dfDate" />
          <p class="text-xs text-ousi-muted">Value: {{ dfDate ? `${dfDate.year}-${String(dfDate.month).padStart(2,'0')}-${String(dfDate.day).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- Pre-filled -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Pre-filled</label>
          <ODateField v-model="dfPreset" />
          <p class="text-xs text-ousi-muted">Value: {{ dfPreset ? `${dfPreset.year}-${String(dfPreset.month).padStart(2,'0')}-${String(dfPreset.day).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- Japanese locale -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Japanese (ja-JP)</label>
          <ODateField v-model="dfJp" locale="ja-JP" />
        </div>

        <!-- German locale -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">German (de-DE)</label>
          <ODateField v-model="dfDe" locale="de-DE" />
        </div>

        <!-- Month granularity -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Month granularity</label>
          <ODateField v-model="dfMonth" granularity="month" />
        </div>

        <!-- Disabled -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Disabled</label>
          <ODateField :default-value="{ year: 2025, month: 1, day: 1 }" disabled />
        </div>
      </div>
    </section>

    <OSeparator />

    <!-- TimeField -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">TimeField</h2>
        <p class="text-sm text-ousi-muted mt-1">Segmented time input with 12/24-hour support and keyboard navigation.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 12h (default) -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">12-hour</label>
          <OTimeField v-model="tfTime" hour12 />
          <p class="text-xs text-ousi-muted">Value: {{ tfTime ? `${String(tfTime.hour).padStart(2,'0')}:${String(tfTime.minute).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- 24h -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">24-hour</label>
          <OTimeField v-model="tf24" />
          <p class="text-xs text-ousi-muted">Value: {{ tf24 ? `${String(tf24.hour).padStart(2,'0')}:${String(tf24.minute).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- Pre-filled -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Pre-filled (2:30 PM)</label>
          <OTimeField v-model="tfPreset" hour12 />
        </div>

        <!-- With seconds -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">With seconds</label>
          <OTimeField v-model="tfSeconds" granularity="second" />
          <p class="text-xs text-ousi-muted">Value: {{ tfSeconds ? `${String(tfSeconds.hour).padStart(2,'0')}:${String(tfSeconds.minute).padStart(2,'0')}:${String(tfSeconds.second ?? 0).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- Disabled -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">Disabled</label>
          <OTimeField :default-value="{ hour: 9, minute: 0 }" disabled />
        </div>

        <!-- 12h with seconds -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-ousi-foreground">12h + seconds</label>
          <OTimeField hour12 granularity="second" />
        </div>
      </div>
    </section>

    <OSeparator />

    <!-- DatePicker -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">DatePicker</h2>
        <p class="text-sm text-ousi-muted mt-1">Combines a segmented date field with a calendar popover.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic -->
        <div class="space-y-2">
          <ODatePicker v-model="dpDate1" label="Date" />
          <p class="text-xs text-ousi-muted">Value: {{ dpDate1 ? `${dpDate1.year}-${String(dpDate1.month).padStart(2,'0')}-${String(dpDate1.day).padStart(2,'0')}` : 'null' }}</p>
        </div>

        <!-- With description -->
        <ODatePicker
          v-model="dpDate2"
          label="Appointment date"
          description="Select your preferred appointment date"
        />

        <!-- With error -->
        <ODatePicker
          v-model="dpDate3"
          label="Required date"
          :required="true"
          error-message="Please select a date"
        />

        <!-- Min/max -->
        <ODatePicker
          v-model="dpDate4"
          label="Available dates"
          description="Only dates in 2025 are available"
          :min-value="{ year: 2025, month: 1, day: 1 }"
          :max-value="{ year: 2025, month: 12, day: 31 }"
        />

        <!-- Unavailable dates -->
        <ODatePicker
          v-model="dpDate5"
          label="Booking date"
          :unavailable-dates="[
            { year: 2025, month: 4, day: 10 },
            { year: 2025, month: 4, day: 15 },
            { year: 2025, month: 4, day: 20 },
          ]"
        />

        <!-- Spanish locale -->
        <ODatePicker v-model="dpDateEs" label="Fecha (ES)" locale="es" />

        <!-- Opens upward -->
        <ODatePicker v-model="dpDateUp" label="Opens upward" placement="top-start" />

        <!-- Full width -->
        <ODatePicker v-model="dpFull" label="Full width" :full-width="true" />

        <!-- Disabled -->
        <ODatePicker
          label="Disabled"
          :default-value="{ year: 2025, month: 4, day: 2 }"
          :disabled="true"
        />

        <!-- Readonly -->
        <ODatePicker
          label="Readonly"
          :model-value="{ year: 2025, month: 4, day: 2 }"
          :readonly="true"
        />
      </div>

      <!-- Real-world: booking form -->
      <div class="pt-4">
        <OCard class="max-w-sm">
          <OCard.Header>
            <OCard.Title>Book appointment</OCard.Title>
          </OCard.Header>
          <OCard.Content class="gap-4">
            <OInput label="Full name" placeholder="John Doe" full-width />
            <ODatePicker
              v-model="bookingDate"
              label="Date"
              :full-width="true"
              description="Select your preferred date"
              :min-value="{ year: 2025, month: 1, day: 1 }"
            />
            <OSelect
              v-model="bookingTime"
              label="Time slot"
              :full-width="true"
              :options="timeSlots"
            />
          </OCard.Content>
          <OCard.Footer>
            <OButton :full-width="true">Confirm booking</OButton>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <OSeparator />

    <!-- DateRangePicker -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">DateRangePicker</h2>
        <p class="text-sm text-ousi-muted mt-1">Two segmented date fields with a range calendar popover.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic -->
        <div class="space-y-2">
          <ODateRangePicker v-model="drpRange1" label="Date range" />
          <p class="text-xs text-ousi-muted">
            Start: {{ drpRange1?.start ? `${drpRange1.start.year}-${String(drpRange1.start.month).padStart(2,'0')}-${String(drpRange1.start.day).padStart(2,'0')}` : 'None' }}
            — End: {{ drpRange1?.end ? `${drpRange1.end.year}-${String(drpRange1.end.month).padStart(2,'0')}-${String(drpRange1.end.day).padStart(2,'0')}` : 'None' }}
          </p>
        </div>

        <!-- With description -->
        <ODateRangePicker
          v-model="drpRange2"
          label="Stay dates"
          description="Select your check-in and check-out dates"
        />

        <!-- With error -->
        <ODateRangePicker
          v-model="drpRange3"
          label="Required range"
          :required="true"
          error-message="Please select a date range"
        />

        <!-- Min/max -->
        <ODateRangePicker
          v-model="drpRange4"
          label="Available period"
          description="Only 2025 dates available"
          :min-value="{ year: 2025, month: 1, day: 1 }"
          :max-value="{ year: 2025, month: 12, day: 31 }"
        />

        <!-- Unavailable dates -->
        <ODateRangePicker
          v-model="drpRange5"
          label="Booking range"
          :unavailable-dates="[
            { year: 2025, month: 4, day: 10 },
            { year: 2025, month: 4, day: 11 },
            { year: 2025, month: 4, day: 12 },
          ]"
        />

        <!-- Spanish locale -->
        <ODateRangePicker v-model="drpRangeEs" label="Fecha (ES)" locale="es" />

        <!-- Opens upward -->
        <ODateRangePicker v-model="drpRangeUp" label="Opens upward" placement="top-start" />

        <!-- Full width -->
        <ODateRangePicker v-model="drpFull" label="Full width" :full-width="true" />

        <!-- Disabled -->
        <ODateRangePicker
          label="Disabled"
          :default-value="{
            start: { year: 2025, month: 4, day: 1 },
            end: { year: 2025, month: 4, day: 7 }
          }"
          :disabled="true"
        />

        <!-- Readonly -->
        <ODateRangePicker
          label="Readonly"
          :model-value="{
            start: { year: 2025, month: 4, day: 1 },
            end: { year: 2025, month: 4, day: 7 }
          }"
          :readonly="true"
        />
      </div>

      <!-- Real-world: hotel booking -->
      <div class="pt-4">
        <OCard class="max-w-sm">
          <OCard.Header>
            <OCard.Title>Book a room</OCard.Title>
          </OCard.Header>
          <OCard.Content class="gap-4">
            <ODateRangePicker
              v-model="hotelDates"
              label="Stay dates"
              :full-width="true"
              description="Select check-in and check-out"
              :min-value="{ year: 2025, month: 1, day: 1 }"
            />
            <OSelect
              v-model="hotelGuests"
              label="Guests"
              :full-width="true"
              :options="[
                { value: 1, label: '1 guest' },
                { value: 2, label: '2 guests' },
                { value: 3, label: '3 guests' },
                { value: 4, label: '4 guests' },
              ]"
            />
          </OCard.Content>
          <OCard.Footer>
            <OButton :full-width="true">Search availability</OButton>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <OSeparator />

    <!-- Disclosure -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Disclosure</h2>
        <p class="text-sm text-ousi-muted mt-1">Expandable/collapsible content panels with smooth height animation.</p>
      </div>

      <!-- HeroUI-style: button trigger with rich content body -->
      <div class="max-w-md">
        <h3 class="text-sm font-semibold text-ousi-foreground mb-2">HeroUI-style (button trigger)</h3>
        <ODisclosure v-model="disclosureOpen">
          <template #trigger="{ isOpen }">
            <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h.01M7 12h.01M7 17h.01" />
            </svg>
            <span class="flex-1 text-left text-sm font-medium">Preview Ousi UI</span>
          </template>
          <div class="flex flex-col items-center rounded-ousi-2xl bg-ousi-default p-4 text-center">
            <p class="text-sm text-ousi-muted">
              Ousi UI is a Vue 3 component library inspired by HeroUI v3,
              built with Tailwind CSS v4, CVA, and OKLCH color tokens.
            </p>
            <div class="my-4 flex size-40 items-center justify-center rounded-ousi-2xl bg-ousi-overlay text-ousi-accent">
              <svg class="size-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <p class="text-sm text-ousi-muted">40+ components and growing.</p>
            <OButton class="mt-3" variant="primary" size="sm">
              Get started
            </OButton>
          </div>
        </ODisclosure>
        <OButton size="sm" variant="secondary" class="mt-2" @click="disclosureOpen = !disclosureOpen">
          Toggle externally
        </OButton>
      </div>

      <div class="space-y-4 max-w-xl">
        <!-- Basic with title slot -->
        <h3 class="text-sm font-semibold text-ousi-foreground">Basic</h3>
        <ODisclosure class="border-b border-ousi-border">
          <template #title>What is Ousi UI?</template>
          <p class="text-sm text-ousi-muted">
            Ousi UI is a Vue 3 component library inspired by HeroUI v3,
            built with Tailwind CSS v4 and CVA.
          </p>
        </ODisclosure>

        <!-- Open by default -->
        <h3 class="text-sm font-semibold text-ousi-foreground pt-4">Open by default</h3>
        <ODisclosure :default-open="true" class="border-b border-ousi-border">
          <template #title>Open by default</template>
          <p class="text-sm text-ousi-muted">This disclosure starts open.</p>
        </ODisclosure>

        <!-- Disabled -->
        <h3 class="text-sm font-semibold text-ousi-foreground pt-4">Disabled</h3>
        <ODisclosure :disabled="true" class="border-b border-ousi-border">
          <template #title>Disabled disclosure</template>
          <p class="text-sm text-ousi-muted">Cannot be opened.</p>
        </ODisclosure>

        <!-- Custom indicator -->
        <h3 class="text-sm font-semibold text-ousi-foreground pt-4">Custom indicator</h3>
        <ODisclosure class="border-b border-ousi-border">
          <template #title>Custom indicator</template>
          <template #indicator="{ isOpen }">
            <span class="ml-auto text-xs text-ousi-muted">{{ isOpen ? 'Hide' : 'Show' }}</span>
          </template>
          <p class="text-sm text-ousi-muted">Text instead of chevron indicator.</p>
        </ODisclosure>

        <!-- Custom trigger with icon + chip -->
        <h3 class="text-sm font-semibold text-ousi-foreground pt-4">Custom trigger</h3>
        <ODisclosure>
          <template #trigger="{ isOpen }">
            <span class="flex size-8 items-center justify-center rounded-ousi-xl bg-ousi-accent-soft text-ousi-accent shrink-0">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
            </span>
            <span class="flex-1 text-left text-sm font-medium">Custom trigger with icon</span>
            <OChip color="accent" variant="soft" size="sm">New</OChip>
            <svg
              :class="['size-4 text-ousi-muted transition-transform duration-250', isOpen ? '-rotate-180' : '']"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </template>
          <p class="text-sm text-ousi-muted">
            Using the trigger slot for completely custom content.
          </p>
        </ODisclosure>
      </div>

      <!-- DisclosureGroup — single (accordion) -->
      <div class="space-y-2 max-w-xl">
        <h3 class="text-sm font-semibold text-ousi-foreground">Accordion (single)</h3>
        <ODisclosureGroup class="rounded-ousi-2xl border border-ousi-border divide-y divide-ousi-border overflow-hidden">
          <ODisclosure v-for="item in faqItems" :key="item.id" class="px-4">
            <template #title>{{ item.question }}</template>
            <p class="text-sm text-ousi-muted">{{ item.answer }}</p>
          </ODisclosure>
        </ODisclosureGroup>
      </div>

      <!-- DisclosureGroup — multiple -->
      <div class="space-y-2 max-w-xl">
        <h3 class="text-sm font-semibold text-ousi-foreground">Multiple open</h3>
        <ODisclosureGroup :allow-multiple="true" class="flex flex-col gap-2">
          <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
            <template #title>Section 1</template>
            <p class="text-sm text-ousi-muted">Content of section 1.</p>
          </ODisclosure>
          <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
            <template #title>Section 2</template>
            <p class="text-sm text-ousi-muted">Content of section 2.</p>
          </ODisclosure>
          <ODisclosure class="rounded-ousi-2xl border border-ousi-border px-4">
            <template #title>Section 3</template>
            <p class="text-sm text-ousi-muted">Content of section 3.</p>
          </ODisclosure>
        </ODisclosureGroup>
      </div>

      <!-- DisclosureGroup — controlled with checkboxes -->
      <div class="space-y-2 max-w-xl">
        <h3 class="text-sm font-semibold text-ousi-foreground">Controlled group with filters</h3>
        <ODisclosureGroup v-model="disclosureGroupKeys" :allow-multiple="true">
          <ODisclosure class="border-b border-ousi-border">
            <template #title>Filters</template>
            <div class="flex flex-col gap-2">
              <OCheckbox label="In stock" />
              <OCheckbox label="On sale" />
              <OCheckbox label="New arrivals" />
            </div>
          </ODisclosure>
          <ODisclosure class="border-b border-ousi-border">
            <template #title>Price range</template>
            <p class="text-sm text-ousi-muted">Price slider would go here.</p>
          </ODisclosure>
          <ODisclosure>
            <template #title>Categories</template>
            <div class="flex flex-col gap-2">
              <OCheckbox label="Electronics" />
              <OCheckbox label="Clothing" />
              <OCheckbox label="Books" />
            </div>
          </ODisclosure>
        </ODisclosureGroup>
      </div>
    </section>

    <OSeparator />

    <!-- Form -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Form</h2>
        <p class="text-sm text-ousi-muted mt-1">Form wrapper with validation context, server error propagation, and auto-focus on invalid fields.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Basic with native validation -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-ousi-foreground">Native validation</h3>
          <OForm
            class="flex flex-col gap-4"
            @submit.prevent="toast.success('Form submitted!')"
          >
            <OInput
              name="email"
              type="email"
              label="Email"
              placeholder="john@example.com"
              :required="true"
              full-width
            />
            <OInput
              name="password"
              type="password"
              label="Password"
              placeholder="Min 8 characters"
              :required="true"
              full-width
            />
            <div class="flex gap-2">
              <OButton type="submit">Submit</OButton>
              <OButton type="reset" variant="secondary">Reset</OButton>
            </div>
          </OForm>
        </div>

        <!-- Server-side errors -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-ousi-foreground">Server-side errors</h3>
          <OForm
            class="flex flex-col gap-4"
            :validation-errors="formServerErrors"
            @submit.prevent
          >
            <OInput name="email" label="Email" full-width />
            <OInput name="username" label="Username" full-width />
            <OButton type="submit">Submit</OButton>
          </OForm>
        </div>

        <!-- Login form -->
        <OCard class="w-full max-w-sm">
          <OCard.Header>
            <OCard.Title>Sign in</OCard.Title>
            <OCard.Description>Enter your credentials to continue</OCard.Description>
          </OCard.Header>
          <OCard.Content>
            <OForm
              class="flex flex-col gap-4"
              :validation-errors="loginErrors"
              @submit.prevent="handleLoginSubmit"
            >
              <OInput
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                :required="true"
                full-width
              />
              <OInput
                name="password"
                type="password"
                label="Password"
                placeholder="........"
                :required="true"
                full-width
              />
              <div class="flex items-center justify-between">
                <OCheckbox label="Remember me" />
                <a href="#" class="text-sm text-ousi-accent hover:underline">Forgot password?</a>
              </div>
              <OButton type="submit" :full-width="true" :loading="loginLoading">
                Sign in
              </OButton>
            </OForm>
          </OCard.Content>
          <OCard.Footer class="justify-center">
            <p class="text-sm text-ousi-muted">
              Don't have an account?
              <a href="#" class="text-sm text-ousi-accent hover:underline">Sign up</a>
            </p>
          </OCard.Footer>
        </OCard>

        <!-- Register form -->
        <OCard class="w-full max-w-sm">
          <OCard.Header>
            <OCard.Title>Create account</OCard.Title>
          </OCard.Header>
          <OCard.Content>
            <OForm class="flex flex-col gap-4" @submit.prevent="toast.success('Account created!')">
              <div class="flex gap-3">
                <OInput name="firstName" label="First name" :required="true" full-width />
                <OInput name="lastName" label="Last name" :required="true" full-width />
              </div>
              <OInput name="email" type="email" label="Email" :required="true" full-width />
              <OInput
                name="password"
                type="password"
                label="Password"
                description="Min 8 characters with 1 uppercase and 1 number"
                :required="true"
                full-width
              />
              <OCheckbox label="I agree to the Terms of Service" :required="true" />
              <OButton type="submit" :full-width="true">Create account</OButton>
              <OButton type="reset" variant="ghost" :full-width="true">Clear</OButton>
            </OForm>
          </OCard.Content>
        </OCard>

        <!-- With global alert -->
        <div class="space-y-2">
          <h3 class="text-sm font-semibold text-ousi-foreground">With global error alert</h3>
          <OForm class="flex flex-col gap-4 w-full max-w-sm" @submit.prevent="handleFormWithError">
            <OAlert
              v-if="globalError"
              variant="danger"
              :title="globalError"
              :closable="true"
              @close="globalError = null"
            />
            <OInput name="email" type="email" label="Email" :required="true" full-width />
            <OInput name="password" type="password" label="Password" :required="true" full-width />
            <OButton type="submit" :full-width="true">Sign in</OButton>
          </OForm>
        </div>
      </div>
    </section>

    <OSeparator />

    <!-- InputOtp -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">InputOtp</h2>
        <p class="text-sm text-ousi-muted mt-1">OTP/PIN code input with animated slots, caret, shake, and auto-clear.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Basic 6 digits -->
        <div class="space-y-1">
          <OInputOtp v-model="otp1" label="Verification code" />
          <p class="text-xs text-ousi-muted">Value: {{ otp1 || 'empty' }}</p>
        </div>

        <!-- Groups 3+3 -->
        <OInputOtp
          v-model="otp2"
          :groups="[{ slots: 3 }, { slots: 3 }]"
          label="Code with separator"
        />

        <!-- 4 digits PIN -->
        <OInputOtp v-model="otp3" :length="4" label="PIN" />

        <!-- Letters only -->
        <OInputOtp v-model="otp7" type="alpha" :length="5" label="Letters only" />

        <!-- Alphanumeric -->
        <OInputOtp v-model="otp4" type="alphanumeric" label="Alphanumeric code" />

        <!-- Masked -->
        <OInputOtp v-model="otp5" :mask="true" :length="4" label="Masked PIN" />

        <!-- Secondary variant -->
        <OInputOtp v-model="otp6" variant="secondary" label="Secondary variant" />
      </div>

      <!-- Sizes -->
      <div class="space-y-4 max-w-md">
        <h3 class="text-sm font-semibold text-ousi-foreground">Sizes</h3>
        <OInputOtp :length="6" size="sm" label="Small" />
        <OInputOtp :length="6" size="md" label="Medium (default)" />
        <OInputOtp :length="6" size="lg" label="Large" />
      </div>

      <!-- Animations -->
      <div class="space-y-6 max-w-md">
        <h3 class="text-sm font-semibold text-ousi-foreground">Animations</h3>

        <!-- Shake on error -->
        <div class="space-y-2">
          <OInputOtp
            v-model="otpShake"
            label="Shake on error"
            :error-message="otpShakeErr"
            description="Fill all 6 then click to trigger shake"
          />
          <OButton size="sm" variant="danger-soft" :disabled="otpShake.length < 6" @click="simulateWrongOtp">
            Simulate wrong code
          </OButton>
        </div>

        <!-- Clear on error -->
        <div class="space-y-2">
          <OInputOtp
            v-model="otpClear"
            label="Shake + Auto-clear"
            :shake-on-error="true"
            :clear-on-error="true"
            :clear-delay="80"
            :error-message="otpClearErr"
            description="Shakes then clears slot by slot"
          />
          <OButton size="sm" variant="danger" :disabled="otpClear.length < 6" @click="simulateClearOtp">
            Wrong OTP
          </OButton>
        </div>
      </div>

      <!-- Real-world: 2FA verification -->
      <div class="max-w-sm">
        <OCard>
          <OCard.Header>
            <OCard.Title>Two-factor authentication</OCard.Title>
            <OCard.Description>
              Enter the 6-digit code from your authenticator app
            </OCard.Description>
          </OCard.Header>
          <OCard.Content class="items-center gap-4">
            <OInputOtp
              v-model="twoFaCode"
              :groups="[{ slots: 3 }, { slots: 3 }]"
              :shake-on-error="true"
              :clear-on-error="true"
              :error-message="twoFaError"
            />
            <OButton
              :full-width="true"
              :disabled="twoFaCode.length < 6"
              :loading="isVerifying"
              @click="verifyCode"
            >
              Verify
            </OButton>
          </OCard.Content>
          <OCard.Footer class="justify-center">
            <p class="text-sm text-ousi-muted">
              Didn't receive a code?
              <button class="text-ousi-accent hover:underline">Resend</button>
            </p>
          </OCard.Footer>
        </OCard>
      </div>
    </section>

    <OSeparator />

    <!-- Kbd -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Kbd</h2>
        <p class="text-sm text-ousi-muted mt-1">Keyboard shortcut display with special key symbols.</p>
      </div>

      <!-- Single keys -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Special keys</h3>
        <div class="flex gap-2 flex-wrap">
          <OKbd keys="command" />
          <OKbd keys="shift" />
          <OKbd keys="option" />
          <OKbd keys="ctrl" />
          <OKbd keys="enter" />
          <OKbd keys="escape" />
          <OKbd keys="tab" />
          <OKbd keys="delete" />
          <OKbd keys="space" />
        </div>
      </div>

      <!-- Arrows -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Arrows</h3>
        <div class="flex gap-2">
          <OKbd keys="up" />
          <OKbd keys="down" />
          <OKbd keys="left" />
          <OKbd keys="right" />
        </div>
      </div>

      <!-- Combinations -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Key combinations</h3>
        <div class="flex gap-2 flex-wrap items-center">
          <OKbd :keys="['command']">K</OKbd>
          <OKbd :keys="['command', 'shift']">P</OKbd>
          <OKbd :keys="['ctrl', 'option', 'delete']" />
          <OKbd :keys="['command']">Z</OKbd>
          <OKbd :keys="['command', 'shift']">Z</OKbd>
        </div>
      </div>

      <!-- Text only -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Text only</h3>
        <div class="flex gap-2">
          <OKbd>A</OKbd>
          <OKbd>B</OKbd>
          <OKbd>F1</OKbd>
          <OKbd>F12</OKbd>
        </div>
      </div>

      <!-- Light variant -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Light variant</h3>
        <div class="flex gap-2 flex-wrap">
          <OKbd variant="light" :keys="['command']">K</OKbd>
          <OKbd variant="light" :keys="['command', 'shift']">P</OKbd>
          <OKbd variant="light" keys="escape" />
        </div>
      </div>

      <!-- Keyboard shortcuts menu -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Shortcuts menu</h3>
        <div class="flex flex-col gap-1 max-w-xs rounded-ousi-2xl border border-ousi-border p-2">
          <div class="flex items-center justify-between px-2 py-1.5 rounded-ousi-lg hover:bg-ousi-default">
            <span class="text-sm text-ousi-foreground">New file</span>
            <OKbd variant="light" :keys="['command']">N</OKbd>
          </div>
          <div class="flex items-center justify-between px-2 py-1.5 rounded-ousi-lg hover:bg-ousi-default">
            <span class="text-sm text-ousi-foreground">Open file</span>
            <OKbd variant="light" :keys="['command']">O</OKbd>
          </div>
          <div class="flex items-center justify-between px-2 py-1.5 rounded-ousi-lg hover:bg-ousi-default">
            <span class="text-sm text-ousi-foreground">Save</span>
            <OKbd variant="light" :keys="['command']">S</OKbd>
          </div>
          <OSeparator />
          <div class="flex items-center justify-between px-2 py-1.5 rounded-ousi-lg hover:bg-ousi-default">
            <span class="text-sm text-ousi-danger">Delete</span>
            <OKbd variant="light" :keys="['command', 'shift']">D</OKbd>
          </div>
        </div>
      </div>

      <!-- Shortcuts reference grid -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Shortcuts reference</h3>
        <div class="grid grid-cols-2 gap-3 max-w-sm">
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Command palette</span>
            <OKbd :keys="['command', 'shift']">P</OKbd>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Quick open</span>
            <OKbd :keys="['command']">P</OKbd>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Find</span>
            <OKbd :keys="['command']">F</OKbd>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Replace</span>
            <OKbd :keys="['command', 'option']">F</OKbd>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Undo</span>
            <OKbd :keys="['command']">Z</OKbd>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-ousi-muted">Redo</span>
            <OKbd :keys="['command', 'shift']">Z</OKbd>
          </div>
        </div>
      </div>

      <!-- Inline usage -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Inline in text</h3>
        <p class="text-sm text-ousi-muted">
          Press <OKbd :keys="['command']">K</OKbd> to open the command palette,
          or <OKbd keys="escape" /> to close any dialog.
        </p>
      </div>
    </section>

    <OSeparator />

    <!-- Meter -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Meter</h2>
        <p class="text-sm text-ousi-muted mt-1">Static quantity indicator within a known range. Semantically different from ProgressBar.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
        <!-- Basic -->
        <OMeter :value="60" label="Storage" :show-value-label="true" />

        <!-- Colors -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-ousi-foreground">Colors</h3>
          <OMeter :value="75" color="accent" label="Accent" :show-value-label="true" />
          <OMeter :value="80" color="success" label="Success" :show-value-label="true" />
          <OMeter :value="45" color="warning" label="Warning" :show-value-label="true" />
          <OMeter :value="30" color="danger" label="Danger" :show-value-label="true" />
          <OMeter :value="60" color="default" label="Default" :show-value-label="true" />
        </div>

        <!-- Sizes -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-ousi-foreground">Sizes</h3>
          <OMeter :value="60" size="sm" label="Small" :show-value-label="true" />
          <OMeter :value="60" size="md" label="Medium" :show-value-label="true" />
          <OMeter :value="60" size="lg" label="Large" :show-value-label="true" />
        </div>

        <!-- AutoColor: high = good (battery) -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-ousi-foreground">Auto color (high = good)</h3>
          <OMeter :value="85" :auto-color="true" label="85% — Good" :show-value-label="true" />
          <OMeter :value="40" :auto-color="true" label="40% — Warning" :show-value-label="true" />
          <OMeter :value="15" :auto-color="true" label="15% — Critical" :show-value-label="true" />
        </div>

        <!-- AutoColor: low = good (CPU) -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-ousi-foreground">Auto color (low = good)</h3>
          <OMeter :value="20" :auto-color="true" :optimum="0" label="20% — Good" :show-value-label="true" />
          <OMeter :value="55" :auto-color="true" :optimum="0" label="55% — Warning" :show-value-label="true" />
          <OMeter :value="88" :auto-color="true" :optimum="0" label="88% — Critical" :show-value-label="true" />
        </div>

        <!-- Custom range + format -->
        <OMeter
          :value="5.4"
          :min-value="0"
          :max-value="16"
          label="RAM used"
          :show-value-label="true"
          :format-options="{ style: 'unit', unit: 'gigabyte', maximumFractionDigits: 1 }"
          color="accent"
        />

        <!-- Disabled -->
        <OMeter :value="40" label="Disabled" :disabled="true" :show-value-label="true" />
      </div>

      <!-- System stats card -->
      <div class="max-w-sm">
        <OCard>
          <OCard.Header>
            <OCard.Title>System Resources</OCard.Title>
          </OCard.Header>
          <OCard.Content class="gap-4">
            <OMeter :value="23" :auto-color="true" :optimum="0" label="CPU" :show-value-label="true" size="sm" />
            <OMeter :value="67" :auto-color="true" :optimum="0" label="Memory" :show-value-label="true" size="sm" />
            <OMeter :value="82" :auto-color="true" :optimum="0" label="Disk I/O" :show-value-label="true" size="sm" />
            <OMeter :value="12" :auto-color="true" :optimum="0" label="Network" :show-value-label="true" size="sm" />
          </OCard.Content>
        </OCard>
      </div>

      <!-- Storage card -->
      <div class="max-w-sm">
        <OCard>
          <OCard.Content class="gap-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-ousi-foreground">Storage</p>
                <p class="text-xs text-ousi-muted">54 GB of 256 GB used</p>
              </div>
            </div>
            <OMeter :value="54" :min-value="0" :max-value="256" :auto-color="true" size="lg" />
            <div class="flex justify-between text-xs text-ousi-muted">
              <span>54 GB used</span>
              <span>202 GB free</span>
            </div>
          </OCard.Content>
        </OCard>
      </div>
    </section>

    <OSeparator />

    <!-- NumberField -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">NumberField</h2>
        <p class="text-sm text-ousi-muted mt-1">Numeric input with increment/decrement buttons, hold-to-repeat, and formatting.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <!-- Basic -->
        <div class="space-y-1">
          <ONumberField v-model="nfQty" label="Quantity" />
          <p class="text-xs text-ousi-muted">Value: {{ nfQty }}</p>
        </div>

        <!-- Min/max/step -->
        <ONumberField
          v-model="nfRating"
          label="Rating"
          :min="0"
          :max="10"
          :step="0.5"
          description="From 0 to 10"
        />

        <!-- Currency format -->
        <ONumberField
          v-model="nfPrice"
          label="Price"
          :format-options="{ style: 'currency', currency: 'USD' }"
          :min="0"
          :step="0.01"
        />

        <!-- Percentage format -->
        <ONumberField
          v-model="nfPercent"
          label="Percentage"
          :format-options="{ style: 'percent' }"
          :min="0"
          :max="1"
          :step="0.01"
        />

        <!-- Without buttons -->
        <ONumberField
          v-model="nfPlain"
          label="Without buttons"
          :show-buttons="false"
          placeholder="Enter number..."
        />

        <!-- Variants -->
        <ONumberField variant="primary" label="Primary" v-model="nfV1" />
        <ONumberField variant="secondary" label="Secondary" v-model="nfV2" />

        <!-- Sizes -->
        <ONumberField size="sm" label="Small" v-model="nfS1" />
        <ONumberField size="md" label="Medium" v-model="nfS2" />
        <ONumberField size="lg" label="Large" v-model="nfS3" />

        <!-- Full width -->
        <ONumberField :full-width="true" label="Full width" v-model="nfFw" class="md:col-span-2" />

        <!-- States -->
        <ONumberField label="Disabled" :disabled="true" :model-value="42" />
        <ONumberField label="Readonly" :readonly="true" :model-value="100" />

        <!-- Error -->
        <ONumberField
          v-model="nfQty"
          label="With error"
          :min="1"
          error-message="Quantity must be at least 1"
          :required="true"
        />
      </div>

      <!-- Custom icons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <h3 class="text-sm font-semibold text-ousi-foreground md:col-span-2">Custom icons</h3>

        <!-- Chevrons -->
        <ONumberField v-model="nfChevron" label="With chevrons" :min="0" :max="100">
          <template #decrement-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke-linecap="round" />
            </svg>
          </template>
          <template #increment-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke-linecap="round" />
            </svg>
          </template>
        </ONumberField>

        <!-- Volume -->
        <ONumberField v-model="nfVolume" label="Volume" :min="0" :max="100" :step="5">
          <template #decrement-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            </svg>
          </template>
          <template #increment-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </template>
        </ONumberField>
      </div>

      <!-- Real-world: cart -->
      <div class="max-w-sm">
        <OCard>
          <OCard.Content class="gap-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm font-medium text-ousi-foreground">Wireless Headphones</p>
                <p class="text-sm text-ousi-muted">$99.00 each</p>
              </div>
              <ONumberField v-model="nfCart" :min="1" :max="10" size="sm" />
            </div>
            <OSeparator />
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-ousi-foreground">Total</span>
              <span class="text-sm font-medium text-ousi-foreground">${{ ((nfCart ?? 0) * 99).toFixed(2) }}</span>
            </div>
          </OCard.Content>
        </OCard>
      </div>

      <!-- Real-world: settings -->
      <div class="flex flex-col gap-4 max-w-xs">
        <h3 class="text-sm font-semibold text-ousi-foreground">Settings</h3>
        <ONumberField v-model="nfFontSize" label="Font size" :min="12" :max="32" :step="1" />
        <ONumberField v-model="nfOpacity" label="Opacity" :min="0" :max="100" :step="5" />
        <ONumberField v-model="nfColumns" label="Grid columns" :min="1" :max="12" :step="1" />
      </div>
    </section>

    <OSeparator />

    <!-- Pagination -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Pagination</h2>
        <p class="text-sm text-ousi-muted mt-1">Page navigation with ellipsis, prev/next, and loop support.</p>
      </div>

      <div class="space-y-6 max-w-2xl">
        <!-- Basic -->
        <div class="space-y-1">
          <OPagination v-model="pg1" :total="10" />
          <p class="text-xs text-ousi-muted">Page: {{ pg1 }}</p>
        </div>

        <!-- With summary -->
        <OPagination v-model="pg2" :total="20" :show-summary="true" />

        <!-- Without controls -->
        <OPagination v-model="pg3" :total="10" :show-controls="false" />

        <!-- Custom siblings + boundaries -->
        <OPagination v-model="pg4" :total="30" :siblings="2" :boundaries="2" />

        <!-- Loop -->
        <OPagination v-model="pg5" :total="5" :loop="true" />

        <!-- Sizes -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-ousi-foreground">Sizes</h3>
          <OPagination v-model="pg6" :total="10" size="sm" />
          <OPagination v-model="pg7" :total="10" size="md" />
          <OPagination v-model="pg8" :total="10" size="lg" />
        </div>

        <!-- With text labels -->
        <OPagination v-model="pg9" :total="10" prev-label="Previous" next-label="Next" />

        <!-- Custom icons (double chevrons) -->
        <OPagination v-model="pg10" :total="10">
          <template #prev-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </template>
          <template #next-icon>
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </template>
        </OPagination>

        <!-- Disabled -->
        <OPagination :model-value="3" :total="10" :disabled="true" />

        <!-- Few pages (no ellipsis) -->
        <OPagination v-model="pg11" :total="5" />

        <!-- Many pages -->
        <OPagination v-model="pg12" :total="100" :show-summary="true" />
      </div>

      <!-- Real-world: data table -->
      <div class="flex flex-col gap-4 w-full max-w-2xl">
        <div class="rounded-ousi-2xl border border-ousi-border overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-ousi-surface">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-ousi-muted">Name</th>
                <th class="px-4 py-3 text-left font-medium text-ousi-muted">Status</th>
                <th class="px-4 py-3 text-left font-medium text-ousi-muted">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ousi-border">
              <tr v-for="row in tableRows" :key="row.id">
                <td class="px-4 py-3 text-ousi-foreground">{{ row.name }}</td>
                <td class="px-4 py-3"><OChip :color="row.color" variant="soft" size="sm">{{ row.status }}</OChip></td>
                <td class="px-4 py-3 text-ousi-muted">{{ row.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <OPagination v-model="pgTable" :total="20" :show-summary="true" size="sm" />
      </div>
    </section>

    <OSeparator />

    <!-- Table -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Table</h2>
        <p class="text-sm text-ousi-muted mt-1">Data table with sorting, selection, custom cells, loading, and pagination.</p>
      </div>

      <!-- Basic -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Basic</h3>
        <OTable :columns="tblColumns" :rows="tblRows" />
      </div>

      <!-- Secondary variant -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Secondary variant</h3>
        <OTable :columns="tblColumns" :rows="tblRows" variant="secondary" />
      </div>

      <!-- Sorting -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Sorting</h3>
        <OTable
          :columns="tblColumns"
          :rows="tblRows"
          :sort-descriptor="tblSort"
          @sort-change="tblSort = $event"
        />
        <p class="text-xs text-ousi-muted">Sort: {{ tblSort.column }} {{ tblSort.direction ?? 'none' }}</p>
      </div>

      <!-- Multiple selection -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Multiple selection</h3>
        <OTable
          :columns="tblColumns"
          :rows="tblRows"
          selection-mode="multiple"
          :selected-keys="tblSelected"
          @selection-change="tblSelected = $event"
        />
        <p class="text-xs text-ousi-muted">Selected: {{ [...tblSelected].join(', ') || 'None' }}</p>
      </div>

      <!-- Disabled rows -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Disabled rows</h3>
        <OTable
          :columns="tblColumns"
          :rows="tblRows"
          selection-mode="multiple"
          :disabled-keys="new Set(['2', '4'])"
        />
      </div>

      <!-- Custom cells -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Custom cells</h3>
        <OTable :columns="tblColumns" :rows="tblRows">
          <template #cell-name="{ row }">
            <div class="flex items-center gap-2">
              <OAvatar :name="row.name" size="sm" />
              <span class="font-medium">{{ row.name }}</span>
            </div>
          </template>
          <template #cell-status="{ value }">
            <OChip
              :color="value === 'active' ? 'success' : value === 'inactive' ? 'danger' : 'warning'"
              variant="soft" size="sm"
            >{{ value }}</OChip>
          </template>
          <template #cell-role="{ value }">
            <OChip color="accent" variant="soft" size="sm">{{ value }}</OChip>
          </template>
        </OTable>
      </div>

      <!-- Empty state -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Empty state</h3>
        <OTable :columns="tblColumns" :rows="[]">
          <template #empty>
            <div class="flex flex-col items-center gap-3 py-6">
              <svg class="size-10 text-ousi-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-sm font-medium text-ousi-foreground">No results found</p>
              <p class="text-xs text-ousi-muted">Try adjusting your search or filters</p>
              <OButton size="sm" variant="secondary">Clear filters</OButton>
            </div>
          </template>
        </OTable>
      </div>

      <!-- Loading -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Loading</h3>
        <OTable :columns="tblColumns" :rows="[]" :is-loading="true" :loading-rows="4" />
      </div>

      <!-- With footer + pagination -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">With footer + pagination</h3>
        <OTable
          :columns="tblColumns"
          :rows="tblRows"
          :show-footer="true"
          selection-mode="multiple"
          :selected-keys="tblSelected"
          @selection-change="tblSelected = $event"
        >
          <template #cell-name="{ row }">
            <div class="flex items-center gap-2">
              <OAvatar :name="row.name" size="sm" />
              <span class="font-medium">{{ row.name }}</span>
            </div>
          </template>
          <template #cell-status="{ value }">
            <OChip
              :color="value === 'active' ? 'success' : value === 'inactive' ? 'danger' : 'warning'"
              variant="soft" size="sm"
            >{{ value }}</OChip>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-between">
              <p class="text-sm text-ousi-muted">
                {{ tblSelected.size > 0 ? `${tblSelected.size} selected · ` : '' }}{{ tblRows.length }} users
              </p>
              <OPagination v-model="tblPage" :total="10" size="sm" />
            </div>
          </template>
        </OTable>
      </div>

      <!-- Column resizing -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Column resizing</h3>
        <OTable :columns="tblColumns" :rows="tblRows" :allows-resizing="true" />
      </div>

      <!-- Dashboard card -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Dashboard card</h3>
        <OCard class="w-full">
          <OCard.Header>
            <div class="flex w-full items-center justify-between">
              <div>
                <OCard.Title>Team members</OCard.Title>
                <OCard.Description>Manage your team</OCard.Description>
              </div>
              <OButton size="sm">Add member</OButton>
            </div>
          </OCard.Header>
          <OCard.Content class="p-0">
            <OTable
              :columns="tblColumns"
              :rows="tblRows"
              variant="secondary"
              selection-mode="multiple"
              :selected-keys="tblSelected"
              :sort-descriptor="tblSort"
              :show-footer="true"
              @selection-change="tblSelected = $event"
              @sort-change="tblSort = $event"
            >
              <template #cell-name="{ row }">
                <div class="flex items-center gap-2">
                  <OAvatar :name="row.name" size="sm" />
                  <span class="font-medium">{{ row.name }}</span>
                </div>
              </template>
              <template #cell-status="{ value }">
                <OChip
                  :color="value === 'active' ? 'success' : value === 'inactive' ? 'danger' : 'warning'"
                  variant="soft" size="sm"
                >{{ value }}</OChip>
              </template>
              <template #footer>
                <div class="flex w-full items-center justify-between">
                  <p class="text-sm text-ousi-muted">{{ tblRows.length }} total</p>
                  <OPagination v-model="tblPage" :total="5" size="sm" />
                </div>
              </template>
            </OTable>
          </OCard.Content>
        </OCard>
      </div>
    </section>

    <OSeparator />

    <!-- Slider -->
    <section class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-ousi-foreground">Slider</h2>
        <p class="text-sm text-ousi-muted mt-1">Draggable slider with single value and range support.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
        <!-- Basic -->
        <OSlider v-model="sl1" label="Volume" :show-output="true" />

        <!-- Range -->
        <OSlider v-model="slRange" label="Price range" :show-output="true" />

        <!-- Min/max/step -->
        <OSlider v-model="slRating" label="Rating" :min="0" :max="10" :step="0.5" :show-output="true" />

        <!-- Currency format -->
        <OSlider
          v-model="slBudget"
          label="Budget"
          :min="0"
          :max="1000"
          :step="10"
          :show-output="true"
          :format-options="{ style: 'currency', currency: 'USD' }"
        />

        <!-- Percent format -->
        <OSlider
          v-model="slOpacity"
          label="Opacity"
          :min="0"
          :max="1"
          :step="0.01"
          :show-output="true"
          :format-options="{ style: 'percent' }"
        />

        <!-- No label -->
        <OSlider v-model="slPlain" />

        <!-- Disabled -->
        <OSlider :model-value="40" label="Disabled" :disabled="true" :show-output="true" />
      </div>

      <!-- Sizes -->
      <div class="space-y-4 max-w-md">
        <h3 class="text-sm font-semibold text-ousi-foreground">Sizes</h3>
        <OSlider v-model="slSm" size="sm" label="Small" :show-output="true" />
        <OSlider v-model="slMd" size="md" label="Medium" :show-output="true" />
        <OSlider v-model="slLg" size="lg" label="Large" :show-output="true" />
      </div>

      <!-- Colors -->
      <div class="space-y-4 max-w-md">
        <h3 class="text-sm font-semibold text-ousi-foreground">Colors</h3>
        <OSlider v-model="slC1" color="primary" label="Primary" :show-output="true" />
        <OSlider v-model="slC2" color="secondary" label="Secondary" :show-output="true" />
        <OSlider v-model="slC3" color="success" label="Success" :show-output="true" />
        <OSlider v-model="slC4" color="warning" label="Warning" :show-output="true" />
        <OSlider v-model="slC5" color="danger" label="Danger" :show-output="true" />
      </div>

      <!-- Vertical -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Vertical</h3>
        <div class="flex h-48 gap-8 items-start">
          <OSlider v-model="slV1" orientation="vertical" label="H" :show-output="true" />
          <OSlider v-model="slV2" orientation="vertical" label="S" :show-output="true" />
          <OSlider v-model="slV3" orientation="vertical" label="L" :show-output="true" />
        </div>
      </div>

      <!-- Equalizer -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-ousi-foreground">Audio Equalizer</h3>
        <div class="flex h-40 items-end gap-6 justify-center">
          <OSlider
            v-for="band in ['60Hz', '250Hz', '1kHz', '4kHz', '16kHz']"
            :key="band"
            v-model="slEq[band]"
            orientation="vertical"
            :label="band"
            :min="-12"
            :max="12"
            :step="1"
            :show-output="true"
          />
        </div>
      </div>

      <!-- Price range filter -->
      <div class="flex flex-col gap-3 max-w-sm">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-ousi-foreground">Price range</p>
          <p class="text-sm text-ousi-muted">${{ slPriceRange[0] }} – ${{ slPriceRange[1] }}</p>
        </div>
        <OSlider v-model="slPriceRange" :min="0" :max="1000" :step="10" />
        <div class="flex justify-between text-xs text-ousi-muted">
          <span>$0</span>
          <span>$1,000</span>
        </div>
      </div>

      <!-- HSL color picker -->
      <div class="flex flex-col gap-2 max-w-xs">
        <h3 class="text-sm font-semibold text-ousi-foreground">HSL Color</h3>
        <OSlider v-model="slHsl.h" label="Hue" :min="0" :max="360" :show-output="true" />
        <OSlider v-model="slHsl.s" label="Saturation" :min="0" :max="100" :show-output="true" />
        <OSlider v-model="slHsl.l" label="Lightness" :min="0" :max="100" :show-output="true" />
        <div
          class="h-12 rounded-ousi-xl mt-2"
          :style="{ background: `hsl(${slHsl.h}, ${slHsl.s}%, ${slHsl.l}%)` }"
        />
      </div>
    </section>

    <OSeparator />

    <!-- Footer -->
    <footer class="pt-8 border-t border-ousi-border">
      <p class="text-sm text-ousi-muted">
        Ousi UI v0.0.1 — Vue 3 Component Library
      </p>
    </footer>
  </div>
</template>
