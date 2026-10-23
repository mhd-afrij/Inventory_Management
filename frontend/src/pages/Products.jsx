import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/axios'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineExclamationTriangle,
  HiOutlineCube,
  HiOutlineArrowPath,
} from 'react-icons/hi2'

const CATEGORIES = ['Medicine', 'Injection', 'Consumable', 'Other']
const UNIT_TYPES = ['pcs', 'ml', 'mg', 'bottles', 'boxes', 'strips']

export default function Products() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Medicine',
    brand: '',
    batch_number: '',
    expiry_date: '',
    quantity: '',
    unit_type: 'pcs',
    purchase_price: '',
    selling_price: '',
    supplier_id: '',
    low_stock_threshold: '10',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category', categoryFilter)

      const response = await api.get(`/products?${params.toString()}`)
      const data = response.data
      setProducts(data.data || data.products || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers')
      const data = response.data
      setSuppliers(data.data || data.suppliers || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSuppliers()
  }, [searchTerm, categoryFilter])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: 'Medicine',
      brand: '',
      batch_number: '',
      expiry_date: '',
      quantity: '',
      unit_type: 'pcs',
      purchase_price: '',
      selling_price: '',
      supplier_id: '',
      low_stock_threshold: '10',
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      category: product.category || 'Medicine',
      brand: product.brand || '',
      batch_number: product.batch_number || '',
      expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : '',
      quantity: product.quantity || '',
      unit_type: product.unit_type || 'pcs',
      purchase_price: product.purchase_price || '',
      selling_price: product.selling_price || '',
      supplier_id: product.supplier_id || '',
      low_stock_threshold: product.low_stock_threshold || '10',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        batch_number: formData.batch_number,
        expiry_date: formData.expiry_date,
        quantity: parseInt(formData.quantity) || 0,
        unit_type: formData.unit_type,
        purchase_price: parseFloat(formData.purchase_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        supplier_id: parseInt(formData.supplier_id) || null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload)
        toast.success('Product updated successfully')
      } else {
        await api.post('/products', payload)
        toast.success('Product created successfully')
      }

      setShowModal(false)
      fetchProducts()
    } catch (error) {
      const msg = error.response?.data?.message
      const errors = error.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0]
        toast.error(firstError || 'Validation failed')
      } else {
        toast.error(msg || 'Operation failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await api.delete(`/products/${productId}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const getStockStatus = (product) => {
    if (product.quantity <= 0) return { label: 'Out of Stock', classes: 'bg-mutedred/10 text-mutedred' }
    if (product.quantity <= (product.low_stock_threshold || 10)) return { label: 'Low Stock', classes: 'bg-amber/10 text-amber' }
    return { label: 'In Stock', classes: 'bg-sage/10 text-sage' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Products</h1>
          <p className="text-warmgray text-sm mt-1">Manage your inventory products</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/products/low-stock"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-amber bg-amber/10 border border-amber/20 rounded-lg hover:bg-amber/20 transition-colors"
          >
            <HiOutlineExclamationTriangle className="w-4 h-4" />
            Low Stock
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cream rounded-xl border border-beige p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray/60" />
            <input
              type="text"
              placeholder="Search by name, brand, or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-charcoal bg-surface border border-line rounded-lg hover:bg-panel transition-colors"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Products Table */}
          <div className="bg-cream rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (products.data || products).length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineCube className="w-16 h-16 mx-auto text-muted-text/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-text">No products found</h3>
            <p className="text-muted-text/60 text-sm mt-1">Add your first product to get started</p>
            <button onClick={openCreateModal} className="mt-4 px-4 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
              <HiOutlinePlus className="w-4 h-4 inline mr-1" />
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-panel border-b border-line">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Batch No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Expiry</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-text uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/50">
                {(products.data || products).map((product) => {
                  const status = getStockStatus(product)
                  return (
                    <tr key={product.id} className="hover:bg-panel transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-muted-text/60">{product.brand} | {product.unit_type}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-panel text-muted-text">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-text font-mono">{product.batch_number}</td>
                      <td className="px-4 py-3 text-sm text-muted-text">
                        {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${
                          product.quantity <= 0 ? 'text-danger' :
                          product.quantity <= (product.low_stock_threshold || 10) ? 'text-warning' :
                          'text-charcoal'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-charcoal">
                        Rs. {Number(product.selling_price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 rounded-lg text-muted-text hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 rounded-lg text-muted-text hover:text-danger hover:bg-danger/10 transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.last_page && products.last_page > 1 && (
        <div className="flex items-center justify-between bg-cream rounded-xl border border-beige px-4 py-3">
          <p className="text-sm text-muted-text">
            Showing {products.from} to {products.to} of {products.total} products
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {/* TODO: pagination */}}
                className={`px-3 py-1 text-sm rounded-lg ${
                  page === products.current_page
                    ? 'bg-primary text-white'
                    : 'text-muted-text hover:bg-panel'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-cream border-b border-line px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-charcoal">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-1">Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="Enter product name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none">
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Brand *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="e.g., Glutathione Plus" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Batch Number *</label>
                  <input type="text" name="batch_number" value={formData.batch_number} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="e.g., BATCH-2024-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Expiry Date *</label>
                  <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Quantity *</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0"
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Unit Type *</label>
                  <select name="unit_type" value={formData.unit_type} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none">
                    {UNIT_TYPES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Purchase Price (Rs.) *</label>
                  <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleInputChange} required step="0.01" min="0"
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Selling Price (Rs.) *</label>
                  <input type="number" name="selling_price" value={formData.selling_price} onChange={handleInputChange} required step="0.01" min="0"
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Supplier *</label>
                  <select name="supplier_id" value={formData.supplier_id} onChange={handleInputChange} required
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none">
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Low Stock Threshold</label>
                  <input type="number" name="low_stock_threshold" value={formData.low_stock_threshold} onChange={handleInputChange} min="1"
                    className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                    placeholder="10" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-warmgray hover:text-charcoal hover:bg-beige/30 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
