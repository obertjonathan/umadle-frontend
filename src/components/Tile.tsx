import type { Hint } from "../game/compare"

const STATUS_CLASS: Record<Hint["status"], string> = {
  exact: "bg-[#6aaa64] border-[#6aaa64]", // green
  close: "bg-[#c9b458] border-[#c9b458]", // yellow
  far: "bg-[#787c7e] border-[#787c7e]", // gray
}

function arrow(direction: Hint["direction"]): string {
  if (direction === "up") return "▲"
  if (direction === "down") return "▼"
  return ""
}

// PROPS: a component's inputs. Like method parameters, they flow IN and are
// read-only. The `?` makes each optional.
//   - hint present  → a filled, colored tile
//   - hint missing  → an empty placeholder tile (for un-guessed rows)
type TileProps = {
  hint?: Hint
  delayMs?: number // stagger the flip animation across a row
}

// A component is just a function that takes props and returns JSX.
export function Tile({ hint, delayMs = 0 }: TileProps) {
  // Empty placeholder: an outlined square, no color.
  if (!hint) {
    return <div className="h-16 w-16 rounded border-2 border-neutral-700" />
  }

  // Filled tile: colored, shows the guessed value + an arrow toward target.
  // `style={{ animationDelay }}` is inline CSS — used here because the delay
  // is dynamic (per column), which utility classes can't express.
  return (
    <div
      className={`animate-reveal flex h-16 w-16 flex-col items-center justify-center rounded border-2 font-bold text-white ${STATUS_CLASS[hint.status]}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span className="text-lg leading-none">{hint.value}</span>
      <span className="text-xs leading-none">{arrow(hint.direction)}</span>
    </div>
  )
}
