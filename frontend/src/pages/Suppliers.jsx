import { useState, useEffect } from 'react'
import api from '../config/axios'
import toast from 'react-hot-toast'
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineArrowPath,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from 'react-icons/hi2'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    email: '',
    address: '',
  })

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/suppliers')
      const data = response.data
      setSuppliers(data.data || data.suppliers || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
      toast.error('Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const openCreateModal = () => {
    setEditingSupplier(null)
    setFormData({ name: '', contact_number: '', email: '', address: '' })
    setShowModal(true)
  }

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name || '',
      contact_number: supplier.contact_number || '',
      email: supplier.email || '',
      address: supplier.address || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.id}`, formData)
        toast.success('Supplier updated successfully')
      } else {
        await api.post('/suppliers', formData)
        toast.success('Supplier created successfully')
      }

      setShowModal(false)
      fetchSuppliers()
    } catch (error) {
      const errors = error.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0]
        toast.error(firstError || 'Validation failed')
      } else {
        toast.error(error.response?.data?.message || 'Operation failed')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (supplierId) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return

    try {
      await api.delete(`/suppliers/${supplierId}`)
      toast.success('Supplier deleted successfully')
      fetchSuppliers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete supplier')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Suppliers</h1>
          <p className="text-warmgray text-sm mt-1">Manage your product suppliers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSuppliers}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-charcoal bg-white border border-line shadow-sm rounded-lg hover:bg-panel hover:border-primary/40 hover:text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <HiOutlineArrowPath className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary shadow-md shadow-primary/20 rounded-lg hover:bg-primary-hover hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-ivory"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="bg-cream rounded-xl border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineUsers className="w-16 h-16 mx-auto text-warmgray/40 mb-4" />
            <h3 className="text-lg font-medium text-warmgray">No suppliers found</h3>
            <p className="text-warmgray/60 text-sm mt-1">Add your first supplier to get started</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary shadow-md shadow-primary/20 rounded-lg hover:bg-primary-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-ivory"
            >
              <HiOutlinePlus className="w-4 h-4 inline mr-1" />
              Add Supplier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border border-beige rounded-xl p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-gold flex items-center justify-center text-white text-sm font-semibold">
                      {supplier.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{supplier.name}</h3>
                      <p className="text-xs text-warmgray">Supplier</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(supplier)}
                      className="p-2 rounded-lg text-primary bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label={`Edit ${supplier.name}`}
                    >
                      <HiOutlinePencilSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(supplier.id)}
                      className="p-2 rounded-lg text-danger bg-danger/10 hover:bg-danger hover:text-white border border-danger/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger/30"
                      aria-label={`Delete ${supplier.name}`}
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {supplier.contact_number && (
                    <div className="flex items-center gap-2 text-warmgray">
                      <HiOutlinePhone className="w-4 h-4 text-warmgray/60" />
                      {supplier.contact_number}
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-warmgray truncate">
                      <HiOutlineEnvelope className="w-4 h-4 text-warmgray/60 flex-shrink-0" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center gap-2 text-warmgray text-xs">
                      <HiOutlineMapPin className="w-4 h-4 text-warmgray/60 flex-shrink-0" />
                      <span className="truncate">{supplier.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="border-b border-beige px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-charcoal">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Supplier Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  placeholder="Enter supplier name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Contact Number *</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} required
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  placeholder="+94 77 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  placeholder="supplier@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} required rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
                  placeholder="Full address..." />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-charcoal bg-panel border border-line rounded-lg hover:bg-beige/40 hover:border-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary shadow-md shadow-primary/20 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-white"
                >
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {submitting ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
