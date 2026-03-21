import { useEffect, useMemo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import useSWR from 'swr'

import { currentChapterAtom, currentDictInfoAtom, reviewModeInfoAtom } from '@/shared/state'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { Word, WordWithIndex } from '@/typings'
import { CHAPTER_LENGTH } from '@/constants'

/** 获取词列表的结果类型 */
export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * 获取当前选中的词典的词列表
 * 根据当前章节、复习模式等条件返回对应的单词数据
 */
export const useWordList = (): UseWordListResult => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom)

  // 当 currentChapter 超出章节总数时，重置为 0
  useEffect(() => {
    if (currentChapter >= currentDictInfo.chapterCount) {
      setCurrentChapter(0)
    }
  }, [currentChapter, currentDictInfo.chapterCount, setCurrentChapter])

  const { data: wordList, error, isLoading } = useSWR(currentDictInfo.url, wordListFetcher)

  const words: WordWithIndex[] = useMemo(() => {
    const newWords: Word[] = isReviewMode
      ? (reviewRecord?.words ?? [])
      : wordList
        ? wordList.slice(currentChapter * CHAPTER_LENGTH, (currentChapter + 1) * CHAPTER_LENGTH)
        : []

    return newWords.map((word, index) => ({
      ...word,
      index,
      trans: normalizeTrans(word.trans),
    }))
  }, [isReviewMode, wordList, reviewRecord?.words, currentChapter])
  return { words, isLoading, error }
}

/**
 * 规范化翻译字段 trans
 * 处理各种可能的输入类型，返回字符串数组
 */
const normalizeTrans = (trans: Word['trans']): string[] => {
  if (Array.isArray(trans)) {
    return trans.filter((item): item is string => typeof item === 'string')
  }
  if (trans === null || trans === undefined || typeof trans === 'object') {
    return []
  }
  return [String(trans)]
}
