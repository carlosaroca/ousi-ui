import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import ONumberField from '../src/components/number-field/NumberField.vue'
import { createNumberFormat } from '../src/components/number-field/number-format'
import { useOusiConfig } from '../src/config'

const NBSP = /[  ]/g

describe('createNumberFormat', () => {
  it('formats es-CO with its separators', () => {
    expect(createNumberFormat('es-CO').format(1234.5)).toBe('1234,5')
    expect(createNumberFormat('es-CO', {}).format(1234567.5)).toBe('1.234.567,5')
    const cop = createNumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    expect(cop.format(1234567).replace(NBSP, ' ')).toBe('$ 1.234.567')
  })

  it('formats en-US with its separators', () => {
    expect(createNumberFormat('en-US').format(1234.5)).toBe('1234.5')
    expect(createNumberFormat('en-US', {}).format(1234567.5)).toBe('1,234,567.5')
    expect(createNumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5)).toBe('$1,234.50')
  })

  it('keeps full precision without format options', () => {
    expect(createNumberFormat('en-US').format(0.1 + 0.2)).toBe(String(0.1 + 0.2))
    expect(createNumberFormat('es-CO').format(-0)).toBe('0')
    expect(createNumberFormat('es-CO').format(null)).toBe('')
  })

  it('parses es-CO', () => {
    const { parse } = createNumberFormat('es-CO')
    expect(parse('1.234,5')).toBe(1234.5)
    expect(parse('1.234')).toBe(1234)
    expect(parse('12,5')).toBe(12.5)
    expect(parse('0.125')).toBe(0.125)
    expect(parse(',125')).toBe(0.125)
    expect(parse('1234.567')).toBe(1234.567)
    expect(parse('12.5')).toBe(12.5)
    expect(parse('1.234.567')).toBe(1234567)
    expect(parse('-1.234,5')).toBe(-1234.5)
    expect(parse(',5')).toBe(0.5)
    expect(parse('12,')).toBe(12)
    expect(parse('')).toBeNull()
    expect(parse('-')).toBeNull()
    expect(parse('1,2,3')).toBeNaN()
    expect(parse('1,234.5')).toBeNaN()
    expect(parse('1-2')).toBeNaN()
  })

  it('parses en-US', () => {
    const { parse } = createNumberFormat('en-US')
    expect(parse('1,234.5')).toBe(1234.5)
    expect(parse('1,234')).toBe(1234)
    expect(parse('12.5')).toBe(12.5)
    expect(parse('12,5')).toBe(12.5)
    expect(parse('1,234,567')).toBe(1234567)
    expect(parse('-0.5')).toBe(-0.5)
  })

  it('parses formatted text: currency, percent and accounting', () => {
    const cop = createNumberFormat('es-CO', { style: 'currency', currency: 'COP' })
    expect(cop.parse(cop.format(1234567))).toBe(1234567)
    expect(cop.parse('$ 1.234,50')).toBe(1234.5)
    const usd = createNumberFormat('en-US', { style: 'currency', currency: 'USD' })
    expect(usd.parse('$1,234.50')).toBe(1234.5)
    expect(usd.parse('-$1,234.50')).toBe(-1234.5)
    const accounting = createNumberFormat('en-US', { style: 'currency', currency: 'USD', currencySign: 'accounting' })
    expect(accounting.parse(accounting.format(-5))).toBe(-5)
    const percent = createNumberFormat('es-CO', { style: 'percent' })
    expect(percent.parse(percent.format(0.25))).toBe(0.25)
    expect(percent.parse('7')).toBe(0.07)
    const dkk = createNumberFormat('da-DK', { style: 'currency', currency: 'DKK' })
    expect(dkk.parse(dkk.format(1234.5))).toBe(1234.5)
  })

  it('reads other numbering systems and space grouping', () => {
    const ar = createNumberFormat('ar-EG', {})
    expect(ar.parse(ar.format(1234.5))).toBe(1234.5)
    const fr = createNumberFormat('fr-FR', {})
    expect(fr.parse(fr.format(1234567.25))).toBe(1234567.25)
    expect(fr.parse('1 234,5')).toBe(1234.5)
  })

  it('knows when only whole numbers can be entered', () => {
    expect(createNumberFormat('es-CO').integerOnly).toBe(false)
    expect(createNumberFormat('es-CO', { maximumFractionDigits: 0 }).integerOnly).toBe(true)
    expect(createNumberFormat('es-CO', { style: 'currency', currency: 'COP' }).integerOnly).toBe(true)
    expect(createNumberFormat('en-US', { style: 'currency', currency: 'USD' }).integerOnly).toBe(false)
  })

  it('falls back to en-US for an invalid locale', () => {
    expect(createNumberFormat('not a locale').format(1.5)).toBe('1.5')
  })
})

