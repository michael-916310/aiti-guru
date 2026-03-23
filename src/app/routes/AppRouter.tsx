import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  )
}
