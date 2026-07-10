// Entity of the game
export type Uma = {
  id: string      // unique key, like primary key
  name: string
  bust: number    // B, in cm
  waist: number   // W, in cm
  hip: number     // H, in cm
  height: number  // in cm
  image?: string
}

// The four numeric fields the player actually guesses against.
export const STAT_KEYS = ["bust", "waist", "hip", "height"] as const

// StatKey = "bust" | "waist" | "hip" | "height".
export type StatKey = (typeof STAT_KEYS)[number]
