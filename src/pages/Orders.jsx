import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { endpoints } from '../api/client'
import { PageLoader } from '../components/Loader'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

const statusStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (['delivered', 'paid', 'completed'].includes(s)) return 'badge-success'
  if (['cancelled', 'failed'].includes(s)) return 'badge-danger'
  return 'badge-accent'
}

const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    endpoints
      .orders()
      .then((res) => setOrders(normalizeListResponse(res.data)))
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Couldn't load your orders. Check the backend connection.</p>
      </div>
    )
  }

  if (!orders) return <PageLoader />

  return (
    <div className="container" style={{ padding: '40px 24px 80px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Your orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state card">
          <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>No orders yet</p>
          <p style={{ fontSize: 13 }}>Orders you place will show up here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Order #{order.id}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span className={`badge ${statusStyle(order.status)}`}>{order.status}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{currency(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
