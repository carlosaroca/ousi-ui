import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import OInput from '../src/components/input/Input.vue'
import OTextarea from '../src/components/textarea/Textarea.vue'
import OSelect from '../src/components/select/Select.vue'
import OAutocomplete from '../src/components/autocomplete/Autocomplete.vue'
import ONumberField from '../src/components/number-field/NumberField.vue'
import ODatePicker from '../src/components/date-picker/DatePicker.vue'
import ODateRangePicker from '../src/components/date-range-picker/DateRangePicker.vue'
import OTimePicker from '../src/components/time-picker/TimePicker.vue'
import ODateField from '../src/components/date-field/DateField.vue'
import OTimeField from '../src/components/time-field/TimeField.vue'
import OTagInput from '../src/components/tag-input/TagInput.vue'
import OInputOtp from '../src/components/input-otp/InputOtp.vue'
import OColorField from '../src/components/color-field/ColorField.vue'

interface FieldCase {
  name: string
  component: Component
  props?: Record<string, unknown>
  /** Selector of the element that carries the field's name and attributes. */
  control: string
  /** Selector of the element `focus()` moves to, when not the control itself. */
  focusTarget?: string
  /** Whether the field renders a `<label for>` from its `label` prop. */
  labelled?: boolean
}

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

const cases: FieldCase[] = [
  { name: 'OInput', component: OInput, control: 'input', labelled: true },
  { name: 'OTextarea', component: OTextarea, control: 'textarea', labelled: true },
  { name: 'OSelect', component: OSelect, props: { options }, control: '[role="combobox"]', labelled: true },
  { name: 'OAutocomplete', component: OAutocomplete, props: { options }, control: 'input[role="combobox"]', labelled: true },
  { name: 'ONumberField', component: ONumberField, control: 'input', labelled: true },
  { name: 'OTagInput', component: OTagInput, control: 'input', labelled: true },
  { name: 'OInputOtp', component: OInputOtp, control: 'input', labelled: true },
  { name: 'OColorField', component: OColorField, control: 'input', labelled: true },
  { name: 'ODatePicker', component: ODatePicker, control: '[role="group"]', focusTarget: '[role="spinbutton"]', labelled: true },
  { name: 'ODateRangePicker', component: ODateRangePicker, control: '[role="group"]', focusTarget: '[role="spinbutton"]', labelled: true },
  { name: 'OTimePicker', component: OTimePicker, control: '[role="group"]', focusTarget: '[role="spinbutton"]', labelled: true },
  { name: 'ODateField', component: ODateField, control: '[role="group"]', focusTarget: '[role="spinbutton"]' },
  { name: 'OTimeField', component: OTimeField, control: '[role="group"]', focusTarget: '[role="spinbutton"]' },
]

let wrapper: VueWrapper<any> | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
})

function mountField(c: FieldCase, extra: { props?: Record<string, unknown>; attrs?: Record<string, unknown> } = {}) {
  wrapper = mount(c.component, {
    props: { ...c.props, ...extra.props },
    attrs: extra.attrs,
    attachTo: document.body,
  })
  return wrapper
}

// Vue skips a listener attached in the same millisecond as an event that already ran another
// Vue listener, so events that bubble through two of them are dispatched a moment after mounting.
const settle = () => new Promise((resolve) => setTimeout(resolve, 5))

function rootElement(w: VueWrapper<any>): HTMLElement {
  return w.element.ownerDocument.querySelector('[data-v-app]')!.firstElementChild as HTMLElement
}

