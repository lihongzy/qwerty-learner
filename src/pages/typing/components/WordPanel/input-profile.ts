import type { Word } from '@/shared/types'
import type { Dictionary, LanguageType } from '@/shared/types/resource'

export type InputMode = 'keyboard-direct' | 'keyboard-transliteration' | 'ime-composition' | 'none'

export type InputProfile = {
  mode: InputMode
  warnIME: boolean
}

const directKeyboardLanguages = new Set<LanguageType>(['en', 'de', 'id', 'code'])
const transliterationLanguages = new Set<LanguageType>(['romaji', 'hapin'])
const imeCompositionLanguages = new Set<LanguageType>(['zh', 'ja', 'kk'])

export function getInputProfile(dictInfo: Dictionary): InputProfile {
  if (directKeyboardLanguages.has(dictInfo.language)) {
    return { mode: 'keyboard-direct', warnIME: true }
  }

  if (transliterationLanguages.has(dictInfo.language)) {
    return { mode: 'keyboard-transliteration', warnIME: true }
  }

  if (imeCompositionLanguages.has(dictInfo.language)) {
    return { mode: 'ime-composition', warnIME: false }
  }

  return { mode: 'none', warnIME: false }
}

export function getTypingTarget(word: Word, dictInfo: Dictionary): string {
  if (transliterationLanguages.has(dictInfo.language) && word.notation) {
    return word.notation
  }

  return word.name
}
