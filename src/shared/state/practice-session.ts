import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { idDictionaryMap } from '@/shared/resources/dictionary'
import type { Dictionary } from '@/shared/types/resource'
import type { ReviewRecord } from '@/shared/lib/db/record'

export type ReviewModeInfo = {
  isReviewMode: boolean
  reviewRecord?: ReviewRecord
}

export const currentDictIdAtom = atomWithStorage('currentDict', 'cet4')

export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom)
  return idDictionaryMap[id] ?? idDictionaryMap.cet4
})

export const currentChapterAtom = atomWithStorage('currentChapter', 0)

export const reviewModeInfoAtom = atomWithStorage<ReviewModeInfo>('reviewModeInfo', {
  isReviewMode: false,
  reviewRecord: undefined,
})

export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)
