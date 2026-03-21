import AnalysisPage from '@/features/analysis'
import ErrorBookPage from '@/features/error-book'
import FriendLinkPage from '@/features/friend-link'
import GalleryPage from '@/features/gallery'
import { MobilePage } from '@/features/mobile'
import TypingPage from '@/features/typing'
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

