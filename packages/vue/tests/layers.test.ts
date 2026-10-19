import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, effectScope, h, nextTick, ref, type Ref, type VNodeChild } from 'vue'
import { useEscapeKey, useLayer, LAYER_BASE_Z_INDEX, TOOLTIP_Z_INDEX } from '@ousi-ui/core'
import ODialog from '../src/components/dialog/Dialog.vue'
import ODrawer from '../src/components/drawer/Drawer.vue'
import OPopover from '../src/components/popover/Popover.vue'
import OSelect from '../src/components/select/Select.vue'
import OAutocomplete from '../src/components/autocomplete/Autocomplete.vue'
import ODatePicker from '../src/components/date-picker/DatePicker.vue'
import OTooltip from '../src/components/tooltip/Tooltip.vue'
import {
  ODropdown,
  ODropdownTrigger,
  ODropdownPopover,
  ODropdownMenu,
  ODropdownItem,
  ODropdownSubmenuTrigger,
} from '../src/components/dropdown'

// Animations are out of scope here: Motion renders its tag and AnimatePresence its slot, so
// overlays mount and unmount with their v-if.
vi.mock('motion-v', async () => {
  const { defineComponent, h } = await import('vue')
  const Motion = defineComponent({
    name: 'Motion',
    props: { tag: { type: String, default: 'div' }, initial: null, animate: null, exit: null, transition: null },
    setup: (props, { slots }) => () => h(props.tag, null, slots.default?.()),
  })
  const AnimatePresence = defineComponent({
    name: 'AnimatePresence',
    setup: (_, { slots }) => () => slots.default?.(),
  })
  return { Motion, AnimatePresence }
})

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

const wrappers: VueWrapper[] = []
function render(fn: () => VNodeChild) {
  const wrapper = mount(defineComponent({ setup: () => fn }), { attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
})

async function flush() {
  await nextTick()
  await nextTick()
}
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function $(selector: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) throw new Error(`No element for ${selector}`)
  return el
}
const exists = (selector: string) => document.querySelector(selector) !== null

function pointerDown(el: Element) {
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, composed: true }))
}
function press(el: Element) {
  pointerDown(el)
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
}
function key(name: string, init: KeyboardEventInit = {}, target?: Element | null) {
  const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init })
  ;(target ?? document.activeElement ?? document.body).dispatchEvent(event)
  return event
}

/** z-index of the nearest ancestor that sets one inline: the overlay surface the node is in. */
function zOf(el: Element): number {
  let node: HTMLElement | null = el as HTMLElement
  while (node && !node.style?.zIndex) node = node.parentElement
  if (!node) throw new Error('No z-index above the element')
  return Number(node.style.zIndex)
}

function model(state: Ref<any>) {
  return {
    modelValue: state.value,
    'onUpdate:modelValue': (v: unknown) => {
      state.value = v
    },
  }
}

describe('layer stack', () => {
  it('stacks by open order and resets once every layer closes', () => {
    const scope = effectScope()
    const a = ref(false)
    const b = ref(false)
    const layers = scope.run(() => ({ a: useLayer(a), b: useLayer(b), tip: useLayer(a, { tooltip: true }) }))!

    b.value = true
    a.value = true
    expect(layers.b.zIndex.value).toBe(LAYER_BASE_Z_INDEX + 1)
    expect(layers.a.zIndex.value).toBe(LAYER_BASE_Z_INDEX + 3)
    expect(layers.a.backdropZIndex.value).toBeGreaterThan(layers.b.zIndex.value)
    expect(layers.a.isTop.value).toBe(true)
    expect(layers.tip.zIndex.value).toBe(TOOLTIP_Z_INDEX)

    a.value = false
    expect(layers.b.isTop.value).toBe(true)
    a.value = true
    expect(layers.a.zIndex.value).toBe(LAYER_BASE_Z_INDEX + 3)

    a.value = false
    b.value = false
    a.value = true
    expect(layers.a.zIndex.value).toBe(LAYER_BASE_Z_INDEX + 1)
    scope.stop()
    expect(layers.a.isTop.value).toBe(false)
  })
})

