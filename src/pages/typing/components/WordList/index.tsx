import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/shared/state';
import { useAtomValue } from 'jotai';
import { useContext, useMemo, useState } from 'react';
import ListIcon from '~icons/tabler/list';
import IconX from '~icons/tabler/x';
import { WordCard } from './WordCard';

const sheetContentClassName =
  'h-full w-[min(36rem,90vw)] max-w-none gap-0 border-r border-border bg-popover shadow-lg data-[side=left]:w-[min(36rem,90vw)] data-[side=left]:max-w-none';

export const WordList = () => {
  const { state, dispatch } = useContext(TypingContext)!;
  const [isOpen, setIsOpen] = useState(false);
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const currentChapter = useAtomValue(currentChapterAtom);
  const isReviewMode = useAtomValue(isReviewModeAtom);

  const currentDictTitle = useMemo(() => {
    if (isReviewMode) {
      return `${currentDictInfo.name} · 复习词单`;
    }

    return `${currentDictInfo.name} · 第 ${currentChapter + 1} 章`;
  }, [currentChapter, currentDictInfo.name, isReviewMode]);

  const openModal = () => {
    setIsOpen(true);
    dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false });
  };

  return (
    <>
      <div className="fixed top-1/2 left-0 z-20 -translate-y-1/2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                onClick={openModal}
                className="rounded-l-none border-l-0"
              >
                <ListIcon data-icon="inline-start" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">单词列表</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" showCloseButton={false} className={sheetContentClassName}>
          <SheetHeader className="flex-row items-center justify-between gap-4 px-5 py-4 text-left">
            <div className="min-w-0">
              <SheetTitle className="truncate text-lg font-semibold tracking-tight">{currentDictTitle}</SheetTitle>
              <SheetDescription asChild>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  <span>当前章节单词总览</span>
                  <span className="text-foreground font-['IBM_Plex_Mono','JetBrains_Mono',monospace]">
                    {state.chapterData.words?.length ?? 0}
                  </span>
                </div>
              </SheetDescription>
            </div>

            <SheetClose asChild>
              <Button type="button" variant="outline" size="icon-lg" className="shrink-0" title="关闭单词列表">
                <IconX data-icon="inline-start" />
              </Button>
            </SheetClose>
          </SheetHeader>
          <Separator className="bg-border-main" />

          <div className="relative min-h-0 flex-1 overflow-hidden px-3 py-3">
            <ScrollArea className="h-full pr-2">
              <div className="flex w-full flex-col gap-2">
                {state.chapterData.words?.map((word, index) => (
                  <WordCard key={`${word.name}_${index}`} word={word} isActive={state.chapterData.index === index} />
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
