import { COLORS } from "../../constants/colors"
import { features } from "../../constants/features"

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-heading" style={{ padding: "100px clamp(1.5rem, 5vw, 4rem)", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <p
          aria-hidden="true"
          style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", color: COLORS.mintLeaf, marginBottom: "1rem" }}
        >
          Features
        </p>
        <h2
          id="features-heading"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#fff",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Everything you need,
          <br />
          <span style={{ color: COLORS.mauve }}>nothing you don't.</span>
        </h2>
      </div>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          maxWidth: 1100,
          margin: "0 auto",
          listStyle: "none",
          padding: 0,
        }}
      >
        {features.map((f) => (
          <li
            key={f.title}
            style={{
              background: COLORS.darkCard,
              border: `1px solid ${COLORS.darkCardBorder}`,
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            <f.icon/>
            <h3
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.15rem",
                color: "#fff",
                margin: "0 0 8px",
                letterSpacing: "-0.01em",
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: "0.875rem", color: "rgba(239,187,255,0.6)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
