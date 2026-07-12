import { RouterProvider } from 'react-router'
import { router } from './routes'
import { AuthProvider } from './auth-context'
import { VehiclesProvider } from './vehicles-context'

export default function App() {
  return (
    <AuthProvider>
      <VehiclesProvider>
        <RouterProvider router={router} />
      </VehiclesProvider>
    </AuthProvider>
  )
}
