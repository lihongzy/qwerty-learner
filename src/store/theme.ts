import { atomWithStorage } from 'jotai/utils'

const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export const isOpenDarkModeAtom = atomWithStorage('isOpenDarkMode', prefersDarkMode)
