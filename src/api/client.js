import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: BASE_URL,
})

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('raco_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh the access token once on a 401, then retry the original request
let isRefreshing = false
let queue = []

const processQueue = (error, token = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  queue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('raco_refresh_token')
      if (!refreshToken) return Promise.reject(error)

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
        refresh: refreshToken,
      })

      localStorage.setItem(
        "raco_access_token",
        data.access
      )

      processQueue(null, data.access)

      originalRequest.headers.Authorization = `Bearer ${data.access}`

      return api(originalRequest)

      } catch (refreshError) {
      processQueue(refreshError, null)

      localStorage.removeItem("raco_access_token")
      localStorage.removeItem("raco_refresh_token")

      return Promise.reject(refreshError)

      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// --- Endpoint helpers -------------------------------------------------
// Adjust these paths if your DRF routers use different URL names.

export const endpoints = {
  // apps/users
  register: (payload) => api.post('/users/register', payload),
  login: (payload) => api.post('/users/login', payload),
  me: () => api.get('/users/profile'),

  // apps/categories (tree, DFS traversal on the backend)
  categories: () => api.get('/categories/'),

  // apps/products
  products: (params) => api.get('/products/', { params }),
  product: (slugOrId) => api.get(`/products/${slugOrId}/`),

  // apps/orders
  orders: () => api.get('/orders/'),
  order: (id) => api.get(`/orders/${id}/`),
  createOrder: (payload) => api.post('/orders/', payload),

  // apps/payments (Strategy pattern: provider = 'stripe' | 'bkash')
  initiatePayment: (payload) =>
    api.post('/payments/initiate/', payload)
}
