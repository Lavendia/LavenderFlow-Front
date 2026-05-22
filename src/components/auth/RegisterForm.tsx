import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      // wire to API later
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#2d1242',
    border: '1.5px solid #BE29EC44',
    color: '#EFBBFF',
    fontFamily: 'inherit',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
          style={{ color: '#D896FF' }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
        />
      </div>

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
          style={inputStyle}
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
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest uppercase mb-2"
          style={{ color: '#D896FF' }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
        />
      </div>

      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
        style={{ background: '#BE29EC' }}>
        {loading ? 'Creating account...' : 'Create account'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: '#BE29EC33' }} />
        <span className="text-xs" style={{ color: '#c084e8' }}>or</span>
        <div className="flex-1 h-px" style={{ background: '#BE29EC33' }} />
      </div>

      <p className="text-center text-sm" style={{ color: '#c084e8' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-medium" style={{ color: '#48CB9D' }}>
          Sign in
        </Link>
      </p>
    </form>
  )
}