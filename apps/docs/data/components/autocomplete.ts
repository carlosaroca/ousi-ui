import type { ComponentData } from './types'

export const autocompleteData: ComponentData = {
  title: 'Autocomplete',
  description: 'Text field with filtered suggestions from a predefined list of options.',
  category: 'Forms',
  importCode: "import { OAutocomplete } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'AutocompleteBasic',
        code: `<OAutocomplete
  :options="[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ]"
  placeholder="Search frameworks..."
/>`,
      },
    },
    {
      id: 'server-search',
      title: 'Server search',
      example: {
        component: 'AutocompleteServerSearch',
        code: `<!-- For large catalogs: only the matches travel to the browser. -->
<OAutocomplete
  v-model="value"
  :options="current ? [current] : []"
  :search="(q) => api.searchCities(q)"
  label="City"
/>`,
      },
    },
    {
      id: 'long-list',
      title: 'Long List',
      example: {
        component: 'AutocompleteLongList',
        code: `<OAutocomplete
  :options="countries"
  placeholder="Search country..."
/>`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'AutocompleteVariants',
        code: `<OAutocomplete variant="primary" :options="options" placeholder="Primary" />
<OAutocomplete variant="secondary" :options="options" placeholder="Secondary" />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label',
      example: {
        component: 'AutocompleteWithLabel',
        code: `<OAutocomplete
  label="Framework"
  :options="frameworks"
  placeholder="Search..."
/>`,
      },
    },
    {
      id: 'with-description',
      title: 'With Description',
      example: {
        component: 'AutocompleteWithDescription',
        code: `<OAutocomplete
  label="City"
  description="Start typing to search cities."
  :options="cities"
  placeholder="Search cities..."
/>`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'AutocompleteWithError',
        code: `<OAutocomplete
  label="Country"
  error-message="Please select a valid country."
  :options="countries"
/>`,
      },
    },
    {
      id: 'clearable',
      title: 'Clearable',
      example: {
        component: 'AutocompleteClearable',
        code: `<OAutocomplete
  clearable
  :options="options"
  placeholder="Type and clear..."
/>`,
      },
    },
    {
      id: 'allow-custom',
      title: 'Allow Custom Value',
      example: {
        component: 'AutocompleteAllowCustom',
        code: `<OAutocomplete
  allow-custom-value
  :options="options"
  placeholder="Type anything..."
/>`,
      },
    },
    {
      id: 'disabled',
      title: 'Disabled',
      example: {
        component: 'AutocompleteDisabled',
        code: '<OAutocomplete disabled :options="options" placeholder="Disabled" />',
      },
    },
    {
      id: 'full-width',
      title: 'Full Width',
      example: {
        component: 'AutocompleteFullWidth',
        code: '<OAutocomplete :options="options" placeholder="Full width" />',
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'AutocompleteAnimated',
        code: `<OAutocomplete :options="options" placeholder="Default: no animation" />
<OAutocomplete :options="options" placeholder="With tactile press" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string | number', default: '-', description: 'Selected value (v-model).' },
    { name: 'defaultValue', type: 'string | number', default: '-', description: 'Default value when uncontrolled.' },
    { name: 'options', type: 'AutocompleteOption[]', default: '-', description: 'List of options to filter ({ value, label, disabled? }).' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder text.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text.' },
    { name: 'description', type: 'string', default: '-', description: 'Help text.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message that activates error state.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant.' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation: scales to 98% on focus.' },
    { name: 'scrollShadow', type: 'boolean', default: 'true', description: 'Show fade shadow at top/bottom of the list when scrollable.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the field is disabled.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Whether the field is read-only.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Whether a value is required.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Show clear button.' },
    { name: 'allowCustomValue', type: 'boolean', default: 'false', description: 'Allow values not in the options list.' },
    { name: 'emptyMessage', type: 'string', default: "locale's no results text", description: 'Message when no results match.' },
    { name: 'filter', type: 'boolean', default: 'true', description: 'Filter options by the typed text, ignoring accents and case. Set false when the app searches on the server and passes the results.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner in the field and a loading row while the options are on their way.' },
    { name: 'search', type: '(query: string) => Promise<AutocompleteOption[]>', default: '-', description: 'Search on the server instead of filtering options: runs after minChars and a debounce pause, drops late answers and shows the loading state. options then only seeds the current value.' },
    { name: 'minChars', type: 'number', default: '2', description: 'Characters typed before search runs.' },
    { name: 'debounce', type: 'number', default: '250', description: 'Pause in ms before search runs.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'option', type: '{ option: AutocompleteOption, selected: boolean }', description: 'Custom content for each option, for example a code and a name.' },
    { name: 'start', type: 'slot', description: 'Content before the input, for example a search icon. Styled and spaced like OInput #start.' },
    { name: 'end', type: 'slot', description: 'Content after the input, before the loading, clear and chevron controls.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string | number]', description: 'Emitted when selection changes.' },
    { name: 'change', type: '[value: string | number]', description: 'Emitted on change.' },
    { name: 'inputChange', type: '[query: string]', description: 'Emitted when the text input changes.' },
    { name: 'focus', type: '[event: FocusEvent]', description: 'Emitted when the input is focused.' },
    { name: 'blur', type: '[event: FocusEvent]', description: 'Emitted when the input loses focus.' },
    { name: 'clear', type: '[]', description: 'Emitted when the clear button is clicked.' },
  ],

  methods: [
    { name: 'focus', type: '(options?: FocusOptions) => void', description: 'Focuses the input.' },
    { name: 'blur', type: '() => void', description: 'Removes focus from the field.' },
  ],

  themeCode: `import { autocompleteTheme } from '@ousi-ui/vue'

// CVA variants: primary, secondary
// CVA booleans: disabled, invalid`,

  keyboard: [
    { key: 'ArrowDown', description: 'Opens the suggestions or moves to the next option.' },
    { key: 'ArrowUp', description: 'Moves to the previous option.' },
    { key: 'enter', description: 'Selects the focused option.' },
    { key: 'escape', description: 'Closes the suggestions dropdown.' },
    { key: 'tab', description: 'Moves focus to the next focusable element.' },
  ],

  aria: [
    { attribute: 'aria-label, id, inputmode, data-*, …', condition: 'passed to the component', description: 'Land on the <input role="combobox">, while class, style and listeners stay on the wrapper, since events from the control bubble to it. A passed id keeps the label, a passed aria-describedby joins the field description.' },
    { attribute: 'role="combobox"', condition: 'always', description: 'Identifies the field as a combobox.' },
    { attribute: 'aria-expanded', condition: 'dropdown open', description: 'Indicates the suggestions are visible.' },
    { attribute: 'aria-autocomplete="list"', condition: 'always', description: 'Indicates inline autocomplete behavior.' },
    { attribute: 'aria-invalid', condition: 'errorMessage is set', description: 'Indicates the field has an error.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for accessibility.', good: true },
    { text: 'Use emptyMessage to guide users when no options match.', good: true },
    { text: 'Enable clearable for optional fields.', good: true },
    { text: "Don't use Autocomplete when there are fewer than 5 options. Use Select instead.", good: false },
  ],
}
