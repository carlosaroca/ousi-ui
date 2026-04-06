import type { ComponentData } from './types'

export const formData: ComponentData = {
  title: 'Form',
  description: 'Accessible form wrapper with validation and error handling.',
  category: 'Form',
  importCode: "import { OForm } from '@ousi-ui/vue'",

  sections: [
    {
      id: 'usage',
      title: 'Usage',
      example: {
        component: 'FormBasic',
        code: `<OForm @submit="onSubmit">
  <OInput label="Name" name="name" required />
  <OButton type="submit">Submit</OButton>
</OForm>`,
      },
    },
    {
      id: 'server-errors',
      title: 'Server Errors',
      example: {
        component: 'FormServerErrors',
        code: `<OForm :validation-errors="{ email: 'Email already taken' }" @submit="onSubmit">
  <OInput label="Email" name="email" />
  <OButton type="submit">Register</OButton>
</OForm>`,
      },
    },
    {
      id: 'login-form',
      title: 'Login Form',
      example: {
        component: 'FormLoginForm',
        code: `<OForm @submit="handleLogin">
  <OInput label="Email" name="email" type="email" required />
  <OInput label="Password" name="password" type="password" required />
  <OButton type="submit" full-width>Sign in</OButton>
</OForm>`,
      },
    },
  ],

  props: [
    { name: 'action', type: 'string', default: '-', description: 'HTML form action URL.' },
    { name: 'method', type: "'get' | 'post'", default: '-', description: 'HTTP method.' },
    { name: 'encType', type: 'string', default: '-', description: 'Encoding type.' },
    { name: 'target', type: "'_self' | '_blank' | '_parent' | '_top'", default: '-', description: 'Target window.' },
    { name: 'validationBehavior', type: "'native' | 'aria'", default: "'native'", description: 'Validation behavior.' },
    { name: 'validationErrors', type: 'Record<string, string | string[]>', default: '-', description: 'Server-side validation errors keyed by field name.' },
    { name: 'ariaLabel', type: 'string', default: '-', description: 'Accessible label.' },
    { name: 'ariaLabelledby', type: 'string', default: '-', description: 'ID of labelling element.' },
    { name: 'class', type: 'string', default: '-', description: 'Additional CSS classes.' },
  ],

  emits: [
    { name: 'submit', type: '(event: SubmitEvent) => void', description: 'Fired on form submission.' },
    { name: 'reset', type: '(event: Event) => void', description: 'Fired on form reset.' },
    { name: 'invalid', type: '(event: Event) => void', description: 'Fired when validation fails.' },
  ],

  aria: [
    { attribute: 'aria-label', condition: 'ariaLabel provided', description: 'Accessible name for the form.' },
    { attribute: 'aria-labelledby', condition: 'ariaLabelledby provided', description: 'References an element that labels the form.' },
  ],

  bestPractices: [
    { text: 'Always provide a label for the form using ariaLabel or ariaLabelledby.', good: true },
    { text: 'Display server validation errors near the relevant fields.', good: true },
    { text: 'Use type="submit" on the submit button inside the form.', good: true },
    { text: "Don't rely solely on color to indicate errors.", good: false },
  ],
}
