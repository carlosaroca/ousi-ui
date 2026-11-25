import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import OAutocomplete from '../src/components/autocomplete/Autocomplete.vue'
import { useOusiConfig } from '../src/config'

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

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
  useOusiConfig().locale.value = 'en-US'
  useOusiConfig().autoSelectSingle.value = false
  vi.useRealTimers()
})

const people = [
  { value: 'ana', label: 'Ana Gómez' },
  { value: 'andres', label: 'Andrés Ruiz' },
  { value: 'luis', label: 'Luis Peña' },
  { value: 'marta', label: 'Marta Díaz', disabled: true },
]

async function settle() {
  await nextTick()
  await nextTick()
}

/** The field as an app uses it, holding the value itself. */
async function field(props: Record<string, unknown> = {}, options: { value?: unknown; slots?: any } = {}) {
  const value = ref<any>('value' in options ? options.value : props.multiple === false ? '' : [])
  const sent: any[] = []
  const seen = { blur: 0, clear: 0 }
  const w = mount(
    defineComponent({
      setup: () => () =>
        h(
          OAutocomplete,
          {
            multiple: true,
            options: people,
            modelValue: value.value,
            'onUpdate:modelValue': (v: any) => ((value.value = v), sent.push(v)),
            onBlur: () => seen.blur++,
            onClear: () => seen.clear++,
            ...props,
          },
          options.slots,
        ),
    }),
    { attachTo: document.body },
  )
  wrappers.push(w)
  await settle()
  return { w, value, sent, seen }
}

const $ = <T extends Element = HTMLElement>(selector: string) => document.querySelector<T>(selector)!
const input = () => $<HTMLInputElement>('input[role="combobox"]')
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="listbox"] [role="option"]')]
const row = (text: string) => rows().find((r) => r.textContent!.includes(text))!
const isOpen = () => input().getAttribute('aria-expanded') === 'true'
const chips = () => [...document.querySelectorAll<HTMLElement>('[data-part="chip"]')].map((c) => c.textContent!.trim())
const removers = () => [...document.querySelectorAll<HTMLElement>('[data-part="chip-remove"]')]
const announced = () => $('[data-part="announcement"]').textContent

async function open() {
  input().focus()
  await settle()
}
async function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await settle()
}
async function type(text: string) {
  input().value = text
  input().dispatchEvent(new Event('input', { bubbles: true }))
  await settle()
}
async function press(key: string, init: KeyboardEventInit = {}, on: Element = document.activeElement!) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  on.dispatchEvent(event)
  await settle()
  return event
}

describe('autocomplete, one value: as before', () => {
  it('takes and gives a single value, and shows its label in the input', async () => {
    const { sent } = await field({ multiple: false })
    await open()
    await click(row('Luis'))
    expect(sent).toEqual(['luis'])
    expect(input().value).toBe('Luis Peña')
    expect(isOpen()).toBe(false)
    expect(chips()).toEqual([])
    expect($('[role="listbox"]')).toBeNull()
  })

  it('has none of what several values need', async () => {
    await field({ multiple: false })
    await open()
    expect($('[role="listbox"]').getAttribute('aria-multiselectable')).toBeNull()
    expect(document.querySelector('input[type="hidden"], [data-part="announcement"]')).toBeNull()
    // The input sits where it always has: straight inside the field, with no box around it.
    expect(input().parentElement!.className).toContain('input-group')
  })

  it('counts 0 as a value', async () => {
    await field({ multiple: false, options: [{ value: 0, label: 'None' }] }, { value: 0 })
    expect(input().value).toBe('None')
    expect($('button[aria-label="Clear"]')).not.toBeNull()
  })
})

