import { STAT_KEYS } from "../data/types"
import type { Uma, StatKey } from "../data/types"

// How many cm counts as "close" (🟨) rather than "far".
const CLOSE_WITHIN = 3

// The feedback for ONE stat cell.
export type Hint = {
  value: number // the guessed uma's number for this stat
  status: "exact" | "close" | "far" // color: green / yellow / gray
  direction: "up" | "down" | "none" // arrow: is the TARGET higher/lower?
}

// The feedback for a whole guess: one Hint per stat + whether it's a win.
export type GuessFeedback = {
  uma: Uma
  hints: Record<StatKey, Hint> // { bust: Hint, waist: Hint, ... }
  isWin: boolean
}

// Compare one stat value against the target's.
function compareStat(guessValue: number, targetValue: number): Hint {
  const diff = targetValue - guessValue // >0 means target is higher

  if (diff === 0) {
    return { value: guessValue, status: "exact", direction: "none" }
  }

  const status = Math.abs(diff) <= CLOSE_WITHIN ? "close" : "far"
  const direction = diff > 0 ? "up" : "down"
  return { value: guessValue, status, direction }
}

// Given a guess and the secret target, produce feedback for every stat. This is what the UI calls for each guessed uma.
export function compareGuess(guess: Uma, target: Uma): GuessFeedback {
  // Build the hints object by looping over our single source of truth.
  const hints = {} as Record<StatKey, Hint>
  for (const key of STAT_KEYS) {
    hints[key] = compareStat(guess[key], target[key])
  }

  // Win condition = every stat is exact. `.every` returns true only if all pass.
  const isWin = STAT_KEYS.every((key) => hints[key].status === "exact")

  return { uma: guess, hints, isWin }
}

// Pick a random uma to be the answer.
export function pickRandomUma(umas: Uma[]): Uma {
  const index = Math.floor(Math.random() * umas.length)
  return umas[index]
}
