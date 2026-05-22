import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AuthLayout from './pages/AuthLayout'
import { AnimatePresence } from 'framer-motion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />} />
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
