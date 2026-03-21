import Loader from '@/components/Loading'
import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { desktopRoutes, sharedRoutes } from './routes'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 600)

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth <= 600
      if (!nextIsMobile) {
        window.location.href = '/'
      }
      setIsMobile(nextIsMobile)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

export function AppRouter() {
  const isMobile = useIsMobile()

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {isMobile ? (
            <Route path="/*" element={<Navigate to="/mobile" replace />} />
          ) : (
            <>
              {desktopRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              <Route path="/*" element={<Navigate to="/" replace />} />
            </>
          )}
          {sharedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
