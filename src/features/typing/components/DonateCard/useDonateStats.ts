import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/lib/db'

export type DonateStats = {
  chapterNumber: number
  dayFromFirstWord: number
  wordNumber: number
  sumWrongCount: number
}

export function useDonateStats() {
  return useLiveQuery<DonateStats | null>(async () => {
    try {
      // These reads are independent, so fetch them together and derive the
      // whole payload in one pass whenever Dexie invalidates the query.
      const [chapterNumber, firstWordRecord, wordNumber, chapterRecords] = await Promise.all([
        db.chapterRecords.count(),
        db.wordRecords.orderBy('timeStamp').first(),
        db.wordRecords.count(),
        db.chapterRecords.toArray(),
      ])

      // No record means "not started yet", not "1970-01-01".
      const dayFromFirstWord = firstWordRecord?.timeStamp ? dayjs().diff(dayjs.unix(firstWordRecord.timeStamp), 'day') : 0
      const sumWrongCount = chapterRecords.reduce((total, record) => total + (record.wrongCount ?? 0), 0)

      return {
        chapterNumber,
        dayFromFirstWord,
        wordNumber,
        sumWrongCount,
      }
    } catch (error) {
      console.error('Failed to load donate stats:', error)
      return {
        chapterNumber: 0,
        dayFromFirstWord: 0,
        wordNumber: 0,
        sumWrongCount: 0,
      }
    }
  }, [])
}
