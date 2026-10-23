import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../config/axios'
import { HiOutlineCube, HiOutlineExclamationTriangle, HiOutlineUsers, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineChartBar, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi2'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#B8755B', '#C5A46D', '#78947A', '#D8B4A6', '#D69A45', '#B95C5C']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
        <p className="text-warmgray text-sm">Loading dashboard...</p>
      </div>
    </div>
  )

  const statCards = [
    { title: 'Total Products', value: stats?.total_products || 0, icon: HiOutlineCube, bg: 'bg-terracotta/10', text: 'text-terracotta', link: '/products' },
    { title: 'Low Stock Alerts', value: stats?.low_stock_count || 0, icon: HiOutlineExclamationTriangle, bg: 'bg-amber/10', text: 'text-amber', link: '/products/low-stock' },
    { title: 'Expired Products', value: stats?.expired_count || 0, icon: HiOutlineClock, bg: 'bg-mutedred/10', text: 'text-mutedred', link: '/products/expired' },
    { title: 'Total Suppliers', value: stats?.total_suppliers || 0, icon: HiOutlineUsers, bg: 'bg-sage/10', text: 'text-sage', link: '/suppliers' },
    { title: 'Stock Value', value: `Rs. ${Number(stats?.total_stock_value || 0).toLocaleString()}`, icon: HiOutlineCurrencyDollar, bg: 'bg-gold/10', text: 'text-gold', link: '/reports' },
    { title: 'Stock In Today', value: stats?.total_stock_in_today || 0, icon: HiOutlineArrowTrendingUp, bg: 'bg-sage/10', text: 'text-sage', link: '/stock' },
    { title: 'Stock Out Today', value: stats?.total_stock_out_today || 0, icon: HiOutlineArrowTrendingDown, bg: 'bg-mutedred/10', text: 'text-mutedred', link: '/stock' },
  ]

  const categoryData = (stats?.category_distribution || []).map(i => ({ name: i.category, count: i.count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
        <p className="text-warmgray text-sm mt-1">Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.slice(0, 4).map(s => (
          <Link key={s.title} to={s.link} className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warmgray">{s.title}</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.text}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.slice(4).map(s => (
          <Link key={s.title} to={s.link} className="card hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warmgray">{s.title}</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.text}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Stock by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count" nameKey="name" label={({ name, count }) => `${name}: ${count}`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-[280px] text-warmgray">No category data</div>}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Low Stock Items</h3>
          {stats?.low_stock_products?.length > 0 ? (
            <div className="space-y-3">
              {stats.low_stock_products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-ivory hover:bg-beige/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-warmgray">{p.category} - {p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-mutedred">{p.quantity} left</p>
                    <p className="text-xs text-warmgray">Min: {p.low_stock_threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="flex items-center justify-center h-[280px] text-warmgray">No low stock items</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-charcoal">Expired Products</h3>
            <Link to="/products/expired" className="text-sm text-terracotta hover:underline">View All</Link>
          </div>
          {stats?.expired_products?.length > 0 ? (
            <div className="space-y-3">
              {stats.expired_products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-mutedred/5 hover:bg-mutedred/10 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-warmgray">{p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-mutedred">Expired: {new Date(p.expiry_date).toLocaleDateString()}</p>
                    <p className="text-xs text-warmgray">Qty: {p.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="flex items-center justify-center h-[200px] text-warmgray">No expired products</div>}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Recent Stock Activities</h3>
          {(stats?.recent_activities || []).length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {stats.recent_activities.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-ivory hover:bg-beige/50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${a.type === 'in' ? 'bg-sage/20 text-sage' : 'bg-mutedred/20 text-mutedred'}`}>
                    {a.type === 'in' ? <HiOutlineArrowTrendingUp className="w-4 h-4" /> : <HiOutlineArrowTrendingDown className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal truncate">
                      <span className="font-medium">{a.product?.name || 'Product'}</span> -{' '}
                      <span className={a.type === 'in' ? 'text-sage' : 'text-mutedred'}>
                        {a.type === 'in' ? '+' : '-'}{a.quantity} units
                      </span>
                    </p>
                    <p className="text-xs text-warmgray">by {a.user?.name || 'User'} | {new Date(a.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${a.type === 'in' ? 'bg-sage/10 text-sage' : 'bg-mutedred/10 text-mutedred'}`}>
                    {a.type === 'in' ? 'In' : 'Out'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-warmgray">
              <div className="text-center"><HiOutlineChartBar className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No recent activity</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
