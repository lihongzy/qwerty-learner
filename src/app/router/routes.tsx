import AnalysisPage from '@/pages/Analysis'
import ErrorBookPage from '@/pages/ErrorBook'
import FriendLinkPage from '@/pages/FriendLink'
import GalleryPage from '@/pages/Gallery-N'
import { MobilePage } from '@/pages/Mobile'
import TypingPage from '@/pages/Typing'
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
