import { lazy, Suspense } from 'react'
import { AppProviders } from '@/app/AppProviders'
import { Wallpaper } from '@/components/layout/Wallpaper'
import { SiriLoader } from '@/components/system/Siri/SiriLoader'
import { HomePage } from '@/pages/HomePage'

// the admin screen is a separate chunk: portfolio visitors never download it
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'))

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, '') === '/admin'

/** Shown while the admin chunk downloads: the same wallpaper with the Siri orb thinking. */
function AdminFallback() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100svh' }}>
      <Wallpaper />
      <SiriLoader label="Loading Messages" className="siri-loader--page" />
    </div>
  )
}

export default function App() {
  return (
    <AppProviders>
      {isAdminRoute() ? (
        <Suspense fallback={<AdminFallback />}>
          <AdminPage />
        </Suspense>
      ) : (
        <HomePage />
      )}
    </AppProviders>
  )
}
