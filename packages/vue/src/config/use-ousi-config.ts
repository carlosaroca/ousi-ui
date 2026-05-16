import { ref, type Ref } from 'vue'

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Global Ousi UI configuration. Drives locale-aware behavior across date/time
 * components and other i18n-sensitive widgets. Singleton — module-level state,
 * shared across the entire app.
 *
 * Usage:
 *
 *   const config = useOusiConfig()
 *   config.locale.value = 'es-ES'   // reactive: all date pickers re-render
 *
 * Or set the initial values via the plugin install:
 *
 *   app.use(OusiUIPlugin, { locale: 'es-ES', hour12: false })
 *
 * Per-component `locale` props still override this config.
 */
export interface OusiConfig {
  /** BCP 47 locale tag — drives date/time format, AM/PM labels, weekday names. */
  locale: Ref<string>
  /** Explicit override for 12-hour clock. When undefined, inferred from locale. */
  hour12: Ref<boolean | undefined>
  /** First day of the week. 0 = Sunday, 1 = Monday. When undefined, inferred from locale. */
  firstDayOfWeek: Ref<WeekDay | undefined>
  /** Text direction. Defaults to 'ltr'. */
  dir: Ref<'ltr' | 'rtl'>
}

export interface OusiConfigInit {
  locale?: string
  hour12?: boolean
  firstDayOfWeek?: WeekDay
  dir?: 'ltr' | 'rtl'
}

// Singleton — lives at the module level. One config per app instance.
const config: OusiConfig = {
  locale: ref('en-US'),
  hour12: ref(undefined),
  firstDayOfWeek: ref(undefined),
  dir: ref('ltr'),
}

/**
 * Access the global Ousi UI config. Returns refs that you can read or write
 * directly — changes propagate reactively to all components consuming them.
 */
export function useOusiConfig(): OusiConfig {
  return config
}

/**
 * Internal — applies initial values from the plugin install hook.
 * Public consumers should write via `useOusiConfig()` instead.
 */
export function applyOusiConfig(init: OusiConfigInit): void {
  if (init.locale !== undefined) config.locale.value = init.locale
  if (init.hour12 !== undefined) config.hour12.value = init.hour12
  if (init.firstDayOfWeek !== undefined) config.firstDayOfWeek.value = init.firstDayOfWeek
  if (init.dir !== undefined) config.dir.value = init.dir
}

// Regions that start their week on Sunday or Saturday.
// Source: Unicode CLDR. Everywhere else defaults to Monday (ISO 8601).
const WEEK_SUNDAY_REGIONS = new Set([
  'US', 'CA', 'AU', 'NZ', 'JP', 'PH', 'BR', 'MX', 'IL', 'TH', 'IN', 'CN', 'TW', 'HK', 'KR', 'ZA',
])
const WEEK_SATURDAY_REGIONS = new Set([
  'SA', 'AE', 'EG', 'IQ', 'IR', 'OM', 'QA', 'YE', 'BH', 'KW', 'LY',
])

/**
 * Derive the first day of the week from a BCP 47 locale tag. Uses the
 * experimental `Intl.Locale#getWeekInfo()` when available (Chromium-based
 * browsers), falling back to a CLDR-derived region map otherwise.
 */
export function getFirstDayOfWeekForLocale(locale: string): WeekDay {
  try {
    const loc: any = new Intl.Locale(locale)
    const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo
    if (info && typeof info.firstDay === 'number') {
      // ISO firstDay: 1=Mon..7=Sun. JS: 0=Sun..6=Sat. Map 7 → 0.
      return ((info.firstDay === 7 ? 0 : info.firstDay) as WeekDay)
    }
  } catch {
    /* fall through */
  }

  try {
    const region = new Intl.Locale(locale).region?.toUpperCase()
    if (region && WEEK_SATURDAY_REGIONS.has(region)) return 6
    if (region && WEEK_SUNDAY_REGIONS.has(region)) return 0
  } catch {
    /* fall through */
  }
  return 1 // Monday — ISO 8601 default
}

/**
 * Derive `hour12` for a locale via Intl. Returns the locale's natural choice
 * unless the config explicitly overrides it.
 */
export function getHour12ForLocale(locale: string): boolean {
  try {
    const opts = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions()
    return opts.hour12 ?? false
  } catch {
    return false
  }
}
