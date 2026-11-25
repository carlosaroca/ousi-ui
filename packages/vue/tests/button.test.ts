import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OButton from '../src/components/button/Button.vue'

// The slots of OButton are typed with defineSlots; these pin what they do.
describe('OButton slots', () => {
  it('renders start, default and end in that order inside the content layer', () => {
    const w = mount(OButton, { slots: { start: '<i>S</i>', default: 'Label', end: '<b>E</b>' } })
    expect(w.text().replace(/\s+/g, '')).toBe('SLabelE')
  })

  it('with an animate slot: the button becomes a hover group and the swapped content is an aria-hidden overlay', () => {
    const w = mount(OButton, { slots: { default: 'Delete', animate: 'Sure?' } })
    expect(w.classes()).toContain('group')
    const overlay = w.findAll('span[aria-hidden="true"]').find((s) => s.text() === 'Sure?')
    expect(overlay).toBeTruthy()
    expect(overlay!.classes()).toContain('absolute')
  })

  it('without an animate slot: no hover group and no overlay', () => {
    const w = mount(OButton, { slots: { default: 'Delete' } })
    expect(w.classes()).not.toContain('group')
    expect(w.findAll('span[aria-hidden="true"]')).toHaveLength(0)
  })
})

describe('OButton loading', () => {
  it('shows a spinner on top and hides the label (it stays in the layout so the width does not jump)', () => {
    const w = mount(OButton, { props: { loading: true }, slots: { default: 'Save' } })
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.attributes('disabled')).toBeDefined()
    expect(w.find('svg.animate-spin').exists()).toBe(true)
    const label = w.findAll('span').find((s) => s.text() === 'Save')!
    expect(label.classes()).toContain('opacity-0')
  })

  it('the loading slot replaces the spinner', () => {
    const w = mount(OButton, { props: { loading: true }, slots: { default: 'Save', loading: '<em>wait</em>' } })
    expect(w.find('svg.animate-spin').exists()).toBe(false)
    expect(w.find('em').text()).toBe('wait')
  })
})

describe('OButton isIconOnly', () => {
  it('changes the classes of the button (a square, without the text padding)', () => {
    const plain = mount(OButton, { slots: { default: 'x' } }).classes().join(' ')
    const icon = mount(OButton, { props: { isIconOnly: true }, slots: { default: 'x' } }).classes().join(' ')
    expect(icon).not.toBe(plain)
  })
})
