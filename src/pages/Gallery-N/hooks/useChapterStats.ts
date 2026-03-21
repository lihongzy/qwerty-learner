import { db } from '@/utils/db'
import type { IChapterRecord } from '@/utils/db/record'
import { useEffect, useState } from 'react'

type ChapterStats = {
  exerciseCount: number
  avgWrongCount: number
}

// 懒加载当前词典某一章节的统计信息，避免画廊页一次查询全部章节记录。
export function useChapterStats(chapter: number, dictId: string, isStartLoad: boolean) {
  const [chapterStats, setChapterStats] = useState<ChapterStats | null>(null)

  useEffect(() => {
    if (!isStartLoad) {
      return
    }

    let isMounted = true

    const fetchChapterStats = async () => {
      const stats = await getChapterStats(dictId, chapter)

      if (isMounted) {
        setChapterStats(stats)
      }
    }

    setChapterStats(null)
    void fetchChapterStats()

    return () => {
      isMounted = false
    }
  }, [chapter, dictId, isStartLoad])

  return chapterStats
}

// 根据词典和章节，从本地数据库聚合出练习次数和平均错误数。
async function getChapterStats(dict: string, chapter: number | null): Promise<ChapterStats> {
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict, chapter }).toArray()

  const exerciseCount = records.length
  const totalWrongCount = records.reduce((total, { wrongCount }) => total + (wrongCount || 0), 0)
  const avgWrongCount = exerciseCount > 0 ? Math.round((totalWrongCount / exerciseCount) * 10) / 10 : 0

  return { exerciseCount, avgWrongCount }
}
