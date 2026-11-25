import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OTour from '../src/components/tour/Tour.vue'
import ODrawer from '../src/components/drawer/Drawer.vue'
import { useOusiConfig } from '../src/config'
import type { TourStep } from '../src/components/tour/tour.types'

vi.mock('motion-v', async () => {
  const { defineComponent, h } = await import('vue')
  const Motion = defineComponent({
    name: 'Motion',
    props: { tag: { type: String, default: 'div' }, initial: null, animate: null, exit: null, transition: null },
    setup: (props, { slots }) => () => h(props.tag, null, slots.default?.()),
  })
  const AnimatePresence = defineComponent({ name: 'AnimatePresence', setup: (_, { slots }) => () => slots.default?.() })
  return { Motion, AnimatePresence }
})

beforeAll(() => {
  ;(globalThis as any).ResizeObserver ??= class { observe() {} disconnect() {} unobserve() {} }
})

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  useOusiConfig().locale.value = 'en-US'
  vi.restoreAllMocks()
})

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))
/** Lets the step be found, drawn and focused. */
async function settle(ms = 40) {
  await nextTick()
  await wait(ms)
  await nextTick()
}

/** happy-dom lays nothing out, so a part of the page has to be described. */
function part(id: string, rect = { x: 100, y: 120, width: 200, height: 40 }, html = '') {
  const el = document.createElement('div')
  el.id = id
  el.innerHTML = html
  document.body.append(el)
  const full = { ...rect, top: rect.y, left: rect.x, right: rect.x + rect.width, bottom: rect.y + rect.height, toJSON: () => rect }
  el.getBoundingClientRect = () => full as DOMRect
  el.scrollIntoView = vi.fn()
  return el
}

const steps: TourStep[] = [
  { target: '#one', title: 'First', description: 'About the first.' },
  { target: '#two', title: 'Second' },
  { title: 'Goodbye' },
]

/** The tour as an app uses it: open and step held by the page. */
async function run(options: { steps?: TourStep[]; props?: Record<string, unknown>; slots?: any; step?: boolean } = {}) {
  const open = ref(false)
  const step = ref(0)
  const events: [string, unknown?][] = []
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(
          OTour,
          {
            steps: options.steps ?? steps,
            modelValue: open.value,
            'onUpdate:modelValue': (v: boolean) => (open.value = v),
            ...(options.step ? { step: step.value } : {}),
            'onUpdate:step': (v: number) => ((step.value = v), events.push(['step', v])),
            onFinish: () => events.push(['finish']),
            onSkip: (at: number) => events.push(['skip', at]),
            ...options.props,
          },
          options.slots,
        ),
    }),
    { attachTo: document.body },
  )
  wrappers.push(w)
  open.value = true
  await settle()
  return { w, open, step, events }
}

const q = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)
const card = () => q('[data-part="card"]')!
const title = () => card().querySelector('h2')!.textContent
const spotlight = () => q('[data-part="spotlight"]')!
const blockers = () => [...document.querySelectorAll<HTMLElement>('[data-part="blocker"]')]
async function click(selector: string) {
  q(selector)!.click()
  await settle()
}
const press = async (key: string, on: Element = document.activeElement ?? document.body) => {
  on.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await settle()
}

