import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OSelect from '../src/components/select/Select.vue'
import OAutocomplete from '../src/components/autocomplete/Autocomplete.vue'
import { useOusiConfig } from '../src/config'

const config = useOusiConfig()
let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  config.autoSelectSingle.value = false
})

type Option = { value: string; label: string; disabled?: boolean }

function mountField(component: unknown, props: Record<string, unknown>, initialOptions: Option[]) {
  const model = ref<string | number>('')
  const options = ref<Option[]>(initialOptions)
  const Host = defineComponent({
    setup: () => () =>
      h(component as never, {
        ...props,
        'options': options.value,
        'modelValue': model.value,
        'onUpdate:modelValue': (v: string | number) => (model.value = v),
      }),
  })
  wrapper = mount(Host)
  return { model, options }
}

const one: Option[] = [{ value: 'cex', label: 'Consulta de medicina general' }]
const two: Option[] = [...one, { value: 'urg', label: 'Urgencias' }]

describe.each([
  ['OSelect', OSelect],
  ['OAutocomplete', OAutocomplete],
])('%s autoSelectSingle', (_, component) => {
  it('picks the only option of a required field when the app turns it on', async () => {
    config.autoSelectSingle.value = true
    const { model } = mountField(component, { required: true }, one)
    await nextTick()
    expect(model.value).toBe('cex')
  })

  it('leaves optional fields and the default config alone', async () => {
    const off = mountField(component, { required: true }, one)
    await nextTick()
    expect(off.model.value).toBe('')
    wrapper!.unmount()
    config.autoSelectSingle.value = true
    const optional = mountField(component, {}, one)
    await nextTick()
    expect(optional.model.value).toBe('')
  })

  it('waits for options that arrive later and ignores lists with more than one', async () => {
    config.autoSelectSingle.value = true
    const { model, options } = mountField(component, { required: true }, [])
    await nextTick()
    expect(model.value).toBe('')
    options.value = two
    await nextTick()
    expect(model.value).toBe('')
    options.value = [two[1]!, { value: 'x', label: 'Inactiva', disabled: true }]
    await nextTick()
    expect(model.value).toBe('urg')
  })

  it('honours the prop over the config', async () => {
    const { model } = mountField(component, { autoSelectSingle: true }, one)
    await nextTick()
    expect(model.value).toBe('cex')
  })
})
