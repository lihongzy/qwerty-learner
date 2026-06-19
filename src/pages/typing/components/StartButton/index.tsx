import { useCallback, useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconRotate from '~icons/tabler/rotate-clockwise-2';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';

export const StartButton = ({ isLoading }: { isLoading: boolean }) => {
  const { state, dispatch } = useContext(TypingContext)!;
  const randomConfig = useTypingPreferencesStore((state) => state.randomConfig);

  const onToggleIsTyping = useCallback(() => {
    if (!isLoading) {
      dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING });
    }
  }, [dispatch, isLoading]);

  const onClickRestart = useCallback(() => {
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen });
  }, [dispatch, randomConfig.isOpen]);

  useHotkeys('enter', onToggleIsTyping, { enableOnFormTags: true, preventDefault: true }, [onToggleIsTyping]);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" disabled={isLoading} onClick={onToggleIsTyping}>
              {state.isTyping ? '暂停' : '开始'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{state.isTyping ? '暂停' : '开始'}（Enter）</TooltipContent>
        </Tooltip>

        {state.isTyping && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onClickRestart}>
                <IconRotate className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>重新开始本章</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
