// Retry-After can be a number of seconds or an HTTP date.
export function retryAfterSeconds(value: string | null, now = Date.now()): number {
  if (!value?.trim()) return 30;
  const seconds = /^\d+(?:\.\d+)?$/.test(value.trim())
    ? Number(value)
    : (Date.parse(value) - now) / 1000;
  return Number.isFinite(seconds) ? Math.max(1, Math.min(86400, Math.ceil(seconds))) : 30;
}
