import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/axios'
import { HiOutlineExclamationTriangle, HiOutlineArrowLeft } from 'react-icons/hi2'

export default function ExpiredProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExpired = async () => {
      try {
        const response = await api.get('/products-expired')
        const data = response.data
        setProducts(data.data || data.products || (Array.isArray(data) ? data : []))
      } catch (error) {
        console.error('Failed to fetch expired products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchExpired()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/products"
          className="p-2 rounded-lg text-warmgray/60 hover:text-charcoal hover:bg-beige/30 transition-colors"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Expired Products</h1>
          <p className="text-warmgray text-sm mt-1">Products that have passed their expiry date</p>
        </div>
      </div>

      <div className="bg-cream rounded-xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineExclamationTriangle className="w-16 h-16 mx-auto text-sage/60 mb-4" />
            <h3 className="text-lg font-medium text-warmgray">No expired products</h3>
            <p className="text-warmgray/60 text-sm mt-1">All products are within their valid date range</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f0ea] border-b border-beige">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Batch</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Expiry Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-mutedred/10 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        <p className="text-xs text-warmgray/60">{product.brand}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f5f0ea] text-warmgray">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-warmgray font-mono">{product.batch_number}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-charcoal">{product.quantity}</td>
                    <td className="px-4 py-3 text-sm text-mutedred font-medium">
                      {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-mutedred/10 text-mutedred">
                        Expired
                      </span>
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
