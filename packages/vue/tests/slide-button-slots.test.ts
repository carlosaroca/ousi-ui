import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type VNodeChild } from 'vue'
import OSlideButton from '../src/components/slide-button/SlideButton.vue'
import type { SlideButtonSlotContext } from '../src/components/slide-button/slide-button.types'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
})

type Slots = Record<string, (context: SlideButtonSlotContext) => VNodeChild>
const mark = (name: string) => () => h('i', { class: name })

/** Two turns: what is written on the track is read once it is drawn. */
async function settle() {
  await nextTick()
  await nextTick()
}
async function render(slots: Slots = {}, props: Record<string, unknown> = {}) {
  const w = mount(OSlideButton, { props, slots, attachTo: document.body })
  wrappers.push(w)
  await settle()
  return w
}
const thumb = (w: VueWrapper) => w.get('[data-part="thumb"]')
const label = (w: VueWrapper) => w.get('[data-part="label"]')
const spoken = (w: VueWrapper) => w.get('[role="status"]').text()
const name = (w: VueWrapper) => thumb(w).attributes('aria-label')

async function confirm(w: VueWrapper) {
  await thumb(w).trigger('keydown', { key: 'End' })
  await settle()
}
/** What is in the thumb: the class of an icon of the app's, or which of the built-in ones. */
const icon = (w: VueWrapper) =>
  thumb(w).find('i').exists() ? thumb(w).get('i').classes()[0] : thumb(w).get('svg').attributes('data-part')

/** Walks through the three states and notes what each shows. */
async function states<T>(w: VueWrapper, see: () => T): Promise<T[]> {
  const idle = see()
  await confirm(w)
  await w.setProps({ loading: true })
  await settle()
  const loading = see()
  await w.setProps({ loading: false })
  await settle()
  return [idle, loading, see()]
}

describe('slide button slots: icons', () => {
  it('has an arrow, a spinner and a check of its own', async () => {
    const w = await render()
    expect(await states(w, () => icon(w))).toEqual(['arrow', 'spinner', 'check'])
  })

  it.each([
    ['icon', ['mine', 'spinner', 'check']],
    ['loading-icon', ['arrow', 'mine', 'check']],
    ['confirmed-icon', ['arrow', 'spinner', 'mine']],
  ])('replacing #%s leaves the other two as they were', async (slot, expected) => {
    const w = await render({ [slot]: mark('mine') })
    expect(await states(w, () => icon(w))).toEqual(expected)
  })

  it('takes all three', async () => {
    const w = await render({ icon: mark('lock'), 'loading-icon': mark('dots'), 'confirmed-icon': mark('open') })
    expect(await states(w, () => icon(w))).toEqual(['lock', 'dots', 'open'])
  })

  it('tells a slot how far along the thumb is, and the state', async () => {
    const w = await render({ icon: (c) => h('i', { class: 'mine', 'data-seen': `${c.progress} ${c.confirmed} ${c.loading}` }) })
    expect(thumb(w).get('i').attributes('data-seen')).toBe('0 false false')
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(thumb(w).get('i').attributes('data-seen')).toBe('0.25 false false')
  })

  it('mirrors its own arrow from right to left, never an icon of the app', async () => {
    expect((await render()).get('[data-part="arrow"]').classes()).toContain('rtl:-scale-x-100')
    const own = await render({ icon: mark('mine') })
    expect(thumb(own).html()).not.toContain('rtl:-scale-x-100')
  })
})

