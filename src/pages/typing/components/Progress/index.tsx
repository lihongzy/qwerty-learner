import { useContext } from 'react';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { TypingContext } from '@/pages/typing/store';

export const Progress = ({ className }: { className?: string }) => {
  const { state } = useContext(TypingContext)!;

  const totalWords = state.chapterData.words.length;
  const currentIndex = state.chapterData.index;
  const progress = totalWords === 0 ? 0 : Math.min(100, Math.floor(((currentIndex + 1) / totalWords) * 100));

  return <ProgressBar value={progress} className={`h-2 ${className ?? ''}`} />;
};
