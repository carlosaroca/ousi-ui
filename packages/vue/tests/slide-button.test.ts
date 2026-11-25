import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { cn } from '@ousi-ui/core'
import OSlideButton from '../src/components/slide-button/SlideButton.vue'
import { slideButtonTheme, slideButtonThumbTheme } from '../src/components/slide-button/slide-button.theme'
import { useOusiConfig } from '../src/config'

const buzz = vi.fn()
vi.mock('@ousi-ui/haptics', () => ({ useHaptics: () => ({ trigger: buzz }) }))

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  buzz.mockClear()
  useOusiConfig().locale.value = 'en-US'
  vi.restoreAllMocks()
})

// happy-dom lays nothing out: a 300px track with a 40px thumb 4px in leaves 252px to run.
const TRAVEL = 252
function render(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  const w = mount(OSlideButton, { props, attachTo: document.body, ...options })
  wrappers.push(w)
  describeSizes(w)
  return w
}
function describeSizes(w: VueWrapper) {
  const track = w.find('[data-slot="slide-button"]').element
  const thumb = w.find('[data-part="thumb"]').element
  Object.defineProperty(track, 'clientWidth', { configurable: true, value: 300 })
  Object.defineProperty(thumb, 'offsetWidth', { configurable: true, value: 40 })
  Object.defineProperty(thumb, 'offsetTop', { configurable: true, value: 4 })
}
type Button = ReturnType<typeof render>
const thumb = (w: VueWrapper) => w.get('[data-part="thumb"]')
const state = (w: VueWrapper) => w.get('[data-slot="slide-button"]').attributes('data-state')
const at = (w: VueWrapper) => Number(thumb(w).attributes('aria-valuenow'))
const label = (w: VueWrapper) => w.get('[data-part="label"]').text()

async function pointer(w: VueWrapper, type: string, x: number, init: PointerEventInit = {}) {
  thumb(w).element.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: x, ...init }))
  await nextTick()
}
/** Drags the thumb along a share of its run. */
async function slide(w: VueWrapper, share: number, end: 'pointerup' | 'pointercancel' | null = 'pointerup') {
  await pointer(w, 'pointerdown', 100)
  await pointer(w, 'pointermove', 100 + TRAVEL * share)
  if (end) await pointer(w, end, 100 + TRAVEL * share)
}
const key = async (w: VueWrapper, name: string, init: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init })
  thumb(w).element.dispatchEvent(event)
  await nextTick()
  return event
}

describe('slide button: dragging', () => {
  it('confirms once slid to the end', async () => {
    const w = render()
    await slide(w, 1)
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('update:modelValue')).toEqual([[true]])
    expect(state(w)).toBe('confirmed')
    expect(at(w)).toBe(100)
  })

  it('follows the pointer, measured against the room the thumb has', async () => {
    const w = render()
    await slide(w, 0.5, null)
    expect(at(w)).toBe(50)
    expect(state(w)).toBe('dragging')
    await pointer(w, 'pointermove', 100 + TRAVEL * 3)
    expect(at(w)).toBe(100) // never past the end
    await pointer(w, 'pointermove', -500)
    expect(at(w)).toBe(0) // nor before the start
  })

  it('goes back when let go short of the end', async () => {
    const w = render()
    await slide(w, 0.85)
    expect(w.emitted('confirm')).toBeUndefined()
    expect(at(w)).toBe(0)
    expect(state(w)).toBe('idle')
  })

  it('takes the threshold it is given, never under half', async () => {
    const low = render({ threshold: 0.7 })
    await slide(low, 0.75)
    expect(low.emitted('confirm')).toHaveLength(1)
    const careless = render({ threshold: 0 })
    await slide(careless, 0.3)
    expect(careless.emitted('confirm')).toBeUndefined()
  })

  it('goes back when the system takes the pointer away, even at the end', async () => {
    const w = render()
    await slide(w, 1, 'pointercancel')
    expect(w.emitted('confirm')).toBeUndefined()
    expect(at(w)).toBe(0)
  })

  it('does not confirm by a click or a press on it', async () => {
    const w = render()
    await thumb(w).trigger('click', { detail: 1 })
    await pointer(w, 'pointerdown', 100)
    await pointer(w, 'pointerup', 100)
    expect(w.emitted('confirm')).toBeUndefined()
  })

  it('does not leave a focus ring behind a drag: the thumb is not focused from script', async () => {
    const w = render()
    const focus = vi.spyOn(thumb(w).element as HTMLElement, 'focus')
    await slide(w, 0.5)
    expect(focus).not.toHaveBeenCalled()
  })

  it('ignores the right button and a second pointer', async () => {
    const w = render()
    await pointer(w, 'pointerdown', 100, { button: 2 })
    await pointer(w, 'pointermove', 400)
    expect(at(w)).toBe(0)
    await pointer(w, 'pointerdown', 100)
    await pointer(w, 'pointermove', 400, { pointerId: 2 })
    await pointer(w, 'pointerup', 400, { pointerId: 2 })
    expect(at(w)).toBe(0)
    expect(w.emitted('confirm')).toBeUndefined()
  })

  it('runs the other way from right to left', async () => {
    const real = window.getComputedStyle.bind(window)
    const w = render()
    const track = w.get('[data-slot="slide-button"]').element
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, p?: string | null) =>
      el === track ? ({ direction: 'rtl' } as CSSStyleDeclaration) : real(el, p),
    )
    await slide(w, 1)
    expect(w.emitted('confirm')).toBeUndefined()
    await slide(w, -1)
    expect(w.emitted('confirm')).toHaveLength(1)
  })
})

