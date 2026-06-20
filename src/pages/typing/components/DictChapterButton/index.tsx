import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { TypingContext } from '@/pages/typing/store';

const DictChapterButtonComponent = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { state } = useContext(TypingContext)!;
  const currentDictId = usePracticeSessionStore((s) => s.currentDictId);
  const currentChapter = usePracticeSessionStore((s) => s.currentChapter);
  const setCurrentChapter = usePracticeSessionStore((s) => s.setCurrentChapter);
  const isReviewMode = usePracticeSessionStore((s) => s.reviewModeInfo.isReviewMode);
  const currentDictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);

  const chapterIndexes = Array.from({ length: currentDictInfo.chapterCount }, (_, i) => i);

  // 开始打字后自动关闭下拉
  useEffect(() => {
    if (state.isTyping) setOpen(false);
  }, [state.isTyping]);

  return (
    <>
      <NavLink
        className="hover:bg-muted hover:text-foreground block rounded-lg px-3 py-1 text-lg transition-colors"
        to="/gallery"
      >
        {currentDictInfo.name}
        {isReviewMode ? ' 复习' : ''}
      </NavLink>

      {!isReviewMode && (
        <Select
          open={open}
          onOpenChange={setOpen}
          value={String(currentChapter)}
          onValueChange={(v) => {
            setCurrentChapter(Number(v));
            requestAnimationFrame(() => triggerRef.current?.blur());
          }}
        >
          <SelectTrigger ref={triggerRef} className="hover:bg-muted h-8 min-w-32 gap-3 border-0 text-lg shadow-none">
            <SelectValue placeholder={`第 ${currentChapter + 1} 章`} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-60">
            {chapterIndexes.map((i) => (
              <SelectItem key={i} value={String(i)}>{`第 ${i + 1} 章`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};

export const DictChapterButton = DictChapterButtonComponent;
