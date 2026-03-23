import { useAtomValue, useSetAtom } from 'jotai'
import clsx from 'clsx'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { isReviewModeAtom, phoneticConfigAtom, reviewModeInfoAtom } from '@/shared/state'
import { isShowPrevAndNextWordAtom, loopWordConfigAtom } from '@/features/typing/state'
import type { Word } from '@/shared/types'
import { usePrefetchPronunciationSound } from '../../hooks/usePronunciation'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'

import { PrevAndNextWord } from '../PrevAndNextWord'
import { Progress } from '../Progress'
import { Phonetic } from '@/shared/components/word-display'
import { Translation } from './components/Translation'
import { WordComponent } from './components/Word'

export const WordPanel = () => {
  const { state, dispatch } = useContext(TypingContext)!
  const phoneticConfig = useAtomValue(phoneticConfigAtom)
  const isShowPrevAndNextWord = useAtomValue(isShowPrevAndNextWordAtom)
  const { times: loopWordTimes } = useAtomValue(loopWordConfigAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)

  const [wordComponentKey, setWordComponentKey] = useState(0)
  const [currentWordExerciseCount, setCurrentWordExerciseCount] = useState(0)
  const lastFinishedTokenRef = useRef<string | null>(null)

  const currentWord = state.chapterData.words[state.chapterData.index]
  const nextWord = state.chapterData.words[state.chapterData.index + 1] as Word | undefined
  const currentFinishToken = `${state.chapterData.index}:${wordComponentKey}:${currentWordExerciseCount}`
  const targetNextIndex = state.chapterData.index + 1

  const prevIndex = useMemo(() => {
    const newIndex = state.chapterData.index - 1
    return newIndex < 0 ? 0 : newIndex
  }, [state.chapterData.index])

  const nextIndex = useMemo(() => {
    const newIndex = state.chapterData.index + 1
    return newIndex > state.chapterData.words.length - 1 ? state.chapterData.words.length - 1 : newIndex
  }, [state.chapterData.index, state.chapterData.words.length])

  usePrefetchPronunciationSound(nextWord?.name)

  const reloadCurrentWordComponent = useCallback(() => {
    setWordComponentKey((old) => old + 1)
  }, [])

  const onFinish = useCallback(() => {
    if (lastFinishedTokenRef.current === currentFinishToken) {
      return
    }

    lastFinishedTokenRef.current = currentFinishToken

    if (state.chapterData.index < state.chapterData.words.length - 1 || currentWordExerciseCount < loopWordTimes - 1) {
      if (currentWordExerciseCount < loopWordTimes - 1) {
        setCurrentWordExerciseCount((old) => old + 1)
        dispatch({ type: TypingStateActionType.LOOP_CURRENT_WORD })
        reloadCurrentWordComponent()
      } else {
        setCurrentWordExerciseCount(0)
        if (isReviewMode) {
          setReviewModeInfo((old) => ({
            ...old,
            reviewRecord: old.reviewRecord ? { ...old.reviewRecord, index: targetNextIndex } : undefined,
          }))
        }
        dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex: targetNextIndex })
      }
    } else {
      dispatch({ type: TypingStateActionType.FINISH_CHAPTER })
      if (isReviewMode) {
        setReviewModeInfo((old) => ({ ...old, reviewRecord: old.reviewRecord ? { ...old.reviewRecord, isFinished: true } : undefined }))
      }
    }
  }, [
    currentFinishToken,
    state.chapterData.index,
    state.chapterData.words.length,
    currentWordExerciseCount,
    loopWordTimes,
    dispatch,
    reloadCurrentWordComponent,
    isReviewMode,
    setReviewModeInfo,
    targetNextIndex,
  ])

  const onSkipWord = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex: prevIndex })
      }

      if (type === 'next') {
        dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex: nextIndex })
      }
    },
    [dispatch, prevIndex, nextIndex],
  )

  useHotkeys(
    'ctrl+shift+arrowleft',
    (e) => {
      e.preventDefault()
      onSkipWord('prev')
    },
    { preventDefault: true },
  )

  useHotkeys(
    'ctrl+shift+arrowright',
    (e) => {
      e.preventDefault()
      onSkipWord('next')
    },
    { preventDefault: true },
  )

  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      {!state.isTyping && (
        <div className="rounded-app-lg bg-bg-overlay/80 absolute inset-0 z-20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
          <div className="px-6 text-center">
            <p className="text-text-strong text-2xl font-semibold select-none">
              {state.timerData.time ? '按任意键继续练习' : '按任意键开始练习'}
            </p>
          </div>
        </div>
      )}
      <div className="container flex w-full justify-between">
        {isShowPrevAndNextWord && state.isTyping && (
          <>
            <PrevAndNextWord type="prev" />
            <PrevAndNextWord type="next" />
          </>
        )}
      </div>

      <div className="container flex grow flex-col items-center justify-center">
        {currentWord && (
          <div className="relative flex w-full justify-center">
            <div className="relative flex w-full max-w-[min(86vw,56rem)] flex-col items-center">
              <WordComponent word={currentWord} onFinish={onFinish} key={`${state.chapterData.index}-${wordComponentKey}`} />
              {phoneticConfig.isOpen && <Phonetic word={currentWord} />}
              <Translation trans={currentWord.trans.join('；')} showTrans={state.isTransVisible} />
            </div>
          </div>
        )}
      </div>

      <Progress className={clsx('mt-6 mb-8', state.isTyping ? 'opacity-100' : 'opacity-0')} />
    </div>
  )
}
