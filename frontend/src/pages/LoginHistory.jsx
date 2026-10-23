import { useState, useEffect } from 'react'
import api from '../config/axios'
import { HiOutlineClock, HiOutlineArrowPath } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function LoginHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await api.get('/login-history')
      const data = response.data
      setHistory(data.data || data.history || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch login history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Login History</h1>
          <p className="text-warmgray text-sm mt-1">Track user login activities</p>
        </div>
        <button onClick={fetchHistory} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-warmgray bg-white border border-beige rounded-lg hover:bg-beige/30 transition-colors self-start">
          <HiOutlineArrowPath className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-cream rounded-xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineClock className="w-16 h-16 mx-auto text-warmgray/40 mb-4" />
            <h3 className="text-lg font-medium text-warmgray">No login history</h3>
            <p className="text-warmgray/60 text-sm mt-1">No login activities recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f0ea] border-b border-beige">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Browser</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Login Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Logout Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/50">
                {history.map((entry, index) => (
                  <tr key={entry.id || index} className="hover:bg-beige/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-gold flex items-center justify-center text-white text-xs font-semibold">
                          {entry.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{entry.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-warmgray/60">{entry.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray font-mono">{entry.ip_address || '-'}</td>
                    <td className="px-4 py-3 text-sm text-warmgray max-w-[250px] truncate" title={entry.user_agent}>
                      {entry.user_agent || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray">
                      {entry.login_at ? new Date(entry.login_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {entry.logout_at ? (
                        <span className="text-warmgray">{new Date(entry.logout_at).toLocaleString()}</span>
                      ) : (
                        <span className="text-sage font-medium">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
