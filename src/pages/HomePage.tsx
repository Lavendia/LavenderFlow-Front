import { NavBar } from "../components/NavBar"
import { HeroSection } from "../components/index/HeroSection"
import { FeaturesSection } from "../components/index/FeaturesSection"
import { CTASection } from "../components/index/CTASection"
import { Footer } from "../components/Footer"

export function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600&display=swap');
        @keyframes drift1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(40px,30px); } }
        @keyframes drift2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-30px,-20px); } }
        @keyframes drift3 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(20px,-40px); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:bg-[#BE29EC]"
      >
        Skip to main content
      </a>

      <NavBar />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
