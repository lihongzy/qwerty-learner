import type { WordWithIndex } from '@/shared/types'
import type { LetterMistakes } from '@/shared/lib/db/record'

export type ChapterData = {
  words: WordWithIndex[]
  index: number
  wordCount: number
  correctCount: number
  wrongCount: number
  userInputLogs: UserInputLog[]
  wordRecordIds: number[]
}

export type UserInputLog = {
  index: number
  correctCount: number
  wrongCount: number
  LetterMistakes: LetterMistakes
}

export type TimerData = {
  time: number
  accuracy: number
  wpm: number
}

export type TypingState = {
  chapterData: ChapterData
  timerData: TimerData
  isTyping: boolean
  isFinished: boolean
  isShowSkip: boolean
  isTransVisible: boolean
  isLoopSingleWord: boolean
  isSavingRecord: boolean
}
