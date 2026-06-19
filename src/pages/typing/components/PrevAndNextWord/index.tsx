import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCallback, useContext, useMemo } from 'react';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import IconNext from '~icons/tabler/arrow-narrow-right';
import IconPrev from '~icons/tabler/arrow-narrow-left';

export type LastAndNextWordProps = {
  type: 'prev' | 'next';
};

export const PrevAndNextWord = ({ type }: LastAndNextWordProps) => {
  const { state, dispatch } = useContext(TypingContext)!;
  const wordDictationConfig = useTypingPreferencesStore((s) => s.wordDictationConfig);

  const newIndex = useMemo(() => state.chapterData.index + (type === 'prev' ? -1 : 1), [state.chapterData.index, type]);
  const word = state.chapterData.words[newIndex];
  const shortCutKey = type === 'prev' ? 'Ctrl + Shift + ←' : 'Ctrl + Shift + →';

  const onClickWord = useCallback(() => {
    if (word) dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex });
  }, [dispatch, newIndex, word]);

  const headWord = useMemo(() => {
    if (!word) return '';
    if (type === 'prev') return word.name;
    return wordDictationConfig.isOpen ? word.name.replace(/./g, '_') : word.name;
  }, [type, word, wordDictationConfig.isOpen]);

  if (!word) return <div />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClickWord}
            className="text-muted-foreground flex max-w-xs cursor-pointer items-center opacity-60 transition-opacity select-none hover:opacity-100"
          >
            {type === 'prev' && <IconPrev className="mr-4 shrink-0 text-2xl" />}
            <div className={`flex grow flex-col ${type === 'next' ? 'items-end text-right' : ''}`}>
              <p className={`font-mono text-2xl font-normal ${wordDictationConfig.isOpen ? 'tracking-wider' : ''}`}>
                {headWord}
              </p>
              {state.isTransVisible && (
                <p className="text-muted-foreground line-clamp-1 max-w-full text-sm">{word.trans.join('；')}</p>
              )}
            </div>
            {type === 'next' && <IconNext className="ml-4 shrink-0 text-2xl" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>快捷键：{shortCutKey}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
