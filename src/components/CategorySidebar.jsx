function CategoryNode({ node, activeId, onSelect, depth }) {
  const isActive = String(node.id) === String(activeId)
  return (
    <div>
      <button
        onClick={() => onSelect(node)}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '7px 10px',
          paddingLeft: 10 + depth * 14,
          borderRadius: 6,
          border: 'none',
          background: isActive ? 'rgba(217,164,65,0.14)' : 'transparent',
          color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: 13,
          fontWeight: isActive ? 500 : 400,
          cursor: 'pointer',
        }}
        className="category-node"
      >
        {node.name}
      </button>
      {node.children?.length > 0 && (
        <div>
          {node.children.map((child) => (
            <CategoryNode key={child.id} node={child} activeId={activeId} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategorySidebar({ categories, activeId, onSelect }) {
  const safeCategories = Array.isArray(categories) ? categories : []

  return (
    <div className="card" style={{ padding: 12 }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '4px 10px 10px' }}>
        Categories
      </p>
      <button
        onClick={() => onSelect(null)}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '7px 10px',
          borderRadius: 6,
          border: 'none',
          background: !activeId ? 'rgba(217,164,65,0.14)' : 'transparent',
          color: !activeId ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: 13,
          fontWeight: !activeId ? 500 : 400,
          cursor: 'pointer',
        }}
      >
        All products
      </button>
      {safeCategories.map((node) => (
        <CategoryNode key={node.id} node={node} activeId={activeId} onSelect={onSelect} depth={0} />
      ))}
      <style>{`.category-node:hover { background: var(--bg-hover) !important; }`}</style>
    </div>
  )
}
