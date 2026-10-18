import { useEffect, useState } from "react"
import { STAT_KEYS } from "./data/types"
import type { Uma } from "./data/types"
import { compareGuess, pickRandomUma } from "./game/compare"
import { loadGuessIds, saveGuessIds } from "./game/storage"
import { GuessRow } from "./components/GuessRow"
import { GameResult } from "./components/GameResult"
import { useGameData } from "./hooks/useGameData"

const MAX_GUESSES = 6

// Testing switch (see .env.development): random target every round, nothing saved.
const PRACTICE_MODE = import.meta.env.UMADLE_PRACTICE_MODE === "true"

function App() {
  const data = useGameData()
  // Bumped by "Play again" in practice mode to start a fresh round.
  const [round, setRound] = useState(0)

  if (data.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center text-neutral-400">
        Loading…
      </main>
    )
  }

  // key: remount (resetting guesses) when the day or the practice round changes.
  return (
    <Game
      key={`${data.dayKey}-${round}`}
      umas={data.umas}
      dayKey={data.dayKey}
      dailyTarget={data.target}
      offline={data.source === "offline"}
      practice={PRACTICE_MODE}
      onPlayAgain={() => setRound((r) => r + 1)}
    />
  )
}

type GameProps = {
  umas: Uma[]
  dayKey: string
  dailyTarget: Uma
  offline: boolean
  practice: boolean
  onPlayAgain: () => void
}

function Game({ umas, dayKey, dailyTarget, offline, practice, onPlayAgain }: GameProps) {
  // Chosen once per mount; practice mode remounts (new key) for each new round.
  const [target] = useState(() => (practice ? pickRandomUma(umas) : dailyTarget))
  const [query, setQuery] = useState("")

  // Lazy initializer: on first render, rebuild the guess list from any ids
  // saved in localStorage for today. Practice rounds always start empty.
  const [guesses, setGuesses] = useState<Uma[]>(() => {
    if (practice) return []
    return loadGuessIds(dayKey)
      .map((id) => umas.find((u) => u.id === id))
      .filter((u): u is Uma => u !== undefined)
  })

  useEffect(() => {
    if (practice) return // don't overwrite the real daily save
    saveGuessIds(
      dayKey,
      guesses.map((g) => g.id),
    )
  }, [guesses, dayKey, practice]) // the dependency array: re-run only when these change

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
    const match = umas.find(
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
      {offline && (
        <p className="rounded border border-yellow-700/50 bg-yellow-900/20 px-3 py-1 text-xs text-yellow-300">
          Offline mode: limited roster
        </p>
      )}
      {practice && (
        <p className="rounded border border-sky-700/50 bg-sky-900/20 px-3 py-1 text-xs text-sky-300">
          Practice mode: random uma, progress not saved
        </p>
      )}
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
            {umas.map((uma) => (
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
        <GameResult status={status} target={target} onPlayAgain={practice ? onPlayAgain : undefined} />
      )}
    </main>
  )
}

export default App
