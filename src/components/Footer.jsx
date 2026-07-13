export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 80, padding: '40px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            raco<span style={{ color: 'var(--accent)' }}>.</span>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 280 }}>
            Everyday goods, honestly priced. Pay with card or bKash.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Shop</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>All products</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Categories</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>Account</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Your orders</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sign in</p>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Raco. All rights reserved.</p>
      </div>
    </footer>
  )
}