describe('slide button slots: texts', () => {
  const props = { label: 'Slide to pay', loadingLabel: 'Paying…', confirmedLabel: 'Paid' }
  const text = (w: VueWrapper) => label(w).text()

  it.each([
    ['label', ['Mine', 'Paying…', 'Paid']],
    ['loading-label', ['Slide to pay', 'Mine', 'Paid']],
    ['confirmed-label', ['Slide to pay', 'Paying…', 'Mine']],
  ])('replacing #%s leaves the other two as they were', async (slot, expected) => {
    const w = await render({ [slot]: () => 'Mine' }, props)
    expect(await states(w, () => text(w))).toEqual(expected)
  })

  it('keeps what #label shows while loading, when loading has no text of its own', async () => {
    const w = await render({ label: (c) => h('b', c.loading ? 'Working' : 'Pay $48') })
    expect(await states(w, () => text(w))).toEqual(['Pay $48', 'Working', 'Confirmed'])
  })

  it('falls back to its own text when a slot has nothing to show', async () => {
    const w = await render({ label: () => null }, { label: 'Slide to pay' })
    expect(text(w)).toBe('Slide to pay')
  })

  it('lays an icon and a text side by side with room between them', async () => {
    const w = await render({ label: () => [h('i'), h('span', 'Pay')] })
    expect(label(w).classes()).toContain('gap-1.5')
  })
})

describe('slide button slots: what is read out', () => {
  const decorated = () => [h('span', { 'aria-hidden': 'true' }, '🔒'), h('span', 'Slide to pay'), h('strong', '$48')]

  it('names the thumb after what #label writes, less its decoration', async () => {
    expect(name(await render({ label: decorated }))).toBe('Slide to pay $48')
  })

  it('lets the label prop win, to say something other than what is drawn', async () => {
    expect(name(await render({ label: decorated }, { label: 'Pay 48 dollars' }))).toBe('Pay 48 dollars')
  })

  it('keeps that name while the thumb is dragged and once confirmed', async () => {
    const w = await render({ label: (c) => `Delete ${Math.round(c.progress * 100)}`, 'confirmed-label': () => 'Gone' })
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(name(w)).toBe('Delete 0')
    await confirm(w)
    expect(name(w)).toBe('Delete 0')
  })

  it('follows the name when what the slot writes changes', async () => {
    const amount = ref(48)
    const w = mount(
      defineComponent({ setup: () => () => h(OSlideButton, null, { label: () => `Pay $${amount.value}` }) }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await settle()
    amount.value = 52
    await settle()
    expect(name(w)).toBe('Pay $52')
  })

  it('has its default name when the slot writes no words', async () => {
    expect(name(await render({ label: mark('picture') }))).toBe('Slide to confirm')
  })

  it('announces what the slots of each state write', async () => {
    const w = await render({ 'loading-label': () => h('span', 'Deleting your file'), 'confirmed-label': () => h('span', 'File deleted') })
    const heard = await states(w, () => [spoken(w), thumb(w).attributes('aria-valuetext')])
    expect(heard).toEqual([
      ['', '0%'],
      ['Deleting your file', 'Deleting your file'],
      ['File deleted', 'File deleted'],
    ])
  })

  it('never announces the text of the state before', async () => {
    const heard: string[] = []
    const w = await render({ label: () => 'Slide to delete', 'confirmed-label': () => 'File deleted' })
    const status = w.get('[role="status"]').element
    // Every text that gets written, not just the one left at the end: a screen reader may say each.
    // happy-dom has no records of text set this way, so the writes themselves are noted.
    const own = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')!
    Object.defineProperty(status, 'textContent', {
      configurable: true,
      get: () => own.get!.call(status),
      set: (value: string) => {
        heard.push(value)
        own.set!.call(status, value)
      },
    })
    await confirm(w)
    expect(heard.filter(Boolean)).toEqual(['File deleted'])
  })

  it('announces the prop of a state whose slot writes no words', async () => {
    const w = await render({ 'confirmed-label': mark('tick') }, { confirmedLabel: 'Paid' })
    await confirm(w)
    expect(spoken(w)).toBe('Paid')
  })

  it('reads a button that starts out confirmed', async () => {
    const w = await render({ 'confirmed-label': () => 'Already sent' }, { modelValue: true })
    expect(spoken(w)).toBe('Already sent')
  })
})
