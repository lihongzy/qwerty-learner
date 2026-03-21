import { Transition } from '@headlessui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router'
import { SimpleTooltip as Tooltip } from '@/components/ui/tooltip'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  infoPanelStateAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from '@/store'
import { InfoPanelType } from '@/typings'
import IconX from '~icons/tabler/x'
import IexportWords from '~icons/icon-park-outline/excel'
import IconCoffee from '~icons/mdi/coffee'
import IconGithub from '~icons/simple-icons/github'
import ShareButton from '@/features/typing/components/ShareButton'
import { AuthorButton } from './AuthorButton'
import ConclusionBar from './ConclusionBar'
import styles from './index.module.css'
import RemarkRing from './RemarkRing'
import WordChip from './WordChip'

export const ResultScreen = () => {
  const { state, dispatch } = useContext(TypingContext)!
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const navigate = useNavigate()

  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const setInfoPanelState = useSetAtom(infoPanelStateAtom)
  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)

  const timeString = useMemo(() => {
    const seconds = state.timerData.time
    const minutes = Math.floor(seconds / 60)
    const minuteString = minutes < 10 ? `0${minutes}` : `${minutes}`
    const restSeconds = seconds % 60
    const secondString = restSeconds < 10 ? `0${restSeconds}` : `${restSeconds}`
    return `${minuteString}:${secondString}`
  }, [state.timerData.time])

  const wrongWords = useMemo(() => {
    return state.chapterData.userInputLogs
      .filter((log) => log.wrongCount > 0)
      .map((log) => state.chapterData.words[log.index])
      .filter((word) => word !== undefined)
  }, [state.chapterData.userInputLogs, state.chapterData.words])

  const correctRate = useMemo(() => {
    const chapterLength = state.chapterData.words.length
    if (chapterLength === 0) {
      return 0
    }

    const correctCount = chapterLength - wrongWords.length
    return Math.floor((correctCount / chapterLength) * 100)
  }, [state.chapterData.words.length, wrongWords.length])

  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) return 0
    if (correctRate >= 70) return 1
    return 2
  }, [correctRate])

  const isLastChapter = useMemo(() => currentChapter >= currentDictInfo.chapterCount - 1, [currentChapter, currentDictInfo.chapterCount])
  const chapterTitle = `${currentDictInfo.name} ${isReviewMode ? 'Review' : `Chapter ${currentChapter + 1}`}`
  const exportFileName = `${currentDictInfo.name}-Chapter-${currentChapter + 1}.xlsx`
  const nextButtonClassName = `my-btn-primary h-12 text-base font-bold${isLastChapter ? ' cursor-not-allowed opacity-50' : ''}`

  const resetAutoDictationMode = useCallback(() => {
    setWordDictationConfig((old) => {
      if (old.isOpen && old.openBy === 'auto') {
        return { ...old, isOpen: false }
      }
      return old
    })
  }, [setWordDictationConfig])

  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
      return
    }
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false })
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo])

  const exportWords = useCallback(() => {
    const { words, userInputLogs } = state.chapterData
    const exportData = userInputLogs.flatMap((log) => {
      const word = words[log.index]
      if (!word) return []
      const wordName = word.name
      return [{
        ...word,
        trans: word.trans.join(';'),
        correctCount: log.correctCount,
        wrongCount: log.wrongCount,
        wrongLetters: Object.entries(log.LetterMistakes).map(([key, mistakes]) => `${wordName[Number(key)]}:${mistakes.length}`).join(';'),
      }]
    })

    import('xlsx')
      .then(({ utils, writeFileXLSX }) => {
        const ws = utils.json_to_sheet(exportData)
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, 'Data')
        writeFileXLSX(wb, exportFileName)
      })
      .catch(() => {
        console.log('Failed to load the xlsx module')
      })
  }, [exportFileName, state.chapterData])

  const handleOpenInfoPanel = useCallback((modalType: InfoPanelType) => {
    setInfoPanelState((old) => ({ ...old, [modalType]: true }))
  }, [setInfoPanelState])

  const dictationButtonHandler = useCallback(() => {
    if (isReviewMode) return
    setWordDictationConfig((old) => ({ ...old, isOpen: true, openBy: 'auto' }))
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, isReviewMode, randomConfig.isOpen, setWordDictationConfig])

  const repeatButtonHandler = useCallback(() => {
    if (isReviewMode) return
    resetAutoDictationMode()
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, isReviewMode, randomConfig.isOpen, resetAutoDictationMode])

  const nextButtonHandler = useCallback(() => {
    if (isReviewMode || isLastChapter) return
    resetAutoDictationMode()
    setCurrentChapter((old) => old + 1)
    dispatch({ type: TypingStateActionType.NEXT_CHAPTER })
  }, [dispatch, isLastChapter, isReviewMode, resetAutoDictationMode, setCurrentChapter])

  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0)
    setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    navigate('/gallery')
  }, [navigate, setCurrentChapter, setReviewModeInfo])

  useEffect(() => {
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 })
  }, [dispatch])

  useHotkeys('enter', () => { nextButtonHandler() }, { preventDefault: true })
  useHotkeys('space', (e) => { e.stopPropagation(); repeatButtonHandler() }, { preventDefault: true })
  useHotkeys('shift+enter', () => { dictationButtonHandler() }, { preventDefault: true })

  return (
    <div>
      <div className="fixed inset-0 z-30 overflow-auto">
        <div className="absolute inset-0 bg-gray-300 opacity-80 dark:bg-gray-600">
          <Transition show={true} enter="ease-in duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-out duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="flex h-screen items-center justify-center">
              <div className="my-card fixed flex w-[90vw] max-w-6xl flex-col overflow-hidden rounded-3xl bg-white pb-14 pl-10 pr-5 pt-10 shadow-lg md:w-4/5 lg:w-3/5 dark:bg-gray-800">
                <div className="text-center font-sans text-xl font-normal text-gray-900 md:text-2xl dark:text-gray-400">{chapterTitle}</div>
                <button className="absolute right-7 top-5" onClick={exitButtonHandler}><IconX className="text-gray-400" /></button>
                <div className="mt-10 flex flex-row gap-2 overflow-hidden">
                  <div className="flex flex-shrink-0 flex-grow-0 flex-col gap-3 px-4 sm:px-1 md:px-2 lg:px-4">
                    <RemarkRing remark={`${state.timerData.accuracy}%`} caption="Accuracy" percentage={state.timerData.accuracy} />
                    <RemarkRing remark={timeString} caption="Elapsed" />
                    <RemarkRing remark={`${state.timerData.wpm}`} caption="WPM" />
                  </div>
                  <div className="z-10 ml-6 flex-1 overflow-visible rounded-xl bg-indigo-50 dark:bg-gray-700">
                    <div className="customized-scrollbar z-20 mr-1 ml-8 flex h-80 flex-row flex-wrap content-start gap-4 overflow-x-hidden overflow-y-auto pb-0 pr-7 pt-9">
                      {wrongWords.map((word, index) => <WordChip key={`${index}-${word.name}`} word={word} />)}
                    </div>
                    <div className="align-center flex w-full flex-row justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-indigo-400">
                      <ConclusionBar mistakeLevel={mistakeLevel} mistakeCount={wrongWords.length} />
                    </div>
                  </div>
                  <div className="ml-2 flex flex-col items-center justify-end gap-3 text-xl">
                    <AuthorButton />
                    {!isReviewMode && <><ShareButton /><IexportWords fontSize={18} className="cursor-pointer text-gray-500" onClick={exportWords} /></>}
                    <button onClick={(e) => { handleOpenInfoPanel('donate'); e.currentTarget.blur() }} className="cursor-pointer" type="button" title="Support this project">
                      <IconCoffee fontSize={17} className={`text-gray-500 hover:text-amber-500 focus:outline-none ${styles.imgShake}`} />
                    </button>
                    <a href="https://github.com/lihongzy/qwerty-learner" target="_blank" rel="noreferrer" className="leading-[0px]">
                      <IconGithub fontSize={16} className="text-gray-500 hover:text-green-800 focus:outline-none" />
                    </a>
                  </div>
                </div>
                <div className="mt-10 flex w-full justify-center gap-5 px-5 text-xl">
                  {!isReviewMode && <>
                    <Tooltip content="Shortcut: Shift + Enter"><button className="my-btn-primary h-12 border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700" type="button" onClick={dictationButtonHandler} title="Dictation for this chapter">Dictation for this chapter</button></Tooltip>
                    <Tooltip content="Shortcut: Space"><button className="my-btn-primary h-12 border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700" type="button" onClick={repeatButtonHandler} title="Repeat this chapter">Repeat this chapter</button></Tooltip>
                  </>}
                  {!isLastChapter && !isReviewMode && <Tooltip content="Shortcut: Enter"><button className={nextButtonClassName} type="button" onClick={nextButtonHandler} title="Next chapter">Next chapter</button></Tooltip>}
                  {isReviewMode && <button className="my-btn-primary h-12 text-base font-bold" type="button" onClick={onNavigateToGallery} title="Practice other chapters">Practice other chapters</button>}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  )
}

