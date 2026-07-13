import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { endpoints } from '../api/client'
import { useCart } from '../context/CartContext'
import { PageLoader } from '../components/Loader'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(false)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setProduct(null)
    setError(false)
    endpoints
      .product(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError(true))
  }, [id])

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Couldn't load this product. It may be unavailable.</p>
        <Link to="/products" style={{ color: 'var(--accent)' }}>
          Back to shop
        </Link>
      </div>
    )
  }

  if (!product) return <PageLoader />

  const inStock = (product.stock ?? 0) > 0

  return (
    <div className="container" style={{ padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div style={{ aspectRatio: '1 / 1', background: 'var(--bg-elevated)', borderRadius: 12, overflow: 'hidden' }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      <div>
        {product.category_name && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category_name}
          </span>
        )}
        <h1 style={{ fontSize: 28, margin: '8px 0 12px' }}>{product.name}</h1>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 600, marginBottom: 16 }}>
          {currency(product.price)}
        </p>

        <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </span>

        <p style={{ color: 'var(--text-secondary)', margin: '20px 0', lineHeight: 1.7 }}>
          {product.description || 'No description provided for this product yet.'}
        </p>

        {inStock && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 8 }}>
              <button className="btn" style={{ border: 'none', padding: '10px 12px' }} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus size={14} />
              </button>
              <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14 }}>{qty}</span>
              <button
                className="btn"
                style={{ border: 'none', padding: '10px 12px' }}
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          disabled={!inStock}
          style={{ padding: '13px 24px' }}
          onClick={() => {
            addItem(product, qty)
            setAdded(true)
            setTimeout(() => setAdded(false), 1800)
          }}
        >
          <ShoppingBag size={16} />
          {added ? 'Added to cart' : 'Add to cart'}
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
