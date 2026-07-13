import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { endpoints } from '../api/client'
import { PageLoader } from '../components/Loader'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    endpoints
      .order(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError(true))
  }, [id])

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Couldn't load this order.</p>
        <Link to="/orders" style={{ color: 'var(--accent)' }}>
          Back to orders
        </Link>
      </div>
    )
  }

  if (!order) return <PageLoader />

  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: 700 }}>
      <Link to="/orders" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        &larr; Back to orders
      </Link>
      <h1 style={{ fontSize: 22, margin: '12px 0 4px' }}>Order #{order.id}</h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Placed {new Date(order.created_at).toLocaleString()}
      </p>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, marginBottom: 12 }}>Items</h2>
        {(order.items || []).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{item.product_name || item.product} &times; {item.quantity}</span>
            <span>{currency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600, paddingTop: 12, marginTop: 8 }}>
          <span>Total</span>
          <span>{currency(order.total)}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h2 style={{ fontSize: 15, marginBottom: 12 }}>Shipping address</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {order.shipping_address?.fullName}
          <br />
          {order.shipping_address?.line1}
          <br />
          {order.shipping_address?.city} {order.shipping_address?.postcode}
          <br />
          {order.shipping_address?.phone}
        </p>
      </div>
    </div>
  )
}
