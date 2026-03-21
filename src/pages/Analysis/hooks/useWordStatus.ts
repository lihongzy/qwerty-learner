import { db } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { Activity } from 'react-activity-calendar'

function getDatesBetween(start: number, end: number): string[] {
  const startDate = dayjs(start).startOf('day')
  const endDate = dayjs(end).startOf('day')

  if (startDate.isAfter(endDate)) {
    return []
  }

  const dates: string[] = []
  let currentDate = startDate

  while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
    dates.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }

  return dates
}

function getLevel(value: number): 0 | 1 | 2 | 3 | 4 {
  if (value === 0) return 0
  if (value < 4) return 1
  if (value < 8) return 2
  if (value < 12) return 3
  return 4
}

type DailyWordStats = {
  exerciseTime: number
  words: string[]
  totalTime: number
  wrongCount: number
  wrongKeys: string[]
  uniqueWordCount: number
  totalWordLength: number
}

type WrongTimeItem = {
  name: string
  value: number
}

interface IWordStats {
  isEmpty?: boolean
  exerciseRecord: Activity[]
  wordRecord: Activity[]
  wpmRecord: [string, number][]
  accuracyRecord: [string, number][]
  wrongTimeRecord: WrongTimeItem[]
}

function createDailyWordStats(): DailyWordStats {
  return {
    exerciseTime: 0,
    words: [],
    totalTime: 0,
    wrongCount: 0,
    wrongKeys: [],
    uniqueWordCount: 0,
    totalWordLength: 0,
  }
}

function createEmptyWordStats(): IWordStats {
  return {
    isEmpty: true,
    exerciseRecord: [],
    wordRecord: [],
    wpmRecord: [],
    accuracyRecord: [],
    wrongTimeRecord: [],
  }
}

async function getWordStats(startTimeStamp: number, endTimeStamp: number): Promise<IWordStats> {
  const records: IWordRecord[] = await db.wordRecords.where('timeStamp').between(startTimeStamp, endTimeStamp).toArray()

  if (records.length === 0) {
    return createEmptyWordStats()
  }

  // 先为区间内每一天创建默认统计，确保图表日期连续。
  const dailyStatsMap: Record<string, DailyWordStats> = Object.fromEntries(
    getDatesBetween(startTimeStamp * 1000, endTimeStamp * 1000).map((date) => [date, createDailyWordStats()]),
  )

  for (const record of records) {
    const date = dayjs(record.timeStamp * 1000).format('YYYY-MM-DD')
    const dailyStats = dailyStatsMap[date] ?? createDailyWordStats()

    dailyStats.exerciseTime += 1
    dailyStats.words.push(record.word)
    dailyStats.totalTime += record.timing.reduce((total, time) => total + time, 0)
    dailyStats.wrongCount += record.wrongCount
    dailyStats.totalWordLength += record.word.length
    dailyStats.wrongKeys.push(...Object.values(record.mistakes).flat())

    dailyStatsMap[date] = dailyStats
  }

  const recordEntries = Object.entries(dailyStatsMap).map(([date, stats]) => {
    const uniqueWordCount = new Set(stats.words).size

    return [
      date,
      {
        ...stats,
        uniqueWordCount,
      },
    ] as const
  })

  const exerciseRecord: IWordStats['exerciseRecord'] = recordEntries.map(([date, { exerciseTime }]) => ({
    date,
    count: exerciseTime,
    level: getLevel(exerciseTime),
  }))

  const wordRecord: IWordStats['wordRecord'] = recordEntries.map(([date, { uniqueWordCount }]) => ({
    date,
    count: uniqueWordCount,
    level: getLevel(uniqueWordCount),
  }))

  // WPM 使用未去重单词数 / 总时长（分钟）计算，没有有效时长时直接过滤掉。
  const wpmRecord: IWordStats['wpmRecord'] = recordEntries
    .map<[string, number]>(([date, { words, totalTime }]) => [date, totalTime > 0 ? Math.round(words.length / (totalTime / 1000 / 60)) : 0])
    .filter(([, value]) => value > 0)

  // 正确率 = 总字符数 / (总字符数 + 错误次数)。
  const accuracyRecord: IWordStats['accuracyRecord'] = recordEntries
    .map<[string, number]>(([date, { totalWordLength, wrongCount }]) => [
      date,
      totalWordLength + wrongCount > 0 ? Math.round((totalWordLength / (totalWordLength + wrongCount)) * 100) : 0,
    ])
    .filter(([, value]) => value > 0)

  // 统计所有错误按键，并统一转成大写后累计次数。
  const wrongKeyCountMap = new Map<string, number>()

  for (const [, { wrongKeys }] of recordEntries) {
    for (const wrongKey of wrongKeys) {
      const normalizedKey = wrongKey.toUpperCase()
      wrongKeyCountMap.set(normalizedKey, (wrongKeyCountMap.get(normalizedKey) ?? 0) + 1)
    }
  }

  const wrongTimeRecord: IWordStats['wrongTimeRecord'] = Array.from(wrongKeyCountMap, ([name, value]) => ({ name, value }))

  return {
    isEmpty: false,
    exerciseRecord,
    wordRecord,
    wpmRecord,
    accuracyRecord,
    wrongTimeRecord,
  }
}

export function useWordStats(startTimeStamp: number, endTimeStamp: number) {
  const [wordStats, setWordStats] = useState<IWordStats>(createEmptyWordStats())

  useEffect(() => {
    let cancelled = false

    const fetchWordStats = async () => {
      const stats = await getWordStats(startTimeStamp, endTimeStamp)

      if (!cancelled) {
        setWordStats(stats)
      }
    }

    void fetchWordStats()

    return () => {
      cancelled = true
    }
  }, [startTimeStamp, endTimeStamp])

  return wordStats
}
