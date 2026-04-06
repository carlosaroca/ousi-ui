import { isBrowser } from './dom'

export function isMac(): boolean {
  if (!isBrowser()) return false
  return navigator.platform.toLowerCase().includes('mac') ||
    navigator.userAgent.toLowerCase().includes('mac')
}

export function isIOS(): boolean {
  if (!isBrowser()) return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function isAndroid(): boolean {
  if (!isBrowser()) return false
  return /Android/.test(navigator.userAgent)
}

export function isMobile(): boolean {
  return isIOS() || isAndroid()
}

export function isTouch(): boolean {
  if (!isBrowser()) return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
