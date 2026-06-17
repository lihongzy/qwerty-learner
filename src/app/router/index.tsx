import Loader from '@/shared/components/Loading';
import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { desktopRoutes, sharedRoutes } from './routes';
import { useMediaQuery } from 'usehooks-ts';

export function AppRouter() {
  const isMobile = useMediaQuery('(max-width: 600px)');
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
  );
}
