import type { Word } from '@/shared/types'
import type { LetterMistakes } from './record'

export type ChapterRecordInput = {
  chapterData: {
    correctCount: number
    wrongCount: number
    userInputLogs: Array<{
      index: number
      correctCount: number
      wrongCount: number
    }>
    wordCount: number
    words: unknown[]
    wordRecordIds?: number[]
  }
  timerData: {
    time: number
  }
}

export type SaveWordRecordInput = {
  word: string
  wrongCount: number
  letterTimeArray: number[]
  letterMistake: LetterMistakes
}

export type SaveWordRecordOptions = {
  onSavedRecordId?: (dbID: number) => void
  onSettled?: () => void
}

export type ReviewWordCandidate = {
  originData: Word
  errorCount: number
  latestErrorTime: number
}
