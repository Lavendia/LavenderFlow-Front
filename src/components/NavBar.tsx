import { useState, useEffect } from "react"
import { COLORS } from "../constants/colors"
import { Link } from "react-router-dom"

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "0 clamp(1.5rem, 5vw, 4rem)",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(26,10,46,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `0.5px solid ${COLORS.darkCardBorder}` : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src="/Lavendia.png"
          alt=""
          style={{
            width: 50,
            height: 50,
            objectFit: "contain",
            transform: "scale(2)", // zoom in to crop the whitespace visually
          }}
        />
        <span style={{ color: "#fff", fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
          LavenderFlow
        </span>
        <span
          aria-label="Part of the Lavendia suite"
          style={{ fontSize: "10px", color: COLORS.mauve, border: `1px solid ${COLORS.mauve}`, borderRadius: 4, padding: "1px 6px", opacity: 0.8 }}
        >
          by Lavendia
        </span>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <a href="#features" className="nav-link" style={{ color: COLORS.mauveLight, fontSize: "0.875rem", textDecoration: "none", opacity: 0.8, display: "none" }}>
          Features
        </a>
        <Link to="/login" style={{ color: COLORS.mauveLight, fontSize: "0.875rem", textDecoration: "none", padding: "6px 16px", borderRadius: 8, border: `1px solid ${COLORS.darkCardBorder}` }}>
          Sign in
        </Link>
        <Link to="/register" style={{ background: COLORS.hyperMagenta, color: "#fff", fontSize: "0.875rem", textDecoration: "none", padding: "7px 18px", borderRadius: 8, fontWeight: 500 }}>
          Get started
        </Link>
      </div>
    </nav>
  )
}
