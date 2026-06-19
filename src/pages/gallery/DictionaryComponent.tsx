import { useMemo } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';
import bookCover from '@/assets/book-cover.png';
import { usePracticeSessionStore } from '@/shared/stores';
import type { Dictionary } from '@/shared/types/resource';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { calcChapterCount } from '@/shared/utils';
import { useState } from 'react';
import DictDetail from './DictDetail';
import { useDictStats } from './hooks/useDictStats';

interface Props {
  dictionary: Dictionary;
}

export default function DictionaryComponent({ dictionary }: Props) {
  const [open, setOpen] = useState(false);
  const currentDictID = usePracticeSessionStore((s) => s.currentDictId);
  const { ref, isIntersecting } = useIntersectionObserver({ freezeOnceVisible: true });
  const dictStats = useDictStats(dictionary.id, isIntersecting);
  const chapterCount = useMemo(() => calcChapterCount(dictionary.length), [dictionary.length]);
  const isSelected = currentDictID === dictionary.id;
  const progress = dictStats ? Math.ceil((dictStats.exercisedChapterCount / chapterCount) * 100) : 0;

  return (
    <TooltipProvider>
      <button
        type="button"
        ref={ref}
        onClick={() => setOpen(true)}
        className={`group relative flex min-h-48 cursor-pointer overflow-hidden rounded-lg border p-5 text-left transition-colors ${
          isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary'
        }`}
      >
        <div className="flex w-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold">{dictionary.name}</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-muted-foreground mt-2 block truncate text-sm">{dictionary.description}</span>
                </TooltipTrigger>
                <TooltipContent>{dictionary.description}</TooltipContent>
              </Tooltip>
            </div>
            <img src={bookCover} className={`h-14 w-14 shrink-0 ${isSelected ? 'opacity-50' : 'opacity-20'}`} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">词数</div>
              <div className="mt-1 font-mono text-base font-semibold">{dictionary.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground text-xs">章节</div>
              <div className="mt-1 font-mono text-base font-semibold">{chapterCount}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
              <span>进度</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="h-[min(92vh,56rem)] w-4xl max-w-[calc(100vw-2rem)] p-0 sm:max-w-4xl"
          showCloseButton={false}
        >
          <DictDetail dictionary={dictionary} />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
