import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ODateField from '../src/components/date-field/DateField.vue'
import ODatePicker from '../src/components/date-picker/DatePicker.vue'
import { useOusiConfig } from '../src/config'

type DateValue = { year: number; month: number; day: number } | null

const config = useOusiConfig()
let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  config.locale.value = 'en-US'
})

function mountField(component: typeof ODateField | typeof ODatePicker) {
  const model = ref<DateValue>(null)
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
})
