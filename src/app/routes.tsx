import { Navigate } from 'react-router'
import { createBrowserRouter } from 'react-router'
import { useAuth } from './auth-context'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { Admin } from './pages/admin'

function ProtectedAdmin() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ds-surface)] text-[var(--ds-warm-gray)]">
        Carregando…
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />
  return <Admin />
}

export const router = createBrowserRouter([
  { path: '/', Component: Home },
  { path: '/login', Component: Login },
  { path: '/admin', Component: ProtectedAdmin },
  { path: '*', Component: Home },
])
