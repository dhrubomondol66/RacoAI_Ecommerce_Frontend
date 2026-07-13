import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { endpoints } from '../api/client'
import ProductCard from '../components/ProductCard'
import CategorySidebar from '../components/CategorySidebar'
import { ProductGridSkeleton } from '../components/Loader'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(false)

  const activeCategory = searchParams.get('category')

  const normalizeListResponse = (payload) => {
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.results)) return payload.results
    if (Array.isArray(payload?.data)) return payload.data
    return []
  }
  const query = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || '-created_at'

  useEffect(() => {
    endpoints
      .categories()
      .then((res) => setCategories(normalizeListResponse(res.data)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setProducts(null)
    endpoints
      .products({ category: activeCategory || undefined, search: query || undefined, ordering: sort })
      .then((res) => {
        setProducts(normalizeListResponse(res.data))
        setError(false)
      })
      .catch(() => {
        setError(true)
        setProducts([])
      })
  }, [activeCategory, query, sort])

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') next.delete(key)
      else next.set(key, value)
    })
    setSearchParams(next)
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
      <aside style={{ position: 'sticky', top: 84, alignSelf: 'start' }}>
        <CategorySidebar
          categories={categories}
          activeId={activeCategory}
          onSelect={(node) => updateParams({ category: node?.id ?? null })}
        />
      </aside>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>{query ? `Results for "${query}"` : 'All products'}</h1>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 10px',
              color: 'var(--text-primary)',
            }}
          >
            <option value="-created_at">Newest</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Couldn't reach the API — check that the Django backend is running at VITE_API_BASE_URL.
          </p>
        )}

        {!products ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="empty-state card">
            <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>No products found</p>
            <p style={{ fontSize: 13 }}>Try a different category or search term.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
