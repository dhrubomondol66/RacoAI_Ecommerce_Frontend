import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'raco_cart'
const FREE_SHIPPING_THRESHOLD = 2000
const SHIPPING_FLAT_RATE = 80

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      const maxQty = product.stock ?? Infinity
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, maxQty) }
            : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          stock: product.stock,
          quantity: Math.min(quantity, maxQty),
        },
      ]
    })
  }

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => setItems([])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE
    const total = subtotal + shipping
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
    return { subtotal, shipping, total, itemCount }
  }, [items])

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
