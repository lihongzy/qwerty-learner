import * as Dialog from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router'
import IconCoffee from '~icons/mdi/coffee'
import IconGithub from '~icons/simple-icons/github'
import IconExportWords from '~icons/icon-park-outline/excel'
import { infoPanelStateAtom } from '@/app/state/info-panel'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { randomConfigAtom, wordDictationConfigAtom } from '@/features/typing/state'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom, reviewModeInfoAtom } from '@/shared/state'
import { InfoPanelType } from '@/shared/types'
import { RESULT_SCREEN_COPY } from './copy'
import styles from './index.module.css'
import { ResultScreenFooter } from './components/ResultScreenFooter'
import { ResultScreenHeader } from './components/ResultScreenHeader'
import { AuthorButton } from './components/ResultScreenParts'
import { ResultScreenReviewPanel } from './components/ResultScreenReviewPanel'
import { ResultScreenStatsRail } from './components/ResultScreenStatsRail'
import ShareButton from './components/share/ShareButton'
import type { ActionButtonConfig, UtilityButtonConfig } from './components/types'
import {
  exportResultWords,
  formatTimeString,
  getChapterTitle,
  getCorrectRate,
  getMistakeLevel,
  getWrongWords,
} from './result-screen.logic'

export const ResultScreen = () => {
  const { state, dispatch } = useContext(TypingContext)!
  const navigate = useNavigate()

  // Global atoms provide the current practice scope and whether the screen is being shown
  // as a normal chapter result or as a review-session result.
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)
  const randomConfig = useAtomValue(randomConfigAtom)

  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const setInfoPanelState = useSetAtom(infoPanelStateAtom)
  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)

  // Everything below is derived from the finished typing snapshot.
  // Keeping these values memoized avoids recalculating the same presentation data
  // while the dialog is open and users interact with follow-up actions.
  const timeString = useMemo(() => formatTimeString(state.timerData.time), [state.timerData.time])
  const wrongWords = useMemo(() => getWrongWords(state.chapterData), [state.chapterData])
  const correctRate = useMemo(() => getCorrectRate(state.chapterData.words.length, wrongWords.length), [state.chapterData.words.length, wrongWords.length])
  const mistakeLevel = useMemo(() => getMistakeLevel(correctRate), [correctRate])

  const isLastChapter = useMemo(() => currentChapter >= currentDictInfo.chapterCount - 1, [currentChapter, currentDictInfo.chapterCount])
  const chapterTitle = getChapterTitle(currentDictInfo.name, currentChapter, isReviewMode)
  const exportFileName = `${currentDictInfo.name}-Chapter-${currentChapter + 1}.xlsx`

  // Auto-open dictation is session-local UI state; clear it before leaving the result screen path.
  const resetAutoDictationMode = useCallback(() => {
    setWordDictationConfig((previous) => {
      if (previous.isOpen && previous.openBy === 'auto') {
        return { ...previous, isOpen: false }
      }

      return previous
    })
  }, [setWordDictationConfig])

  // Closing the result screen means two different things:
  // 1. in review mode, leave review mode and reset the chapter pointer;
  // 2. in normal mode, return to the current chapter so the user can keep practicing.
  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0)
      setReviewModeInfo((previous) => ({ ...previous, isReviewMode: false }))
      return
    }

    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false })
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo])

  const exportWords = useCallback(() => {
    exportResultWords(state.chapterData, exportFileName).catch(() => {
      console.log(RESULT_SCREEN_COPY.xlsxLoadFailed)
    })
  }, [exportFileName, state.chapterData])

  // Footer and header actions both open shared app-level info panels, so that state
  // is funneled through the central atom instead of local dialog-only state.
  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((previous) => ({ ...previous, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  // Dictation mode is a follow-up action from the result screen: reopen the chapter
  // immediately and mark the dictation panel as auto-opened by this transition.
  const dictationButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return
    }

    setWordDictationConfig((previous) => ({ ...previous, isOpen: true, openBy: 'auto' }))
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, isReviewMode, randomConfig.isOpen, setWordDictationConfig])

  // Repeat keeps the user in the same chapter but clears any transient auto-open state first.
  const repeatButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return
    }

    resetAutoDictationMode()
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, isReviewMode, randomConfig.isOpen, resetAutoDictationMode])

  // Next chapter changes both the persisted chapter atom and the typing reducer state.
  // Both updates are required so the rest of the typing feature stays in sync.
  const nextButtonHandler = useCallback(() => {
    if (isReviewMode || isLastChapter) {
      return
    }

    resetAutoDictationMode()
    setCurrentChapter((previous) => previous + 1)
    dispatch({ type: TypingStateActionType.NEXT_CHAPTER })
  }, [dispatch, isLastChapter, isReviewMode, resetAutoDictationMode, setCurrentChapter])

  // Review mode exits to gallery instead of repeating/advancing inside the same flow.
  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0)
    setReviewModeInfo((previous) => ({ ...previous, isReviewMode: false }))
    navigate('/gallery')
  }, [navigate, setCurrentChapter, setReviewModeInfo])

  // Radix emits open-state changes for close button, overlay interactions, and escape.
  // We route every close request through the same exit handler to keep behavior consistent.
  const handleResultScreenOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        exitButtonHandler()
      }
    },
    [exitButtonHandler],
  )

  // Build action metadata once so the footer stays declarative and easy to restyle.
  const actionButtons = useMemo<ActionButtonConfig[]>(() => {
    if (isReviewMode) {
      return [
        {
          key: 'gallery',
          label: RESULT_SCREEN_COPY.reviewOtherChapters,
          title: RESULT_SCREEN_COPY.reviewOtherChapters,
          tooltip: RESULT_SCREEN_COPY.reviewOtherChaptersTooltip,
          onClick: onNavigateToGallery,
        },
      ]
    }

    const buttons: ActionButtonConfig[] = [
      {
        key: 'dictation',
        label: RESULT_SCREEN_COPY.chapterDictation,
        title: RESULT_SCREEN_COPY.chapterDictation,
        tooltip: RESULT_SCREEN_COPY.chapterDictationTooltip,
        className:
          'border border-slate-300 bg-white/90 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500 dark:hover:bg-slate-800',
        onClick: dictationButtonHandler,
      },
      {
        key: 'repeat',
        label: RESULT_SCREEN_COPY.repeatChapter,
        title: RESULT_SCREEN_COPY.repeatChapter,
        tooltip: RESULT_SCREEN_COPY.repeatChapterTooltip,
        className:
          'border border-slate-300 bg-white/90 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-500 dark:hover:bg-slate-800',
        onClick: repeatButtonHandler,
      },
    ]

    if (!isLastChapter) {
      buttons.push({
        key: 'next',
        label: RESULT_SCREEN_COPY.nextChapter,
        title: RESULT_SCREEN_COPY.nextChapter,
        tooltip: RESULT_SCREEN_COPY.nextChapterTooltip,
        onClick: nextButtonHandler,
      })
    }

    return buttons
  }, [dictationButtonHandler, isLastChapter, isReviewMode, nextButtonHandler, onNavigateToGallery, repeatButtonHandler])

  // The header uses the same compact icon-button shell for every utility action.
  const utilityButtons = useMemo<UtilityButtonConfig[]>(() => {
    const buttons: UtilityButtonConfig[] = [
      {
        key: 'author',
        title: RESULT_SCREEN_COPY.authorTitle,
        icon: <AuthorButton />,
      },
    ]

    if (!isReviewMode) {
      buttons.push(
        {
          key: 'share',
          title: RESULT_SCREEN_COPY.shareTitle,
          icon: <ShareButton />,
        },
        {
          key: 'export',
          title: RESULT_SCREEN_COPY.exportTitle,
          onClick: exportWords,
          icon: <IconExportWords fontSize={18} />,
        },
      )
    }

    buttons.push(
      {
        key: 'donate',
        title: RESULT_SCREEN_COPY.donateTitle,
        className:
          'hover:border-amber-300 hover:text-amber-500 dark:hover:border-amber-500/50 dark:hover:text-amber-300',
        onClick: () => handleOpenInfoPanel('donate'),
        icon: <IconCoffee fontSize={17} className={styles.imgShake} />,
      },
      {
        key: 'github',
        title: RESULT_SCREEN_COPY.githubTitle,
        href: 'https://github.com/lihongzy/qwerty-learner',
        icon: <IconGithub fontSize={16} />,
      },
    )

    return buttons
  }, [exportWords, handleOpenInfoPanel, isReviewMode])

  useEffect(() => {
    // Force one timer tick when the result screen appears so elapsed time is fully flushed
    // into the summary before any derived presentation values are displayed.
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 })
  }, [dispatch])

  // Keep result-screen hotkeys local to the overlay so repeat/next actions remain available after finishing a chapter.
  useHotkeys('enter', () => { nextButtonHandler() }, { preventDefault: true })
  useHotkeys('space', (event) => { event.stopPropagation(); repeatButtonHandler() }, { preventDefault: true })
  useHotkeys('shift+enter', () => { dictationButtonHandler() }, { preventDefault: true })

  return (
    <Dialog.Root open={state.isFinished} onOpenChange={handleResultScreenOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-slate-950/26 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/74" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-40 flex h-[min(700px,calc(100vh-1.25rem))] w-[min(1060px,calc(100vw-1.25rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(245,248,251,0.97))] shadow-[0_34px_96px_rgba(15,23,42,0.18)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-slate-800 dark:bg-[linear-gradient(180deg,rgba(2,8,17,0.98),rgba(9,16,28,0.98))] dark:shadow-[0_38px_120px_rgba(0,0,0,0.5)]">
          {/* Decorative light wash stays outside the content layout so it never affects sizing. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_18%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.42),transparent_16%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_18%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_16%)]" />

          <ResultScreenHeader chapterTitle={chapterTitle} utilityButtons={utilityButtons} />

          {/* Main body is intentionally split into a narrow metric rail and a single flexible review panel. */}
          <div className="relative min-h-0 flex-1 overflow-hidden px-5 py-3.5 sm:px-6 lg:px-7">
            <div className="grid h-full gap-3 lg:grid-cols-[152px_minmax(0,1fr)]">
              <ResultScreenStatsRail accuracy={state.timerData.accuracy} timeString={timeString} wpm={state.timerData.wpm} />
              <ResultScreenReviewPanel wrongWords={wrongWords} mistakeLevel={mistakeLevel} />
            </div>
          </div>

          <ResultScreenFooter actionButtons={actionButtons} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
