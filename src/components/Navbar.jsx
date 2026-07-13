import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { totals } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products')
    setMenuOpen(false)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(18,18,20,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 68 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
          raco<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        <form
          onSubmit={handleSearch}
          style={{
            flex: 1,
            display: 'none',
          }}
          className="nav-search"
        >
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              style={{
                width: '100%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 12px 10px 36px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
        </form>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 'auto' }}>
          <Link to="/products" style={{ fontSize: 14, color: 'var(--text-secondary)' }} className="nav-link">
            Shop
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="btn"
                style={{ padding: '8px 10px' }}
                aria-label="Account menu"
              >
                <User size={18} />
              </button>
              {menuOpen && (
                <div
                  className="card"
                  style={{ position: 'absolute', right: 0, top: 44, minWidth: 160, padding: 8, boxShadow: 'var(--shadow-card)' }}
                >
                  <p style={{ padding: '6px 10px', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    {user.first_name || user.email}
                  </p>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '8px 10px', borderRadius: 6, fontSize: 14 }}
                    className="menu-item"
                  >
                    Your orders
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                      navigate('/')
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 6,
                      fontSize: 14,
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn" style={{ padding: '8px 14px' }}>
              Sign in
            </Link>
          )}

          <Link to="/cart" className="btn" style={{ position: 'relative', padding: '8px 10px' }} aria-label="Cart">
            <ShoppingBag size={18} />
            {totals.itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'var(--accent)',
                  color: 'var(--accent-text)',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 999,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}
              >
                {totals.itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .nav-search { display: block !important; max-width: 380px; }
        }
        .menu-item:hover { background: var(--bg-hover); }
      `}</style>
    </header>
  )
}
