/**
 * Parse CORS_ORIGIN for Express and Socket.io.
 * Supports a single origin, comma-separated list, or unset (reflect request).
 */
export function parseCorsOrigin(value = process.env.CORS_ORIGIN) {
  if (value == null || value === '' || value === '*') return true
  const list = value.split(',').map(s => s.trim()).filter(Boolean)
  if (list.length === 0) return true
  if (list.length === 1) return list[0]
  return list
}
