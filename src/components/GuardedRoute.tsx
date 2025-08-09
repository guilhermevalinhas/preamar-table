import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthState } from '../lib/firebase'

export default function GuardedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthState()
  const location = useLocation()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) return <Navigate to="/signin" replace state={{ from: location }} />
  return <>{children}</>
}
