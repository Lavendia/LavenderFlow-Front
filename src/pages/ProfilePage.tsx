import { Footer } from "../components/Footer"
import { NavBar } from "../components/NavBar"
import { ProfileSection } from "../components/profile/ProfileSection"
import { COLORS } from "../constants/colors"

export function ProfilePage() {
    return (
        <>
            <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    html { scroll-behavior: smooth; }
                    body { background: ${COLORS.darkBg}; font-family: 'Syne', sans-serif; color: #fff; overflow-x: hidden; }
                    :focus-visible { outline: 2px solid ${COLORS.hyperMagenta}; outline-offset: 3px; border-radius: 4px; }
                    a:focus-visible { outline: 2px solid ${COLORS.hyperMagenta}; outline-offset: 3px; border-radius: 6px; }
                    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
                    @keyframes drift1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(40px, 30px); } }
                    @keyframes drift2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, -20px); } }
                    @keyframes drift3 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, -40px); } }
                    @media (min-width: 640px) { .nav-link { display: inline !important; } }
                  `}</style>
            <NavBar />
            <main id="main-content">
                <ProfileSection />
            </main>
            <Footer />
        </>
    )
}