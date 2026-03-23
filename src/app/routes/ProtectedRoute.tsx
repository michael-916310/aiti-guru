import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, hydrated } = useAuth()
  const location = useLocation()

  if (!hydrated) {
    return (
      <main className="page page--centered">
        <p className="page__muted">Загрузка…</p>
      </main>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
