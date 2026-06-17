import { useCallback, useEffect, useRef, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { usePracticeSessionStore } from '@/shared/stores';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { isDesktop, isLegal } from '@/shared/utils';
import { useSaveChapterRecord } from '@/shared/lib/db';
import { useConfetti } from './hooks/useConfetti';
import { useWordList } from './hooks/useWordList';
import { initialState, TypingStateActionType, typingReducer } from './store';

export function useTypingSession() {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState));
  const [isLoading, setIsLoading] = useState(true);
  const hasSavedChapterRecordRef = useRef(false);

  const { words } = useWordList();
  const randomConfig = useTypingPreferencesStore((store) => store.randomConfig);
  const reviewModeInfo = usePracticeSessionStore((store) => store.reviewModeInfo);
  const isReviewMode = usePracticeSessionStore((store) => store.reviewModeInfo.isReviewMode);
  const saveChapterRecord = useSaveChapterRecord();

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  useConfetti(state.isFinished);

  useEffect(() => {
    // 移动端暂时使用兜底提示，后续应改成页面内提示条，避免阻塞交互。
    if (!isDesktop()) {
      const timerId = window.setTimeout(() => {
        alert('Qwerty Learner 暂未针对移动端进行优化，请使用桌面浏览器，或改用连接硬件键盘的平板设备。');
      }, 500);

      return () => window.clearTimeout(timerId);
    }
  }, []);

  useEffect(() => {
    if (words === undefined) {
      return;
    }

    // 复习模式从上次记录的位置恢复，普通模式始终从章节起点开始。
    const initialIndex = isReviewMode ? (reviewModeInfo.reviewRecord?.index ?? 0) : 0;

    dispatch({
      type: TypingStateActionType.SETUP_CHAPTER,
      payload: {
        words,
        shouldShuffle: randomConfig.isOpen,
        initialIndex,
      },
    });
  }, [dispatch, isReviewMode, randomConfig.isOpen, reviewModeInfo.reviewRecord?.index, words]);

  useEffect(() => {
    setIsLoading(state.chapterData.words.length === 0);
  }, [state.chapterData.words.length]);

  useEffect(() => {
    // 窗口失焦时立即暂停，避免计时和输入状态继续推进。
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
    };

    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [dispatch]);

  useEffect(() => {
    if (state.isTyping) {
      return;
    }

    // 只在待开始状态下监听启动按键，开始后交给专门的输入流程处理。
    const onKeyDown = (e: KeyboardEvent) => {
      const isInputKey = isLegal(e.key) || e.key === ' ';
      const hasModifier = e.altKey || e.ctrlKey || e.metaKey;

      if (!isLoading && e.key !== 'Enter' && isInputKey && !hasModifier) {
        e.preventDefault();
        dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: true });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, isLoading, state.isTyping]);

  useEffect(() => {
    if (!state.isFinished) {
      hasSavedChapterRecordRef.current = false;
      return;
    }

    // 章节完成且单词记录已落库后，再统一保存本章结果。
    if (!state.isSavingRecord && !hasSavedChapterRecordRef.current) {
      hasSavedChapterRecordRef.current = true;
      saveChapterRecord(state);
    }
  }, [saveChapterRecord, state]);

  useEffect(() => {
    if (!state.isTyping) {
      return;
    }

    // 计时器只在正在练习时递增。
    const intervalId = window.setInterval(() => {
      dispatch({ type: TypingStateActionType.TICK_TIMER });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [dispatch, state.isTyping]);

  return {
    state,
    dispatch,
    isLoading,
    skipWord,
  };
}