describe('stacking order', () => {
  it('puts a drawer opened later above one mounted later, whatever the mount order', async () => {
    // The layout mounts the file viewer first; the page's drawer mounts after it and opens it.
    const viewer = ref(false)
    const main = ref(false)
    render(() => [
      h(ODrawer, { ...model(viewer), class: 'viewer-panel' }, () => h('p', 'File')),
      h(ODrawer, { ...model(main), class: 'main-panel' }, () =>
        h('button', { class: 'open-viewer', onClick: () => (viewer.value = true) }, 'View file'),
      ),
    ])

    main.value = true
    await flush()
    $('.open-viewer').click()
    await flush()

    const viewerWrap = $('.viewer-panel').parentElement!
    const mainWrap = $('.main-panel').parentElement!
    expect(mainWrap.compareDocumentPosition(viewerWrap) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    expect(zOf(viewerWrap)).toBeGreaterThan(zOf(mainWrap))
    expect(zOf(viewerWrap.previousElementSibling!)).toBeGreaterThan(zOf(mainWrap))
    expect(zOf(viewerWrap.previousElementSibling!)).toBeLessThan(zOf(viewerWrap))

    viewer.value = false
    main.value = false
    await flush()
    viewer.value = true
    await flush()
    main.value = true
    await flush()
    expect(zOf($('.main-panel'))).toBeGreaterThan(zOf($('.viewer-panel')))
  })

  it('puts a field list opened in a dialog above the dialog, and tooltips above both', async () => {
    const open = ref(true)
    const value = ref('')
    render(() => [
      h(ODialog, model(open), () => h(OSelect, { ...model(value), options, label: 'Status' })),
      h(OTooltip, { content: 'Help', delay: 0 }, () => h('button', { class: 'help' }, '?')),
    ])
    await flush()

    $('[role="combobox"]').click()
    await flush()
    const dialogZ = zOf($('[role="dialog"]'))
    const listZ = zOf($('[role="listbox"]'))
    expect(listZ).toBeGreaterThan(dialogZ)

    $('.help').parentElement!.dispatchEvent(new MouseEvent('mouseenter'))
    await wait(5)
    await flush()
    expect(zOf($('[role="tooltip"]'))).toBe(TOOLTIP_Z_INDEX)
    expect(TOOLTIP_Z_INDEX).toBeGreaterThan(listZ)
  })
})

describe('Escape', () => {
  it('closes a dialog opened from a drawer first, then the drawer', async () => {
    const drawer = ref(true)
    const dialog = ref(false)
    render(() => [
      h(ODrawer, model(drawer), () =>
        h('button', { class: 'delete', onClick: () => (dialog.value = true) }, 'Delete'),
      ),
      h(ODialog, model(dialog), () => h('button', { class: 'confirm' }, 'Confirm')),
    ])
    await flush()
    await frame()

    const opener = $('.delete')
    opener.focus()
    opener.click()
    await flush()
    await frame()
    expect(document.activeElement).toBe($('.confirm'))

    key('Escape')
    await flush()
    expect(dialog.value).toBe(false)
    expect(drawer.value).toBe(true)
    expect(document.activeElement).toBe(opener)

    key('Escape')
    await flush()
    expect(drawer.value).toBe(false)
  })

  it('closes an open list before the dialog it is in', async () => {
    const open = ref(true)
    const value = ref('')
    render(() => h(ODialog, model(open), () => h(OSelect, { ...model(value), options })))
    await flush()

    $('[role="combobox"]').click()
    await flush()
    expect(exists('[role="listbox"]')).toBe(true)

    key('Escape')
    await flush()
    expect(exists('[role="listbox"]')).toBe(false)
    expect(open.value).toBe(true)

    key('Escape')
    await flush()
    expect(open.value).toBe(false)
  })

  it('leaves the layer open when a widget inside it stops Escape', async () => {
    const open = ref(true)
    render(() =>
      h(ODialog, model(open), () =>
        h('input', {
          class: 'combo',
          onKeydown: (e: KeyboardEvent) => e.key === 'Escape' && e.stopPropagation(),
        }),
      ),
    )
    await flush()

    key('Escape', {}, $('.combo'))
    await flush()
    expect(open.value).toBe(true)

    key('Escape', {}, document.body)
    await flush()
    expect(open.value).toBe(false)
  })

  it('reaches an enabled useEscapeKey only while it is the top-most layer', async () => {
    const handler = vi.fn()
    const open = ref(false)
    const Listener = defineComponent({
      setup() {
        useEscapeKey({ handler, enabled: ref(true) })
        return () => null
      },
    })
    render(() => [h(Listener), h(ODialog, model(open), () => 'Body')])
    await flush()

    open.value = true
    await flush()
    key('Escape', {}, document.body)
    await flush()
    expect(open.value).toBe(false)
    expect(handler).not.toHaveBeenCalled()

    key('Escape', {}, document.body)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('outside presses', () => {
  function renderPopover(content: () => VNodeChild) {
    render(() =>
      h(OPopover, { class: 'filters-panel' }, {
        trigger: () => h('button', { class: 'filters' }, 'Filters'),
        default: content,
      }),
    )
  }

  it('keeps a popover open when an option of a select inside it is picked', async () => {
    const value = ref('')
    renderPopover(() => h(OSelect, { ...model(value), options }))
    $('.filters').click()
    await flush()
    $('[role="combobox"]').click()
    await flush()

    press(document.querySelectorAll('[role="option"]')[1])
    await flush()
    expect(value.value).toBe('b')
    expect(exists('[role="listbox"]')).toBe(false)
    expect(exists('.filters-panel')).toBe(true)

    pointerDown(document.body)
    await flush()
    expect(exists('.filters-panel')).toBe(false)
  })

  it('keeps a popover open when an autocomplete option inside it is picked', async () => {
    const value = ref('')
    renderPopover(() => h(OAutocomplete, { ...model(value), options }))
    $('.filters').click()
    await flush()
    $('.filters-panel input').focus()
    await flush()

    press(document.querySelectorAll('[role="option"]')[0])
    await flush()
    expect(value.value).toBe('a')
    expect(exists('.filters-panel')).toBe(true)
  })

  it('keeps a popover open while its date picker calendar is used', async () => {
    const value = ref(null)
    renderPopover(() => h(ODatePicker, { ...model(value), label: 'Since' }))
    $('.filters').click()
    await flush()
    $('.filters-panel [aria-haspopup="dialog"]').click()
    await flush()

    const calendar = $('[role="dialog"][aria-modal="true"]')
    press(calendar.querySelector('button')!)
    await flush()
    expect(exists('[role="dialog"][aria-modal="true"]')).toBe(true)
    expect(exists('.filters-panel')).toBe(true)
  })

  it('keeps a dialog open when a press starts in a list above it', async () => {
    const open = ref(true)
    const value = ref('')
    render(() => h(ODialog, model(open), () => h(OSelect, { ...model(value), options })))
    await flush()
    $('[role="combobox"]').click()
    await flush()

    const container = $('[role="dialog"]').parentElement!.parentElement!
    pointerDown(document.querySelectorAll('[role="option"]')[0])
    container.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    expect(open.value).toBe(true)

    press(container)
    await flush()
    expect(open.value).toBe(false)
  })

  it('keeps a drawer open when a press starts in a list above it', async () => {
    const open = ref(true)
    const value = ref('')
    render(() => h(ODrawer, { ...model(open), class: 'drawer-panel' }, () => h(OSelect, { ...model(value), options })))
    await flush()
    $('[role="combobox"]').click()
    await flush()

    const backdrop = $('.drawer-panel').parentElement!.previousElementSibling!
    pointerDown(document.querySelectorAll('[role="option"]')[0])
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    expect(open.value).toBe(true)

    press(backdrop)
    await flush()
    expect(open.value).toBe(false)
  })

  it('keeps a dropdown open on a press inside its submenu', async () => {
    render(() =>
      h(ODropdown, null, () => [
        h(ODropdownTrigger, null, () => h('button', { class: 'more' }, 'More')),
        h(ODropdownPopover, null, () =>
          h(ODropdownMenu, null, () => [
            h(ODropdownItem, { id: 'edit' }, () => 'Edit'),
            h(ODropdownSubmenuTrigger, null, {
              trigger: () => h('span', { class: 'move' }, 'Move to'),
              popover: () => h('ul', { class: 'folders' }, [h('li', 'Inbox')]),
            }),
          ]),
        ),
      ]),
    )
    $('.more').click()
    await flush()
    $('.move').parentElement!.dispatchEvent(new MouseEvent('mouseenter'))
    await wait(120)
    await flush()

    pointerDown($('.folders li'))
    await flush()
    expect(exists('[role="menu"]')).toBe(true)
    expect(zOf($('.folders'))).toBeGreaterThan(zOf($('[role="menu"]')))

    key('Escape', {}, document.body)
    await flush()
    expect(exists('.folders')).toBe(false)
    expect(exists('[role="menu"]')).toBe(true)

    pointerDown(document.body)
    await flush()
    expect(exists('[role="menu"]')).toBe(false)
  })
})

describe('focus', () => {
  it('returns focus to the popover trigger in a dialog when the popover closes', async () => {
    const open = ref(true)
    render(() =>
      h(ODialog, model(open), () =>
        h(OPopover, { class: 'filters-panel' }, {
          trigger: () => h('button', { class: 'filters' }, 'Filters'),
          default: () => h('button', { class: 'apply' }, 'Apply'),
        }),
      ),
    )
    await flush()
    await frame()

    const trigger = $('.filters')
    trigger.focus()
    trigger.click()
    await flush()
    $('.apply').focus()

    key('Escape')
    await flush()
    expect(exists('.filters-panel')).toBe(false)
    expect(open.value).toBe(true)
    expect(document.activeElement).toBe(trigger)
  })

  it('cycles Tab through a dialog and the popover opened in it', async () => {
    const open = ref(true)
    render(() =>
      h(ODialog, { ...model(open), hideCloseButton: true }, () => [
        h('button', { class: 'first' }, 'First'),
        h(OPopover, { class: 'filters-panel' }, {
          trigger: () => h('button', { class: 'filters' }, 'Filters'),
          default: () => [h('button', { class: 'p1' }, 'One'), h('button', { class: 'p2' }, 'Two')],
        }),
      ]),
    )
    await flush()
    await frame()
    $('.filters').click()
    await flush()

    $('.filters').focus()
    expect(key('Tab').defaultPrevented).toBe(true)
    expect(document.activeElement).toBe($('.p1'))

    $('.p2').focus()
    key('Tab')
    expect(document.activeElement).toBe($('.first'))

    key('Tab', { shiftKey: true })
    expect(document.activeElement).toBe($('.p2'))

    $('.p1').focus()
    expect(key('Tab').defaultPrevented).toBe(false)

    $('.p1').blur()
    key('Tab', {}, document.body)
    expect(document.activeElement).toBe($('.first'))
  })

  it("pauses a drawer's trap while a dialog above it has focus", async () => {
    const drawer = ref(true)
    const dialog = ref(true)
    render(() => [
      h(ODrawer, model(drawer), () => h('button', { class: 'in-drawer' }, 'Drawer')),
      h(ODialog, { ...model(dialog), hideCloseButton: true }, () => [
        h('button', { class: 'd1' }, 'One'),
        h('button', { class: 'd2' }, 'Two'),
      ]),
    ])
    await flush()
    await frame()

    $('.d2').focus()
    key('Tab')
    expect(document.activeElement).toBe($('.d1'))
  })
})

describe('scroll lock', () => {
  it('stays locked until the last overlay closes, in any order', async () => {
    const drawer = ref(true)
    const inner = ref(false)
    const dialog = ref(false)
    render(() => [
      // The closed dialog mounts inside the open drawer and must not unlock the page.
      h(ODrawer, model(drawer), () => h(ODialog, model(inner), () => 'Inner')),
      h(ODialog, model(dialog), () => 'Outer'),
    ])
    await flush()
    expect(document.body.style.overflow).toBe('hidden')

    dialog.value = true
    await flush()
    drawer.value = false
    await flush()
    expect(document.body.style.overflow).toBe('hidden')

    dialog.value = false
    await flush()
    expect(document.body.style.overflow).toBe('')
  })
})
