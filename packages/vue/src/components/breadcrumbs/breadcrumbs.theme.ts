export const breadcrumbsTheme = 'flex items-center'

export const breadcrumbItemTheme = 'flex shrink-0 items-center justify-center gap-0.5 px-0.5'

export function breadcrumbLinkTheme(isCurrent: boolean, isDisabled: boolean): string {
  const base = 'relative px-0.5 text-sm leading-5 font-medium no-underline'
  const state = isCurrent
    ? 'text-ousi-foreground cursor-default'
    : 'text-ousi-muted hover:underline cursor-pointer'
  const disabled = isDisabled
    ? 'opacity-50 pointer-events-none'
    : ''
  return [base, state, disabled].filter(Boolean).join(' ')
}

export const breadcrumbSeparatorTheme = 'size-3 text-ousi-muted select-none'
