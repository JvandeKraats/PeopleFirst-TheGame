export function getFallbackAvatarUrl() {
  return new URL('fallback-photos/fallback-avatar.png', import.meta.env.BASE_URL).href
}

// Matches the original TheGame.vue `_sanitizeUrl` behavior.
export function sanitizeUrl(value) {
  const s = (value ?? '').toString().trim()
  const lower = s.toLowerCase()
  const lowerNoLeadingSlash = lower.replace(/^\/+/, '')
  if (!s || lower === 'undefined' || lower === 'null') return ''
  if (lowerNoLeadingSlash === 'undefined' || lowerNoLeadingSlash === 'null') return ''
  return s
}

export function applyFallbackOnError(event, fallbackUrl) {
  if (event?.target) event.target.src = fallbackUrl
}
