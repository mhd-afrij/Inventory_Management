import { useState, useEffect } from 'react'
import api from '../config/axios'
import toast from 'react-hot-toast'
import {
  HiOutlineChartBar,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentArrowDown,
  HiOutlinePrinter,
} from 'react-icons/hi2'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function Reports() {
  const [activeTab, setActiveTab] = useState('stock')
  const [loading, setLoading] = useState(true)
  const [stockReport, setStockReport] = useState([])
  const [expiryReport, setExpiryReport] = useState({})
  const [usageReport, setUsageReport] = useState([])
  const [dateFilter, setDateFilter] = useState('30')

  const escapeCsvValue = (value) => {
    const text = value == null ? '' : String(value)
    return `"${text.replace(/"/g, '""')}"`
  }

  const downloadCsv = (filename, rows) => {
    const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getReportTitle = () => {
    if (activeTab === 'expiry') return `Expiry Report (${dateFilter} Days)`
    if (activeTab === 'usage') return `Usage Report (${dateFilter} Days)`
    return 'Stock Report'
  }

  const exportCurrentReportToExcel = () => {
    if (activeTab === 'stock') {
      const rows = [
        ['Product', 'Category', 'Batch', 'Qty', 'Unit Price', 'Total Value', 'Supplier'],
        ...stockReport.map((product) => [
          product.name,
          product.category,
          product.batch_number,
          product.quantity,
          Number(product.purchase_price).toFixed(2),
          (product.quantity * product.purchase_price).toFixed(2),
          product.supplier?.name || '-',
        ]),
      ]
      downloadCsv('stock-report.csv', rows)
      return
    }

    if (activeTab === 'expiry') {
      const rows = [
        ['Section', 'Product', 'Batch', 'Expiry Date', 'Qty', 'Supplier'],
        ...(expiryReport.expired || []).map((p) => [
          'Expired',
          p.name,
          p.batch_number,
          new Date(p.expiry_date).toLocaleDateString(),
          p.quantity,
          p.supplier?.name || '-',
        ]),
        ...(expiryReport.expiring_soon || []).map((p) => [
          'Expiring Soon',
          p.name,
          p.batch_number,
          new Date(p.expiry_date).toLocaleDateString(),
          p.quantity,
          p.supplier?.name || '-',
        ]),
        ...(expiryReport.safe || []).map((p) => [
          'Safe',
          p.name,
          p.batch_number,
          new Date(p.expiry_date).toLocaleDateString(),
          p.quantity,
          p.supplier?.name || '-',
        ]),
      ]
      downloadCsv(`expiry-report-${dateFilter}-days.csv`, rows)
      return
    }

    const rows = [
      ['Product', 'Stock In', 'Stock Out', 'Net Change'],
      ...usageReport.map((item) => [
        item.product_name || item.name,
        item.total_in || 0,
        item.total_out || 0,
        item.net_change || 0,
      ]),
    ]
    downloadCsv(`usage-report-${dateFilter}-days.csv`, rows)
  }

  const exportCurrentReportToPdf = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800')
    if (!printWindow) return

    const content = `
      <html>
        <head>
          <title>${getReportTitle()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
            h1 { margin-bottom: 8px; }
            p { margin-top: 0; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; }
            .right { text-align: right; }
            .section { margin-top: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${getReportTitle()}</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          ${activeTab === 'stock' ? `
            <table>
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Batch</th><th class="right">Qty</th><th class="right">Unit Price</th><th class="right">Total Value</th><th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                ${stockReport.map((product) => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.batch_number || '-'}</td>
                    <td class="right">${product.quantity}</td>
                    <td class="right">Rs. ${Number(product.purchase_price).toFixed(2)}</td>
                    <td class="right">Rs. ${(product.quantity * product.purchase_price).toFixed(2)}</td>
                    <td>${product.supplier?.name || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : activeTab === 'expiry' ? `
            ${expiryReport.expired?.length ? `<div class="section">Expired Products</div><table><thead><tr><th>Product</th><th>Batch</th><th>Expiry Date</th><th class="right">Qty</th><th>Supplier</th></tr></thead><tbody>${expiryReport.expired.map((p) => `<tr><td>${p.name}</td><td>${p.batch_number || '-'}</td><td>${new Date(p.expiry_date).toLocaleDateString()}</td><td class="right">${p.quantity}</td><td>${p.supplier?.name || '-'}</td></tr>`).join('')}</tbody></table>` : ''}
            ${expiryReport.expiring_soon?.length ? `<div class="section">Expiring Soon</div><table><thead><tr><th>Product</th><th>Batch</th><th>Expiry Date</th><th class="right">Qty</th><th>Supplier</th></tr></thead><tbody>${expiryReport.expiring_soon.map((p) => `<tr><td>${p.name}</td><td>${p.batch_number || '-'}</td><td>${new Date(p.expiry_date).toLocaleDateString()}</td><td class="right">${p.quantity}</td><td>${p.supplier?.name || '-'}</td></tr>`).join('')}</tbody></table>` : ''}
            ${(!expiryReport.expired?.length && !expiryReport.expiring_soon?.length) ? '<p>No expiry concerns</p>' : ''}
          ` : `
            <table>
              <thead>
                <tr>
                  <th>Product</th><th class="right">Stock In</th><th class="right">Stock Out</th><th class="right">Net Change</th>
                </tr>
              </thead>
              <tbody>
                ${usageReport.map((item) => `
                  <tr>
                    <td>${item.product_name || item.name}</td>
                    <td class="right">${item.total_in || 0}</td>
                    <td class="right">${item.total_out || 0}</td>
                    <td class="right">${item.net_change || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  const fetchStockReport = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reports/stock')
      setStockReport(response.data.products || response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch stock report:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpiryReport = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/reports/expiry?days=${dateFilter}`)
      setExpiryReport(response.data)
    } catch (error) {
      console.error('Failed to fetch expiry report:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsageReport = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - parseInt(dateFilter))

      const response = await api.get(`/reports/usage?date_from=${startDate.toISOString().split('T')[0]}&date_to=${today.toISOString().split('T')[0]}`)
      setUsageReport(response.data.usage || response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch usage report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'stock') fetchStockReport()
    else if (activeTab === 'expiry') fetchExpiryReport()
    else if (activeTab === 'usage') fetchUsageReport()
  }, [activeTab, dateFilter])

  const tabs = [
    { id: 'stock', label: 'Stock Report' },
    { id: 'expiry', label: 'Expiry Report' },
    { id: 'usage', label: 'Usage Report' },
  ]

  const totalStockValue = stockReport.reduce((sum, p) => sum + (p.quantity * p.purchase_price), 0)

  const chartData = stockReport.slice(0, 10).map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    quantity: p.quantity,
    value: p.quantity * p.purchase_price,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Reports</h1>
          <p className="text-warmgray text-sm mt-1">Inventory analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-beige rounded-lg focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button onClick={() => {
            if (activeTab === 'stock') fetchStockReport()
            else if (activeTab === 'expiry') fetchExpiryReport()
            else fetchUsageReport()
          }} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-warmgray bg-white border border-beige rounded-lg hover:bg-beige/30 transition-colors">
            <HiOutlineArrowPath className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportCurrentReportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#B8755B] rounded-lg hover:opacity-90 transition-colors"
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={exportCurrentReportToPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-warmgray bg-white border border-beige rounded-lg hover:bg-beige/30 transition-colors"
          >
            <HiOutlinePrinter className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-beige">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-terracotta text-terracotta'
                : 'border-transparent text-warmgray hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stock Report */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Total Products</p>
                  <p className="text-2xl font-bold text-charcoal mt-1">{stockReport.length}</p>
                </div>
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Total Stock Value</p>
                  <p className="text-2xl font-bold text-charcoal mt-1">Rs. {totalStockValue.toLocaleString()}</p>
                </div>
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Total Units</p>
                  <p className="text-2xl font-bold text-charcoal mt-1">
                    {stockReport.reduce((sum, p) => sum + p.quantity, 0)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="bg-cream rounded-xl border border-beige p-6">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">Stock Levels</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#f8fafc',
                        }}
                      />
                      <Bar dataKey="quantity" fill="#B8755B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Table */}
              <div className="bg-cream rounded-xl border border-beige overflow-hidden">
                <div className="px-6 py-4 border-b border-beige">
                  <h3 className="text-lg font-semibold text-charcoal">Stock Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f5f0ea] border-b border-beige">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Product</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Batch</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Qty</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Unit Price</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Total Value</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Supplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/50">
                      {stockReport.map((product) => (
                        <tr key={product.id} className="hover:bg-beige/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-charcoal">{product.name}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f5f0ea] text-warmgray">{product.category}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-warmgray font-mono">{product.batch_number}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-charcoal">{product.quantity}</td>
                          <td className="px-4 py-3 text-right text-sm text-warmgray">Rs. {Number(product.purchase_price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-charcoal">Rs. {(product.quantity * product.purchase_price).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-warmgray">{product.supplier?.name || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Expiry Report */}
          {activeTab === 'expiry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Expired Products</p>
                  <p className="text-2xl font-bold text-mutedred mt-1">{expiryReport.expired?.length || 0}</p>
                </div>
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Expiring Soon ({dateFilter} days)</p>
                  <p className="text-2xl font-bold text-amber mt-1">{expiryReport.expiring_soon?.length || 0}</p>
                </div>
                <div className="bg-cream rounded-xl border border-beige p-5">
                  <p className="text-sm text-warmgray">Safe Products</p>
                  <p className="text-2xl font-bold text-sage mt-1">{expiryReport.safe?.length || 0}</p>
                </div>
              </div>

              {/* Expired Products */}
              {expiryReport.expired?.length > 0 && (
                <div className="bg-cream rounded-xl border border-beige overflow-hidden">
                  <div className="px-6 py-4 border-b border-mutedred/20 bg-mutedred/10">
                    <h3 className="text-lg font-semibold text-mutedred flex items-center gap-2">
                      <HiOutlineExclamationTriangle className="w-5 h-5" />
                      Expired Products
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f5f0ea] border-b border-beige">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Product</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Batch</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Expiry Date</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Qty</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Supplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-beige/50">
                        {expiryReport.expired.map((p) => (
                          <tr key={p.id} className="hover:bg-mutedred/10 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-charcoal">{p.name}</td>
                            <td className="px-4 py-3 text-sm text-warmgray font-mono">{p.batch_number}</td>
                            <td className="px-4 py-3 text-sm font-medium text-mutedred">{new Date(p.expiry_date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right text-sm text-charcoal">{p.quantity}</td>
                            <td className="px-4 py-3 text-sm text-warmgray">{p.supplier?.name || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expiring Soon */}
              {expiryReport.expiring_soon?.length > 0 && (
                <div className="bg-cream rounded-xl border border-beige overflow-hidden">
                  <div className="px-6 py-4 border-b border-amber/20 bg-amber/10">
                    <h3 className="text-lg font-semibold text-amber">Expiring Within {dateFilter} Days</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f5f0ea] border-b border-beige">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Product</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Batch</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Expiry Date</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Qty</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Supplier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-beige/50">
                        {expiryReport.expiring_soon.map((p) => (
                          <tr key={p.id} className="hover:bg-amber/10 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-charcoal">{p.name}</td>
                            <td className="px-4 py-3 text-sm text-warmgray font-mono">{p.batch_number}</td>
                            <td className="px-4 py-3 text-sm font-medium text-amber">{new Date(p.expiry_date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right text-sm text-charcoal">{p.quantity}</td>
                            <td className="px-4 py-3 text-sm text-warmgray">{p.supplier?.name || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(!expiryReport.expired?.length && !expiryReport.expiring_soon?.length) && (
                <div className="text-center py-12 bg-cream rounded-xl border border-beige">
                  <HiOutlineExclamationTriangle className="w-12 h-12 mx-auto text-sage/60 mb-2" />
                  <p className="text-warmgray font-medium">No expiry concerns</p>
                  <p className="text-warmgray/60 text-sm">All products are within safe expiry range</p>
                </div>
              )}
            </div>
          )}

          {/* Usage Report */}
          {activeTab === 'usage' && (
            <div className="space-y-6">
              <div className="bg-cream rounded-xl border border-beige overflow-hidden">
                <div className="px-6 py-4 border-b border-beige">
                  <h3 className="text-lg font-semibold text-charcoal">Product Usage ({dateFilter} Days)</h3>
                </div>
                {usageReport.length === 0 ? (
                  <div className="text-center py-12">
                    <HiOutlineChartBar className="w-12 h-12 mx-auto text-warmgray/40 mb-2" />
                    <p className="text-warmgray">No usage data for this period</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f5f0ea] border-b border-beige">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-warmgray uppercase">Product</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Stock In</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Stock Out</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-warmgray uppercase">Net Change</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-beige/50">
                        {usageReport.map((item) => (
                          <tr key={item.product_id || item.id} className="hover:bg-beige/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-charcoal">{item.product_name || item.name}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-sage">+{item.total_in || 0}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-mutedred">-{item.total_out || 0}</td>
                            <td className={`px-4 py-3 text-right text-sm font-bold ${
                              (item.net_change || 0) >= 0 ? 'text-sage' : 'text-mutedred'
                            }`}>
                              {(item.net_change || 0) >= 0 ? '+' : ''}{item.net_change || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
