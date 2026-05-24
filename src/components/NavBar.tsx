import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LogoDark from "../assets/logo-dark.webp"

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setLoggedIn(!!token)

    if ( !token && !["/", "/login", "/register"].includes(window.location.pathname) ) {
      window.location.replace("/login")
      return
    }

    const handler = () => { setScrolled(window.scrollY > 40) }
    window.addEventListener("scroll", handler)
    return () => { window.removeEventListener("scroll", handler) }
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between transition-all duration-300 px-[clamp(1.5rem,5vw,4rem)] ${
        scrolled
          ? "bg-[#1a0a2e]/90 backdrop-blur-md border-b border-[#3d1a6e]/50"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Link to="/">
          <img src={LogoDark} alt="" className="w-12 h-12 object-contain scale-[2]" />
        </Link>
        <span className="text-white text-xl tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
          LavenderFlow
        </span>
        <span
          aria-label="Part of the Lavendia suite"
          className="text-[10px] text-[#D896FF] border border-[#D896FF] rounded px-1.5 py-0.5 opacity-80"
        >
          by Lavendia
        </span>
      </div>

      <div className="flex items-center gap-3">
        {window.location.pathname === "/" && (
          <a
            href="#features"
            className="hidden sm:inline text-[#EFBBFF] text-sm opacity-80 no-underline hover:opacity-100 transition-opacity"
          >
            Features
          </a>
          )}
        {!loggedIn && (
          <>
            <Link
              to="/login"
              className="text-[#EFBBFF] text-sm no-underline px-4 py-1.5 rounded-lg border border-[#3d1a6e] hover:border-[#D896FF] transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-[#BE29EC] text-white text-sm font-medium no-underline px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link to="/dashboard" className="text-[#EFBBFF] text-sm no-underline px-4 py-1.5 rounded-lg border border-[#3d1a6e] hover:border-[#D896FF] transition-colors">
              Dashboards
            </Link>
            <Link
              to="/profile"
              className="bg-[#BE29EC] text-white text-sm font-medium no-underline px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Profile
            </Link>
            <a href="/login" onClick={() => { localStorage.removeItem("authToken"); setLoggedIn(false) }}
              className="text-[#EFBBFF] text-sm no-underline px-4 py-1.5 rounded-lg border border-[#3d1a6e] hover:border-[#D896FF] transition-colors"
            >
              Sign out
            </a>
          </>
        )}
      </div>
    </nav>
  )
}
