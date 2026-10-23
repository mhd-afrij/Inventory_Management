import { useState } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineArrowsRightLeft,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineBars3,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
  HiOutlineBell,
  HiOutlineCubeTransparent,
} from 'react-icons/hi2'

const navItems = [
  { to: '/', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/products', label: 'Products', icon: HiOutlineCube },
  { to: '/stock', label: 'Stock Management', icon: HiOutlineArrowsRightLeft },
  { to: '/suppliers', label: 'Suppliers', icon: HiOutlineUsers },
  { to: '/reports', label: 'Reports', icon: HiOutlineChartBar },
]

const adminNavItems = [
  { to: '/login-history', label: 'Login History', icon: HiOutlineClock },
]

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/products/low-stock': 'Low Stock Items',
  '/products/expired': 'Expired Products',
  '/stock': 'Stock Management',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
  '/login-history': 'Login History',
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  const getPageTitle = () => pageTitles[location.pathname] || 'Inventory System'

  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src="/logo.svg" alt="Royal Wellness Center logo" className="w-11 h-11 rounded-xl bg-black object-contain p-1" />
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Royal Aesthetic</h1>
          <p className="text-xs text-secondary">Inventory System</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-semibold text-secondary/60 uppercase tracking-wider">Main Menu</p>
        {allNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/20 text-accent'
                  : 'text-secondary/70 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent' : 'text-secondary/50 group-hover:text-secondary'}`} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-secondary/60 truncate capitalize">{user?.role || 'Staff'}</p>
          </div>
          <button onClick={logout} className="p-2 rounded-lg text-secondary/60 hover:text-danger hover:bg-white/5 transition-colors" title="Logout">
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-ivory/90 backdrop-blur border-b border-line px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-panel transition-colors">
                <HiOutlineBars3 className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-charcoal">{getPageTitle()}</h2>
                <p className="text-xs text-muted-text hidden sm:block">Royal Aesthetic Clinic</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-muted-text hover:text-charcoal hover:bg-panel transition-colors">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </button>

              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-panel transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-charcoal">{user?.name || 'User'}</span>
                  <HiOutlineChevronDown className="w-4 h-4 text-muted-text hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-cream rounded-xl shadow-lg border border-line py-2 z-50">
                      <div className="px-4 py-2 border-b border-line">
                        <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                        <p className="text-xs text-muted-text">{user?.email}</p>
                      </div>
                      <button onClick={() => { setUserMenuOpen(false); logout() }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors">
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
