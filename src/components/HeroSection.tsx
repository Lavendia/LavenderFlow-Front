import { useState, useEffect } from "react"
import { COLORS } from "../constants/colors"
import { BoardMockup } from "./BoardMockup"
import { Link } from "react-router-dom"

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px clamp(1.5rem, 5vw, 4rem) 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: 760,
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          id="hero-heading"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
            lineHeight: 1.05,
            color: "#fff",
            margin: "0 0 1.5rem",
            letterSpacing: "-0.03em",
          }}
        >
          Your team's flow,
          <br />
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.hyperMagenta}, ${COLORS.mauve}, ${COLORS.mauveLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            reinvented.
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "rgba(239,187,255,0.7)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          LavenderFlow is the collaborative dashboard built for modern teams. Organize, prioritize, deliver — without friction, with style.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/register"
            style={{
              background: COLORS.hyperMagenta,
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Create a workspace
          </Link>
          <a
            href="#features"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: COLORS.mauveLight,
              padding: "14px 32px",
              borderRadius: 12,
              fontSize: "1rem",
              textDecoration: "none",
              border: "1px solid rgba(216,150,255,0.2)",
            }}
          >
            See features →
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: "5rem",
          width: "100%",
          maxWidth: 900,
          position: "relative",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) perspective(1200px) rotateX(0deg)"
            : "translateY(40px) perspective(1200px) rotateX(6deg)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        <div
          style={{
            background: COLORS.darkCard,
            border: `1px solid ${COLORS.darkCardBorder}`,
            borderRadius: 20,
            padding: "24px",
            boxShadow: "0 0 80px rgba(190,41,236,0.15)",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 6,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              app.lavenderflow.io/workspace
            </div>
          </div>
          <BoardMockup />
        </div>
      </div>
    </section>
  )
}
