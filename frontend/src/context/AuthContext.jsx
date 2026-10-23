import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../config/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/me')
      setUser(response.data.data || response.data.user || response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token, fetchUser])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await api.post('/login', { email, password })
      const { user: userData, token: authToken, access_token } = response.data
      const tokenValue = authToken || access_token || response.data.token

      if (tokenValue) {
        localStorage.setItem('auth_token', tokenValue)
        setToken(tokenValue)
      }
      if (userData) {
        setUser(userData)
      }

      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please check your credentials.'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === 'admin' || user?.is_admin === true

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}