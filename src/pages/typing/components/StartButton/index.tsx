import { useCallback, useContext, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconRotate from '~icons/tabler/rotate-clockwise-2';
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';

export const StartButton = ({ isLoading }: { isLoading: boolean }) => {
  const { state, dispatch } = useContext(TypingContext)!;
  const randomConfig = useTypingPreferencesStore((state) => state.randomConfig);
  const [isRestartVisible, setIsRestartVisible] = useState(false);

  const onToggleIsTyping = useCallback(() => {
    if (!isLoading) {
      dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING });
    }
  }, [dispatch, isLoading]);

  const onClickRestart = useCallback(() => {
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen });
  }, [dispatch, randomConfig.isOpen]);

  useHotkeys('enter', onToggleIsTyping, { enableOnFormTags: true, preventDefault: true }, [onToggleIsTyping]);

  const isTyping = state.isTyping;
  const shellClassName = isTyping
    ? 'border-border-main bg-bg-elevated shadow-app-soft'
    : 'border-accent-primary/30 bg-bg-panel shadow-app-soft';
  const primaryButtonClassName = isTyping
    ? 'bg-text-muted text-white hover:bg-text-main'
    : 'bg-accent-primary text-white hover:bg-accent-primary-hover';
  const restartButtonClassName = isTyping
    ? 'border-border-main bg-bg-panel text-text-main hover:bg-bg-panel-strong'
    : 'border-accent-primary/20 bg-accent-primary-soft text-accent-primary hover:bg-accent-primary/20';

  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-2xl border p-1 transition-all duration-200 ${shellClassName}`}
      onMouseEnter={() => setIsRestartVisible(true)}
      onMouseLeave={() => setIsRestartVisible(false)}
    >
      <Tooltip content={`${isTyping ? '暂停' : '开始'}（Enter）`}>
        <button
          className={`inline-flex min-w-[5.5rem] items-center justify-center rounded-md px-5 py-2 text-base font-semibold shadow-none transition-colors duration-200 ${primaryButtonClassName}`}
          type="button"
          onClick={onToggleIsTyping}
          aria-label={isTyping ? '暂停' : '开始'}
        >
          <span className="font-medium tracking-[0.08em]">{isTyping ? '暂停' : '开始'}</span>
        </button>
      </Tooltip>

      <div
        className={`overflow-hidden transition-all duration-200 ${isRestartVisible ? 'ml-1 max-w-24 opacity-100' : 'ml-0 max-w-0 opacity-0'}`}
        aria-hidden={!isRestartVisible}
      >
        <Tooltip content="重新开始本章">
          <button
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${restartButtonClassName}`}
            type="button"
            onClick={onClickRestart}
            aria-label="重新开始"
          >
            <IconRotate className="h-4 w-4" />
            <span>重开</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
