import { COLORS } from "../../constants/colors"
import { Link } from "react-router-dom"
import LogoDark from "../../assets/logo-dark.webp"

export function CTASection() {
  return (
    <section aria-labelledby="cta-heading" style={{ padding: "80px clamp(1.5rem, 5vw, 4rem) 120px" }}>
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
          background: COLORS.darkCard,
          border: `1px solid ${COLORS.darkCardBorder}`,
          borderRadius: 24,
          padding: "clamp(2.5rem, 6vw, 4rem)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div aria-hidden="true" style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
            <img
              src={LogoDark}
              alt=""
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                transform: "scale(2)", // zoom in to crop the whitespace visually
              }}
            />
          </div>
          <h2
            id="cta-heading"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#fff",
              margin: "0 0 1rem",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Ready to transform your workflow?
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(239,187,255,0.6)", lineHeight: 1.6, marginBottom: "2rem" }}>
            Join teams that have already adopted LavenderFlow. Get started in under 2 minutes.
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-block",
              background: COLORS.hyperMagenta,
              color: "#fff",
              padding: "15px 40px",
              borderRadius: 12,
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Create my workspace
          </Link>
        </div>
      </div>
    </section>
  )
}