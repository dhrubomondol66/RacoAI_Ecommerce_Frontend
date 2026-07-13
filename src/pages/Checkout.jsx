import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { endpoints } from '../api/client'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

export default function Checkout() {
  const { items, totals, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [provider, setProvider] = useState('stripe')
  const [address, setAddress] = useState({ fullName: user?.first_name || '', phone: '', line1: '', city: '', postcode: '' })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPlacing(true)
    setError('')
    try {
      const orderPayload = {
        lines: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_full_name: address.fullName,
        shipping_phone: address.phone,
        shipping_address: address.line1,
        shipping_city: address.city,
        shipping_postcode: address.postcode,
      }
      const order = await endpoints.createOrder(orderPayload)
      const payment = await endpoints.initiatePayment({
        order_id: order.data.id,
        provider,
      })
      clearCart()
      if (payment.data.redirect_url) {
        window.location.href = payment.data.redirect_url
      } else {
        navigate(`/orders/${order.data.id}`)
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Couldn't place your order. Check the backend is running and you're signed in."
      )
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
      <form onSubmit={handleSubmit}>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Checkout</h1>

        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, marginBottom: 16 }}>Shipping address</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Full name</label>
              <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="01XXXXXXXXX" />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
            </div>
            <div className="field">
              <label>City</label>
              <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="field">
              <label>Postcode</label>
              <input required value={address.postcode} onChange={(e) => setAddress({ ...address, postcode: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h2 style={{ fontSize: 15, marginBottom: 16 }}>Payment method</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label
              className="pay-option"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 16px',
                borderRadius: 8,
                border: `1px solid ${provider === 'stripe' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              <input type="radio" name="provider" value="stripe" checked={provider === 'stripe'} onChange={() => setProvider('stripe')} style={{ accentColor: 'var(--accent)' }} />
              <CreditCard size={18} />
              <span style={{ fontSize: 14 }}>Card (Stripe)</span>
            </label>
            <label
              className="pay-option"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 16px',
                borderRadius: 8,
                border: `1px solid ${provider === 'bkash' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }}
            >
              <input type="radio" name="provider" value="bkash" checked={provider === 'bkash'} onChange={() => setProvider('bkash')} style={{ accentColor: 'var(--accent)' }} />
              <Smartphone size={18} />
              <span style={{ fontSize: 14 }}>bKash</span>
            </label>
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 16 }}>{error}</p>
        )}
      </form>

      <div className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 84 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Order summary</h2>
        {items.map((i) => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--text-secondary)' }}>
            <span>{i.name} &times; {i.quantity}</span>
            <span>{currency(i.price * i.quantity)}</span>
          </div>
        ))}
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
        <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 20, padding: '12px 0' }} disabled={placing} onClick={handleSubmit}>
          {placing ? 'Placing order…' : `Pay ${currency(totals.total)}`}
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