describe.each(cases)('$name', (c) => {
  it('puts aria-label, inputmode and other native attributes on the control', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onKeydown = vi.fn()
    const w = mountField(c, {
      attrs: {
        'aria-label': 'Custom name',
        inputmode: 'numeric',
        enterkeyhint: 'next',
        'data-testid': 'field',
        style: 'margin-top: 4px',
        onKeydown,
      },
    })
    const control = w.get(c.control).element as HTMLElement
    expect(control.getAttribute('aria-label')).toBe('Custom name')
    expect(control.getAttribute('inputmode')).toBe('numeric')
    expect(control.getAttribute('enterkeyhint')).toBe('next')
    expect(control.getAttribute('data-testid')).toBe('field')

    const root = rootElement(w)
    expect(root.getAttribute('style')).toContain('margin-top')
    if (root !== control) {
      expect(root.getAttribute('aria-label')).toBeNull()
      expect(root.getAttribute('data-testid')).toBeNull()
    }

    await settle()
    control.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
    expect(onKeydown).toHaveBeenCalledTimes(1)
    expect(control.getAttribute('onkeydown')).toBeNull()

    const extraneous = warn.mock.calls.filter((args) => String(args[0]).includes('Extraneous non-props'))
    expect(extraneous).toHaveLength(0)
  })

  it('keeps the label on a passed id', () => {
    if (!c.labelled) return
    const w = mountField(c, { props: { label: 'Field label' }, attrs: { id: 'my-field' } })
    const control = w.get(c.control).element as HTMLElement
    const label = w.get('label').element as HTMLLabelElement
    expect(control.id).toBe('my-field')
    expect(label.htmlFor).toBe('my-field')
    expect(document.getElementById('my-field')).toBe(control)
  })

  it('keeps listeners on the wrapper, so a click anywhere in the field reaches them', async () => {
    const onClick = vi.fn()
    const w = mountField(c, { attrs: { onClick } })
    await settle()
    rootElement(w).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onClick).toHaveBeenCalledTimes(1)
    onClick.mockClear()
    ;(w.get(c.control).element as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('joins a passed aria-describedby with its own description', () => {
    const w = mountField(c, { props: { description: 'Help text' }, attrs: { 'aria-describedby': 'outside-hint' } })
    const describedBy = w.get(c.control).attributes('aria-describedby') ?? ''
    expect(describedBy.split(' ')).toContain('outside-hint')
  })

  it('exposes focus() and blur()', () => {
    const w = mountField(c)
    const target = w.get(c.focusTarget ?? c.control).element as HTMLElement
    w.vm.focus()
    expect(document.activeElement).toBe(target)
    w.vm.blur()
    expect(document.activeElement).not.toBe(target)
  })
})

describe('field slots', () => {
  it('OSelect renders #start and #end and shifts the text like OInput', () => {
    wrapper = mount(OSelect, {
      props: { options },
      slots: { start: '<svg data-icon="start" />', end: '<span data-icon="end">kg</span>' },
    })
    const trigger = wrapper.get('[role="combobox"]')
    const start = trigger.get('[data-icon="start"]').element.parentElement!
    const end = trigger.get('[data-icon="end"]').element.parentElement!
    expect(start.className).toContain('text-ousi-muted')
    expect(start.className).toContain('pr-1')
    expect(end.className).toContain('text-ousi-muted')
    expect(end.className).toContain('pl-3')
    const text = start.nextElementSibling as HTMLElement
    expect(text.className).toContain('pl-1')
    expect(trigger.classes()).toContain('px-3')
    expect(trigger.classes()).toContain('pr-8')
    expect(end.nextElementSibling?.getAttribute('aria-hidden')).toBe('true')
  })

  it('OSelect keeps its padding without slots', () => {
    wrapper = mount(OSelect, { props: { options } })
    const text = wrapper.get('[role="combobox"] > span').element as HTMLElement
    expect(text.className).not.toContain('pl-1')
  })

  it('OAutocomplete renders #start and #end and shifts the input like OInput', () => {
    wrapper = mount(OAutocomplete, {
      props: { options },
      slots: { start: '<svg data-icon="start" />', end: '<span data-icon="end">kg</span>' },
    })
    const input = wrapper.get('input')
    const start = wrapper.get('[data-icon="start"]').element.parentElement!
    expect(start.className).toBe('flex items-center pl-3 pr-1 text-ousi-muted shrink-0')
    expect(start.nextElementSibling).toBe(input.element)
    expect(input.classes()).toContain('pl-1')
    expect(input.classes()).toContain('py-2')
    const end = wrapper.get('[data-icon="end"]').element.parentElement!
    expect(end.className).toContain('text-ousi-muted')
    expect(end.parentElement?.lastElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('OAutocomplete keeps its padding without slots', () => {
    wrapper = mount(OAutocomplete, { props: { options } })
    expect(wrapper.get('input').classes()).toContain('px-3')
    expect(wrapper.get('input').classes()).not.toContain('pl-1')
  })

  it('OInput start slot matches the Select and Autocomplete containers', () => {
    wrapper = mount(OInput, { slots: { start: '<svg data-icon="start" />' } })
    const start = wrapper.get('[data-icon="start"]').element.parentElement!
    expect(start.className).toBe('flex items-center pl-3 pr-1 text-ousi-muted shrink-0')
    expect(wrapper.get('input').classes()).toContain('pl-1')
  })
})

describe('listbox name', () => {
  it('OSelect and OAutocomplete name their list after a passed aria-label', async () => {
    for (const component of [OSelect, OAutocomplete]) {
      wrapper = mount(component as Component, { props: { options }, attrs: { 'aria-label': 'Country' }, attachTo: document.body })
      const control = wrapper.get('[role="combobox"]').element as HTMLElement
      if (control.tagName === 'INPUT') control.dispatchEvent(new FocusEvent('focus'))
      else control.click()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox?.getAttribute('aria-label')).toBe('Country')
      wrapper.unmount()
      wrapper = undefined
    }
  })
})
