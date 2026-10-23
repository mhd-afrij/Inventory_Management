import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import LowStock from './pages/LowStock'
import ExpiredProducts from './pages/ExpiredProducts'
import StockManagement from './pages/StockManagement'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import LoginHistory from './pages/LoginHistory'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/low-stock" element={<LowStock />} />
        <Route path="products/expired" element={<ExpiredProducts />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="login-history" element={<LoginHistory />} />
      </Route>
    </Routes>
  )
}

export default App
