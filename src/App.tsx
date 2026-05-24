import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './pages/AuthLayout'
import { HomePage } from "./pages/HomePage"
import { ProfilePage } from './pages/ProfilePage'
import { BoardPage } from './pages/BoardPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/board" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  )
}