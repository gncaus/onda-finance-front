import { createBrowserRouter } from 'react-router-dom'
import { PrivateRoute } from '@/components/PrivateRoute'
import Login  from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Transfer from '@/pages/Transfer'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/transfer',
        element: <Transfer />,
      },
    ],
  },
])