import { COLORS } from "../constants/colors"
import LogoDark from "../assets/logo-dark.webp"

export function Footer() {
  return (
    <footer
      aria-label="Footer"
      style={{
        borderTop: `1px solid ${COLORS.darkCardBorder}`,
        padding: "2.5rem clamp(1.5rem, 5vw, 4rem)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
              src={LogoDark}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: "contain",
                transform: "scale(2)", // zoom in to crop the whitespace visually
              }}
            />
        </div>
        <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem" }}>
          LavenderFlow
        </span>
        <span style={{ color: "rgba(239,187,255,0.3)", fontSize: "0.75rem" }}>by Lavendia</span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "rgba(239,187,255,0.35)", margin: 0 }}>
        © 2026 Lavendia. All rights reserved.
      </p>
    </footer>
  )
}
