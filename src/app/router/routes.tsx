import AnalysisPage from '@/pages/analysis'
import ErrorBookPage from '@/pages/error-book'
import FriendLinkPage from '@/pages/friend-link'
import GalleryPage from '@/pages/gallery'
import { MobilePage } from '@/pages/mobile'
import TypingPage from '@/pages/typing'
import type { ReactNode } from 'react'

export type AppRoute = {
  path: string
  element: ReactNode
}

export const desktopRoutes: AppRoute[] = [
  { path: '/', element: <TypingPage /> },
  { path: '/gallery', element: <GalleryPage /> },
  { path: '/analysis', element: <AnalysisPage /> },
  { path: '/error-book', element: <ErrorBookPage /> },
  { path: '/friend-link', element: <FriendLinkPage /> },
]

export const sharedRoutes: AppRoute[] = [{ path: '/mobile', element: <MobilePage /> }]

