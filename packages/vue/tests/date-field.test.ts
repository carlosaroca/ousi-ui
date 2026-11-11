import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ODateField from '../src/components/date-field/DateField.vue'
import ODatePicker from '../src/components/date-picker/DatePicker.vue'
import ODateRangePicker from '../src/components/date-range-picker/DateRangePicker.vue'
import OTimePicker from '../src/components/time-picker/TimePicker.vue'
import { useOusiConfig } from '../src/config'

type DateValue = { year: number; month: number; day: number } | null

const config = useOusiConfig()
let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  config.locale.value = 'en-US'
})

function mountField(component: typeof ODateField | typeof ODatePicker, initial: DateValue = null) {
  const model = ref<DateValue>(initial)
  const Host = defineComponent({
    setup: () => () =>
      h(component as never, {
        'modelValue': model.value,
        'onUpdate:modelValue': (v: DateValue) => (model.value = v),
        'locale': 'es-CO',
      }),
  })
  wrapper = mount(Host, { attachTo: document.body })
  const segment = (label: string) => wrapper!.find(`[role="spinbutton"][aria-label="${label}"]`)
  return { model, segment }
}

async function type(el: ReturnType<VueWrapper['find']>, digits: string) {
  for (const key of digits) {
    await el.trigger('keydown', { key })
  }
  await nextTick()
}

describe.each([
  ['ODateField', ODateField],
  ['ODatePicker', ODatePicker],
])('%s day segment', (_, component) => {
  it('keeps day 31 typed before the month', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(component)
    await type(segment('Día'), '31')
    await type(segment('Mes'), '12')
    await type(segment('Año'), '2026')
    expect(model.value).toEqual({ year: 2026, month: 12, day: 31 })
  })

  it('lowers the day only when the month is shorter', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(component)
    await type(segment('Día'), '31')
    await type(segment('Mes'), '11')
    await type(segment('Año'), '2026')
    expect(model.value).toEqual({ year: 2026, month: 11, day: 30 })
  })

  it('keeps 29 February until the year says otherwise', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(component)
    await type(segment('Día'), '29')
    await type(segment('Mes'), '02')
    await type(segment('Año'), '2028')
    expect(model.value).toEqual({ year: 2028, month: 2, day: 29 })
  })

  it('labels and placeholders follow the Spanish messages', async () => {
    config.locale.value = 'es-CO'
    mountField(component)
    await nextTick()
    const labels = wrapper!.findAll('[role="spinbutton"]').map((s) => s.attributes('aria-label'))
    expect(labels).toEqual(['Día', 'Mes', 'Año'])
    expect(wrapper!.text()).toContain('aaaa')
  })

  it('over a date of a 30-day month, a typed 31 waits for the month', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(component, { year: 2026, month: 11, day: 9 })
    await type(segment('Día'), '31')
    await type(segment('Mes'), '12')
    await type(segment('Año'), '2026')
    expect(model.value).toEqual({ year: 2026, month: 12, day: 31 })
  })

  it('over a February date, a typed 3 waits for its second digit', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(component, { year: 2026, month: 2, day: 10 })
    await type(segment('Día'), '30')
    await type(segment('Mes'), '04')
    expect(model.value).toEqual({ year: 2026, month: 4, day: 30 })
  })
})

describe('ODatePicker with a display format', () => {
  it('uses the Spanish placeholders (n2:22)', async () => {
    config.locale.value = 'es-CO'
    wrapper = mount(ODatePicker, {
      props: { format: 'YYYY-MM-DD', displayFormat: 'DD/MM/YYYY', modelValue: null },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.text()).toContain('aaaa')
    expect(wrapper.text()).not.toContain('yyyy')
  })
})

describe('ODateRangePicker segments', () => {
  it('use the Spanish placeholders and keep day 31 typed before the month', async () => {
    config.locale.value = 'es-CO'
    const model = ref<{ start: DateValue; end: DateValue } | null>(null)
    const Host = defineComponent({
      setup: () => () =>
        h(ODateRangePicker as never, {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: typeof model.value) => (model.value = v),
          'locale': 'es-CO',
        }),
    })
    wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(wrapper.text()).toContain('aaaa')
    const start = (part: string) => wrapper!.find(`[role="spinbutton"][aria-label="${part} de inicio"]`)
    await type(start('Día'), '31')
    await type(start('Mes'), '12')
    await type(start('Año'), '2026')
    expect(model.value?.start).toEqual({ year: 2026, month: 12, day: 31 })
  })
})

