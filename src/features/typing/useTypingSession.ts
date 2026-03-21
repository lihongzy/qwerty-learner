import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'
import { currentChapterAtom, currentDictIdAtom, isReviewModeAtom, randomConfigAtom, reviewModeInfoAtom } from '@/store'
import { idDictionaryMap } from '@/resources/dictionary'
import { isDesktop, isLegal } from '@/utils'
import { useSaveChapterRecord } from '@/shared/lib/db'
import { useConfetti } from './hooks/useConfetti'
import { useWordList } from './hooks/useWordList'
import { initialState, TypingStateActionType, typingReducer } from './store'

export function useTypingSession() {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [isLoading, setIsLoading] = useState(true)

  const { words } = useWordList()
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const reviewModeInfo = useAtomValue(reviewModeInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)
  const saveChapterRecord = useSaveChapterRecord()

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD })
  }, [dispatch])

  useConfetti(state.isFinished)

  useEffect(() => {
    if (!isDesktop()) {
      const timerId = window.setTimeout(() => {
        alert('Qwerty Learner is not optimized for mobile yet. Please use a desktop browser, or try a tablet with a hardware keyboard.')
      }, 500)

      return () => window.clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    if (!(currentDictId in idDictionaryMap)) {
      setCurrentDictId('cet4')
      setCurrentChapter(0)
    }
  }, [currentDictId, setCurrentChapter, setCurrentDictId])

  useEffect(() => {
    if (words === undefined) {
      return
    }

    const initialIndex = isReviewMode ? (reviewModeInfo.reviewRecord?.index ?? 0) : 0

    dispatch({
      type: TypingStateActionType.SETUP_CHAPTER,
      payload: {
        words,
        shouldShuffle: randomConfig.isOpen,
        initialIndex,
      },
    })
  }, [dispatch, isReviewMode, randomConfig.isOpen, reviewModeInfo.reviewRecord?.index, words])

  useEffect(() => {
    setIsLoading(state.chapterData.words.length === 0)
  }, [state.chapterData.words.length])

  useEffect(() => {
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }

    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [dispatch])

  useEffect(() => {
    if (state.isTyping) {
      return
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const isInputKey = isLegal(e.key) || e.key === ' '
      const hasModifier = e.altKey || e.ctrlKey || e.metaKey

      if (!isLoading && e.key !== 'Enter' && isInputKey && !hasModifier) {
        e.preventDefault()
        dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: true })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch, isLoading, state.isTyping])

  useEffect(() => {
    if (state.isFinished && !state.isSavingRecord) {
      saveChapterRecord(state)
    }
  }, [saveChapterRecord, state])

  useEffect(() => {
    if (!state.isTyping) {
      return
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: TypingStateActionType.TICK_TIMER })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [dispatch, state.isTyping])

  return {
    state,
    dispatch,
    isLoading,
    skipWord,
  }
}
