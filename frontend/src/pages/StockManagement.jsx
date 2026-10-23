import { useState, useEffect } from 'react'
import api from '../config/axios'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowsRightLeft,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineArrowPath,
  HiOutlineClock,
} from 'react-icons/hi2'

export default function StockManagement() {
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInModal, setShowInModal] = useState(false)
  const [showOutModal, setShowOutModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [stockInData, setStockInData] = useState({ product_id: '', quantity: '', notes: '' })
  const [stockOutData, setStockOutData] = useState({ product_id: '', quantity: '', notes: '' })
  const [summary, setSummary] = useState(null)

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      const data = response.data
      setProducts(data.data || data.products || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const response = await api.get('/stock-movements')
      const data = response.data
      setMovements(data.data || data.movements || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch movements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await api.get('/stock-summary')
      setSummary(response.data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchMovements()
    fetchSummary()
  }, [])

  const handleStockIn = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/stock-in', {
        product_id: parseInt(stockInData.product_id),
        quantity: parseInt(stockInData.quantity),
        notes: stockInData.notes,
      })
      toast.success('Stock added successfully')
      setShowInModal(false)
      setStockInData({ product_id: '', quantity: '', notes: '' })
      fetchProducts()
      fetchMovements()
      fetchSummary()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add stock')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStockOut = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/stock-out', {
        product_id: parseInt(stockOutData.product_id),
        quantity: parseInt(stockOutData.quantity),
        notes: stockOutData.notes,
      })
      toast.success('Stock removed successfully')
      setShowOutModal(false)
      setStockOutData({ product_id: '', quantity: '', notes: '' })
      fetchProducts()
      fetchMovements()
      fetchSummary()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove stock')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Stock Management</h1>
          <p className="text-warmgray text-sm mt-1">Track and manage inventory movements</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchMovements} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-charcoal bg-surface border border-line rounded-lg hover:bg-panel transition-colors">
            <HiOutlineArrowPath className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={() => setShowInModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            <HiOutlineArrowUp className="w-4 h-4" />
            Stock In
          </button>
          <button onClick={() => setShowOutModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-danger rounded-lg hover:bg-[#a35050] transition-colors shadow-sm">
            <HiOutlineArrowDown className="w-4 h-4" />
            Stock Out
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cream rounded-xl border border-beige p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center">
              <HiOutlineArrowUp className="w-5 h-5 text-sage" />
            </div>
            <div>
              <p className="text-sm text-warmgray">Stock In Today</p>
              <p className="text-xl font-bold text-charcoal">{summary?.stock_in_today || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-cream rounded-xl border border-beige p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <HiOutlineArrowDown className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-warmgray">Stock Out Today</p>
              <p className="text-xl font-bold text-charcoal">{summary?.stock_out_today || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-cream rounded-xl border border-beige p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center">
              <HiOutlineArrowsRightLeft className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <p className="text-sm text-warmgray">Total Movements</p>
              <p className="text-xl font-bold text-charcoal">{movements.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Movements Table */}
      <div className="bg-cream rounded-xl border border-beige overflow-hidden">
        <div className="px-6 py-4 border-b border-beige">
          <h3 className="text-lg font-semibold text-charcoal">Recent Stock Movements</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movements.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineClock className="w-16 h-16 mx-auto text-warmgray/40 mb-4" />
            <h3 className="text-lg font-medium text-warmgray">No stock movements yet</h3>
            <p className="text-warmgray/60 text-sm mt-1">Record your first stock in or stock out</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f0ea] border-b border-beige">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Notes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/50">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-beige/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-warmgray">{movement.reference_number}</td>
                    <td className="px-4 py-3 text-sm font-medium text-charcoal">{movement.product?.name || 'Product'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        movement.type === 'in'
                          ? 'bg-sage/10 text-sage'
                          : 'bg-mutedred/10 text-mutedred'
                      }`}>
                        {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-bold ${
                      movement.type === 'in' ? 'text-sage' : 'text-danger'
                    }`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray max-w-[200px] truncate">
                      {movement.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray">{movement.user?.name || 'User'}</td>
                    <td className="px-4 py-3 text-sm text-warmgray">{new Date(movement.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock In Modal */}
      {showInModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="border-b border-beige px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-charcoal">Stock In - Receive Products</h2>
            </div>
            <form onSubmit={handleStockIn} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Product *</label>
                <select value={stockInData.product_id} onChange={(e) => setStockInData({ ...stockInData, product_id: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none">
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.quantity} {p.unit_type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Quantity *</label>
                <input type="number" value={stockInData.quantity} onChange={(e) => setStockInData({ ...stockInData, quantity: e.target.value })} required min="1"
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  placeholder="Enter quantity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                <textarea value={stockInData.notes} onChange={(e) => setStockInData({ ...stockInData, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
                  placeholder="Optional notes..." />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige">
                <button type="button" onClick={() => setShowInModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-warmgray hover:bg-beige/30 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-sage rounded-lg hover:bg-[#6a856c] disabled:opacity-50 transition-colors">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {submitting ? 'Processing...' : 'Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Out Modal */}
      {showOutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="border-b border-beige px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-charcoal">Stock Out - Dispense Products</h2>
            </div>
            <form onSubmit={handleStockOut} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Product *</label>
                <select value={stockOutData.product_id} onChange={(e) => setStockOutData({ ...stockOutData, product_id: e.target.value })} required
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none">
                  <option value="">Select a product</option>
                  {products.filter((p) => p.quantity > 0).map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Available: {p.quantity} {p.unit_type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Quantity *</label>
                <input type="number" value={stockOutData.quantity} onChange={(e) => setStockOutData({ ...stockOutData, quantity: e.target.value })} required min="1"
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  placeholder="Enter quantity" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                <textarea value={stockOutData.notes} onChange={(e) => setStockOutData({ ...stockOutData, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
                  placeholder="Optional notes..." />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige">
                <button type="button" onClick={() => setShowOutModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-warmgray hover:bg-beige/30 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-danger rounded-lg hover:bg-[#a35050] disabled:opacity-50 transition-colors">
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {submitting ? 'Processing...' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
