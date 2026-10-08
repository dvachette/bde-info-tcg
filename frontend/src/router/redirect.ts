import type { LocationQueryValue } from 'vue-router'

const DEFAULT_REDIRECT = '/home'

export function resolveRedirect(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string {
  if (typeof value !== 'string') {
    return DEFAULT_REDIRECT
  }
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return DEFAULT_REDIRECT
  }
  return value
}
