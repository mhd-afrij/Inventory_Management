import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    const result = await login(email, password)
    if (result.success) {
      navigate('/')
      return
    }

    setError(result.error)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-cream rounded-2xl shadow-xl border border-border p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-surface flex items-center justify-center mb-4 shadow-lg border border-line overflow-hidden">
              <img src="/logo.svg" alt="Royal Wellness Center logo" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">Royal Aesthetic</h1>
            <p className="text-muted-text text-sm mt-1">Inventory & Stock Management</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@clinic.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-charcoal"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>

        <p className="text-center text-muted-text text-xs mt-6">
          &copy; 2024 Royal Aesthetic Clinic. All rights reserved.
        </p>
      </div>
    </div>
  )
}
