import type { Word } from '@/shared/types'

export function getPronunciationTarget(word: Word, language: string) {
  if (language === 'romaji') {
    return word.notation || word.name
  }

  if (language === 'hapin') {
    if (/[\u0400-\u04FF]/.test(word.notation || '')) {
      return word.notation || ''
    }

    return word.trans[2] || word.name
  }

  return word.name
}
