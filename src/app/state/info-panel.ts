import { atom } from 'jotai'
import type { InfoPanelState } from '@/typings'

export const infoPanelStateAtom = atom<InfoPanelState>({
  donate: false,
  vsc: false,
  community: false,
  redBook: false,
})
