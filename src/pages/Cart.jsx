import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

export default function Cart() {
  const { items, updateQuantity, removeItem, totals } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="empty-state card">
          <p style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>Your cart is empty</p>
          <p style={{ fontSize: 13, marginBottom: 20 }}>Add something you like and it'll show up here.</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Browse products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Your cart</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'var(--bg-elevated)', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{currency(item.price)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8 }}>
                <button className="btn" style={{ border: 'none', padding: '6px 10px' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus size={13} />
                </button>
                <span style={{ minWidth: 24, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>
                <button className="btn" style={{ border: 'none', padding: '6px 10px' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={13} />
                </button>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, minWidth: 76, textAlign: 'right' }}>{currency(item.price * item.quantity)}</p>
              <button
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 84 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Order summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text-secondary)' }}>
          <span>Subtotal</span>
          <span>{currency(totals.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--text-secondary)' }}>
          <span>Shipping</span>
          <span>{totals.shipping === 0 ? 'Free' : currency(totals.shipping)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 16,
            fontWeight: 600,
            paddingTop: 12,
            marginTop: 8,
            borderTop: '1px solid var(--border)',
          }}
        >
          <span>Total</span>
          <span>{currency(totals.total)}</span>
        </div>
        <button className="btn btn-primary btn-block" style={{ marginTop: 20, padding: '12px 0' }} onClick={() => navigate('/checkout')}>
          Checkout
        </button>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
