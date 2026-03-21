import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import { EXPLICIT_SPACE } from '@/shared/constants'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { WordPronunciationIcon, type WordPronunciationIconRef } from '@/shared/components/WordPronunciationIcon'
import { currentChapterAtom, currentDictInfoAtom, isTextSelectableAtom } from '@/shared/state'
import { isIgnoreCaseAtom, isShowAnswerOnHoverAtom, pronunciationIsOpenAtom, wordDictationConfigAtom } from '@/features/typing/state'
import type { Word } from '@/shared/types'
import { useSaveWordRecord } from '@/shared/lib/db'
import { getUTCUnixTimestamp } from '@/shared/utils'
import useKeySounds from '@/features/typing/hooks/useKeySounds'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { InputHandler, type WordUpdateAction } from '../InputHandler'
import { Notation } from './Notation'
import { TipAlert } from './TipAlert'
import { Letter } from '@/shared/components/word-display'
import { initialWordState, type WordState } from './type'

const vowelLetters = ['A', 'E', 'I', 'O', 'U']

export const WordComponent = ({ word, onFinish }: { word: Word; onFinish: () => void }) => {
  const { state, dispatch } = useContext(TypingContext)!
  const [wordState, setWordState] = useImmer<WordState>(structuredClone(initialWordState))

  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentLanguage = currentDictInfo.language
  const currentLanguageCategory = currentDictInfo.languageCategory
  const currentChapter = useAtomValue(currentChapterAtom)
  const wordDictationConfig = useAtomValue(wordDictationConfigAtom)
  const pronunciationIsOpen = useAtomValue(pronunciationIsOpenAtom)
  const isShowAnswerOnHover = useAtomValue(isShowAnswerOnHoverAtom)
  const isTextSelectable = useAtomValue(isTextSelectableAtom)
  const isIgnoreCase = useAtomValue(isIgnoreCaseAtom)

  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)
  const hasCommittedFinishRef = useRef(false)
  const [showTipAlert, setShowTipAlert] = useState(false)
  const [isHoveringWord, setIsHoveringWord] = useState(false)
  const saveWordRecord = useSaveWordRecord()
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds()

  useEffect(() => {
    let headword = ''
    try {
      headword = word.name.replace(/ /g, EXPLICIT_SPACE).replace(/’/g, '..')
    } catch {
      headword = ''
    }

    const newWordState = structuredClone(initialWordState)
    newWordState.displayWord = headword
    newWordState.letterStates = new Array(headword.length).fill('normal')
    newWordState.startTime = Date.now().toString()
    newWordState.randomLetterVisible = headword.split('').map(() => Math.random() > 0.4)
    hasCommittedFinishRef.current = false
    setWordState(newWordState)
  }, [setWordState, word])

  const updateInput = useCallback(
    (updateAction: WordUpdateAction) => {
      if (updateAction.type !== 'add') {
        return
      }

      if (wordState.hasWrong) {
        return
      }

      if (updateAction.value === ' ') {
        updateAction.event.preventDefault()
        setWordState((draft) => {
          draft.inputWord += EXPLICIT_SPACE
        })
        return
      }

      setWordState((draft) => {
        draft.inputWord += updateAction.value
      })
    },
    [setWordState, wordState.hasWrong],
  )

  const getLetterVisible = useCallback(
    (index: number) => {
      if (wordState.letterStates[index] === 'correct' || (isShowAnswerOnHover && isHoveringWord)) {
        return true
      }

      if (!wordDictationConfig.isOpen) {
        return true
      }

      if (wordDictationConfig.type === 'hideAll') {
        return false
      }

      const letter = wordState.displayWord[index]
      if (wordDictationConfig.type === 'hideVowel') {
        return !vowelLetters.includes(letter.toUpperCase())
      }
      if (wordDictationConfig.type === 'hideConsonant') {
        return vowelLetters.includes(letter.toUpperCase())
      }
      if (wordDictationConfig.type === 'randomHide') {
        return wordState.randomLetterVisible[index]
      }

      return true
    },
    [
      isHoveringWord,
      isShowAnswerOnHover,
      wordDictationConfig.isOpen,
      wordDictationConfig.type,
      wordState.displayWord,
      wordState.letterStates,
      wordState.randomLetterVisible,
    ],
  )

  useEffect(() => {
    if (wordState.inputWord.length === 0 && state.isTyping) {
      wordPronunciationIconRef.current?.play?.()
    }
  }, [state.isTyping, wordState.inputWord.length])

  useEffect(() => {
    const inputLength = wordState.inputWord.length
    if (wordState.hasWrong || inputLength === 0 || wordState.displayWord.length === 0) {
      return
    }

    const inputChar = wordState.inputWord[inputLength - 1]
    const correctChar = wordState.displayWord[inputLength - 1]
    const isEqual =
      inputChar !== undefined && correctChar !== undefined
        ? isIgnoreCase
          ? inputChar.toLowerCase() === correctChar.toLowerCase()
          : inputChar === correctChar
        : false

    if (isEqual) {
      setWordState((draft) => {
        draft.letterTimeArray.push(Date.now())
        draft.correctCount += 1
        draft.letterStates[inputLength - 1] = 'correct'

        if (inputLength >= draft.displayWord.length) {
          draft.isFinished = true
          draft.endTime = getUTCUnixTimestamp().toString()
        }
      })

      if (inputLength >= wordState.displayWord.length) {
        playHintSound()
      } else {
        playKeySound()
      }

      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD })
      return
    }

    playBeepSound()
    setWordState((draft) => {
      draft.letterStates[inputLength - 1] = 'wrong'
      draft.hasWrong = true
      draft.hasMadeInputWrong = true
      draft.wrongCount += 1
      draft.letterTimeArray = []

      if (draft.letterMistake[inputLength - 1]) {
        draft.letterMistake[inputLength - 1].push(inputChar)
      } else {
        draft.letterMistake[inputLength - 1] = [inputChar]
      }

      dispatch({
        type: TypingStateActionType.REPORT_WRONG_WORD,
        payload: { letterMistake: JSON.parse(JSON.stringify(draft.letterMistake)) },
      })
    })

    if (currentChapter === 0 && state.chapterData.index === 0 && wordState.wrongCount >= 3) {
      setShowTipAlert(true)
    }
  }, [
    currentChapter,
    dispatch,
    isIgnoreCase,
    playBeepSound,
    playHintSound,
    playKeySound,
    setWordState,
    state.chapterData.index,
    wordState.displayWord.length,
    wordState.hasWrong,
    wordState.inputWord,
    wordState.wrongCount,
  ])

  useEffect(() => {
    if (!wordState.isFinished || hasCommittedFinishRef.current) {
      return
    }

    hasCommittedFinishRef.current = true
    dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: true })
    void saveWordRecord(
      {
        word: word.name,
        wrongCount: wordState.wrongCount,
        letterTimeArray: wordState.letterTimeArray,
        letterMistake: wordState.letterMistake,
      },
      {
        onSavedRecordId: (dbID) => {
          dispatch({ type: TypingStateActionType.ADD_WORD_RECORD_ID, payload: dbID })
        },
        onSettled: () => {
          dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: false })
        },
      },
    )
    onFinish()
  }, [
    dispatch,
    onFinish,
    saveWordRecord,
    word.name,
    wordState.letterMistake,
    wordState.letterTimeArray,
    wordState.isFinished,
    wordState.wrongCount,
  ])

  useEffect(() => {
    if (!wordState.hasWrong) {
      return
    }

    const timer = setTimeout(() => {
      setWordState((draft) => {
        draft.inputWord = ''
        draft.letterStates = new Array(draft.letterStates.length).fill('normal')
        draft.hasWrong = false
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [setWordState, wordState.hasWrong])

  return (
    <>
      <InputHandler updateInput={updateInput} />
      <div lang={currentLanguageCategory !== 'code' ? currentLanguageCategory : 'en'} className="flex flex-col items-center justify-center pb-1 pt-4">
        {['romaji', 'hapin'].includes(currentLanguage) && word.notation && <Notation notation={word.notation} />}
        <div
          className={clsx('relative w-fit bg-transparent p-0 leading-normal shadow-none', wordDictationConfig.isOpen && 'my-tooltip')}
          data-tip="按 Tab 快捷键显示完整单词"
        >
          <div
            onMouseEnter={() => setIsHoveringWord(true)}
            onMouseLeave={() => setIsHoveringWord(false)}
            className={clsx('flex items-center justify-center', { 'select-all': isTextSelectable }, wordState.hasWrong && 'my-word-wrong')}
          >
            {wordState.displayWord.split('').map((char, index) => (
              <Letter key={`${index}-${char}`} letter={char} visible={getLetterVisible(index)} state={wordState.letterStates[index]} />
            ))}
          </div>
          {pronunciationIsOpen && (
            <div className="absolute -right-12 top-1/2 h-9 w-9 -translate-y-1/2 transform">
              <Tooltip content="快捷键：Ctrl + J">
                <WordPronunciationIcon word={word} lang={currentLanguage} ref={wordPronunciationIconRef} className="h-full w-full" />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <TipAlert className="fixed bottom-10 right-3" show={showTipAlert} setShow={setShowTipAlert} />
    </>
  )
}
