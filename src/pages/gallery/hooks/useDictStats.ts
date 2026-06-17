import { db } from '@/shared/lib/db'
import type { IChapterRecord } from '@/shared/lib/db/record'
import { useEffect, useState } from 'react'

interface IDictStats {
  exercisedChapterCount: number
}

export function useDictStats(dictID: string, isStartLoad: boolean) {
  const [dictStats, setDictStats] = useState<IDictStats | null>(null)

  useEffect(() => {
    setDictStats(null)
  }, [dictID])

  useEffect(() => {
    if (!isStartLoad || dictStats) {
      return
    }

    let cancelled = false

    const fetchDictStats = async () => {
      const stats = await getDictStats(dictID)

      if (!cancelled) {
        setDictStats(stats)
      }
    }

    void fetchDictStats()

    return () => {
      cancelled = true
    }
  }, [dictID, dictStats, isStartLoad])

  return dictStats
}

async function getDictStats(dict: string): Promise<IDictStats> {
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict }).toArray()
  const exercisedChapterCount = new Set(records.map(({ chapter }) => chapter).filter((chapter): chapter is number => chapter !== null)).size

  return { exercisedChapterCount }
}
