import { COLORS } from "../../constants/colors"

const cols = [
  { title: "To do",       color: COLORS.mauve,        cards: ["Homepage redesign", "Q3 client brief", "Unit tests"] },
  { title: "In progress", color: COLORS.mintLeaf,     cards: ["JWT auth API", "Design system v2"] },
  { title: "Done",        color: COLORS.hyperMagenta, cards: ["Postgres DB setup", "EF Core migrations", "Entity models"] },
]

export function BoardMockup() {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      {cols.map((col) => (
        <div key={col.title} className="bg-white/[0.04] rounded-xl p-3">

          {/* Column header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: col.color }} />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">
              {col.title}
            </span>
            <span className="ml-auto text-[11px] text-white/30 bg-white/[0.06] rounded px-1.5 py-0.5">
              {col.cards.length}
            </span>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2">
            {col.cards.map((card) => (
              <div
                key={card}
                className="bg-[#2d1052] border border-[#3d1a6e] rounded-lg px-3 py-2.5 text-[13px] text-white/85 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: col.color }} />
                {card}
              </div>
            ))}
            <div className="border border-dashed border-white/10 rounded-lg px-3 py-2 text-xs text-white/25 text-center cursor-pointer hover:border-white/20 transition-colors">
              + Add a card
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