describe('ODatePicker calendar (ips1:6, n343:23)', () => {
  const calendar = () => document.querySelector('[role="dialog"][aria-modal="true"]')

  it('does not open the calendar when a segment is pressed to type', async () => {
    config.locale.value = 'es-CO'
    const { segment } = mountField(ODatePicker)
    await segment('Día').trigger('click')
    expect(calendar()).toBeNull()
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    expect(calendar()).not.toBeNull()
  })

  it('closes the calendar when a digit is typed', async () => {
    config.locale.value = 'es-CO'
    const { model, segment } = mountField(ODatePicker)
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    expect(calendar()).not.toBeNull()
    await type(segment('Día'), '31')
    await type(segment('Mes'), '12')
    await type(segment('Año'), '2026')
    expect(calendar()).toBeNull()
    expect(model.value).toEqual({ year: 2026, month: 12, day: 31 })
  })

  it('closes the calendar when focus leaves the field', async () => {
    config.locale.value = 'es-CO'
    const outside = document.createElement('input')
    document.body.appendChild(outside)
    mountField(ODatePicker)
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    expect(calendar()).not.toBeNull()
    await wrapper!.find('[role="group"]').trigger('focusout', { relatedTarget: outside })
    expect(calendar()).toBeNull()
    outside.remove()
  })

  it('shows the month of the typed date', async () => {
    config.locale.value = 'es-CO'
    const { segment } = mountField(ODatePicker)
    await type(segment('Día'), '15')
    await type(segment('Mes'), '10')
    await type(segment('Año'), '2028')
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    expect(calendar()?.textContent).toContain('2028')
    expect(calendar()?.textContent?.toLowerCase()).toContain('octubre')
  })

  it('moves an open calendar to a date set from outside', async () => {
    config.locale.value = 'es-CO'
    const { model } = mountField(ODatePicker, { year: 2026, month: 11, day: 10 })
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    model.value = { year: 2028, month: 10, day: 15 }
    await nextTick()
    await nextTick()
    expect(calendar()?.textContent?.toLowerCase()).toContain('octubre')
  })
})

describe('Date and time popovers stay out of the way', () => {
  const popover = () => document.querySelector('[role="dialog"]')

  it('ODatePicker opens its calendar with Alt+ArrowDown', async () => {
    config.locale.value = 'es-CO'
    const { segment } = mountField(ODatePicker)
    await segment('Día').trigger('keydown', { key: 'ArrowDown', altKey: true })
    expect(popover()).not.toBeNull()
  })

  it('ODateRangePicker: a segment press types, typing closes the calendar, labels are translated', async () => {
    config.locale.value = 'es-CO'
    const model = ref<{ start: DateValue; end: DateValue } | null>(null)
    const Host = defineComponent({
      setup: () => () =>
        h(ODateRangePicker as never, {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: typeof model.value) => (model.value = v),
          'locale': 'es-CO',
        }),
    })
    wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    const startDay = wrapper.find('[role="spinbutton"][aria-label="Día de inicio"]')
    expect(wrapper.find('[role="spinbutton"][aria-label="Año final"]').exists()).toBe(true)
    await startDay.trigger('click')
    expect(popover()).toBeNull()
    await wrapper.find('[aria-haspopup="dialog"]').trigger('click')
    expect(popover()).not.toBeNull()
    await type(startDay, '1')
    expect(popover()).toBeNull()
  })

  it('OTimePicker: a segment press types and leaving the field closes the wheels', async () => {
    config.locale.value = 'es-CO'
    const outside = document.createElement('input')
    document.body.appendChild(outside)
    wrapper = mount(OTimePicker, { props: { modelValue: null }, attachTo: document.body })
    await nextTick()
    await wrapper.find('[role="spinbutton"]').trigger('click')
    expect(popover()).toBeNull()
    await wrapper.find('[aria-haspopup="dialog"]').trigger('click')
    expect(popover()).not.toBeNull()
    await wrapper.find('[role="group"]').trigger('focusout', { relatedTarget: outside })
    expect(popover()).toBeNull()
    outside.remove()
  })
})

describe('Calendar heading', () => {
  it('shows the month and the year on one line, without joining words', async () => {
    config.locale.value = 'es-CO'
    const { segment } = mountField(ODatePicker)
    await type(segment('Día'), '30')
    await type(segment('Mes'), '09')
    await type(segment('Año'), '2026')
    await wrapper!.find('[aria-haspopup="dialog"]').trigger('click')
    const calendar = document.querySelector('[role="dialog"][aria-modal="true"]')
    expect(calendar?.textContent).toContain('septiembre 2026')
    expect(calendar?.textContent).not.toContain('septiembre de 2026')
  })
})