describe('autocomplete, several values: picking', () => {
  it('adds each pick in order, as a new array every time, and stays open', async () => {
    const mine: string[] = []
    const { sent, value } = await field({}, { value: mine })
    await open()
    await click(row('Luis'))
    await click(row('Ana'))
    expect(sent).toEqual([['luis'], ['luis', 'ana']])
    expect(mine).toEqual([]) // the app's array is never changed
    expect(value.value).not.toBe(mine)
    expect(chips()).toEqual(['Luis Peña', 'Ana Gómez'])
    expect(isOpen()).toBe(true)
  })

  it('marks what is picked, and picking it again takes it off', async () => {
    const { value } = await field()
    await open()
    expect($('[role="listbox"]').getAttribute('aria-multiselectable')).toBe('true')
    await click(row('Ana'))
    expect(row('Ana').getAttribute('aria-selected')).toBe('true')
    expect(row('Ana').querySelector('svg')).not.toBeNull()
    expect(row('Luis').getAttribute('aria-selected')).toBe('false')
    await click(row('Ana'))
    expect(value.value).toEqual([])
  })

  it('does not pick a disabled option', async () => {
    const { sent } = await field()
    await open()
    await click(row('Marta'))
    expect(sent).toEqual([])
  })

  it('toggles with Enter, staying open', async () => {
    const { value } = await field()
    await open()
    await press('Enter')
    await press('ArrowDown')
    await press('Enter')
    expect(value.value).toEqual(['ana', 'andres'])
    await press('Enter')
    expect(value.value).toEqual(['ana'])
    expect(isOpen()).toBe(true)
  })

  it('clears the search after a pick, keeping the highlight on what was picked', async () => {
    await field()
    await open()
    await type('pen')
    expect(rows().map((r) => r.textContent!.trim())).toEqual(['Luis Peña'])
    await press('Enter')
    expect(input().value).toBe('')
    expect(rows()).toHaveLength(4)
    expect(input().getAttribute('aria-activedescendant')).toBe(row('Luis').id)
  })

  it('keeps the text where the app does the filtering: its results hang on it', async () => {
    await field({ filter: false })
    await open()
    await type('an')
    await click(row('Ana'))
    expect(input().value).toBe('an')
  })

  it('with a server search, keeps the text and results, and every label picked from them', async () => {
    vi.useFakeTimers()
    const search = vi.fn(async (term: string) =>
      term === 'an' ? [{ value: 1, label: 'Ana' }, { value: 2, label: 'Andrés' }] : [{ value: 3, label: 'Pedro' }],
    )
    const { value } = await field({ search, options: [], debounce: 10 })
    await open()
    await type('an')
    await vi.advanceTimersByTimeAsync(20)
    await click(row('Ana'))
    await click(row('Andrés'))
    expect(input().value).toBe('an')
    expect(search).toHaveBeenCalledTimes(1)
    await type('ped')
    await vi.advanceTimersByTimeAsync(20)
    await click(row('Pedro'))
    expect(value.value).toEqual([1, 2, 3])
    expect(chips()).toEqual(['Ana', 'Andrés', 'Pedro'])
  })

  it('remembers the label of a value the app set, after it leaves the results', async () => {
    vi.useFakeTimers()
    const search = async () => [{ value: 9, label: 'Nueve' }]
    const { value } = await field({ search, options: [], debounce: 10 })
    await open()
    await type('nu')
    await vi.advanceTimersByTimeAsync(20)
    value.value = [9] // set by the app, not picked
    await settle()
    await type('x') // too short: the results go
    expect(chips()).toEqual(['Nueve'])
  })

  it('shows the value itself for one no option names, so it can still be removed', async () => {
    const { value } = await field({}, { value: ['ghost', 'ana'] })
    expect(chips()).toEqual(['ghost', 'Ana Gómez'])
    await click(removers()[0])
    expect(value.value).toEqual(['ana'])
  })

  it('works uncontrolled, from a default', async () => {
    const w = mount(OAutocomplete, { props: { multiple: true, options: people, defaultValue: ['luis'] }, attachTo: document.body })
    wrappers.push(w)
    await settle()
    expect(chips()).toEqual(['Luis Peña'])
    await open()
    await click(row('Ana'))
    expect(chips()).toEqual(['Luis Peña', 'Ana Gómez'])
  })

  it('takes a single value the app left behind as a list of one', async () => {
    await field({}, { value: 'ana' })
    expect(chips()).toEqual(['Ana Gómez'])
  })

  it('never picks on its own, even with one option and autoSelectSingle', async () => {
    useOusiConfig().autoSelectSingle.value = true
    const { sent } = await field({ options: [people[0]], required: true, autoSelectSingle: true })
    expect(sent).toEqual([])
  })
})

