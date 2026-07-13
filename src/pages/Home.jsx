import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { endpoints } from '../api/client'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Loader'

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Wireless charging pad', price: 1450, stock: 12, category_name: 'Electronics', image: null },
  { id: 2, name: 'Ceramic pour-over set', price: 2200, stock: 4, category_name: 'Home', image: null },
  { id: 3, name: 'Canvas weekender bag', price: 3200, stock: 0, category_name: 'Bags', image: null },
  { id: 4, name: 'Mechanical desk keyboard', price: 5400, stock: 7, category_name: 'Electronics', image: null },
]

const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export default function Home() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    endpoints
      .products({ ordering: '-created_at', page_size: 8 })
      .then((res) => setProducts(normalizeListResponse(res.data)))
      .catch(() => {
        setError(true)
        setProducts(FALLBACK_PRODUCTS)
      })
  }, [])

  return (
    <div>
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '72px 24px 64px', display: 'grid', gap: 24 }}>
          <span className="badge badge-accent" style={{ width: 'fit-content' }}>New arrivals weekly</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', maxWidth: 640, lineHeight: 1.1 }}>
            Everyday goods, <span style={{ color: 'var(--accent)' }}>honestly priced</span>.
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, fontSize: 16 }}>
            Browse curated categories, pay with card or bKash, and track every order from checkout to delivery.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '12px 22px' }}>
              Shop all products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '56px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22 }}>Featured products</h2>
          <Link to="/products" style={{ fontSize: 14, color: 'var(--accent)' }}>
            View all
          </Link>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Showing sample products — connect the API to see live inventory.
          </p>
        )}

        {!products ? (
          <ProductGridSkeleton />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
