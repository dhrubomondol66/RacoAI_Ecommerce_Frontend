export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: 'hidden' }}>
          <div className="skeleton" style={{ aspectRatio: '1 / 1' }} />
          <div style={{ padding: 14 }}>
            <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
