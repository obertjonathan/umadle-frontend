import { useEffect, useState } from "react"
import type { Uma } from "../data/types"
import { UMAS } from "../data/umas"
import { dailyUma, todayKey } from "../game/daily"
import { fetchDaily, fetchRoster } from "../api/umas"

export type GameData =
  | { status: "loading" }
  | {
      status: "ready"
      source: "online" | "offline"
      umas: Uma[]
      dayKey: string
      target: Uma
    }

// Local roster + local daily pick, used when the backend can't be reached.
function offlineData(): GameData {
  const dayKey = todayKey()
  return { status: "ready", source: "offline", umas: UMAS, dayKey, target: dailyUma(UMAS, dayKey) }
}

// Loads the roster and today's answer from the backend, falling back to
// the bundled umas.ts if either request fails.
export function useGameData(): GameData {
  const [data, setData] = useState<GameData>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchRoster(), fetchDaily()])
      .then(([umas, daily]): GameData => {
        const target = umas.find((u) => u.id === daily.answerId)
        if (!target) throw new Error(`Daily answer "${daily.answerId}" not in roster`)
        return { status: "ready", source: "online", umas, dayKey: daily.dayKey, target }
      })
      .catch((err: unknown) => {
        console.warn("Backend unavailable, using offline roster:", err)
        return offlineData()
      })
      .then((result) => {
        if (!cancelled) setData(result)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return data
}
