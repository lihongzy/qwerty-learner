import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { idDictionaryMap } from '@/resources/dictionary'
import type { Dictionary } from '@/typings/resource'

export const currentDictIdAtom = atomWithStorage('currentDict', 'cet4')

export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom)
  return idDictionaryMap[id] ?? idDictionaryMap.cet4
})

export const currentChapterAtom = atomWithStorage('currentChapter', 0)
