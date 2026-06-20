import { useCallback, useEffect, useRef } from 'react';
import { useImmerReducer } from 'use-immer';
import { usePracticeSessionStore } from '@/shared/stores';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { isLegal } from '@/shared/utils';
import { useSaveChapterRecord } from '@/shared/lib/db';
import { useConfetti } from './hooks/useConfetti';
import { useWordList } from './hooks/useWordList';
import { initialState, TypingStateActionType, typingReducer } from './store';

export function useTypingSession() {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState));
  const hasSavedChapterRecordRef = useRef(false);

  const { words } = useWordList();
  const randomConfig = useTypingPreferencesStore((store) => store.randomConfig);
  const reviewModeInfo = usePracticeSessionStore((store) => store.reviewModeInfo);
  const isReviewMode = usePracticeSessionStore((store) => store.reviewModeInfo.isReviewMode);
  const saveChapterRecord = useSaveChapterRecord();

  // 派生是否就绪：reducer 已派发 SETUP_CHAPTER 即视为可练习。
  // 避免用 useState + useEffect 同步同一份派生值，减少一帧延迟与额外渲染。
  const isLoading = state.chapterData.words.length === 0;

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD });
  }, [dispatch]);

  useConfetti(state.isFinished);

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
