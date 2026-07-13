import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/')
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Sign in</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button className="btn btn-primary btn-block" style={{ padding: '11px 0' }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
        New here?{' '}
        <Link to="/register" style={{ color: 'var(--accent)' }}>
          Create an account
        </Link>
      </p>
    </div>
  )
}
