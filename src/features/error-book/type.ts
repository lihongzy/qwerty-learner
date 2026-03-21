import type { WordRecord } from '@/shared/lib/db/record'

export type groupedWordRecords = {
  word: string
  dict: string
  records: WordRecord[]
  wrongCount: number
}
