import { Navigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/LoginForm'
import { useAuth } from '../features/auth/useAuth'

export function LoginPage() {
  const { token, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <main className="page page--centered">
        <p className="page__muted">Загрузка…</p>
      </main>
    )
  }

  if (token) {
    return <Navigate to="/products" replace />
  }

  return (
    <main className="page page--centered">
      <LoginForm />
    </main>
  )
}
