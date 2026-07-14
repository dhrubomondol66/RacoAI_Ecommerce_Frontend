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
  headers: { 'ngrok-skip-browser-warning': 'true' },
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
        const { data } = await axios.post(refreshUrl, { refresh: refreshToken }, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        })

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
  register: (payload) => api.post('/users/register', payload),
  login: (payload) => api.post('/users/login', payload),
  me: () => api.get('/users/profile'),

  forgotPassword: (payload) => api.post('/users/forgot-password', payload),
  resetPassword: (payload) => api.post('/users/reset-password', payload),
  adminForgotPassword: (payload) => api.post('/users/admin/forgot-password', payload),
  adminResetPassword: (payload) => api.post('/users/admin/reset-password', payload),

  categories: () => api.get('/categories/'),
  categoryTree: () => api.get('/categories/tree/'),

  products: (params) => api.get('/products/', { params }),
  product: (id) => api.get(`/products/${id}/`),

  orders: () => api.get('/orders/'),
  order: (id) => api.get(`/orders/${id}/`),
  createOrder: (payload) => api.post('/orders/', payload),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),

  initiatePayment: (payload) => api.post('/payments/initiate/', payload),
  confirmPayment: (payload) => api.post('/payments/confirm/', payload),
  payments: () => api.get('/payments/'),
}
