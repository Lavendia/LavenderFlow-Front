import { COLORS } from "../../constants/colors"

const cols = [
  { title: "To do", color: COLORS.mauve, cards: ["Homepage redesign", "Q3 client brief", "Unit tests"] },
  { title: "In progress", color: COLORS.mintLeaf, cards: ["JWT auth API", "Design system v2"] },
  { title: "Done", color: COLORS.hyperMagenta, cards: ["Postgres DB setup", "EF Core migrations", "Entity models"] },
]

export function BoardMockup() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {cols.map((col) => (
        <div key={col.title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {col.title}
            </span>
            <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "1px 7px" }}>
              {col.cards.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {col.cards.map((card) => (
              <div
                key={card}
                style={{
                  background: COLORS.darkCard, border: `1px solid ${COLORS.darkCardBorder}`,
                  borderRadius: 8, padding: "10px 12px", fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: 2, background: col.color, flexShrink: 0 }} />
                {card}
              </div>
            ))}
            <div style={{ border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", textAlign: "center", cursor: "pointer" }}>
              + Add a card
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
