import { features } from "../../constants/features"

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative px-[clamp(1.5rem,5vw,4rem)] py-[100px]"
    >
      <div className="text-center mb-16">
        <p aria-hidden="true" className="text-xs uppercase tracking-[0.1em] text-[#48CB9D] mb-4">
          Features
        </p>
        <h2
          id="features-heading"
          className="text-white tracking-tight leading-[1.1] m-0"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Everything you need,
          <br />
          <span className="text-[#D896FF]">nothing you don't.</span>
        </h2>
      </div>

      <ul
        className="grid gap-5 max-w-[1100px] mx-auto list-none p-0"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {features.map((f) => (
          <li
            key={f.title}
            className="bg-[#2d1052] border border-[#3d1a6e] rounded-2xl p-7 hover:border-[#D896FF]/40 transition-colors"
          >
            <f.icon />
            <h3
              className="text-white mb-2 tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem" }}
            >
              {f.title}
            </h3>
            <p className="text-sm text-[#EFBBFF]/60 leading-relaxed m-0">{f.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
