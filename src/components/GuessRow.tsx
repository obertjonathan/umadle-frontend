import { STAT_KEYS } from "../data/types"
import { umaImageUrl } from "../data/umaImage"
import type { GuessFeedback } from "../game/compare"
import { Tile } from "./Tile"

// A row = the uma's avatar + name + one Tile per stat.
// feedback missing → an empty row (placeholder tiles, no name).
type GuessRowProps = {
  feedback?: GuessFeedback
}

export function GuessRow({ feedback }: GuessRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-40 items-center gap-2">
        {/* Only render the avatar for real guesses. If the PNG is missing,
            onError hides the broken-image icon instead of showing it. */}
        {feedback && (
          <img
            src={umaImageUrl(feedback.uma)}
            alt={feedback.uma.name}
            className="h-10 w-10 shrink-0 rounded-full bg-neutral-800 object-cover"
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden"
            }}
          />
        )}
        <span className="truncate text-sm font-medium text-white">
          {feedback?.uma.name ?? ""}
        </span>
      </div>

      {STAT_KEYS.map((key, i) => (
        <Tile key={key} hint={feedback?.hints[key]} delayMs={i * 250} />
      ))}
    </div>
  )
}
