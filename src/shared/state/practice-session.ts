import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { idDictionaryMap } from '@/shared/resources/dictionary'
import type { Dictionary } from '@/shared/types/resource'
import type { ReviewRecord } from '@/shared/lib/db/record'

export type ReviewModeInfo = {
  isReviewMode: boolean
  reviewRecord?: ReviewRecord
}

// 统一在状态层兜底无效词典 id，避免业务层再用 effect 做二次修正。
const normalizeDictId = (dictId: string) => {
  return dictId in idDictionaryMap ? dictId : 'cet4'
}

const persistedCurrentDictIdAtom = atomWithStorage('currentDict', 'cet4')

export const currentDictIdAtom = atom(
  // 读取时始终返回合法 id，这样使用方不会先拿到脏值再触发一次修正渲染。
  (get) => normalizeDictId(get(persistedCurrentDictIdAtom)),
  (_get, set, nextDictId: string) => {
    set(persistedCurrentDictIdAtom, normalizeDictId(nextDictId))
  },
)

export const currentDictInfoAtom = atom<Dictionary>((get) => {
  return idDictionaryMap[get(currentDictIdAtom)]
})

export const currentChapterAtom = atomWithStorage('currentChapter', 0)

export const reviewModeInfoAtom = atomWithStorage<ReviewModeInfo>('reviewModeInfo', {
  isReviewMode: false,
  reviewRecord: undefined,
})

export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)
