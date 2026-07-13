import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: ''})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create your account. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: 420 }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Create an account</h1>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="field">
          <label>username</label>
          <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="field">
          <label>phone</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <button className="btn btn-primary btn-block" style={{ padding: '11px 0' }} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