describe('ONumberField', () => {
  let wrapper: VueWrapper<any> | undefined
  const config = useOusiConfig()

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    config.locale.value = 'en-US'
  })

  function mountControlled(props: Record<string, unknown>, initial: number | null = null) {
    const model = ref<number | null>(initial)
    wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(ONumberField, {
            ...props,
            modelValue: model.value,
            'onUpdate:modelValue': (v: number | null) => {
              model.value = v
            },
          }),
      }),
      { attachTo: document.body },
    )
    const input = wrapper.get('input').element as HTMLInputElement
    return { model, input }
  }

  async function type(input: HTMLInputElement, text: string) {
    input.dispatchEvent(new FocusEvent('focus'))
    input.value = text
    input.dispatchEvent(new Event('input'))
    await nextTick()
  }

  async function commit(input: HTMLInputElement) {
    input.dispatchEvent(new FocusEvent('blur'))
    await nextTick()
  }

  it('formats and parses with the configured locale', async () => {
    config.locale.value = 'es-CO'
    const { model, input } = mountControlled({}, 1234.5)
    expect(input.value).toBe('1234,5')
    await type(input, '1.234,75')
    expect(model.value).toBe(1234.75)
    await commit(input)
    expect(input.value).toBe('1234,75')
    await type(input, '12,5')
    await commit(input)
    expect(model.value).toBe(12.5)
    await type(input, '1.234')
    await commit(input)
    expect(model.value).toBe(1234)
  })

  it('lets the locale prop override the config', async () => {
    config.locale.value = 'es-CO'
    const { model, input } = mountControlled({ locale: 'en-US', formatOptions: {} }, 1234.5)
    expect(input.value).toBe('1,234.5')
    await type(input, '2,500.25')
    await commit(input)
    expect(model.value).toBe(2500.25)
    expect(input.value).toBe('2,500.25')
  })

  it('follows a locale change', async () => {
    const { input } = mountControlled({ formatOptions: {} }, 1234.5)
    expect(input.value).toBe('1,234.5')
    config.locale.value = 'es-CO'
    await nextTick()
    expect(input.value).toBe('1.234,5')
  })

  it('keeps the typed text while focused instead of reformatting it', async () => {
    config.locale.value = 'es-CO'
    const { model, input } = mountControlled({ formatOptions: { style: 'currency', currency: 'COP' } })
    await type(input, '1')
    expect(model.value).toBe(1)
    expect(input.value).toBe('1')
    await type(input, '12500')
    expect(input.value).toBe('12500')
    await commit(input)
    expect(model.value).toBe(12500)
    expect(input.value.replace(NBSP, ' ')).toBe('$ 12.500')
  })

  it('keeps the exact value when the text is left untouched', async () => {
    const { model, input } = mountControlled({ formatOptions: { maximumFractionDigits: 1 } }, 1.25)
    expect(input.value).toBe('1.3')
    input.dispatchEvent(new FocusEvent('focus'))
    await commit(input)
    expect(model.value).toBe(1.25)
  })

  it('scales a percent format', async () => {
    const { model, input } = mountControlled({ formatOptions: { style: 'percent' } }, 0.1)
    expect(input.value).toBe('10%')
    await type(input, '25')
    await commit(input)
    expect(model.value).toBe(0.25)
    expect(input.value).toBe('25%')
  })

  it('reverts text that is not a number', async () => {
    config.locale.value = 'es-CO'
    const { model, input } = mountControlled({}, 5)
    await type(input, '1,2,3')
    expect(model.value).toBe(5)
    await commit(input)
    expect(model.value).toBe(5)
    expect(input.value).toBe('5')
  })

  it('picks the mobile keyboard from the format', () => {
    mountControlled({})
    expect(wrapper!.get('input').attributes('inputmode')).toBe('decimal')
    wrapper!.unmount()
    mountControlled({ formatOptions: { maximumFractionDigits: 0 } })
    expect(wrapper!.get('input').attributes('inputmode')).toBe('numeric')
    wrapper!.unmount()
    wrapper = mount(ONumberField, { attrs: { inputmode: 'numeric' } })
    expect(wrapper.get('input').attributes('inputmode')).toBe('numeric')
  })

  it('refuses keystrokes that cannot make a number', () => {
    config.locale.value = 'es-CO'
    const { input } = mountControlled({ max: 1000 }, 12)
    function insert(data: string) {
      input.setSelectionRange(input.value.length, input.value.length)
      const event = new InputEvent('beforeinput', { inputType: 'insertText', data, cancelable: true })
      input.dispatchEvent(event)
      return !event.defaultPrevented
    }
    expect(insert('a')).toBe(false)
    expect(insert(',')).toBe(true)
    expect(insert('.')).toBe(true)
    input.value = '12,5'
    expect(insert(',')).toBe(false)
    input.value = '999'
    expect(insert('9')).toBe(false)
  })

  it('updates the text when the buttons change the value while focused', async () => {
    const { model, input } = mountControlled({}, 1)
    await type(input, '2')
    await wrapper!.findAll('button')[1].trigger('mousedown')
    await wrapper!.findAll('button')[1].trigger('mouseup')
    expect(model.value).toBe(3)
    expect(input.value).toBe('3')
  })
})
