import type { Word } from '@/typings'
import type { Dictionary } from '@/typings/resource'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export default function useGetWord(name: string, dict: Dictionary) {
  const { data: wordList, error, isLoading } = useSWR(dict?.url, wordListFetcher)
  const [hasError, setHasError] = useState(false)

  const word: Word | undefined = useMemo(() => {
    if (!wordList) return undefined

    const matchedWord = wordList.find((item) => item.name === name)
    if (!matchedWord) {
      setHasError(true)
      return undefined
    }

    return matchedWord
  }, [wordList, name])

  useEffect(() => {
    if (error) setHasError(true)
  }, [error])

  return { word, isLoading, hasError }
}
