import type { Uma } from "../data/types"

// Day 0 of the game — an arbitrary launch date we count from.
const EPOCH_UTC = Date.UTC(2024, 0, 1) // 2024-01-01 (month is 0-based)
const DAY_MS = 24 * 60 * 60 * 1000

// Today's LOCAL calendar date as "YYYY-MM-DD". This string is the puzzle's
// identity — it's how we know "is this the same day as last time I played?".
export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function dailyUma(umas: Uma[], key: string = todayKey()): Uma {
  const [y, m, d] = key.split("-").map(Number)
  // How many whole days since EPOCH.
  const dayNumber = Math.floor((Date.UTC(y, m - 1, d) - EPOCH_UTC) / DAY_MS)
  // Wrap around the roster. The extra `+ length) % length` keeps it positive
  // even for dates before EPOCH.
  const index = ((dayNumber % umas.length) + umas.length) % umas.length
  return umas[index]
}
