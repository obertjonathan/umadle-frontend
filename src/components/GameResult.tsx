import { STAT_KEYS } from "../data/types"
import type { Uma } from "../data/types"
import { umaImageUrl } from "../data/umaImage"

// Note `onPlayAgain: () => void` — a FUNCTION passed in as a prop. This is
// how a child talks back UP to its parent: the parent owns the reset logic
// and hands it down; the button just calls it.
type GameResultProps = {
  status: "won" | "lost"
  target: Uma
  onPlayAgain: () => void
}

export function GameResult({ status, target, onPlayAgain }: GameResultProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-900 p-6">
      <p
        className={`text-lg font-semibold ${
          status === "won" ? "text-green-400" : "text-red-400"
        }`}
      >
        {status === "won" ? "🎉 GGWP!" : "😭 Out of guesses!"}
      </p>

      {/* Reveal portrait — stacked with the name below it. */}
      <img
        src={umaImageUrl(target)}
        alt={target.name}
        className="h-28 w-28 rounded-full bg-neutral-800 object-cover"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden"
        }}
      />
      <p className="text-xl font-bold text-white">{target.name}</p>

      <div className="flex gap-4 text-sm text-neutral-300">
        {STAT_KEYS.map((k) => (
          <span key={k}>
            <span className="text-neutral-500 uppercase">{k}</span> {target[k]}
          </span>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="mt-2 rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
      >
        Play again
      </button>
    </div>
  )
}
