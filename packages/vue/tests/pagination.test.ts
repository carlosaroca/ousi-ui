import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import OPagination from '../src/components/pagination/Pagination.vue'
import { useOusiConfig } from '../src/config'

const config = useOusiConfig()
let wrapper: VueWrapper | null = null

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  config.locale.value = 'en-US'
})

describe('OPagination summary', () => {
  it('speaks Spanish with a Spanish locale (n22:6)', () => {
    config.locale.value = 'es-CO'
    wrapper = mount(OPagination, { props: { total: 201, modelValue: 1, showSummary: true } })
    expect(wrapper.text()).toContain('Página 1 de 201')
    expect(wrapper.find('[aria-label="Ir a la página 2"]').exists()).toBe(true)
  })

  it('keeps English by default', () => {
    wrapper = mount(OPagination, { props: { total: 2, modelValue: 2, showSummary: true } })
    expect(wrapper.text()).toContain('Page 2 of 2')
  })
})
