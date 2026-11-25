import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OButtonGroup from '../src/components/button-group/ButtonGroup.vue'

describe('OButtonGroup orientation', () => {
  it('vertical: buttons stretch to the width of the group, instead of keeping the width of their text', () => {
    const cls = mount(OButtonGroup, { props: { orientation: 'vertical' } }).classes()
    expect(cls).toContain('flex-col')
    expect(cls).toContain('items-stretch')
    expect(cls).not.toContain('items-center')
  })

  it('horizontal: buttons are centered on the row as before', () => {
    const cls = mount(OButtonGroup, { props: { orientation: 'horizontal' } }).classes()
    expect(cls).toContain('flex-row')
    expect(cls).toContain('items-center')
    expect(cls).not.toContain('items-stretch')
  })

  it('the recipe classes are still there for the radius rules', () => {
    expect(mount(OButtonGroup, { props: { orientation: 'vertical' } }).classes()).toContain('ousi-btn-group--vertical')
    expect(mount(OButtonGroup, { props: { orientation: 'horizontal' } }).classes()).toContain('ousi-btn-group--horizontal')
  })
})
