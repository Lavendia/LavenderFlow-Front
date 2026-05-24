import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { COLORS } from "../../constants/colors"
import { BoardMockup } from "./BoardMockup"

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-[clamp(1.5rem,5vw,4rem)] pt-[120px] pb-20"
    >

      <div
        className={`relative z-10 max-w-[760px] transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1
          id="hero-heading"
          className="text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
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
          className="text-[#EFBBFF]/70 leading-[1.7] mb-10 mx-auto max-w-[560px]"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}
        >
          LavenderFlow is the collaborative dashboard built for modern teams. Organize, prioritize, deliver — without friction, with style.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/register"
            className="bg-[#BE29EC] text-white px-8 py-3.5 rounded-xl text-base font-semibold no-underline tracking-tight hover:opacity-90 transition-opacity"
          >
            Create a workspace
          </Link>
          <a
            href="#features"
            className="bg-white/6 text-[#EFBBFF] px-8 py-3.5 rounded-xl text-base no-underline border border-[#D896FF]/20 hover:bg-white/10 transition-colors"
          >
            See features →
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`relative z-10 mt-20 w-full max-w-225 transition-all duration-1200 ease-out delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-[#2d1052] border border-[#3d1a6e] rounded-2xl p-6 shadow-[0_0_80px_rgba(190,41,236,0.15)]">
          <div className="flex gap-2 mb-5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
            <div className="flex-1 bg-white/[0.06] rounded h-5 flex items-center justify-center text-[11px] text-white/30">
              app.lavenderflow.io/workspace
            </div>
          </div>
          <BoardMockup />
        </div>
      </div>
    </section>
  )
}
