import { createContext, useContext, useEffect, useState } from 'react'
import { endpoints } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('raco_access_token')
    if (!token) {
      setLoading(false)
      return
    }
    endpoints
      .me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('raco_access_token')
        localStorage.removeItem('raco_refresh_token')
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await endpoints.login({ email, password })
      const accessToken = data.access || data.token || data.accessToken
      const refreshToken = data.refresh || data.refreshToken

      if (!accessToken) {
        throw new Error('Login response was missing an access token')
      }

      localStorage.setItem('raco_access_token', accessToken)
      if (refreshToken) {
        localStorage.setItem('raco_refresh_token', refreshToken)
      }

      const me = await endpoints.me()
      setUser(me.data)
      return me.data
    } catch (error) {
      localStorage.removeItem('raco_access_token')
      localStorage.removeItem('raco_refresh_token')
      throw error
    }
  }

  const register = async (payload) => {
    await endpoints.register(payload)
    return login(payload.email, payload.password)
  }

  const logout = () => {
    localStorage.removeItem('raco_access_token')
    localStorage.removeItem('raco_refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
