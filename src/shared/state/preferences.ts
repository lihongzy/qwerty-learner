import { atomWithStorage } from 'jotai/utils'
import { defaultFontSizeConfig } from '@/shared/constants'
import type { PronunciationType } from '@/shared/types'
import { atomForConfig } from './atomForConfig'

export const fontSizeConfigAtom = atomForConfig('fontsize', defaultFontSizeConfig)
export const isTextSelectableAtom = atomWithStorage('isTextSelectable', false)

export const phoneticConfigAtom = atomForConfig('phoneticConfig', {
  isOpen: true,
  type: 'us' as PronunciationType,
})
