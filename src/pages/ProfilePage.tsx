import { Footer } from "../components/Footer"
import { NavBar } from "../components/NavBar"
import { ProfileSection } from "../components/profile/ProfileSection"

export function ProfilePage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600&display=swap');
            `}</style>
            <NavBar />
            <main id="main-content">
                <ProfileSection />
            </main>
            <Footer />
        </>
    )
}