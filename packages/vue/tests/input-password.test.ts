import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import OInput from '../src/components/input/Input.vue'
import { useOusiConfig } from '../src/config'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function render(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  const w = mount(OInput, { props: { type: 'password', revealable: true, ...props }, attachTo: document.body, ...options })
  wrappers.push(w)
  return w
}
const input = (w: VueWrapper) => w.get('input').element as HTMLInputElement
const button = (w: VueWrapper) => w.get('[data-slot="input-reveal"]')

describe('input: showing a password', () => {
  it('is asked for: no button on a plain password field, nor on other types', () => {
    expect(render({ revealable: false }).find('[data-slot="input-reveal"]').exists()).toBe(false)
    expect(render({ type: 'text' }).find('[data-slot="input-reveal"]').exists()).toBe(false)
    expect(render().find('[data-slot="input-reveal"]').exists()).toBe(true)
  })

  it('shows what was typed and hides it again, saying which it is', async () => {
    const w = render()
    expect(input(w).type).toBe('password')
    expect(button(w).attributes('aria-pressed')).toBe('false')
    expect(w.find('[data-part="slash"]').exists()).toBe(false)
    await button(w).trigger('click')
    expect(input(w).type).toBe('text')
    expect(button(w).attributes('aria-pressed')).toBe('true')
    expect(w.find('[data-part="slash"]').exists()).toBe(true)
    await button(w).trigger('click')
    expect(input(w).type).toBe('password')
  })

  it('names the button, controls the field and never submits', () => {
    const w = render()
    expect(button(w).attributes('aria-label')).toBe('Show password')
    expect(button(w).attributes('aria-controls')).toBe(input(w).id)
    expect(button(w).attributes('type')).toBe('button')
  })

  it('keeps the value, and v-model keeps working while it is shown', async () => {
    const w = render({ modelValue: 'hunter2' })
    await button(w).trigger('click')
    expect(input(w).value).toBe('hunter2')
    await w.get('input').setValue('hunter3')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['hunter3'])
  })

  it('leaves focus in the field when pressed with a pointer', () => {
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    button(render()).element.dispatchEvent(press)
    expect(press.defaultPrevented).toBe(true)
  })

  it('keeps the caret where it was while typing, also past the move the browser makes later', async () => {
    // Seen in Chromium: it keeps the caret through the change of type, then sends it to the start
    // once the click is over, before the next frame.
    const frames: FrameRequestCallback[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => frames.push(callback))
    const w = render({ modelValue: 'hunter2' })
    const caret = () => [input(w).selectionStart, input(w).selectionEnd]
    input(w).focus()
    input(w).setSelectionRange(2, 4)
    await button(w).trigger('click')
    await nextTick()
    input(w).setSelectionRange(0, 0)
    frames.splice(0).forEach((run) => run(0))
    expect(caret()).toEqual([2, 4])
  })

  it('does not move the caret of a field nobody was typing in', async () => {
    const w = render({ modelValue: 'hunter2' })
    const select = vi.spyOn(input(w), 'setSelectionRange')
    await button(w).trigger('click')
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(select).not.toHaveBeenCalled()
  })

  it('keeps a password out of the spell checker, shown or not, unless the app says otherwise', async () => {
    const w = render()
    await button(w).trigger('click')
    expect(input(w).getAttribute('spellcheck')).toBe('false')
    expect(input(w).getAttribute('autocapitalize')).toBe('off')
    expect(input(w).getAttribute('autocorrect')).toBe('off')
    expect(render({}, { attrs: { autocapitalize: 'words' } }).get('input').attributes('autocapitalize')).toBe('words')
    expect(render({ type: 'text' }).get('input').attributes('spellcheck')).toBeUndefined()
  })

  it('is hidden again by the time its form is sent', async () => {
    let sent: string | undefined
    const w = mount(
      defineComponent({
        setup: () => () =>
          h('form', { onSubmit: (e: Event) => (e.preventDefault(), (sent = document.querySelector('input')!.type)) }, [
            h(OInput, { type: 'password', revealable: true }),
          ]),
      }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await button(w).trigger('click')
    expect(input(w).type).toBe('text')
    w.element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(sent).toBe('password') // at once, as the form reads it
    await nextTick()
    expect(button(w).attributes('aria-pressed')).toBe('false')
  })

  it('does not stay shown after it stops being a password', async () => {
    const w = render()
    await button(w).trigger('click')
    await w.setProps({ revealable: false })
    expect(input(w).type).toBe('password')
    await w.setProps({ revealable: true })
    expect(input(w).type).toBe('password')
  })

  it('is off while the field is, and stays available when it is read-only', () => {
    expect(button(render({ disabled: true })).attributes('disabled')).toBeDefined()
    expect(button(render({ readonly: true })).attributes('disabled')).toBeUndefined()
  })

  it('lives beside the clear button and the end slot', () => {
    const cleared = render({ clearable: true, modelValue: 'x' })
    expect(cleared.findAll('button')).toHaveLength(2)
    expect(render({}, { slots: { end: '<span class="mine">!</span>' } }).find('.mine').exists()).toBe(true)
  })

  it('speaks the language of the app', async () => {
    const w = render()
    useOusiConfig().locale.value = 'es-CO'
    await nextTick()
    expect(button(w).attributes('aria-label')).toBe('Mostrar la contraseña')
    useOusiConfig().locale.value = 'en-US'
  })
})
