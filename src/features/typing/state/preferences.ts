import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { LoopWordTimesOption, PronunciationType, WordDictationOpenBy, WordDictationType } from '@/shared/types'
import { atomForConfig } from '@/shared/state/atomForConfig'

export type PhoneticType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'

export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>('loopWordConfig', { times: 1 })
export const isShowPrevAndNextWordAtom = atomWithStorage('isShowPrevAndNextWord', true)
export const isShowAnswerOnHoverAtom = atomWithStorage('isShowAnswerOnHover', true)
export const isIgnoreCaseAtom = atomWithStorage('isIgnoreCaseAtom', true)
export const randomConfigAtom = atomForConfig('randomConfig', { isOpen: false })

export const wordDictationConfigAtom = atomForConfig('wordDictationConfig', {
  isOpen: false,
  type: 'hideAll' as WordDictationType,
  openBy: 'auto' as WordDictationOpenBy,
})

export const pronunciationConfigAtom = atomForConfig('pronunciationConfig', {
  isOpen: true,
  volume: 1,
  type: 'us' as PronunciationType,
  name: '美音',
  isLoop: false,
  isTransRead: false,
  transVolume: 1,
  rate: 1,
})

export const pronunciationIsOpenAtom = atom((get) => get(pronunciationConfigAtom).isOpen)
