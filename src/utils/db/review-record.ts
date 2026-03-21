import type { TErrorWordData } from '@/pages/Gallery-N/hooks/useErrorWords'
import { db } from '@/utils/db'
import { ReviewRecord } from '@/utils/db/record'
import { useEffect, useState } from 'react'

export function useGetLatestReviewRecord(dictID: string) {
  const [wordReviewRecord, setWordReviewRecord] = useState<ReviewRecord | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    const fetchWordReviewRecord = async () => {
      const record = await getWordReviewRecords(dictID)

      if (!cancelled) {
        setWordReviewRecord(record)
      }
    }

    if (dictID) {
      void fetchWordReviewRecord()
    } else {
      setWordReviewRecord(undefined)
    }

    return () => {
      cancelled = true
    }
  }, [dictID])

  return wordReviewRecord
}

async function getWordReviewRecords(dictID: string): Promise<ReviewRecord | undefined> {
  const records = await db.reviewRecords.where('dict').equals(dictID).toArray()
  const latestRecord = records.sort((a, b) => a.createTime - b.createTime).pop()

  return latestRecord && !latestRecord.isFinished ? (latestRecord as ReviewRecord) : undefined
}

export async function putWordReviewRecord(record: ReviewRecord) {
  await db.reviewRecords.put(record)
}

export async function generateNewWordReviewRecord(dictID: string, errorData: TErrorWordData[]) {
  const words = errorData
    .slice()
    .sort((a, b) => {
      if (b.errorCount !== a.errorCount) {
        return b.errorCount - a.errorCount
      }

      return b.latestErrorTime - a.latestErrorTime
    })
    .map((item) => item.originData)

  const record = new ReviewRecord(dictID, words)
  const id = await db.reviewRecords.add(record)
  record.id = id

  return record
}
