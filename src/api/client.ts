// Thin fetch wrapper for umadle-backend.

const BASE_URL = import.meta.env.UMADLE_BACKEND_API_BASE_URL ?? ""

// Give up quickly so the offline fallback kicks in instead of a long hang.
const TIMEOUT_MS = 4000

export async function apiGet<T>(path: string): Promise<T> {
  if (!BASE_URL) throw new Error("UMADLE_BACKEND_API_BASE_URL is not set")

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(BASE_URL + path, { signal: controller.signal })
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}
