import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

const currency = (v) =>
  new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(v)

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const inStock = (product.stock ?? 0) > 0

  return (
    <div className="card product-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/products/${product.slug || product.id}`} style={{ display: 'block', position: 'relative' }}>
        <div style={{ aspectRatio: '1 / 1', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%' }} className="skeleton" />
          )}
        </div>
        {!inStock && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: 10, left: 10 }}>
            Out of stock
          </span>
        )}
      </Link>

      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {product.category_name && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.category_name}
          </span>
        )}
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{product.name}</h3>
        </Link>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>
            {currency(product.price)}
          </span>
          <button
            className="btn quick-add"
            style={{ padding: '6px 10px' }}
            disabled={!inStock}
            onClick={(e) => {
              e.preventDefault()
              addItem(product, 1)
            }}
            aria-label="Add to cart"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <style>{`
        .product-card { transition: border-color 0.15s ease, transform 0.1s ease; }
        .product-card:hover { border-color: var(--border-strong); }
      `}</style>
    </div>
  )
}
