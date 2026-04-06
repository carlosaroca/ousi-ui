/** Root wrapper. */
export const disclosureTheme = 'relative w-full'

/** Heading row wrapping the trigger button. */
export const disclosureHeadingTheme = 'flex w-full'

/** Trigger button. */
export const disclosureTriggerTheme = [
  'flex w-full items-center gap-3 py-3',
  'cursor-pointer select-none outline-none',
  'focus-visible:ring-2 focus-visible:ring-ousi-focus focus-visible:ring-inset',
  'disabled:opacity-[--ousi-disabled-opacity] disabled:pointer-events-none',
  'transition-colors duration-150 motion-reduce:transition-none',
].join(' ')

/** Chevron indicator — rotates when expanded. */
export function disclosureIndicatorTheme(isExpanded: boolean): string {
  return [
    'ml-auto size-4 shrink-0 text-ousi-muted',
    'transition-transform duration-250 motion-reduce:transition-none',
    isExpanded ? '-rotate-180' : 'rotate-0',
  ].join(' ')
}

/** Content panel — height + opacity animated via inline styles. */
export const disclosureContentTheme = 'overflow-clip motion-reduce:transition-none'

/** Inner body with padding. */
export const disclosureBodyTheme = 'pb-3'

/** Group wrapper. */
export const disclosureGroupTheme = 'w-full'
