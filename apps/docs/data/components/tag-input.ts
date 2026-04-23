import type { ComponentData } from './types'

export const tagInputData: ComponentData = {
  title: 'TagInput',
  description: 'An input field that allows users to add and remove tags, rendered as chips.',
  category: 'Forms',
  importCode: "import { OTagInput } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'TagInputBasic',
        code: `<script setup lang="ts">
import { ref } from 'vue'
const tags = ref(['Vue', 'React'])
</script>

<OTagInput v-model="tags" placeholder="Add a tag..." />`,
      },
    },
    {
      id: 'variants',
      title: 'Variants',
      example: {
        component: 'TagInputVariants',
        code: `<OTagInput v-model="tags" variant="primary" placeholder="Primary..." />
<OTagInput v-model="tags" variant="secondary" placeholder="Secondary..." />`,
      },
    },
    {
      id: 'with-label',
      title: 'With Label & Description',
      example: {
        component: 'TagInputWithLabel',
        code: `<OTagInput
  v-model="skills"
  label="Skills"
  description="Press Enter or comma to add a skill."
  placeholder="Add a skill..."
  required
/>`,
      },
    },
    {
      id: 'colors',
      title: 'Colors',
      example: {
        component: 'TagInputColors',
        code: `<OTagInput v-model="tags" color="accent" />
<OTagInput v-model="tags" color="success" />
<OTagInput v-model="tags" color="warning" />
<OTagInput v-model="tags" color="danger" />
<OTagInput v-model="tags" color="default" />`,
      },
    },
    {
      id: 'with-error',
      title: 'With Error',
      example: {
        component: 'TagInputWithError',
        code: `<OTagInput
  v-model="tags"
  label="Categories"
  :error-message="tags.length === 0 ? 'At least one tag is required.' : undefined"
/>`,
      },
    },
    {
      id: 'max-tags',
      title: 'Max Tags',
      example: {
        component: 'TagInputMaxTags',
        code: `<OTagInput v-model="tags" :max-tags="5" label="Tags (max 5)" />`,
      },
    },
    {
      id: 'custom-tag',
      title: 'Custom Tag Content',
      example: {
        component: 'TagInputCustomTag',
        code: `<OTagInput v-model="emails" label="Recipients" color="default">
  <template #tag="{ tag, index, remove }">
    <span class="flex items-center gap-1">
      <MailIcon class="size-3" />
      {{ tag }}
    </span>
  </template>
</OTagInput>`,
      },
    },
    {
      id: 'animated',
      title: 'Animated',
      example: {
        component: 'TagInputAnimated',
        code: `<OTagInput v-model="tags" placeholder="Default — no animation" />
<OTagInput v-model="tags" placeholder="With tactile press" animated />`,
      },
    },
  ],

  props: [
    { name: 'modelValue', type: 'string[]', description: 'Array of tag values (v-model).' },
    { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Default tags when uncontrolled.' },
    { name: 'placeholder', type: 'string', default: '-', description: 'Placeholder when no tags and input is empty.' },
    { name: 'label', type: 'string', default: '-', description: 'Label text above the field.' },
    { name: 'description', type: 'string', default: '-', description: 'Helper text below the field.' },
    { name: 'errorMessage', type: 'string', default: '-', description: 'Error message — activates error state.' },
    { name: 'name', type: 'string', default: '-', description: 'Field name for form context.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the field and tag chips.' },
    { name: 'color', type: "'accent' | 'success' | 'warning' | 'danger' | 'default'", default: "'accent'", description: 'Color of the tag chips.' },
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual variant (matches Input).' },
    { name: 'shadow', type: "'none' | 'xs' | 'sm' | 'md'", default: "'xs'", description: 'Elevation shadow.' },
    { name: 'animated', type: 'boolean', default: 'false', description: 'Tactile press animation — scales to 98% on focus.' },
    { name: 'maxTags', type: 'number', default: '-', description: 'Maximum number of tags allowed.' },
    { name: 'allowDuplicates', type: 'boolean', default: 'false', description: 'Allow duplicate tags.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Show required asterisk on label.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the field.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  slots: [
    { name: 'tag', type: '{ tag: string, index: number, remove: () => void }', description: 'Custom content inside each tag chip. The chip wrapper and close button are still rendered by TagInput.' },
  ],

  emits: [
    { name: 'update:modelValue', type: '[value: string[]]', description: 'Emitted when the tags array changes.' },
    { name: 'add', type: '[tag: string]', description: 'Emitted when a tag is added.' },
    { name: 'remove', type: '[tag: string]', description: 'Emitted when a tag is removed.' },
  ],

  keyboard: [
    { key: 'enter', description: 'Adds the current input text as a tag.' },
    { key: ',', description: 'Adds the current input text as a tag (comma separator).' },
    { key: 'backspace', description: 'Removes the last tag when input is empty.' },
  ],

  bestPractices: [
    { text: 'Use `label` and `description` to guide users on expected input.', good: true },
    { text: 'Set `maxTags` to prevent excessive input.', good: true },
    { text: 'Use the `#tag` slot to add icons or custom formatting to tags.', good: true },
    { text: "Don't allow duplicates unless the use case specifically requires it.", good: false },
  ],
}
