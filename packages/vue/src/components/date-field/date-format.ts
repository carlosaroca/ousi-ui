import type { DateFieldValue, Segment } from './date-field.types'

// Supported tokens (longest-first to satisfy alternation):
//   YYYY  → 4-digit year             YY → 2-digit year (parses as 2000 + n)
//   MM    → 2-digit month (padded)   M  → 1–2 digit month
//   DD    → 2-digit day (padded)     D  → 1–2 digit day
// Anything else is a literal (separator, space, slash, etc.).
const TOKEN_MATCH = /^(YYYY|YY|MM|M|DD|D)/

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function formatDateValue(value: DateFieldValue, pattern: string): string {
  return pattern.replace(/YYYY|YY|MM|M|DD|D/g, (token) => {
    switch (token) {
      case 'YYYY': return String(value.year).padStart(4, '0')
      case 'YY': return String(value.year % 100).padStart(2, '0')
      case 'MM': return String(value.month).padStart(2, '0')
      case 'M': return String(value.month)
      case 'DD': return String(value.day).padStart(2, '0')
      case 'D': return String(value.day)
      default: return token
    }
  })
}

export function parseDateValue(input: string, pattern: string): DateFieldValue | null {
  let regex = '^'
  let i = 0
  while (i < pattern.length) {
    const m = pattern.slice(i).match(TOKEN_MATCH)
    if (m) {
      const token = m[0]
      if (token === 'YYYY') regex += '(?<year>\\d{4})'
      else if (token === 'YY') regex += '(?<year2>\\d{2})'
      else if (token === 'MM') regex += '(?<month>\\d{2})'
      else if (token === 'M') regex += '(?<month>\\d{1,2})'
      else if (token === 'DD') regex += '(?<day>\\d{2})'
      else if (token === 'D') regex += '(?<day>\\d{1,2})'
      i += token.length
    } else {
      regex += escapeRegex(pattern[i])
      i += 1
    }
  }
  regex += '$'

  let match: RegExpMatchArray | null
  try {
    match = input.match(new RegExp(regex))
  } catch {
    return null
  }
  if (!match?.groups) return null

  const year = match.groups.year != null
    ? parseInt(match.groups.year, 10)
    : match.groups.year2 != null
      ? 2000 + parseInt(match.groups.year2, 10)
      : NaN
  const month = match.groups.month != null ? parseInt(match.groups.month, 10) : NaN
  const day = match.groups.day != null ? parseInt(match.groups.day, 10) : NaN

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return { year, month, day }
}

export interface SegmentPlaceholders {
  year: string
  month: string
  day: string
}

const DEFAULT_PLACEHOLDERS: SegmentPlaceholders = { year: 'yyyy', month: 'mm', day: 'dd' }

/** Segments of a display pattern; placeholders come from the locale messages (`aaaa` in Spanish). */
export function patternToSegments(
  pattern: string,
  placeholders: SegmentPlaceholders = DEFAULT_PLACEHOLDERS,
): Segment[] {
  const segments: Segment[] = []
  let literalBuf = ''
  const flushLiteral = () => {
    if (literalBuf) {
      segments.push({ type: 'literal', text: literalBuf, placeholder: literalBuf })
      literalBuf = ''
    }
  }

  let i = 0
  while (i < pattern.length) {
    const m = pattern.slice(i).match(TOKEN_MATCH)
    if (m) {
      flushLiteral()
      const token = m[0]
      if (token[0] === 'Y') segments.push({ type: 'year', text: '', placeholder: placeholders.year, value: undefined })
      else if (token[0] === 'M') segments.push({ type: 'month', text: '', placeholder: placeholders.month, value: undefined })
      else segments.push({ type: 'day', text: '', placeholder: placeholders.day, value: undefined })
      i += token.length
    } else {
      literalBuf += pattern[i]
      i += 1
    }
  }
  flushLiteral()
  return segments
}
