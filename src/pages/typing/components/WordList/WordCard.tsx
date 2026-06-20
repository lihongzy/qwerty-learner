import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WordPronunciationIcon } from '@/shared/components/WordPronunciationIcon';
import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import type { Word } from '@/shared/types';
import { useMemo } from 'react';

type WordCardProps = {
  word: Word;
  isActive: boolean;
};

export const WordCard = ({ word, isActive }: WordCardProps) => {
  const currentDictId = usePracticeSessionStore((state) => state.currentDictId);
  const currentLanguage = useMemo(() => selectCurrentDictInfo(currentDictId).language, [currentDictId]);

  return (
    <Card
      size="sm"
      className={cn(
        'focus-within:ring-ring/40 cursor-pointer rounded-lg py-0 transition-colors duration-150 select-text focus-within:ring-2',
        isActive ? 'border-primary bg-accent shadow-sm' : 'border-border bg-card hover:border-primary hover:bg-accent',
      )}
    >
      <CardContent className="flex items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-foreground font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] leading-6">
            {['romaji', 'hapin'].includes(currentLanguage) ? word.notation || word.name : word.name}
          </p>
          <div className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">{word.trans.join('；')}</div>
        </div>

        <WordPronunciationIcon
          word={word}
          lang={currentLanguage}
          ariaLabel={`播放 ${word.name} 发音`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-lg' }),
            'text-muted-foreground hover:text-primary shrink-0',
          )}
          iconClassName="size-8"
        />
      </CardContent>
    </Card>
  );
};
