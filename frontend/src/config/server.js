/** Public Socket.io / API origin from Vite env (no trailing slash). */
function trimOrigin(value) {
  return String(value).replace(/\/$/, '')
}

/** Socket server URL. Falls back to same-origin (dev proxy or misconfigured prod). */
export function getSocketUrl() {
  const fromEnv = import.meta.env.VITE_SOCKET_URL
  if (fromEnv) return trimOrigin(fromEnv)
  return typeof window !== 'undefined' ? window.location.origin : ''
}

/**
 * REST API base. Prefer VITE_API_URL; otherwise reuse VITE_SOCKET_URL.
 * Empty string keeps relative `/api/...` paths (Vite dev proxy).
 */
export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL
  if (fromEnv) return trimOrigin(fromEnv)
  return ''
}

/** Build an absolute or relative API URL. */
export function apiUrl(path) {
  const base = getApiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

/** True when a production build has no VITE_SOCKET_URL (Vercel SPA alone). */
export function needsRemoteBackend() {
  return Boolean(import.meta.env.PROD && !import.meta.env.VITE_SOCKET_URL)
}

/** True when the client was built with an explicit remote socket URL. */
export function hasRemoteSocketUrl() {
  return Boolean(import.meta.env.VITE_SOCKET_URL)
}