describe('slide button: confirmed', () => {
  it('cannot be slid or confirmed twice', async () => {
    const w = render()
    await slide(w, 1)
    await slide(w, -1)
    await slide(w, 1)
    await key(w, 'End')
    await thumb(w).trigger('click', { detail: 0 })
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(thumb(w).attributes('aria-disabled')).toBe('true')
  })

  it('follows v-model: true on confirming, and back to the start when the app says false', async () => {
    const done = ref(false)
    const w = mount(
      defineComponent({ setup: () => () => h(OSlideButton, { modelValue: done.value, 'onUpdate:modelValue': (v: boolean) => (done.value = v) }) }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    describeSizes(w)
    await slide(w, 1)
    expect(done.value).toBe(true)
    expect(state(w)).toBe('confirmed')
    done.value = false // the action failed
    await nextTick()
    expect(state(w)).toBe('idle')
    expect(at(w)).toBe(0)
    await slide(w, 1)
    expect(done.value).toBe(true)
  })

  it('does not stay half way when the app does not take the confirmation', async () => {
    const w = render({ modelValue: false })
    await slide(w, 1)
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(at(w)).toBe(0)
  })

  it('can be sent back with reset()', async () => {
    const w = render()
    await slide(w, 1)
    ;(w.vm as any).reset()
    await nextTick()
    expect(at(w)).toBe(0)
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('says what it will do, then what happened', async () => {
    const w = render({ label: 'Slide to pay', confirmedLabel: 'Paid', loadingLabel: 'Paying…' })
    expect(label(w)).toBe('Slide to pay')
    expect(w.get('[role="status"]').text()).toBe('')
    await slide(w, 1)
    await w.setProps({ loading: true })
    expect(label(w)).toBe('Paying…')
    expect(state(w)).toBe('loading')
    expect(thumb(w).attributes('aria-busy')).toBe('true')
    expect(w.find('[data-part="spinner"]').exists()).toBe(true)
    await w.setProps({ loading: false })
    expect(label(w)).toBe('Paid')
    expect(w.get('[role="status"]').text()).toBe('Paid')
    expect(w.find('[data-part="check"]').exists()).toBe(true)
  })
})

describe('slide button: off', () => {
  it.each([['disabled'], ['loading']])('cannot be moved while %s', async (prop) => {
    const w = render({ [prop]: true })
    await slide(w, 1)
    await key(w, 'End')
    await thumb(w).trigger('click', { detail: 0 })
    expect(w.emitted('confirm')).toBeUndefined()
    expect(thumb(w).attributes('aria-disabled')).toBe('true')
    expect(thumb(w).classes()).not.toContain('cursor-grab')
  })

  it('drops a drag that was under way when it is turned off', async () => {
    const w = render()
    await slide(w, 0.95, null)
    await w.setProps({ disabled: true })
    await pointer(w, 'pointerup', 400)
    expect(w.emitted('confirm')).toBeUndefined()
    expect(at(w)).toBe(0)
  })

  it('leaves the tab order only when disabled', () => {
    expect(thumb(render({ disabled: true })).attributes('tabindex')).toBe('-1')
    expect(thumb(render()).attributes('tabindex')).toBe('0')
  })
})

describe('slide button: keyboard and screen readers', () => {
  it('is a slider named after what it does', () => {
    const el = thumb(render({ label: 'Slide to delete' }))
    expect(el.attributes('role')).toBe('slider')
    expect(el.attributes('aria-label')).toBe('Slide to delete')
    expect([el.attributes('aria-valuemin'), el.attributes('aria-valuemax'), el.attributes('aria-valuenow')]).toEqual(['0', '100', '0'])
  })

  it('moves in four steps with the arrows, and confirms at the end', async () => {
    const w = render()
    for (const expected of [25, 50, 75]) {
      expect((await key(w, 'ArrowRight')).defaultPrevented).toBe(true)
      expect(at(w)).toBe(expected)
    }
    await key(w, 'ArrowLeft')
    expect(at(w)).toBe(50)
    await key(w, 'ArrowRight')
    await key(w, 'ArrowRight')
    expect(w.emitted('confirm')).toHaveLength(1)
  })

  it('does not run to the end on a held key', async () => {
    const w = render()
    await key(w, 'ArrowRight')
    for (let i = 0; i < 10; i++) await key(w, 'ArrowRight', { repeat: true })
    expect(at(w)).toBe(25)
    await key(w, 'End', { repeat: true })
    expect(w.emitted('confirm')).toBeUndefined()
  })

  it('goes to the ends with Home and End, and forgets half a way on leaving', async () => {
    const w = render()
    await key(w, 'ArrowRight')
    await key(w, 'Home')
    expect(at(w)).toBe(0)
    await key(w, 'ArrowRight')
    await thumb(w).trigger('blur')
    expect(at(w)).toBe(0)
    await key(w, 'End')
    expect(w.emitted('confirm')).toHaveLength(1)
  })

  it('leaves other keys to the page', async () => {
    expect((await key(render(), 'Tab')).defaultPrevented).toBe(false)
  })

  it('confirms when assistive technology activates it', async () => {
    const w = render()
    await thumb(w).trigger('click', { detail: 0 })
    expect(w.emitted('confirm')).toHaveLength(1)
  })

  it('speaks the language of the app', async () => {
    useOusiConfig().locale.value = 'es-CO'
    const w = render()
    expect(label(w)).toBe('Desliza para confirmar')
    await slide(w, 1)
    expect(label(w)).toBe('Confirmado')
  })
})

describe('slide button: theme', () => {
  it('buzzes on confirming only when asked', async () => {
    await slide(render(), 1)
    expect(buzz).not.toHaveBeenCalled()
    await slide(render({ haptic: 'success' }), 1)
    expect(buzz).toHaveBeenCalledTimes(1)
    expect(buzz).toHaveBeenCalledWith('success')
  })

  it('takes its shape, border and states from the tokens', () => {
    // Through cn, which drops classes it takes to be in conflict.
    const track = cn(slideButtonTheme({ disabled: true }))
    for (const token of [
      '[--slide-radius:var(--ousi-radius-4xl)]',
      'rounded-(--slide-radius)',
      'border-[length:var(--ousi-border-width)]',
      'border-ousi-border',
      'bg-ousi-default',
      'opacity-(--ousi-disabled-opacity)',
      'cursor-(--ousi-cursor-disabled)',
    ]) expect(track.split(' ')).toContain(token)
    const knob = slideButtonThumbTheme()
    expect(knob).toContain('rounded-[max(0px,calc(var(--slide-radius)_-_var(--slide-pad)_-_var(--ousi-border-width)))]')
    expect(knob).toContain('focus-visible:outline-ousi-focus')
    expect(knob).toContain('focus-visible:outline-offset-[var(--ousi-ring-offset-width)]')
    // No radius of its own that a theme could not change.
    expect(`${track} ${knob}`).not.toMatch(/\brounded-(full|sm|md|lg|xl|\d)/)
  })

  it('takes classes from the app', () => {
    expect(render({ class: 'w-full' }).get('[data-slot="slide-button"]').classes()).toContain('w-full')
  })
})
