/** Display without `formatOptions`: the locale's digits and decimal separator, no grouping, no rounding. */
const PLAIN: Intl.NumberFormatOptions = { useGrouping: false, maximumFractionDigits: 20 }

const NUMBER_PARTS = new Set(['integer', 'group', 'decimal', 'fraction', 'minusSign', 'plusSign'])
const MINUS = /[-−‒–﹣－]/

export interface NumberFormat {
  /** Text for a value; empty for null. */
  format: (value: number | null | undefined) => string
  /** Value for a text: null when it holds no digits yet, NaN when it can't be a number. */
  parse: (text: string) => number | null
  /** Whether a typed character can be part of a number in this locale. */
  accepts: (char: string) => boolean
  /** The format shows no decimals, so only whole numbers can be entered. */
  integerOnly: boolean
  decimal: string
  group: string
}

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  try {
    return new Intl.NumberFormat(locale, options)
  } catch {
    return new Intl.NumberFormat('en-US', options)
  }
}

/**
 * Formats and parses numbers for a locale. Parsing reads the locale's separators: the decimal
 * separator marks the decimals and group separators are dropped. A text with no decimal separator
 * and a single other separator ('.' or ',') reads it as a thousands separator when exactly three
 * digits follow one to three digits that don't start with 0, and as the decimal point otherwise,
 * so in es-CO "1.234" is 1234, "0.125" is 0.125, "12,5" and "12.5" are 12.5, and "1.234,5" is
 * 1234.5. Currency symbols, units and percent signs from the
 * format are ignored; a percent format divides by 100.
 */
export function createNumberFormat(locale: string, options?: Intl.NumberFormatOptions): NumberFormat {
  const formatter = numberFormat(locale, options ?? PLAIN)
  const resolved = formatter.resolvedOptions()
  const symbolOptions = { numberingSystem: resolved.numberingSystem } as Intl.NumberFormatOptions

  const symbols = numberFormat(resolved.locale, {
    ...symbolOptions,
    useGrouping: true,
    minimumFractionDigits: 1,
  }).formatToParts(1234567.5)
  const decimal = symbols.find((p) => p.type === 'decimal')?.value ?? '.'
  const group = symbols.find((p) => p.type === 'group')?.value ?? ','
  const groupIsSpace = !group.trim()

  const localDigits = [
    ...numberFormat(resolved.locale, { ...symbolOptions, useGrouping: false }).format(9876543210),
  ]
  const digitMap = new Map<string, string>()
  if (localDigits.length === 10) localDigits.forEach((d, i) => digitMap.set(d, String(9 - i)))

  const separators = new Set(['.', ',', decimal])
  if (!groupIsSpace) separators.add(group)

  const affixes = [
    ...new Set(
      [...formatter.formatToParts(-1234.5), ...formatter.formatToParts(1234.5)]
        .filter((p) => !NUMBER_PARTS.has(p.type))
        .map((p) => p.value.trim())
        .filter((v) => v && ![...v].every((c) => separators.has(c) || MINUS.test(c))),
    ),
  ].sort((a, b) => b.length - a.length)

  const percent = resolved.style === 'percent'
  const integerOnly = resolved.maximumFractionDigits === 0

  function toLatinDigits(text: string): string {
    if (!digitMap.size) return text
    let out = ''
    for (const c of text) out += digitMap.get(c) ?? c
    return out
  }

  function format(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return ''
    return formatter.format(Object.is(value, -0) ? 0 : value)
  }

  function parse(text: string): number | null {
    let s = text
    for (const affix of affixes) s = s.split(affix).join('')
    s = toLatinDigits(s)

    const firstDigit = s.search(/\d/)
    if (firstDigit === -1) return null
    const minusAt = s.search(MINUS)
    if (minusAt > firstDigit) return NaN
    const negative = minusAt !== -1 || (text.includes('(') && text.includes(')'))

    let body = ''
    for (const c of s) if (/\d/.test(c) || separators.has(c)) body += c

    let integer = body
    let fraction = ''
    const at = body.indexOf(decimal)
    if (at !== -1) {
      if (body.indexOf(decimal, at + 1) !== -1) return NaN
      integer = body.slice(0, at)
      fraction = body.slice(at + 1)
      if (/\D/.test(fraction)) return NaN
    } else {
      const others = body.match(/\D/g) ?? []
      if (others.length === 1) {
        const sep = body.search(/\D/)
        const after = body.slice(sep + 1)
        const thousands = after.length === 3 && /^[1-9]\d{0,2}$/.test(body.slice(0, sep))
        if (!thousands) {
          integer = body.slice(0, sep)
          fraction = after
        }
      }
    }
    integer = integer.replace(/\D/g, '')

    let value = Number(`${negative ? '-' : ''}${integer || '0'}.${fraction || '0'}`)
    if (percent) value = Number((value / 100).toPrecision(15))
    return Object.is(value, -0) ? 0 : value
  }

  function accepts(char: string): boolean {
    return /[\d\s]/.test(char) || MINUS.test(char) || separators.has(char) || digitMap.has(char)
  }

  return { format, parse, accepts, integerOnly, decimal, group }
}
