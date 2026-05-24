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
      `}</style>

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
