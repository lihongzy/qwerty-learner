import * as Dialog from '@radix-ui/react-dialog';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router';
import IconCoffee from '~icons/mdi/coffee';
import IconGithub from '~icons/simple-icons/github';
import IconExportWords from '~icons/icon-park-outline/excel';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import { DonateDialog } from '@/shared/components/DonateDialog';
import { RESULT_SCREEN_COPY } from './copy';
import { ResultScreenFooter } from './components/ResultScreenFooter';
import { ResultScreenHeader } from './components/ResultScreenHeader';
import { AuthorButton } from './components/ResultScreenParts';
import { ResultScreenReviewPanel } from './components/ResultScreenReviewPanel';
import { ResultScreenStatsRail } from './components/ResultScreenStatsRail';
import ShareButton from './components/share/ShareButton';
import type { ActionButtonConfig, UtilityButtonConfig } from './components/types';
import {
  exportResultWords,
  formatTimeString,
  getChapterTitle,
  getCorrectRate,
  getMistakeLevel,
  getWrongWords,
} from './result-screen.logic';

export const ResultScreen = () => {
  const { state, dispatch } = useContext(TypingContext)!;
  const navigate = useNavigate();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);

  // Global state provides the current practice scope and whether the screen is being shown
  // as a normal chapter result or as a review-session result.
  const currentDictId = usePracticeSessionStore((state) => state.currentDictId);
  const currentDictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);
  const isReviewMode = usePracticeSessionStore((state) => state.reviewModeInfo.isReviewMode);
  const currentChapter = usePracticeSessionStore((state) => state.currentChapter);
  const setCurrentChapter = usePracticeSessionStore((state) => state.setCurrentChapter);
  const setReviewModeInfo = usePracticeSessionStore((state) => state.setReviewModeInfo);
  const randomConfig = useTypingPreferencesStore((state) => state.randomConfig);
  const setWordDictationConfig = useTypingPreferencesStore((state) => state.setWordDictationConfig);

  // Everything below is derived from the finished typing snapshot.
  // Keeping these values memoized avoids recalculating the same presentation data
  // while the dialog is open and users interact with follow-up actions.
  const timeString = useMemo(() => formatTimeString(state.timerData.time), [state.timerData.time]);
  const wrongWords = useMemo(() => getWrongWords(state.chapterData), [state.chapterData]);
  const correctRate = useMemo(
    () => getCorrectRate(state.chapterData.words.length, wrongWords.length),
    [state.chapterData.words.length, wrongWords.length],
  );
  const mistakeLevel = useMemo(() => getMistakeLevel(correctRate), [correctRate]);

  const isLastChapter = useMemo(
    () => currentChapter >= currentDictInfo.chapterCount - 1,
    [currentChapter, currentDictInfo.chapterCount],
  );
  const chapterTitle = getChapterTitle(currentDictInfo.name, currentChapter, isReviewMode);
  const exportFileName = `${currentDictInfo.name}-Chapter-${currentChapter + 1}.xlsx`;

  // Auto-open dictation is session-local UI state; clear it before leaving the result screen path.
  const resetAutoDictationMode = useCallback(() => {
    setWordDictationConfig((previous) => {
      if (previous.isOpen && previous.openBy === 'auto') {
        return { ...previous, isOpen: false };
      }

      return previous;
    });
  }, [setWordDictationConfig]);

  // Closing the result screen means two different things:
  // 1. in review mode, leave review mode and reset the chapter pointer;
  // 2. in normal mode, return to the current chapter so the user can keep practicing.
  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0);
      setReviewModeInfo((previous) => ({ ...previous, isReviewMode: false }));
      return;
    }

    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false });
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo]);

  const exportWords = useCallback(() => {
    exportResultWords(state.chapterData, exportFileName).catch(() => {
      console.log(RESULT_SCREEN_COPY.xlsxLoadFailed);
    });
  }, [exportFileName, state.chapterData]);

  // Dictation mode is a follow-up action from the result screen: reopen the chapter
  // immediately and mark the dictation panel as auto-opened by this transition.
  const dictationButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return;
    }

    setWordDictationConfig((previous) => ({ ...previous, isOpen: true, openBy: 'auto' }));
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen });
  }, [dispatch, isReviewMode, randomConfig.isOpen, setWordDictationConfig]);

  // Repeat keeps the user in the same chapter but clears any transient auto-open state first.
  const repeatButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return;
    }

    resetAutoDictationMode();
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen });
  }, [dispatch, isReviewMode, randomConfig.isOpen, resetAutoDictationMode]);

  // Next chapter changes both the persisted chapter atom and the typing reducer state.
  // Both updates are required so the rest of the typing feature stays in sync.
  const nextButtonHandler = useCallback(() => {
    if (isReviewMode || isLastChapter) {
      return;
    }

    resetAutoDictationMode();
    setCurrentChapter((previous) => previous + 1);
    dispatch({ type: TypingStateActionType.NEXT_CHAPTER });
  }, [dispatch, isLastChapter, isReviewMode, resetAutoDictationMode, setCurrentChapter]);

  // Review mode exits to gallery instead of repeating/advancing inside the same flow.
  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0);
    setReviewModeInfo((previous) => ({ ...previous, isReviewMode: false }));
    navigate('/gallery');
  }, [navigate, setCurrentChapter, setReviewModeInfo]);

  // Radix emits open-state changes for close button, overlay interactions, and escape.
  // We route every close request through the same exit handler to keep behavior consistent.
  const handleResultScreenOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        exitButtonHandler();
      }
    },
    [exitButtonHandler],
  );

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
      ];
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
    ];

    if (!isLastChapter) {
      buttons.push({
        key: 'next',
        label: RESULT_SCREEN_COPY.nextChapter,
        title: RESULT_SCREEN_COPY.nextChapter,
        tooltip: RESULT_SCREEN_COPY.nextChapterTooltip,
        onClick: nextButtonHandler,
      });
    }

    return buttons;
  }, [
    dictationButtonHandler,
    isLastChapter,
    isReviewMode,
    nextButtonHandler,
    onNavigateToGallery,
    repeatButtonHandler,
  ]);

  // The header uses the same compact icon-button shell for every utility action.
  const utilityButtons = useMemo<UtilityButtonConfig[]>(() => {
    const buttons: UtilityButtonConfig[] = [
      {
        key: 'author',
        title: RESULT_SCREEN_COPY.authorTitle,
        icon: <AuthorButton />,
      },
    ];

    if (!isReviewMode) {
      buttons.push(
        {
          key: 'share',
          title: RESULT_SCREEN_COPY.shareTitle,
          icon: <ShareButton onOpenChange={setIsShareDialogOpen} />,
        },
        {
          key: 'export',
          title: RESULT_SCREEN_COPY.exportTitle,
          onClick: exportWords,
          icon: <IconExportWords fontSize={18} />,
        },
      );
    }

    buttons.push(
      {
        key: 'donate',
        title: RESULT_SCREEN_COPY.donateTitle,
        className:
          'hover:border-amber-300 hover:text-amber-500 dark:hover:border-amber-500/50 dark:hover:text-amber-300',
        onClick: () => setIsDonateDialogOpen(true),
        icon: <IconCoffee fontSize={17} />,
      },
      {
        key: 'github',
        title: RESULT_SCREEN_COPY.githubTitle,
        href: 'https://github.com/lihongzy/qwerty-learner',
        icon: <IconGithub fontSize={16} />,
      },
    );

    return buttons;
  }, [exportWords, isReviewMode]);

  useEffect(() => {
    // Force one timer tick when the result screen appears so elapsed time is fully flushed
    // into the summary before any derived presentation values are displayed.
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 });
  }, [dispatch]);

  // Keep result-screen hotkeys local to the overlay so repeat/next actions remain available after finishing a chapter.
  const areResultHotkeysEnabled = state.isFinished && !isShareDialogOpen && !isDonateDialogOpen;

  useHotkeys(
    'enter',
    () => {
      nextButtonHandler();
    },
    { preventDefault: true, enabled: areResultHotkeysEnabled },
  );
  useHotkeys(
    'space',
    (event) => {
      event.stopPropagation();
      repeatButtonHandler();
    },
    { preventDefault: true, enabled: areResultHotkeysEnabled },
  );
  useHotkeys(
    'shift+enter',
    () => {
      dictationButtonHandler();
    },
    { preventDefault: true, enabled: areResultHotkeysEnabled },
  );

  return (
    <>
      <DonateDialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen} />
      <Dialog.Root open={state.isFinished} onOpenChange={handleResultScreenOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-mask data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 z-30 backdrop-blur-sm" />

          <Dialog.Content className="bg-bg-panel shadow-app-panel border-border-main data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 z-40 flex h-[min(620px,calc(100vh-1.25rem))] w-[min(920px,calc(100vw-1.25rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.45rem] border outline-none">
            <ResultScreenHeader chapterTitle={chapterTitle} utilityButtons={utilityButtons} />

            {/* Main body is intentionally split into a narrow metric rail and a single flexible review panel. */}
            <div className="relative min-h-0 flex-1 overflow-hidden px-3.5 py-2.5 sm:px-4 lg:px-5">
              <div className="grid h-full gap-2 lg:grid-cols-[128px_minmax(0,1fr)]">
                <ResultScreenStatsRail
                  accuracy={state.timerData.accuracy}
                  timeString={timeString}
                  wpm={state.timerData.wpm}
                />
                <ResultScreenReviewPanel wrongWords={wrongWords} mistakeLevel={mistakeLevel} />
              </div>
            </div>

            <ResultScreenFooter actionButtons={actionButtons} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
