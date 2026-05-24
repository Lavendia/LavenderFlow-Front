import { APIAuth } from '@/src/api_utils/APIAuthUtils'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      var response = await APIAuth.login(email, password)
      if (!response.token) {
        throw new Error('No token received')
      }
      window.localStorage.setItem('authToken', response.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
          style={{ color: '#D896FF' }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ background: '#2d1242', border: '1.5px solid #BE29EC44', color: '#EFBBFF' }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
          style={{ color: '#D896FF' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ background: '#2d1242', border: '1.5px solid #BE29EC44', color: '#EFBBFF' }}
        />
        <div className="text-right mt-2">
          <Link to="/forgot-password" className="text-xs" style={{ color: '#48CB9D' }}>
            Forgot password?
          </Link>
        </div>
      </div>

      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
        style={{ background: '#BE29EC' }}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px" style={{ background: '#BE29EC33' }} />
        <span className="text-xs" style={{ color: '#D896FFaa' }}>or</span>
        <div className="flex-1 h-px" style={{ background: '#BE29EC33' }} />
      </div>

      <p className="text-center text-sm" style={{ color: '#D896FF99' }}>
        Don't have an account?{' '}
        <Link to="/register" className="font-medium" style={{ color: '#48CB9D' }}>
          Create one
        </Link>
      </p>
    </form>
  )
}