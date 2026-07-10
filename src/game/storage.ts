// Save only the guessed uma IDS + which day they belong to

const STORAGE_KEY = "umadle:v1"

type SavedGame = {
  dayKey: string // the todayKey() this game belongs to
  guessIds: string[] // ordered ids the player guessed
}

// Load the guessed ids for a given day. Returns [] if there's nothing saved,
// or if the saved game is from a different day (yesterday's is stale).
export function loadGuessIds(dayKey: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const saved = JSON.parse(raw) as SavedGame
    return saved.dayKey === dayKey ? saved.guessIds : []
  } catch {
    return []
  }
}

// Persist the current guesses for today.
export function saveGuessIds(dayKey: string, guessIds: string[]): void {
  try {
    const data: SavedGame = { dayKey, guessIds }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or disabled — ignore
  }
}
