import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 48, marginBottom: 12 }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This page doesn't exist.</p>
      <Link to="/" className="btn btn-primary" style={{ padding: '10px 20px' }}>
        Back home
      </Link>
    </div>
  )
}
