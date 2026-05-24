import LogoDark from "../assets/logo-dark.webp"

export function Footer() {
  return (
    <footer
      aria-label="Footer"
      className="border-t border-[#3d1a6e] flex flex-wrap justify-between items-center gap-4 px-[clamp(1.5rem,5vw,4rem)] py-10"
    >
      <div className="flex items-center gap-2.5">
        <img src={LogoDark} alt="" className="w-10 h-10 object-contain scale-[2]" />
        <span className="text-white/70 text-base" style={{ fontFamily: "'DM Serif Display', serif" }}>
          LavenderFlow
        </span>
        <span className="text-[#EFBBFF]/30 text-xs">by Lavendia</span>
      </div>
      <p className="text-xs text-[#EFBBFF]/35 m-0">
        © 2026 Lavendia. All rights reserved.
      </p>
    </footer>
  )
}
