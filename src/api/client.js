import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const isProd = import.meta.env.PROD

const normalizeBaseUrl = (value) => {
  if (!value) return ''
  return value.endsWith('/') ? value.slice(0, -1) : value
}

const API_BASE_URL = normalizeBaseUrl(BASE_URL)

export const api = axios.create({
  baseURL: API_BASE_URL,
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
        const refreshUrl = `${API_BASE_URL}/auth/refresh/`
        const { data } = await axios.post(refreshUrl, { refresh: refreshToken })

        const nextAccessToken = data.access || data.token || data.accessToken
        if (!nextAccessToken) {
          throw new Error('Refresh response did not include an access token')
        }

        localStorage.setItem('raco_access_token', nextAccessToken)

        processQueue(null, nextAccessToken)

        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        localStorage.removeItem('raco_access_token')
        localStorage.removeItem('raco_refresh_token')

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

const tryEndpoints = async (candidates, payload) => {
  let lastError = null

  for (const candidate of candidates) {
    try {
      return await candidate(payload)
    } catch (error) {
      lastError = error
      if (error?.response?.status !== 404 && error?.response?.status !== 405) {
        throw error
      }
    }
  }

  throw lastError
}

export const endpoints = {
  // apps/users
  register: (payload) =>
    tryEndpoints([
      (body) => api.post('/users/register/', body),
      (body) => api.post('/register/', body),
      (body) => api.post('/users/signup/', body),
    ], payload),
  login: (payload) =>
    tryEndpoints([
      (body) => api.post('/users/login/', body),
      (body) => api.post('/login/', body),
      (body) => api.post('/users/token/', body),
      (body) => api.post('/token/', body),
    ], payload),
  me: () =>
    tryEndpoints([
      () => api.get('/users/profile/'),
      () => api.get('/profile/'),
      () => api.get('/users/me/'),
    ], undefined),

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
