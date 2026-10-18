import type { Uma } from "../data/types"
import { apiGet } from "./client"

// The backend sends `image: null` when there's no portrait; our type uses undefined.
type UmaDto = Omit<Uma, "image"> & { image?: string | null }

export type DailyDto = {
  dayKey: string // server's UTC date, "YYYY-MM-DD"
  answerId: string
}

export async function fetchRoster(): Promise<Uma[]> {
  const rows = await apiGet<UmaDto[]>("/v1/uma")
  return rows.map(({ image, ...rest }) => (image ? { ...rest, image } : rest))
}

export function fetchDaily(): Promise<DailyDto> {
  return apiGet<DailyDto>("/v1/daily/uma")
}
