import { Link } from "react-router-dom"
import { COLORS } from "../../constants/colors"
import LogoDark from "../../assets/logo-dark.webp"

export function CTASection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="px-[clamp(1.5rem,5vw,4rem)] pt-20 pb-[120px]"
    >
      <div className="max-w-175 mx-auto text-center bg-[#2d1052] border border-[#3d1a6e] rounded-3xl p-[clamp(2.5rem,6vw,4rem)] relative overflow-hidden">

        {/* Background glow */}
        <div
          aria-hidden="true"
          className="absolute -top-1/2 -left-[10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.12] pointer-events-none"
          style={{ background: COLORS.hyperMagenta }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div aria-hidden="true" className="flex justify-center mb-4">
            <img
              src={LogoDark}
              alt=""
              className="w-[75px] h-[75px] object-contain scale-[2]"
            />
          </div>

          <h2
            id="cta-heading"
            className="text-white tracking-tight leading-[1.1] mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Ready to transform your workflow?
          </h2>

          <p className="text-base text-[#EFBBFF]/60 leading-relaxed mb-8">
            Join teams that have already adopted LavenderFlow. Get started in under 2 minutes.
          </p>

          <Link
            to="/register"
            className="inline-block bg-[#BE29EC] text-white px-10 py-4 rounded-xl text-base font-semibold no-underline tracking-tight hover:opacity-90 transition-opacity"
          >
            Create my workspace
          </Link>
        </div>
      </div>
    </section>
  )
}
