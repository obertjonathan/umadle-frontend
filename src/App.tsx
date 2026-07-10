import { useState } from "react"
import { UMAS } from "./data/umas"
import { STAT_KEYS } from "./data/types"
import type { Uma } from "./data/types"
import { compareGuess, pickRandomUma } from "./game/compare"
import { GuessRow } from "./components/GuessRow"
import { GameResult } from "./components/GameResult"

const MAX_GUESSES = 6

function App() {
  const [query, setQuery] = useState("")
  const [guesses, setGuesses] = useState<Uma[]>([])
  // target now has a setter so "Play again" can pick a fresh answer.
  const [target, setTarget] = useState<Uma>(() => pickRandomUma(UMAS))

  // --- Derived game state (computed every render, never stored) ---
  const feedbacks = guesses.map((uma) => compareGuess(uma, target))
  const hasWon = feedbacks.some((f) => f.isWin)
  const outOfGuesses = guesses.length >= MAX_GUESSES
  // A single "status" value is easier to reason about than juggling booleans.
  const status: "playing" | "won" | "lost" = hasWon
    ? "won"
    : outOfGuesses
      ? "lost"
      : "playing"

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (status !== "playing") return // game's over — ignore input
    const match = UMAS.find(
      (uma) => uma.name.toLowerCase() === query.trim().toLowerCase(),
    )
    if (!match) return
    if (guesses.some((g) => g.id === match.id)) return
    setGuesses([...guesses, match])
    setQuery("")
  }

  // Reset everything and roll a new secret uma. Passed down to GameResult.
  function handlePlayAgain() {
    setGuesses([])
    setQuery("")
    setTarget(pickRandomUma(UMAS))
  }

  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => feedbacks[i])

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center gap-6 px-4 py-10">
      <h1 className="text-4xl font-bold tracking-tight text-white">🐎 Umadle</h1>
      <p className="text-center text-neutral-400">
        Guess the uma by her three sizes (B / W / H) + height.
      </p>

      {/* Guesses-left counter, only while the game is live. */}
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

      {/* While playing: show the input. When over: show the result card.
          A ternary (cond ? a : b) picks between two chunks of JSX. */}
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
        <GameResult
          status={status}
          target={target}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </main>
  )
}

export default App
