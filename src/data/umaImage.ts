import type { Uma } from "./types"

// Uma images, static, todo next
export function umaImageUrl(uma: Uma): string {
  // If the dataset row provides an explicit URL (e.g. a CDN link), use it.
  // Otherwise fall back to a local file in public/umas/ named by id.
  return uma.image ?? `/umas/${uma.id}.png`
}