describe('tour: steps', () => {
  it('shows nothing until it is opened, or with no steps', async () => {
    const w = mount(OTour, { props: { steps }, attachTo: document.body })
    wrappers.push(w)
    await settle()
    expect(q('[data-slot="tour"]')).toBeNull()
    await w.setProps({ steps: [], modelValue: true })
    await settle()
    expect(q('[data-slot="tour"]')).toBeNull()
  })

  it('highlights the target, with room around it', async () => {
    part('one')
    await run()
    expect(title()).toBe('First')
    const s = spotlight().style
    expect([s.left, s.top, s.width, s.height]).toEqual(['92px', '112px', '216px', '56px'])
  })

  it('takes the room it is given', async () => {
    part('one')
    await run({ props: { padding: 2 } })
    expect(spotlight().style.width).toBe('204px')
  })

  it('walks forward and back, and says where it is', async () => {
    part('one')
    part('two', { x: 400, y: 300, width: 50, height: 50 })
    const { events } = await run()
    expect(q('[data-part="progress"]')!.textContent).toContain('1 of 3')
    expect(q('[data-part="back"]')).toBeNull()
    await click('[data-part="next"]')
    expect(title()).toBe('Second')
    expect(spotlight().style.left).toBe('392px')
    expect(q('[data-part="progress"]')!.textContent).toContain('2 of 3')
    await click('[data-part="back"]')
    expect(title()).toBe('First')
    expect(events).toEqual([['step', 1], ['step', 0]])
  })

  it('finishes on the last step, which is not a skip', async () => {
    part('one')
    part('two')
    const { open, events } = await run()
    await click('[data-part="next"]')
    await click('[data-part="next"]')
    expect(q('[data-part="next"]')!.textContent!.trim()).toBe('Done')
    await click('[data-part="next"]')
    expect(open.value).toBe(false)
    expect(events.map((e) => e[0])).toEqual(['step', 'step', 'finish'])
    expect(q('[data-slot="tour"]')).toBeNull()
  })

  it('can be left, saying at which step', async () => {
    part('one')
    part('two')
    const { open, events } = await run()
    await click('[data-part="next"]')
    await click('[data-part="close"]')
    expect(open.value).toBe(false)
    expect(events.at(-1)).toEqual(['skip', 1])
  })

  it('starts over on the next run, unless the app holds the step', async () => {
    part('one')
    part('two')
    const alone = await run()
    await click('[data-part="next"]')
    alone.open.value = false
    await settle()
    alone.open.value = true
    await settle()
    expect(title()).toBe('First')
    alone.w.unmount()
    wrappers.pop()

    const held = await run({ step: true })
    await click('[data-part="next"]')
    held.open.value = false
    await settle()
    held.open.value = true
    await settle()
    expect(title()).toBe('Second')
    held.step.value = 99
    await settle()
    expect(title()).toBe('Goodbye') // never past the last
  })

  it('shows a step with no target in the middle, over a scrim with no hole', async () => {
    await run({ steps: [{ title: 'Welcome' }] })
    expect(card().style.left).toBe('50%')
    expect(card().style.transform).toBe('translate(-50%, -50%)')
    expect(spotlight().style.width).toBe('0px')
    expect(q('[data-part="progress"]')).toBeNull() // a single step has nowhere to be
  })

  it('takes an element or a function as a target', async () => {
    const el = part('thing', { x: 10, y: 20, width: 30, height: 40 })
    await run({ steps: [{ target: el, title: 'a' }, { target: () => el, title: 'b' }] })
    expect(spotlight().style.left).toBe('2px')
    await click('[data-part="next"]')
    expect(spotlight().style.left).toBe('2px')
  })

  it('waits for a target that is not there yet', async () => {
    await run({ steps: [{ target: '#late', title: 'Late' }] })
    expect(spotlight().style.opacity).toBe('0')
    part('late', { x: 50, y: 60, width: 10, height: 10 })
    await settle(80)
    expect(spotlight().style.opacity).toBe('1')
    expect(spotlight().style.left).toBe('42px')
  })

  it.each([
    ['is never found', '#nowhere'],
    ['has no size, as when hidden', '#flat'],
    ['is not a selector', '###'],
  ])('shows the step in the middle when its target %s', async (_, target) => {
    part('flat', { x: 0, y: 0, width: 0, height: 0 })
    await run({ steps: [{ target, title: 'Anyway' }] })
    await settle(700)
    expect(title()).toBe('Anyway')
    expect(card().style.left).toBe('50%')
  })

  it('brings a target into view only when it is not', async () => {
    const seen = part('one')
    const far = part('two', { x: 100, y: 5000, width: 200, height: 40 })
    await run()
    expect(seen.scrollIntoView).not.toHaveBeenCalled()
    await click('[data-part="next"]')
    expect(far.scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'center' }))
  })

  it('does not scroll back when the app renders the same steps again', async () => {
    const far = part('one', { x: 100, y: 5000, width: 200, height: 40 })
    const again = ref(0)
    const w = mount(
      defineComponent({
        // New objects every time, as steps written in a template are.
        setup: () => () => h('div', { 'data-n': again.value }, h(OTour, { modelValue: true, steps: [{ target: '#one', title: `First` }] })),
      }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await settle()
    again.value++
    await settle()
    again.value++
    await settle()
    expect(far.scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('shows what the app adds, with the means to move', async () => {
    part('one')
    part('two')
    await run({ slots: { default: (p: any) => h('button', { class: 'skip-ahead', onClick: p.next }, `${p.step.title} ${p.index + 1}/${p.total}`) } })
    expect(q('.skip-ahead')!.textContent).toBe('First 1/3')
    await click('.skip-ahead')
    expect(title()).toBe('Second')
  })
})

describe('tour: what can be used', () => {
  it('takes every click on the page, and none of them closes it', async () => {
    part('one')
    const { open } = await run()
    expect(blockers()).toHaveLength(1)
    expect(blockers()[0].style.inset).toBe('0px')
    await click('[data-part="blocker"]')
    expect(open.value).toBe(true)
    // A press on it would take focus out of the card, to the page behind.
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    blockers()[0].dispatchEvent(press)
    expect(press.defaultPrevented).toBe(true)
  })

  it('leaves the highlight open on an interactive step', async () => {
    part('one')
    await run({ steps: [{ target: '#one', title: 'Try it', interactive: true }] })
    expect(blockers()).toHaveLength(4)
    const [above, below, left, right] = blockers().map((b) => b.style)
    // The hole runs from (92, 112) to (308, 168).
    expect(above.height).toBe('112px')
    expect(below.top).toBe('168px')
    expect([left.width, left.top, left.height]).toEqual(['92px', '112px', '56px'])
    expect(right.left).toBe('308px')
    expect(card().getAttribute('aria-modal')).toBeNull()
  })
})

describe('tour: keyboard and screen readers', () => {
  it('is a dialog named and described by the step', async () => {
    part('one')
    await run()
    const el = card()
    expect(el.getAttribute('role')).toBe('dialog')
    expect(el.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(el.getAttribute('aria-labelledby')!)!.textContent).toBe('First')
    expect(document.getElementById(el.getAttribute('aria-describedby')!)!.textContent).toBe('About the first.')
    expect(q('[aria-live="polite"]')!.textContent).toContain('1 of 3. First. About the first.')
  })

  it('puts focus on the button that moves on, and keeps it in the card', async () => {
    part('one')
    part('two')
    await run()
    expect((document.activeElement as HTMLElement).dataset.part).toBe('next')
    await click('[data-part="next"]')
    expect(card().contains(document.activeElement)).toBe(true)
  })

  it('keeps focus in the card when the button that had it goes away', async () => {
    part('one')
    part('two')
    await run()
    await click('[data-part="next"]')
    q('[data-part="back"]')!.focus()
    await click('[data-part="back"]') // there is no Back on the first step
    await settle()
    expect((document.activeElement as HTMLElement).dataset.part).toBe('next')
  })

  it('gives focus back to what opened it', async () => {
    part('one')
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    await run()
    await press('Escape')
    expect(document.activeElement).toBe(opener)
  })

  it('moves with the arrows, without finishing by one', async () => {
    part('one')
    part('two')
    const { open } = await run()
    await press('ArrowRight')
    await press('ArrowRight')
    await press('ArrowRight')
    expect(title()).toBe('Goodbye')
    expect(open.value).toBe(true)
    await press('ArrowLeft')
    expect(title()).toBe('Second')
  })

  it('leaves the arrows to a field inside the card', async () => {
    part('one')
    await run({ slots: { default: () => h('input', { class: 'mine' }) } })
    await press('ArrowRight', q('.mine')!)
    expect(title()).toBe('First')
  })

  it('leaves with Escape, unless told not to', async () => {
    part('one')
    const stays = await run({ props: { closeOnEscape: false } })
    await press('Escape')
    expect(stays.open.value).toBe(true)
    stays.w.unmount()
    wrappers.pop()
    const leaves = await run()
    await press('Escape')
    expect(leaves.open.value).toBe(false)
    expect(leaves.events.at(-1)).toEqual(['skip', 0])
  })

  it('lies above a drawer that was open, and takes Escape before it', async () => {
    const closedDrawer = vi.fn()
    const w = mount(ODrawer, { props: { modelValue: true, onClose: closedDrawer }, slots: { default: '<button id="inside">x</button>' }, attachTo: document.body })
    wrappers.push(w)
    await settle()
    const inside = q('#inside')!
    inside.getBoundingClientRect = () => ({ x: 1, y: 1, width: 10, height: 10, top: 1, left: 1, right: 11, bottom: 11 }) as DOMRect
    const { open } = await run({ steps: [{ target: '#inside', title: 'In the drawer' }] })
    expect(Number(card().style.zIndex)).toBeGreaterThan(Number((q('[role="dialog"]:not([data-part])')!.parentElement as HTMLElement).style.zIndex))
    await press('Escape')
    expect(open.value).toBe(false)
    expect(closedDrawer).not.toHaveBeenCalled()
  })

  it('speaks the language of the app', async () => {
    useOusiConfig().locale.value = 'es-CO'
    part('one')
    await run()
    expect(q('[data-part="next"]')!.textContent!.trim()).toBe('Siguiente')
    expect(q('[data-part="progress"]')!.textContent).toContain('1 de 3')
    expect(q('[data-part="close"]')!.getAttribute('aria-label')).toBe('Cerrar el recorrido')
  })

  it('takes its shape and border from the tokens', async () => {
    part('one')
    await run()
    for (const token of ['rounded-ousi-3xl', 'bg-ousi-overlay', 'border-[length:var(--ousi-border-width)]', 'shadow-ousi-xl']) {
      expect(card().className.split(' ')).toContain(token)
    }
    expect(spotlight().className).toContain('[--tour-radius:var(--ousi-radius-xl)]')
    expect(spotlight().className).toContain('var(--ousi-backdrop)')
  })
})
