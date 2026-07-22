import { OsShell } from '@/components/os/os-shell'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function OsPage() {
  return (
    <ProtectedRoute>
      <OsShell />
    </ProtectedRoute>
  )
}