describe('autocomplete, several values: chips', () => {
  it('removes one from its button, without opening the list or moving focus', async () => {
    const { value } = await field({}, { value: ['ana', 'luis'] })
    expect(removers()[0].getAttribute('aria-label')).toBe('Remove Ana Gómez')
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    removers()[0].dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
    await click(removers()[0])
    expect(value.value).toEqual(['luis'])
    expect(isOpen()).toBe(false)
    expect(document.activeElement).not.toBe(input())
  })

  it('is one Tab stop however many chips', async () => {
    await field({}, { value: ['ana', 'luis'] })
    expect(removers().map((b) => b.getAttribute('tabindex'))).toEqual(['-1', '-1'])
  })

  it('removes the last with Backspace once there is nothing typed', async () => {
    const { value } = await field({}, { value: ['ana', 'luis'] })
    await open()
    await type('a')
    await press('Backspace')
    expect(value.value).toEqual(['ana', 'luis']) // it was erasing the text
    await type('')
    expect((await press('Backspace')).defaultPrevented).toBe(true)
    expect(value.value).toEqual(['ana'])
  })

  it('does not go on erasing picks while Backspace is held down', async () => {
    const { value } = await field({}, { value: ['ana', 'andres', 'luis'] })
    await open()
    for (let i = 0; i < 10; i++) await press('Backspace', { repeat: true })
    expect(value.value).toEqual(['ana', 'andres', 'luis'])
  })

  it('walks the chips with the arrows, and back to the input past the last', async () => {
    await field({}, { value: ['ana', 'andres', 'luis'] })
    await open()
    await press('ArrowLeft')
    expect(document.activeElement).toBe(removers()[2])
    expect(isOpen()).toBe(false)
    await press('ArrowLeft')
    await press('ArrowLeft')
    await press('ArrowLeft') // stops at the first
    expect(document.activeElement).toBe(removers()[0])
    await press('ArrowRight')
    await press('ArrowRight')
    await press('ArrowRight')
    expect(document.activeElement).toBe(input())
  })

  it('removes the focused chip: Backspace goes back, Delete stays', async () => {
    const { value } = await field({}, { value: ['ana', 'andres', 'luis'] })
    await open()
    await press('ArrowLeft')
    await press('ArrowLeft') // Andrés
    await press('Backspace')
    expect(value.value).toEqual(['ana', 'luis'])
    expect(document.activeElement).toBe(removers()[0])
    await press('Delete')
    expect(value.value).toEqual(['luis'])
    expect(document.activeElement).toBe(removers()[0])
    await press('Delete')
    expect(value.value).toEqual([])
    expect(document.activeElement).toBe(input())
  })

  it('leaves the arrows to the text while there is some', async () => {
    await field({}, { value: ['ana'] })
    await open()
    await type('lu')
    expect((await press('ArrowLeft')).defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(input())
  })

  it('reports leaving the field, not moving among its chips', async () => {
    const { seen } = await field({}, { value: ['ana'] })
    await open()
    await press('ArrowLeft')
    expect(seen.blur).toBe(0)
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    await settle()
    expect(seen.blur).toBe(1)
  })

  it.each([['disabled'], ['readonly']])('cannot be changed while %s', async (prop) => {
    const { value } = await field({ [prop]: true }, { value: ['ana'] })
    expect(removers()).toHaveLength(0)
    await press('Backspace', {}, input())
    expect(value.value).toEqual(['ana'])
  })

  it('shows the placeholder only while there is nothing picked', async () => {
    const { value } = await field({ placeholder: 'Add people' })
    expect(input().placeholder).toBe('Add people')
    value.value = ['ana']
    await settle()
    expect(input().placeholder).toBe('')
  })

  it('clears them all', async () => {
    const { value, seen } = await field({}, { value: ['ana', 'luis'] })
    await click($('button[aria-label="Clear"]'))
    expect(value.value).toEqual([])
    expect(seen.clear).toBe(1)
  })

  it('lets the app draw what a chip says, keeping its remove button', async () => {
    await field({}, { value: ['ana'], slots: { chip: (p: any) => h('b', { class: 'mine' }, `${p.option.value}:${p.disabled}`) } })
    expect($('.mine').textContent).toBe('ana:false')
    expect(removers()).toHaveLength(1)
  })

  it('asks for no line of its own beside the chips until there is something to type', async () => {
    const { value } = await field()
    const classes = () => input().className.split(' ')
    expect(classes()).toContain('min-w-16') // room for the placeholder
    value.value = ['ana']
    await settle()
    expect(classes()).toContain('min-w-0')
    expect(classes()).toContain('focus:min-w-8') // room for the caret
    expect(classes()).not.toContain('min-w-16')
    expect(input().style.minWidth).toBe('')
    await open()
    await type('andres')
    // Then it asks for what the text takes, never more than the field. Set as a style, which wins
    // over the theme's own minimum.
    expect(classes()).toContain('px-1.5')
    expect(input().style.minWidth).toBe('min(100%, calc(7ch + 0.75rem))')
  })

  it('is a chip of the library, with its tokens', async () => {
    await field({}, { value: ['ana'] })
    const classes = $('[data-part="chip"]').className.split(' ')
    for (const token of ['rounded-ousi-md', 'bg-ousi-default', 'text-ousi-foreground', 'max-w-full']) expect(classes).toContain(token)
    // Not announced on its own, as a status would be.
    expect($('[data-part="chip"]').getAttribute('role')).toBeNull()
  })
})

describe('autocomplete: adding what is not on the list', () => {
  const custom = { allowCustomValue: true }

  it('offers a row to add what was typed, picked with Enter or a click', async () => {
    const { value } = await field(custom)
    await open()
    await type('  Zoe ')
    expect(rows().map((r) => r.textContent!.trim())).toEqual(['Add “Zoe”'])
    await press('Enter')
    expect(value.value).toEqual(['Zoe'])
    expect(input().value).toBe('')
    await type('Ivo')
    await click(row('Add'))
    expect(value.value).toEqual(['Zoe', 'Ivo'])
    expect(chips()).toEqual(['Zoe', 'Ivo'])
  })

  it('comes after the matches, reached with the arrows', async () => {
    const { value } = await field(custom)
    await open()
    await type('an')
    expect(rows().map((r) => r.textContent!.trim())).toEqual(['Ana Gómez', 'Andrés Ruiz', 'Add “an”'])
    await press('ArrowDown')
    await press('ArrowDown')
    await press('ArrowDown') // stops there
    expect(input().getAttribute('aria-activedescendant')).toBe(row('Add').id)
    await press('Enter')
    expect(value.value).toEqual(['an'])
  })

  it('is not offered for what is already there, whatever the accents and capitals', async () => {
    await field(custom, { value: ['Zoe'] })
    await open()
    await type('andres ruiz')
    expect(row('Add')).toBeUndefined()
    await type('ZOE')
    expect(row('Add')).toBeUndefined()
  })

  it('is only offered when asked for, and only for several', async () => {
    await field()
    await open()
    await type('Zoe')
    expect(row('Add')).toBeUndefined()
    wrappers.splice(0).forEach((w) => w.unmount())
    document.body.innerHTML = ''
    await field({ multiple: false, allowCustomValue: true })
    await open()
    await type('Zoe')
    expect(row('Add')).toBeUndefined()
  })
})

describe('autocomplete: forms', () => {
  it('is required only while empty, and says so to screen readers either way', async () => {
    const { value } = await field({ required: true })
    expect(input().required).toBe(true)
    value.value = ['ana']
    await settle()
    expect(input().required).toBe(false)
    expect(input().getAttribute('aria-required')).toBe('true')
  })

  it('sends every value under its name, not the text being typed', async () => {
    const w = mount(
      defineComponent({
        setup: () => () => h('form', [h(OAutocomplete, { multiple: true, options: people, defaultValue: ['ana', 'luis'], name: 'team' })]),
      }),
      { attachTo: document.body },
    )
    wrappers.push(w)
    await settle()
    await open()
    await type('and')
    expect(new FormData(w.element as HTMLFormElement).getAll('team')).toEqual(['ana', 'luis'])
    expect(input().getAttribute('name')).toBeNull()
  })
})

describe('autocomplete: keyboard and screen readers', () => {
  it.each([[true], [false]])('points at the highlighted option (multiple: %s)', async (multiple) => {
    await field({ multiple })
    expect(input().getAttribute('aria-activedescendant')).toBeNull()
    await open()
    expect(input().getAttribute('aria-activedescendant')).toBe(row('Ana').id)
    await press('ArrowDown')
    expect(input().getAttribute('aria-activedescendant')).toBe(row('Andrés').id)
    await type('zzz')
    expect(input().getAttribute('aria-activedescendant')).toBeNull()
  })

  it('keeps the highlighted option in view', async () => {
    const seen: string[] = []
    const real = HTMLElement.prototype.scrollIntoView
    HTMLElement.prototype.scrollIntoView = function (this: HTMLElement) {
      seen.push(this.textContent!.trim())
    }
    await field()
    await open()
    await press('ArrowDown')
    await press('ArrowDown')
    await press('ArrowUp')
    HTMLElement.prototype.scrollIntoView = real
    expect(seen).toEqual(['Andrés Ruiz', 'Luis Peña', 'Andrés Ruiz'])
  })

  it('says what is picked as part of the field’s description', async () => {
    await field({ description: 'Who takes part.' }, { value: ['ana', 'luis'] })
    const described = input()
      .getAttribute('aria-describedby')!
      .split(' ')
      .map((id) => document.getElementById(id)!.textContent!.trim())
    expect(described).toEqual(['Who takes part.', 'Selected: Ana Gómez, Luis Peña'])
  })

  it('announces what is added and removed', async () => {
    await field()
    await open()
    await click(row('Ana'))
    expect(announced()).toBe('Ana Gómez added')
    await click(removers()[0])
    expect(announced()).toBe('Ana Gómez removed')
  })

  it('opens again on a click after Escape', async () => {
    await field()
    await open()
    await press('Escape')
    expect(isOpen()).toBe(false)
    await click(input())
    expect(isOpen()).toBe(true)
  })

  it('does not let a press on the list take focus from the input', async () => {
    await field()
    await open()
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    row('Ana').dispatchEvent(down)
    expect(down.defaultPrevented).toBe(true)
  })

  it('speaks the language of the app', async () => {
    useOusiConfig().locale.value = 'es-CO'
    await field({ allowCustomValue: true }, { value: ['ana'] })
    expect(removers()[0].getAttribute('aria-label')).toBe('Quitar Ana Gómez')
    await open()
    await type('Zoe')
    expect(row('Agregar').textContent!.trim()).toBe('Agregar «Zoe»')
  })
})
