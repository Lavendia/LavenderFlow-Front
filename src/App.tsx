import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#2d1242' }}>
      <div className="flex flex-col items-center gap-6">
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: '#EFBBFF' }}>
          LavenderFlow
        </span>
        <a href="/login">
          <button
            className="px-8 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-80"
            style={{ background: '#BE29EC' }}>
            Go to Login
          </button>
        </a>
      </div>
    </div>
  )
}