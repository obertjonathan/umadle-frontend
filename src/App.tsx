import { useEffect, useState } from "react"
import { UMAS } from "./data/umas"
import { STAT_KEYS } from "./data/types"
import type { Uma } from "./data/types"
import { compareGuess } from "./game/compare"
import { dailyUma, todayKey } from "./game/daily"
import { loadGuessIds, saveGuessIds } from "./game/storage"
import { GuessRow } from "./components/GuessRow"
import { GameResult } from "./components/GameResult"

const MAX_GUESSES = 6

function App() {
  const dayKey = todayKey()
  const target = dailyUma(UMAS, dayKey)

  const [query, setQuery] = useState("")

  // Lazy initializer: on first render, rebuild the guess list from any ids
  // saved in localStorage for today.
  const [guesses, setGuesses] = useState<Uma[]>(() => {
    return loadGuessIds(dayKey)
      .map((id) => UMAS.find((u) => u.id === id))
      .filter((u): u is Uma => u !== undefined)
  })

  useEffect(() => {
    saveGuessIds(
      dayKey,
      guesses.map((g) => g.id),
    )
  }, [guesses, dayKey]) // the dependency array: re-run only when these change

  // --- Derived game state ---
  const feedbacks = guesses.map((uma) => compareGuess(uma, target))
  const hasWon = feedbacks.some((f) => f.isWin)
  const outOfGuesses = guesses.length >= MAX_GUESSES
  const status: "playing" | "won" | "lost" = hasWon
    ? "won"
    : outOfGuesses
      ? "lost"
      : "playing"

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status !== "playing") return
    const match = UMAS.find(
      (uma) => uma.name.toLowerCase() === query.trim().toLowerCase(),
    )
    if (!match) return
    if (guesses.some((g) => g.id === match.id)) return
    setGuesses([...guesses, match])
    setQuery("")
  }

  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => feedbacks[i])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-4xl font-bold tracking-tight text-white">🐎 Umadle</h1>
      <p className="text-center text-neutral-400">
        Guess today's uma by her three sizes (B / W / H) + height.
      </p>

      {status === "playing" && (
        <p className="text-sm text-neutral-500">
          Guess {guesses.length + 1} of {MAX_GUESSES}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <div className="w-40 text-left">Uma</div>
        {STAT_KEYS.map((k) => (
          <div key={k} className="w-16 text-center uppercase">{k}</div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((feedback, i) => (
          <GuessRow key={i} feedback={feedback} />
        ))}
      </div>

      {status === "playing" ? (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            list="uma-names"
            placeholder="Type an uma name…"
            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-neutral-500"
          />
          <datalist id="uma-names">
            {UMAS.map((uma) => (
              <option key={uma.id} value={uma.name} />
            ))}
          </datalist>
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
          >
            Guess
          </button>
        </form>
      ) : (
        <GameResult status={status} target={target} />
      )}
    </main>
  )
}

export default App
