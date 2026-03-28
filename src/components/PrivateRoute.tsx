import { Navigate, Outlet } from 'react-router-dom'

// Troca por useAuthStore quando criar o Zustand
const isAuthenticated = () => !!localStorage.getItem('token')

export function PrivateRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}