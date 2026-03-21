import { useAtomValue } from 'jotai'
import { useEffect, type PropsWithChildren } from 'react'
import { isOpenDarkModeAtom } from '@/app/state/theme'

export function ThemeProvider({ children }: PropsWithChildren) {
  const darkMode = useAtomValue(isOpenDarkModeAtom)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return children
}
