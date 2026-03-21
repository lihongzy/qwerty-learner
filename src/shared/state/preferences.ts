import { atomWithStorage } from 'jotai/utils'
import { defaultFontSizeConfig } from '@/shared/constants'
import type { PhoneticType } from '@/features/typing/state'
import { atomForConfig } from './atomForConfig'

export const fontSizeConfigAtom = atomForConfig('fontsize', defaultFontSizeConfig)
export const isTextSelectableAtom = atomWithStorage('isTextSelectable', false)

export const phoneticConfigAtom = atomForConfig('phoneticConfig', {
  isOpen: true,
  type: 'us' as PhoneticType,
})
