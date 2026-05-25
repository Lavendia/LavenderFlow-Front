import { BoardBackground } from "../components/board/BoardBackground"
import { NavBar } from "../components/NavBar"

export function BoardPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600&display=swap');
            `}</style>
            <NavBar />
            <main id="main-content">
                <BoardBackground />
            </main>
        </>
    )
}